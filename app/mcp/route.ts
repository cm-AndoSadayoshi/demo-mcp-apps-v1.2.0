import { baseURL } from "@/baseUrl";
import { createMcpHandler } from "mcp-handler";
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { sampleResources } from "@/lib/sample-resources";

const UI_VERSION = "2026-03-12-01";
const RESOURCE_URI = `ui://resource-browser/index?v=${UI_VERSION}`;

// ---------------------------------------------------------------------------
// Self-fetch: grab the rendered Next.js page to use as the widget HTML.
// ---------------------------------------------------------------------------
async function fetchPageHtml(path: string): Promise<string> {
  const res = await fetch(`${baseURL}${path}`);
  return res.text();
}

// ---------------------------------------------------------------------------
// MCP handler
// ---------------------------------------------------------------------------
const handler = createMcpHandler(async (server) => {
  // Register UI resource (self-fetched Next.js page)
  registerAppResource(
    server,
    "resource-browser-widget",
    RESOURCE_URI,
    { mimeType: RESOURCE_MIME_TYPE },
    async () => {
      const html = await fetchPageHtml("/");
      return {
        contents: [
          {
            uri: RESOURCE_URI,
            mimeType: RESOURCE_MIME_TYPE,
            text: html,
            _meta: {
              ui: {
                csp: {
                  connectDomains: [baseURL],
                  resourceDomains: [baseURL],
                },
              },
            },
          },
        ],
      };
    },
  );

  // Register sample data resources
  for (const res of sampleResources) {
    server.resource(res.name, res.uri, { mimeType: res.mimeType }, async () => {
      return {
        contents: [
          {
            uri: res.uri,
            mimeType: res.mimeType,
            text: res.content,
          },
        ],
      };
    });
  }

  // Standard tool: list-resources (Claude.ai compatible)
  server.tool(
    "list-resources",
    "List all available MCP resources on this server",
    {},
    async () => {
      const list = sampleResources.map((r) => ({
        uri: r.uri,
        name: r.name,
        description: r.description,
        mimeType: r.mimeType,
      }));
      return {
        content: [{ type: "text" as const, text: JSON.stringify(list, null, 2) }],
      };
    },
  );

  // Standard tool: read-resource
  server.tool(
    "read-resource",
    "Read the content of a specific MCP resource by URI",
    { uri: z.string().describe("The resource URI to read") },
    async ({ uri }) => {
      const res = sampleResources.find((r) => r.uri === uri);
      if (!res) {
        return {
          content: [
            { type: "text" as const, text: `Resource not found: ${uri}` },
          ],
          isError: true,
        };
      }
      return {
        content: [{ type: "text" as const, text: res.content }],
      };
    },
  );

  // MCP Apps tool: browse-resources (with UI)
  registerAppTool(
    server,
    "browse-resources",
    {
      title: "Browse Resources",
      description:
        "Open the Resource Browser UI to interactively browse and preview all available MCP resources.",
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
      _meta: {
        ui: { resourceUri: RESOURCE_URI, preferredHeight: 1200 },
      },
    },
    async () => {
      const list = sampleResources.map((r) => ({
        uri: r.uri,
        name: r.name,
        description: r.description,
        mimeType: r.mimeType,
      }));
      return {
        content: [
          {
            type: "text" as const,
            text: `Resource Browser opened. ${list.length} resources available.`,
          },
        ],
        structuredContent: {
          action: "browse",
          resources: list,
        },
      };
    },
  );
});

export const GET = handler;
export const POST = handler;
