import {
  ContextRepository,
  ContextWorkingCopy,
} from '@contexthub/context-repository';
import type { TableDefinition, ColumnDefinition } from '@contexthub/core';
import { ContextAgent } from './context-agent.js';
import {
  getDataSourceConnection,
  getSelectedTables,
} from '@contexthub/data-sources-connections';
import {
  DataSource,
  registry as dataSourceRegistry,
} from '@contexthub/data-sources-all';
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
    await Promise.all(
      selectedTables.map((selectedTable) =>
        this.runSingleTable({
          dataSourceConnectionId,
          connectionName: connection.name,
          selectedTableFullyQualifiedName: selectedTable.fullyQualifiedName,
          dataSource,
          allTables,
          mainWorkingCopy,
          newWorkingCopy,
        })
      )
    );
  }

  private async runSingleTable({
    dataSourceConnectionId,
    connectionName,
    selectedTableFullyQualifiedName,
    dataSource,
    allTables,
    mainWorkingCopy,
    newWorkingCopy,
  }: {
    dataSourceConnectionId: string;
    connectionName: string;
    selectedTableFullyQualifiedName: string;
    dataSource: DataSource;
    allTables: TableDefinition[];
    mainWorkingCopy: ContextWorkingCopy;
    newWorkingCopy: ContextWorkingCopy;
  }): Promise<void> {
    const tableDefinition = allTables.find(
      (table) =>
        table.fullyQualifiedTableName === selectedTableFullyQualifiedName
    );
    if (!tableDefinition) {
      return;
    }
    const columnDefinitions: ColumnDefinition[] =
      await dataSource.getColumnsList({
        fullyQualifiedTableName: selectedTableFullyQualifiedName,
      });
    const existingTableContext =
      (await mainWorkingCopy.getTable({
        dataSourceConnectionId,
        fullyQualifiedTableName: selectedTableFullyQualifiedName,
      })) ?? null;
    const existingColumnContexts = (await mainWorkingCopy.listColumns()).filter(
      (column) =>
        column.dataSourceConnectionId === dataSourceConnectionId &&
        column.fullyQualifiedTableName === selectedTableFullyQualifiedName
    );
    const tableContextResult = await this.contextAgent.generateTableContext({
      dataSourceConnectionId,
      dataSourceConnectionName: connectionName,
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
