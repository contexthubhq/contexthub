#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { SnowflakeDataSource } from './snowflake-datasource.js';

function printUsage() {
  console.log(`
Usage: snowflake-test-cli [options]

Test Snowflake data source functionality

Options:
  --command     Command to run (test-connection, list-tables)
  --account     Snowflake account identifier
  --username    Snowflake username
  --password    Snowflake password
  --warehouse   Snowflake warehouse name
  --role        Snowflake role name
  --help        Show this help message

Example:
  snowflake-test-cli --account myaccount --username CONTEXTHUB_USER --password mypassword --database mydb --warehouse CONTEXTHUB_WAREHOUSE --role CONTEXTHUB_ROLE
`);
}

async function main() {
  try {
    const { values } = parseArgs({
      args: process.argv.slice(2),
      options: {
        command: { type: 'string' },
        account: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        warehouse: { type: 'string' },
        role: { type: 'string' },
        help: { type: 'boolean' },
      },
      strict: true,
    });

    if (values.help) {
      printUsage();
      process.exit(0);
    }

    console.log('Testing Snowflake connection...');

    const credentials = {
      account: values.account as string,
      username: values.username as string,
      password: values.password as string,
      warehouse: values.warehouse as string,
      role: values.role as string,
    };
    const dataSource = new SnowflakeDataSource({ credentials });
    if (values.command === 'test-connection') {
      await testConnection(dataSource);
    } else if (values.command === 'list-tables') {
      await listTables(dataSource);
    } else {
      console.error('❌ Invalid command');
    }
  } catch (error) {
    console.error('❌ Error:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

async function listTables(dataSource: SnowflakeDataSource) {
  const tables = await dataSource.getTablesList();
  console.log(tables);
  process.exit(0);
}

async function testConnection(dataSource: SnowflakeDataSource) {
  const isConnected = await dataSource.testConnection();
  if (isConnected) {
    console.log('✅ Connection test successful!');
  } else {
    console.log('❌ Connection test failed!');
  }
  process.exit(0);
}

main();
