#!/usr/bin/env node
/**
 * Supabase MCP Server — minimal stdio MCP server
 * Exposes: query, insert, update, delete, list_tables, describe_table
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://yubxgftugxbwtywyhcsv.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── MCP Protocol helpers ──
function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

// ── Tool: query ──
async function handleQuery(params) {
  const { table, columns = '*', filter = null, limit = 100, order = 'id', ascending = false } = params;

  let query = supabase.from(table).select(columns);

  if (filter) {
    const [col, op, val] = filter;
    const operators = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'in', 'is'];
    if (operators.includes(op)) {
      query = query[op](col, val);
    }
  }

  if (order) {
    query = query.order(order, { ascending });
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { data };
}

// ── Tool: insert ──
async function handleInsert(params) {
  const { table, records } = params;
  const { data, error } = await supabase.from(table).insert(records).select();
  if (error) return { error: error.message };
  return { data };
}

// ── Tool: update ──
async function handleUpdate(params) {
  const { table, filter, data } = params;
  const [col, op, val] = filter;
  const operators = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'];
  if (!operators.includes(op)) return { error: `Unknown operator: ${op}` };
  const { data: result, error } = await supabase.from(table)[op](col, val).update(data).select();
  if (error) return { error: error.message };
  return { data: result };
}

// ── Tool: delete ──
async function handleDelete(params) {
  const { table, filter } = params;
  const [col, op, val] = filter;
  const operators = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'];
  if (!operators.includes(op)) return { error: `Unknown operator: ${op}` };
  const { data: result, error } = await supabase.from(table)[op](col, val).delete();
  if (error) return { error: error.message };
  return { deleted: result?.length || 0 };
}

// ── Known public tables (PostgREST only exposes public schema) ──
const KNOWN_TABLES = [
  'admin_audit', 'accounts', 'achievement_definitions', 'budgets',
  'calendar_events', 'daily_commitments', 'daily_logs', 'dsa_problems',
  'feature_flags', 'habit_completions', 'habits', 'money_categories',
  'money_transactions', 'notes', 'notifications', 'personal_goals',
  'pomodoro_sessions', 'routines', 'routine_logs', 'savings_goals',
  'system_config', 'user_daily_metrics', 'user_profiles',
  'wins', 'xp_log', 'user_xp', 'achievements', 'sleep_quality_tags',
  'discipline_streaks', 'discipline_logs', 'replacement_habits',
  'journal_entries', 'cbt_records', 'www_entries', 'habit_stacks',
  'sports_favorites', 'financial_health_scores', 'cognitive_benchmarks',
  'google_tokens'
];

// ── Tool: list_tables ──
async function handleListTables() {
  return { tables: KNOWN_TABLES.sort() };
}

// ── Tool: describe_table ──
async function handleDescribeTable(params) {
  const { table } = params;
  const { data: sample, error } = await supabase.from(table).select('*').limit(1);
  if (error) return { error: error.message };
  const columns = sample && sample.length > 0
    ? Object.keys(sample[0]).map(col => ({
      column_name: col,
      data_type: typeof sample[0][col] === 'number' ? 'integer' : 'text',
      is_nullable: 'true',
      column_default: null
    }))
    : [];
  return { columns };
}

// ── MCP Request Handler ──
async function main() {
  // Handle stdin
  const stdin = process.stdin;
  stdin.setEncoding('utf8');

  let buffer = '';
  stdin.on('data', async (chunk) => {
    buffer += chunk;
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      try {
        const msg = JSON.parse(trimmed);

        if (msg.method === 'initialize') {
          // Send initialize response
          send({
            jsonrpc: '2.0',
            id: msg.id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: { tools: {} },
              serverInfo: { name: 'supabase-mcp', version: '1.0.0' }
            }
          });
          // Send initialized notification
          send({ jsonrpc: '2.0', method: 'notifications/initialized' });
          // Send tools/list response
          const TOOLS = [
            {
              name: 'query',
              description: 'Query a Supabase table with optional filter, limit, and ordering',
              inputSchema: {
                type: 'object',
                properties: {
                  table: { type: 'string', description: 'Table name' },
                  columns: { type: 'string', description: 'Comma-separated columns, or * for all' },
                  filter: { type: 'array', description: '[column, operator, value] — operator: eq, neq, gt, gte, lt, lte, like, ilike, in, is' },
                  limit: { type: 'integer', description: 'Max rows to return' },
                  order: { type: 'string', description: 'Column to order by' },
                  ascending: { type: 'boolean', description: 'Sort direction' }
                },
                required: ['table']
              }
            },
            {
              name: 'insert',
              description: 'Insert one or more records into a Supabase table',
              inputSchema: {
                type: 'object',
                properties: {
                  table: { type: 'string' },
                  records: { type: 'array', description: 'Array of objects to insert' }
                },
                required: ['table', 'records']
              }
            },
            {
              name: 'update',
              description: 'Update records in a Supabase table matching a filter',
              inputSchema: {
                type: 'object',
                properties: {
                  table: { type: 'string' },
                  filter: { type: 'array', description: '[column, operator, value]' },
                  data: { type: 'object', description: 'Fields to update' }
                },
                required: ['table', 'filter', 'data']
              }
            },
            {
              name: 'delete',
              description: 'Delete records from a Supabase table matching a filter',
              inputSchema: {
                type: 'object',
                properties: {
                  table: { type: 'string' },
                  filter: { type: 'array', description: '[column, operator, value]' }
                },
                required: ['table', 'filter']
              }
            },
            {
              name: 'list_tables',
              description: 'List all public tables in the Supabase database'
            },
            {
              name: 'describe_table',
              description: 'Get column schema for a table',
              inputSchema: {
                type: 'object',
                properties: {
                  table: { type: 'string' }
                },
                required: ['table']
              }
            }
          ];
          send({ jsonrpc: '2.0', id: msg.id + 1, result: { tools: TOOLS } });
        }
        else if (msg.method === 'tools/call') {
          const { name, arguments: args } = msg.params;
          let result;

          switch (name) {
            case 'query': result = await handleQuery(args); break;
            case 'insert': result = await handleInsert(args); break;
            case 'update': result = await handleUpdate(args); break;
            case 'delete': result = await handleDelete(args); break;
            case 'list_tables': result = await handleListTables(); break;
            case 'describe_table': result = await handleDescribeTable(args); break;
            default: result = { error: `Unknown tool: ${name}` };
          }

          send({ jsonrpc: '2.0', result, id: msg.id });
        }
      } catch (e) {
        send({ jsonrpc: '2.0', error: { code: -32700, message: e.message }, id: null });
      }
    }
  });
}

main().catch(console.error);