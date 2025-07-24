#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { SnowflakeDataSource } from './snowflake-datasource.js';

function printUsage() {
  console.log(`
Usage: snowflake-test-cli [options]

Test Snowflake data source connection

Options:
  --account     Snowflake account identifier
  --username    Snowflake username
  --password    Snowflake password
  --database    Snowflake database name
  --warehouse   Snowflake warehouse name
  --schema      Snowflake schema name
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
        account: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        database: { type: 'string' },
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
      database: values.database as string,
      warehouse: values.warehouse as string,
      role: values.role as string,
    };
    const dataSource = new SnowflakeDataSource({ credentials });
    const isConnected = await dataSource.testConnection();

    if (isConnected) {
      console.log('✅ Connection test successful!');
      process.exit(0);
    } else {
      console.log('❌ Connection test failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error testing connection:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
