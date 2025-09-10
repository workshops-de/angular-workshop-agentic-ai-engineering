import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { exec as execSync } from 'child_process';
import { dirname } from 'path';
import { promisify } from 'util';
import { z } from 'zod';

const exec = promisify(execSync);

// Initialize the MCP server with a name and version
const server = new McpServer({ name: 'workshops-de-angular-mcp', version: '1.0.0' });

server.registerTool(
  'migrate-self-closing-tags',
  {
    title: 'Migrate Self Closing Tags',
    description: 'Migrate self closing tags to self closing tags using the Angular CLI'
  },
  async () => {
    const result = await exec('npx @angular/cli g @angular/core:self-closing-tag', {
      cwd: dirname(dirname(__dirname))
    });

    return { content: [{ type: 'text', text: result.stdout }] };
  }
);

server.registerTool(
  'generate_component',
  {
    title: 'Generate Angular Component',
    description: 'Creates a new Angular component using the Angular CLI',
    inputSchema: {
      name: z.string().describe('Component name'),
      path: z.string().optional().describe('Target path or project')
    }
  },
  async ({ name, path }) => {
    // CLI is already in the project root, so we need to remove the src/app prefix
    path = path?.replace(/^src\/app\/?/, '');

    // Construct the CLI command
    const target = path ? `${path}/${name}` : name;
    const cliCommand = `npx @angular/cli generate component ${target} --standalone --flat --skip-tests --inline-style --inline-template --no-interactive`;

    // TODO: Since we access the tool from the project root, we need to go two levels up
    //       This is not needed once we publish the tool to a npm registry
    const result = await exec(cliCommand, { cwd: dirname(dirname(__dirname)) });
    return { content: [{ type: 'text', text: result.stdout, _meta: {} }] };
  }
);

// Start listening for MCP messages on STDIN/STDOUT
const transport = new StdioServerTransport();

server
  .connect(transport)
  .then(() => {
    console.log('MCP server started');
  })
  .catch(error => {
    console.error('Error connecting to MCP server:', error);
  });
