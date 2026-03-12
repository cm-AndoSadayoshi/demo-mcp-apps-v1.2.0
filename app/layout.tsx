import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP Resource Browser",
  description: "MCP Apps v1.2.0 Resource Browser Demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
