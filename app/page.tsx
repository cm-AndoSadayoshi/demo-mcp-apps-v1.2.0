"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useMcpApp,
  listServerResources,
  readServerResource,
} from "./hooks/use-mcp-app";

interface ResourceInfo {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

interface ResourceContent {
  uri: string;
  mimeType?: string;
  text?: string;
}

export default function ResourceBrowser() {
  const { connected } = useMcpApp();
  const [resources, setResources] = useState<ResourceInfo[]>([]);
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [content, setContent] = useState<ResourceContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  // Load resource list on connect
  useEffect(() => {
    if (!connected) return;
    setStatus("リソース一覧を取得中...");
    listServerResources()
      .then((result) => {
        const list = (result.resources ?? []).map(
          (r: {
            uri: string;
            name?: string;
            description?: string;
            mimeType?: string;
          }) => ({
            uri: r.uri,
            name: r.name ?? r.uri,
            description: r.description,
            mimeType: r.mimeType,
          }),
        );
        setResources(list);
        setStatus(`${list.length} 件のリソースが見つかりました`);
      })
      .catch((err) => {
        console.error("Failed to list resources:", err);
        setStatus("リソース一覧の取得に失敗しました");
      });
  }, [connected]);

  const handleSelect = useCallback(async (uri: string) => {
    setSelectedUri(uri);
    setLoading(true);
    setStatus("リソースを読み込み中...");
    try {
      const result = await readServerResource(uri);
      const first = result.contents?.[0] as ResourceContent | undefined;
      setContent(first ?? null);
      setStatus("読み込み完了");
    } catch (err) {
      console.error("Failed to read resource:", err);
      setContent(null);
      setStatus("リソースの読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!content?.text) return;
    const resource = resources.find((r) => r.uri === selectedUri);
    const ext = content.mimeType === "application/json" ? ".json" : ".md";
    const filename = (resource?.name ?? "resource").replace(/\s+/g, "-") + ext;
    try {
      const blob = new Blob([content.text], {
        type: content.mimeType ?? "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setStatus(`${filename} をダウンロードしました`);
    } catch (err) {
      console.error("Download failed:", err);
      setStatus("ダウンロードに失敗しました");
    }
  }, [content, selectedUri, resources]);

  // Fallback for non-MCP context
  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="max-w-md text-center p-8">
          <h1 className="text-2xl font-bold mb-4">MCP Resource Browser</h1>
          <p className="text-gray-500 mb-6">
            MCP ホスト（Claude.ai、ChatGPT、Cursor）から接続してください。
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-left text-sm font-mono">
            <p className="text-gray-500 mb-1">MCP エンドポイント:</p>
            <p className="text-blue-600 dark:text-blue-400">
              {typeof window !== "undefined"
                ? `${window.location.origin}/mcp`
                : "/mcp"}
            </p>
          </div>
          <div className="mt-6 text-left text-sm text-gray-500 space-y-2">
            <p>機能:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>サーバーリソースの一覧表示</li>
              <li>Markdown / JSON コンテンツのプレビュー</li>
              <li>リソースのダウンロード</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const selectedResource = resources.find((r) => r.uri === selectedUri);

  return (
    <div className="flex flex-col bg-background text-foreground" style={{ minHeight: 1200 }}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          <span>MCP 接続済み</span>
        </div>
        <span>{status}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Resource list */}
        <aside className="w-[280px] border-r border-gray-200 dark:border-gray-700 overflow-y-auto scrollbar-hide flex-shrink-0">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              リソース一覧
            </h2>
          </div>
          <ul>
            {resources.map((r) => (
              <li key={r.uri}>
                <button
                  onClick={() => handleSelect(r.uri)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                    selectedUri === r.uri
                      ? "bg-blue-50 dark:bg-blue-900/30 border-l-2 border-l-blue-500"
                      : ""
                  }`}
                >
                  <p className="text-sm font-medium truncate">{r.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {r.uri}
                  </p>
                  {r.mimeType && (
                    <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {r.mimeType}
                    </span>
                  )}
                </button>
              </li>
            ))}
            {resources.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-gray-400">
                リソースがありません
              </li>
            )}
          </ul>
        </aside>

        {/* Main: Content preview */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedResource && content ? (
            <>
              <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div>
                  <h2 className="text-base font-semibold">
                    {selectedResource.name}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedResource.mimeType} — {selectedResource.uri}
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  ダウンロード
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    読み込み中...
                  </div>
                ) : (
                  <pre className="text-sm font-mono whitespace-pre-wrap break-words leading-relaxed">
                    {content.text}
                  </pre>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              左のリソースを選択してプレビュー
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
