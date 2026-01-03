import { McpServer } from "npm:@modelcontextprotocol/sdk@1.13.0/server/mcp.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk@1.13.0/server/stdio.js";
import { z } from "npm:zod@3.24.2";
import { DOMParser } from "jsr:@b-fuze/deno-dom@0.1.49";

// Create an MCP server
const server = new McpServer({
  name: "WebScraper",
  version: "1.0.0",
});

// Add a web scraping tool
server.registerTool("scrape_page", {
  title: "Web Page Scraper",
  description: "Scrape web pages and extract content using CSS selectors",
  inputSchema: {
    url: z.string().describe("The URL of the page to scrape"),
    query_selector: z.string().describe(
      "CSS selector to query elements (e.g., 'h1', '.class', '#id', 'div p')",
    ),
  },
}, async ({ url, query_selector }) => {
  try {
    // Fetch the webpage
    const response = await fetch(url);

    if (!response.ok) {
      return {
        content: [{
          type: "text",
          text: `Error fetching URL: ${response.status} ${response.statusText}`,
        }],
      };
    }

    const html = await response.text();
    console.error("resp", html);

    // Parse the HTML with deno-dom
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    if (!doc) {
      return {
        content: [{
          type: "text",
          text: "Error: Failed to parse HTML document",
        }],
      };
    }
    console.error("called");

    // Query all elements matching the selector
    const elements = doc.querySelectorAll(query_selector);

    if (elements.length === 0) {
      return {
        content: [{
          type: "text",
          text: `No elements found matching selector: ${query_selector}`,
        }],
      };
    }

    // Extract text content from all matching elements
    const results: string[] = [];
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      let textContent = element.textContent?.trim();
      if (textContent) {
        // Clean up excessive whitespace
        textContent = textContent
          .replace(/\s+/g, " ") // Replace multiple whitespace with single space
          .replace(/\n\s*\n/g, "\n") // Remove empty lines
          .trim();

        if (textContent) {
          results.push(`Element ${i + 1}: ${textContent}`);
          results.push("\n");
        }
      }
    }

    if (results.length === 0) {
      return {
        content: [{
          type: "text",
          text:
            `Found ${elements.length} matching elements, but none contained text content`,
        }],
      };
    }

    const resultText = [
      `Found ${elements.length} elements matching selector "${query_selector}" on ${url}:`,
      "",
      ...results,
    ].join("\n");

    return {
      content: [{
        type: "text",
        text: resultText,
      }],
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error scraping page: ${
          error instanceof Error ? error.message : String(error)
        }`,
      }],
    };
  }
});

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
