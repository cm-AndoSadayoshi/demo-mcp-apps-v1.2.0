import { createMcpHandler } from "mcp-handler";
import { configureServer } from "@/lib/mcp-server";

const handler = createMcpHandler(configureServer);

export { handler as GET, handler as POST };
