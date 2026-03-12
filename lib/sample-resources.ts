export interface SampleResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  content: string;
}

export const sampleResources: SampleResource[] = [
  {
    uri: "data://docs/getting-started",
    name: "Getting Started Guide",
    description: "Quick start guide for MCP Apps development",
    mimeType: "text/markdown",
    content: `# Getting Started with MCP Apps

## Overview

MCP Apps allow you to build interactive UI widgets that render directly inside
AI assistants like Claude.ai, ChatGPT, and Cursor.

## Quick Start

1. **Create a new project** using the Next.js starter template
2. **Define your MCP tools** in \`app/mcp/route.ts\`
3. **Build your UI** as standard React components
4. **Deploy** to Vercel or any hosting provider

## How It Works

The MCP server registers your Next.js page as a UI resource. When an AI
assistant invokes one of your tools, the rendered HTML is served inside a
sandboxed iframe — giving you full control over the user experience.

## Key Concepts

- **Resources**: Data exposed by the MCP server (documents, configs, etc.)
- **Tools**: Functions the AI assistant can call on behalf of the user
- **UI Resources**: HTML pages rendered inside the assistant's interface

## Next Steps

- Read the [API Reference](data://docs/api-reference) for detailed endpoint docs
- Check the [Settings](data://config/settings) for configuration options
`,
  },
  {
    uri: "data://docs/api-reference",
    name: "API Reference",
    description: "Detailed API documentation for MCP Apps",
    mimeType: "text/markdown",
    content: `# MCP Apps API Reference

## Endpoints

### \`GET /mcp\`
Returns server metadata and capabilities via the MCP protocol.

### \`POST /mcp\`
Handles MCP JSON-RPC requests including:
- \`tools/list\` — List available tools
- \`tools/call\` — Invoke a tool
- \`resources/list\` — List available resources
- \`resources/read\` — Read a resource's content

## Tools

### \`browse-resources\`
Opens the Resource Browser UI and lists all available server resources.

**Parameters:** None

**Returns:** A list of resources with their URIs, names, and MIME types.

### \`list-resources\`
Lists all available MCP resources (text-only, no UI).

**Parameters:** None

### \`read-resource\`
Reads the content of a specific resource by URI.

**Parameters:**
| Name | Type   | Required | Description          |
|------|--------|----------|----------------------|
| uri  | string | Yes      | The resource URI     |

## Resource URI Schemes

| Scheme    | Example                       | Description              |
|-----------|-------------------------------|--------------------------|
| \`data://\` | \`data://docs/getting-started\` | Application data         |
| \`ui://\`   | \`ui://resource-browser/index\` | UI widget resources      |
`,
  },
  {
    uri: "data://config/settings",
    name: "Application Settings",
    description: "Current application configuration",
    mimeType: "application/json",
    content: JSON.stringify(
      {
        app: {
          name: "MCP Resource Browser",
          version: "1.2.0",
          description:
            "A demo MCP App that browses and previews server resources",
        },
        features: {
          resourceBrowser: true,
          contentPreview: true,
          fileDownload: true,
        },
        ui: {
          theme: "system",
          maxPreviewLength: 10000,
          sidebarWidth: 280,
        },
        mcp: {
          transport: "streamable-http",
          endpoint: "/mcp",
        },
      },
      null,
      2,
    ),
  },
];
