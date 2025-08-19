import {
  ContextRepository,
  ContextWorkingCopy,
} from '@contexthub/context-repository';
import { ContextAgent } from './context-agent.js';
import {
  getDataSourceConnection,
  getSelectedTables,
} from '@contexthub/data-sources-connections';
import { registry as dataSourceRegistry } from '@contexthub/data-sources-all';
import { createContextAgentResult } from './create-context-agent-result.js';

export class ContextAgentRunner {
  private readonly contextRepository: ContextRepository;
  private readonly contextAgent: ContextAgent;
  private readonly dataSourceConnectionIds: string[];

  constructor({
    contextRepository,
    contextAgent,
    dataSourceConnectionIds,
  }: {
    contextRepository: ContextRepository;
    contextAgent: ContextAgent;
    dataSourceConnectionIds: string[];
  }) {
    this.contextRepository = contextRepository;
    this.contextAgent = contextAgent;
    this.dataSourceConnectionIds = dataSourceConnectionIds;
  }

  async run({ jobId }: { jobId: string }): Promise<void> {
    const mainWorkingCopy = await this.contextRepository.checkout({
      branchName: this.contextRepository.mainBranchName,
    });
    const newBranchName = `job-${jobId}`;
    await this.contextRepository.createBranch({
      newBranchName,
      sourceBranchName: this.contextRepository.mainBranchName,
    });
    const newWorkingCopy = await this.contextRepository.checkout({
      branchName: newBranchName,
    });
    for (const dataSourceConnectionId of this.dataSourceConnectionIds) {
      await this.runSingleDataSourceConnection({
        dataSourceConnectionId,
        mainWorkingCopy,
        newWorkingCopy,
      });
    }
    await this.contextRepository.commit({
      workingCopy: newWorkingCopy,
      branchName: newBranchName,
    });
    await createContextAgentResult({
      jobId,
      branchName: newBranchName,
    });
  }

  private async runSingleDataSourceConnection({
    dataSourceConnectionId,
    mainWorkingCopy,
    newWorkingCopy,
  }: {
    dataSourceConnectionId: string;
    mainWorkingCopy: ContextWorkingCopy;
    newWorkingCopy: ContextWorkingCopy;
  }): Promise<void> {
    const connection = await getDataSourceConnection({
      id: dataSourceConnectionId,
    });
    const dataSource = dataSourceRegistry.createInstance({
      type: connection.type,
      credentials: connection.credentials,
    });
    const selectedTables = await getSelectedTables({
      connectionId: dataSourceConnectionId,
    });
    const allTables = await dataSource.getTablesList();
    for (const selectedTable of selectedTables) {
      const tableDefinition = allTables.find(
        (table) =>
          table.fullyQualifiedTableName === selectedTable.fullyQualifiedName
      );
      if (!tableDefinition) {
        continue;
      }
      const columnDefinitions = await dataSource.getColumnsList({
        fullyQualifiedTableName: selectedTable.fullyQualifiedName,
      });
      const existingTableContext =
        (await mainWorkingCopy.getTable({
          dataSourceConnectionId,
          fullyQualifiedTableName: selectedTable.fullyQualifiedName,
        })) ?? null;
      const existingColumnContexts = (
        await mainWorkingCopy.listColumns()
      ).filter(
        (column) =>
          column.dataSourceConnectionId === dataSourceConnectionId &&
          column.fullyQualifiedTableName === selectedTable.fullyQualifiedName
      );
      const tableContextResult = await this.contextAgent.generateTableContext({
        dataSourceConnectionId,
        dataSourceConnectionName: connection.name,
        tableDefinition,
        columnDefinitions,
        existingTableContext,
        existingColumnContexts,
      });
      await newWorkingCopy.upsertTable(tableContextResult.newTableContext);
      for (const columnContext of tableContextResult.newColumnContexts) {
        await newWorkingCopy.upsertColumn(columnContext);
      }
    }
  }
}
