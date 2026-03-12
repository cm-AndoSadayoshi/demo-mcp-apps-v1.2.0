import { App, PostMessageTransport } from "@modelcontextprotocol/ext-apps";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function main() {
  const app = new App(
    { name: "resource-browser", version: "1.0.0" },
    {}
  );
  await app.connect(
    new PostMessageTransport(window.parent, window.parent)
  );

  const statusEl = document.getElementById("status")!;
  const listEl = document.getElementById("resourceList")!;
  const previewEl = document.getElementById("preview")!;

  statusEl.textContent = "リソース一覧を取得中...";
  const result = await app.listServerResources();
  const resources = result.resources;
  statusEl.textContent = `${resources.length}件のリソースが見つかりました`;

  for (const resource of resources) {
    const item = document.createElement("div");
    item.className = "resource-item";
    item.innerHTML = `
      <div class="name">${escapeHtml(resource.name ?? "Unnamed")}</div>
      <div class="uri">${escapeHtml(resource.uri)}</div>
    `;

    item.addEventListener("click", async () => {
      document.querySelectorAll(".resource-item").forEach((el) => {
        el.classList.remove("active");
      });
      item.classList.add("active");

      statusEl.textContent = `${resource.uri} を読み込み中...`;
      try {
        const readResult = await app.readServerResource({
          uri: resource.uri,
        });
        const content = readResult.contents[0];
        const text =
          "text" in content
            ? (content.text as string)
            : "(バイナリコンテンツ)";

        previewEl.innerHTML = `
          <div style="margin-bottom: 12px;">
            <strong>${escapeHtml(resource.name ?? "Unnamed")}</strong>
            <span style="margin-left: 8px; font-size: 12px; color: #888;">
              ${escapeHtml(content.mimeType ?? "unknown")}
            </span>
            <button class="download-btn" id="downloadBtn"
                    style="float: right;">
              ダウンロード
            </button>
          </div>
          <pre>${escapeHtml(text)}</pre>
        `;

        const downloadBtn = document.getElementById("downloadBtn")!;
        downloadBtn.addEventListener("click", async () => {
          const ext =
            content.mimeType === "application/json" ? ".json" : ".md";
          const filename =
            (resource.name ?? "resource").replace(/\s+/g, "-") + ext;

          await app.downloadFile({
            contents: [
              {
                type: "resource",
                resource: {
                  uri: resource.uri,
                  mimeType: content.mimeType ?? "text/plain",
                  text,
                },
              },
            ],
          });
          statusEl.textContent = `${filename} のダウンロードをリクエストしました`;
        });

        statusEl.textContent = `${resource.uri} を表示中`;
      } catch (err) {
        previewEl.innerHTML = `<p style="color: red;">
          読み込みエラー: ${escapeHtml((err as Error).message)}
        </p>`;
        statusEl.textContent = "エラーが発生しました";
      }
    });

    listEl.appendChild(item);
  }
}

main().catch(console.error);
