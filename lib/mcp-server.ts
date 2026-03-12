import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { UI_HTML } from "./ui-html";

const sampleResources = [
  {
    uri: "data://docs/getting-started",
    name: "Getting Started Guide",
    description: "MCP Appsの基本的な使い方",
    mimeType: "text/markdown",
    content:
      "# Getting Started\n\nMCP Appsを始めるには、以下の手順に従ってください。\n\n## 1. セットアップ\n\n```bash\nnpm install @modelcontextprotocol/sdk @modelcontextprotocol/ext-apps\n```\n\n## 2. サーバーの作成\n\n`McpServer` インスタンスを作成し、ツールとリソースを登録します。\n\n## 3. UIの実装\n\n`App` クラスでHostに接続し、データを取得・表示します。",
  },
  {
    uri: "data://docs/api-reference",
    name: "API Reference",
    description: "ext-apps SDKのAPIリファレンス",
    mimeType: "text/markdown",
    content:
      "# API Reference\n\n## App class\n\nHostに接続するためのクラスです。PostMessageTransport経由で通信を確立します。\n\n## listServerResources()\n\nサーバーが公開しているMCPリソースの一覧を取得します。\n\n## readServerResource(params)\n\n指定したURIのリソース内容を読み取ります。\n\n## downloadFile(params)\n\nホスト経由でファイルのダウンロードをリクエストします。",
  },
  {
    uri: "data://config/settings",
    name: "Server Settings",
    description: "サーバー設定（JSON）",
    mimeType: "application/json",
    content: JSON.stringify(
      {
        theme: "dark",
        maxConnections: 10,
        debug: false,
        features: {
          resourceBrowser: true,
          fileDownload: true,
          autoResize: true,
        },
      },
      null,
      2
    ),
  },
];

export function configureServer(server: McpServer) {
  // MCPリソースとして登録
  for (const res of sampleResources) {
    server.resource(res.name, res.uri, async () => ({
      contents: [
        {
          uri: res.uri,
          mimeType: res.mimeType,
          text: res.content,
        },
      ],
    }));
  }

  // UIリソース（HTML）を ui:// スキームで登録
  registerAppResource(
    server,
    "Resource Browser UI",
    "ui://resource-browser/index",
    {},
    async () => ({
      contents: [
        {
          uri: "ui://resource-browser/index",
          mimeType: RESOURCE_MIME_TYPE,
          text: UI_HTML,
        },
      ],
    })
  );

  // UI対応ツールを登録
  registerAppTool(
    server,
    "browse-resources",
    {
      description: "サーバーのリソースをインタラクティブに閲覧します",
      _meta: {
        ui: { resourceUri: "ui://resource-browser/index" },
      },
    },
    async () => {
      const resourceList = sampleResources
        .map((r) => `- ${r.name}: ${r.description}`)
        .join("\n");
      return {
        content: [
          {
            type: "text" as const,
            text: `利用可能なリソース:\n${resourceList}`,
          },
        ],
      };
    }
  );
}
