import { OpenAIAgentContextEngine } from './openai-agent-context-engine.js';
import type { TableDefinition } from '@contexthub/core';
import { InMemoryTextInputContextSource } from '@contexthub/context-sources';

// Test function
async function testOpenAIAgentContextEngine() {
  console.log(
    '🚀 Starting OpenAIAgentContextEngine test with InMemoryTextInputContextSource...\n'
  );

  try {
    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log('⚠️  OPENAI_API_KEY not found in environment variables');
      console.log(
        "   This test will show the structure but won't make actual API calls"
      );
      console.log('   Set OPENAI_API_KEY to test with real OpenAI API\n');
    } else {
      console.log('✅ OpenAI API key found\n');
    }

    // Create context sources using InMemoryTextInputContextSource
    const contextSources = [
      new InMemoryTextInputContextSource({
        text: 'The users table stores user account information including profile details, authentication data, and account settings. It is used for user management, authentication, and personalization features.',
        description: 'Documentation about the users table',
      }),
      new InMemoryTextInputContextSource({
        text: 'The table contains columns: id (primary key), username, email, created_at, updated_at, and status. The id column is auto-incrementing, email must be unique, and status can be active, inactive, or pending.',
        description: 'Schema analysis of the users table',
      }),
      new InMemoryTextInputContextSource({
        text: 'This table is frequently queried for user authentication, profile management, and account status checks. Common queries include finding users by email, checking account status, and retrieving user profiles.',
        description: 'Usage patterns and common queries',
      }),
    ];

    // Create test table definition
    const testTable: TableDefinition = {
      tableName: 'users',
      tableSchema: 'public',
      tableCatalog: 'my_database',
      fullyQualifiedTableName: 'my_database.public.users',
    };

    console.log('📋 Test Configuration:');
    console.log('   Table:', testTable.tableName);
    console.log('   Schema:', testTable.tableSchema);
    console.log('   Context Sources:', contextSources.length);
    console.log('');

    if (apiKey) {
      // Create context engine (no constructor parameters needed)
      const contextEngine = new OpenAIAgentContextEngine();

      console.log('🔄 Generating table context...\n');

      // Generate context
      const result = await contextEngine.generateTableContext({
        table: testTable,
        contextSources: contextSources,
      });

      console.log('✅ Context Generation Complete!\n');
      console.log('📊 Results:');
      console.log('   Confidence:', result.confidence);
      console.log('   Sources Used:', result.sourcesUsed.join(', '));
      console.log('   Description:', result.context.description);
      console.log('');
    } else {
      // Show structure without making API calls
      console.log('📋 Test Structure (without API calls):');
      console.log('   - InMemoryTextInputContextSource instances created');
      console.log('   - Table definition prepared');
      console.log('   - Context engine would process sources iteratively');
      console.log('   - Final synthesis would combine all context');
      console.log('');

      // Test tool generation from context sources
      console.log('🔧 Testing tool generation from context sources:');
      for (const source of contextSources) {
        try {
          const tools = await source.getTools();
          console.log(
            `   ✅ ${source.constructor.name}: ${tools.length} tools generated`
          );

          // Show tool details
          for (const tool of tools) {
            if (tool.type === 'function') {
              console.log(`      - Tool: ${tool.name}`);
              console.log(`      - Description: ${tool.description}`);
            }
          }
        } catch (error) {
          console.log(
            `   ❌ ${source.constructor.name}: Error generating tools -`,
            error
          );
        }
      }
      console.log('');

      // Test creating new context sources
      console.log('🔧 Testing context source creation:');
      const newSource = new InMemoryTextInputContextSource({
        text: 'This is a test text input for the context source.',
        description: 'Test description',
      });
      console.log(
        '   ✅ Successfully created and configured new context source'
      );
      console.log('');
    }

    console.log('🎉 Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testOpenAIAgentContextEngine().catch(console.error);
