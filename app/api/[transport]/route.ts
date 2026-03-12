import { createMcpHandler } from "mcp-handler";
import { configureServer } from "@/lib/mcp-server";

const handler = createMcpHandler(configureServer, undefined, {
  basePath: "/api",
  verboseLogs: true,
});

export { handler as GET, handler as POST };
