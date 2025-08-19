import 'dotenv/config';
import { OpenAIAgentContextEngine } from './openai-agent-context-engine.js';
import type { ColumnDefinition, TableDefinition } from '@contexthub/core';
import { InMemoryTextInputContextSource } from '@contexthub/context-sources-all';

// Test function
async function testOpenAIAgentContextEngine() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not found in environment variables');
  }
  if (!process.env.OPENAI_MODEL) {
    throw new Error('OPENAI_MODEL not found in environment variables');
  }

  // Create context sources using InMemoryTextInputContextSource
  const contextSources = [
    new InMemoryTextInputContextSource({
      name: 'Users table documentation',
      text: 'The users table stores user account information including profile details, authentication data, and account settings. It is used for user management, authentication, and personalization features.',
      description: 'Documentation about the users table',
    }),
    new InMemoryTextInputContextSource({
      name: 'Users table schema',
      text: 'The table contains columns: id (primary key), username, email, created_at, updated_at, and status. The id column is auto-incrementing, email must be unique, and status can be active, inactive, or pending.',
      description: 'Schema analysis of the users table',
    }),
    new InMemoryTextInputContextSource({
      name: 'Users table usage patterns',
      text: 'This table is frequently queried for user authentication, profile management, and account status checks. Common queries include finding users by email, checking account status, and retrieving user profiles.',
      description: 'Usage patterns and common queries',
    }),
  ];

  // Create test table definition
  const tableDefinition: TableDefinition = {
    tableName: 'users',
    tableSchema: 'public',
    tableCatalog: 'my_database',
    fullyQualifiedTableName: 'my_database.public.users',
  };

  const baseColumnProps = {
    tableName: tableDefinition.tableName,
    tableSchema: tableDefinition.tableSchema,
    tableCatalog: tableDefinition.tableCatalog,
    fullyQualifiedTableName: tableDefinition.fullyQualifiedTableName,
  };

  const columnDefinitions: ColumnDefinition[] = [
    {
      ...baseColumnProps,
      columnName: 'id',
      ordinalPosition: 1,
      isNullable: false,
      dataType: 'integer',
      columnDefault: null,
      fullyQualifiedTableName: tableDefinition.fullyQualifiedTableName,
      fullyQualifiedColumnName: `${tableDefinition.fullyQualifiedTableName}.id`,
    },
    {
      ...baseColumnProps,
      columnName: 'username',
      ordinalPosition: 2,
      isNullable: false,
      dataType: 'varchar',
      columnDefault: null,
      fullyQualifiedTableName: tableDefinition.fullyQualifiedTableName,
      fullyQualifiedColumnName: `${tableDefinition.fullyQualifiedTableName}.username`,
    },
    {
      ...baseColumnProps,
      columnName: 'email',
      ordinalPosition: 3,
      isNullable: false,
      dataType: 'varchar',
      columnDefault: null,
      fullyQualifiedTableName: tableDefinition.fullyQualifiedTableName,
      fullyQualifiedColumnName: `${tableDefinition.fullyQualifiedTableName}.email`,
    },
    {
      ...baseColumnProps,
      columnName: 'created_at',
      ordinalPosition: 4,
      isNullable: false,
      dataType: 'timestamp',
      columnDefault: null,
      fullyQualifiedTableName: tableDefinition.fullyQualifiedTableName,
      fullyQualifiedColumnName: `${tableDefinition.fullyQualifiedTableName}.created_at`,
    },
    {
      ...baseColumnProps,
      columnName: 'updated_at',
      ordinalPosition: 5,
      isNullable: false,
      dataType: 'timestamp',
      columnDefault: null,
      fullyQualifiedTableName: tableDefinition.fullyQualifiedTableName,
      fullyQualifiedColumnName: `${tableDefinition.fullyQualifiedTableName}.updated_at`,
    },
    {
      ...baseColumnProps,
      columnName: 'status',
      ordinalPosition: 6,
      isNullable: false,
      dataType: 'varchar',
      columnDefault: null,
      fullyQualifiedTableName: tableDefinition.fullyQualifiedTableName,
      fullyQualifiedColumnName: `${tableDefinition.fullyQualifiedTableName}.status`,
    },
  ];

  console.log('📋 Test Configuration:');
  console.log('   Table:', tableDefinition.tableName);
  console.log('   Schema:', tableDefinition.tableSchema);
  console.log('   Columns:', columnDefinitions.length);
  console.log('   Context Sources:', contextSources.length);
  console.log('');

  // Create context engine (no constructor parameters needed)
  const contextEngine = new OpenAIAgentContextEngine(contextSources, {
    model: process.env.OPENAI_MODEL,
  });

  console.log('🔄 Generating table context...\n');

  // Generate context
  const result = await contextEngine.generateTableContext({
    dataSourceConnectionId: 'ds1',
    dataSourceConnectionName: 'data warehouse',
    tableDefinition,
    columnDefinitions,
    existingTableContext: null,
    existingColumnContexts: [],
  });

  console.log(JSON.stringify(result, null, 2));
}

// Run the test
testOpenAIAgentContextEngine().catch(console.error);
