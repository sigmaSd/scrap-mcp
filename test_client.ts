#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-run

import { Client } from "npm:@modelcontextprotocol/sdk@1.13.0/client/index.js";
import { StdioClientTransport } from "npm:@modelcontextprotocol/sdk@1.13.0/client/stdio.js";

/**
 * Test script for the Web Scraper MCP Server
 * Tests scraping TunisiaNet with the .wb-product-desc selector
 */

async function testMCPServer() {
  console.log("🚀 Testing Web Scraper MCP Server");
  console.log("=".repeat(50));

  try {
    // Create client transport
    const transport = new StdioClientTransport({
      command: Deno.execPath(),
      args: [
        "run",
        "--allow-net",
        "server.ts",
      ],
    });

    // Create MCP client
    const client = new Client({
      name: "test-client",
      version: "1.0.0",
    });

    // Connect to server
    console.log("🔌 Connecting to MCP server...");
    await client.connect(transport);
    console.log("✅ Connected successfully!\n");

    // Test the specific TunisiaNet URL and selector
    const testUrl = "https://www.tunisianet.com.tn/732-full-setup-gamer?page=1";
    const testSelector = ".wb-product-desc";

    console.log("🧪 Running test:");
    console.log(`   URL: ${testUrl}`);
    console.log(`   Selector: ${testSelector}`);
    console.log("-".repeat(50));

    try {
      const result = await client.callTool({
        name: "scrape_page",
        arguments: {
          url: testUrl,
          query_selector: testSelector,
        },
      });

      console.log("✅ MCP Tool Response:");
      if (result.content && Array.isArray(result.content)) {
        result.content.forEach((content: unknown) => {
          if (
            typeof content === "object" && content !== null &&
            "type" in content && content.type === "text" && "text" in content
          ) {
            console.log((content as { text: string }).text);
          }
        });
      }
    } catch (error) {
      console.log(
        `❌ Tool call failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  } catch (error) {
    console.error(
      "❌ Client connection failed:",
      error instanceof Error ? error.message : String(error),
    );
  } finally {
    // Clean up handled by transport
  }
}

// Run the test
if (import.meta.main) {
  await testMCPServer();
}
