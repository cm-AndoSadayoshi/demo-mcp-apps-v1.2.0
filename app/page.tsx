export default function Home() {
  return (
    <div
      style={{
        maxWidth: 640,
        margin: "80px auto",
        padding: "0 24px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: "#1a1a1a",
        lineHeight: 1.7,
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>
        MCP Resource Browser
      </h1>
      <p style={{ color: "#666", marginBottom: 32 }}>
        MCP Apps v1.2.0 の新API（listServerResources / readServerResource）を
        使ったリソースブラウザのデモです。
      </p>

      <h2 style={{ fontSize: 20, marginBottom: 12 }}>接続方法</h2>
      <ol style={{ paddingLeft: 20, marginBottom: 32 }}>
        <li style={{ marginBottom: 8 }}>
          <a href="https://claude.ai" target="_blank" rel="noopener">
            Claude.ai
          </a>{" "}
          を開く
        </li>
        <li style={{ marginBottom: 8 }}>
          Settings → Integrations → 「Add More」をクリック
        </li>
        <li style={{ marginBottom: 8 }}>
          このサーバーのMCPエンドポイントURLを入力:
          <code
            style={{
              display: "block",
              background: "#f5f5f5",
              padding: "8px 12px",
              borderRadius: 6,
              marginTop: 4,
              fontSize: 14,
            }}
          >
            {`https://<このサイトのドメイン>/mcp`}
          </code>
        </li>
        <li style={{ marginBottom: 8 }}>
          チャットで「リソースを閲覧して」と入力
        </li>
      </ol>

      <h2 style={{ fontSize: 20, marginBottom: 12 }}>機能</h2>
      <ul style={{ paddingLeft: 20 }}>
        <li style={{ marginBottom: 6 }}>
          サーバーのMCPリソース一覧を表示
        </li>
        <li style={{ marginBottom: 6 }}>
          リソースの内容をプレビュー
        </li>
        <li style={{ marginBottom: 6 }}>
          ファイルとしてダウンロード
        </li>
      </ul>
    </div>
  );
}
