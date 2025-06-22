# Web Scraper MCP Server

An MCP (Model Context Protocol) server that can scrape web pages and extract
content using CSS selectors. Built with deno-dom for fast HTML parsing.

## Why

Most LLM clients already have some HTTP fetching capabilities, but fetching a
page directly often returns a lot of unnecessary content. This not only confuses
the LLM, but also quickly fills up the context window.

That's where this MCP comes in—it enables targeted scraping using CSS selectors,
so you only extract the content you actually need. It's built to work seamlessly
across various JavaScript runtimes like Deno, Node.js, and Bun.

## Example from Zed

[See ZedExample.md for a real-world usage example.](ZedExample.md)

## Features

- 🌐 Fetch any publicly accessible web page by URL
- 🔍 Parse HTML content using the fast deno-dom library
- 📋 Extract text content using standard CSS selectors
- 🎯 Support for complex selectors (classes, IDs, attributes, pseudo-selectors)
- ⚡ Built-in error handling for network issues and parsing failures
- 🛡️ Safe execution with minimal required permissions

## Prerequisites

- [Deno](https://deno.land/) installed on your system
- Network access for fetching web pages

## Running the Server

```bash
deno run --allow-net jsr:@sigma/scrap-mcp # or node or bun
```

## MCP Tool Reference

### `scrape_page`

The main tool for scraping web pages and extracting content.

**Parameters:**

- `url` (string, required): The URL of the page to scrape
- `query_selector` (string, required): CSS selector to query elements

**Return Format:**

```
Found X elements matching selector "SELECTOR" on URL:

Element 1: TEXT_CONTENT

Element 2: TEXT_CONTENT
...
```

## Usage Examples

### Basic Selectors

1. **Extract all headings:**
   ```json
   {
     "url": "https://example.com",
     "query_selector": "h1, h2, h3"
   }
   ```

2. **Extract all paragraphs:**
   ```json
   {
     "url": "https://example.com",
     "query_selector": "p"
   }
   ```

3. **Extract content from specific classes:**
   ```json
   {
     "url": "https://news.ycombinator.com",
     "query_selector": ".titleline > a"
   }
   ```

4. **Extract all links:**
   ```json
   {
     "url": "https://example.com",
     "query_selector": "a"
   }
   ```

### Advanced Selectors

5. **Extract navigation items:**
   ```json
   {
     "url": "https://deno.land",
     "query_selector": "nav a"
   }
   ```

6. **Extract elements with specific attributes:**
   ```json
   {
     "url": "https://example.com",
     "query_selector": "a[href^='https://']"
   }
   ```

7. **Extract form inputs:**
   ```json
   {
     "url": "https://example.com",
     "query_selector": "input[type='text'], input[type='email']"
   }
   ```

## CSS Selector Reference

### Basic Selectors

- `h1` - All H1 headings
- `.className` - All elements with class "className"
- `#elementId` - Element with ID "elementId"
- `*` - All elements

### Combinators

- `div p` - All paragraphs inside div elements
- `div > p` - Direct paragraph children of div elements
- `h1 + p` - Paragraphs immediately following H1 elements
- `h1 ~ p` - All paragraphs that are siblings after H1 elements

### Attribute Selectors

- `[href]` - All elements with href attribute
- `a[title]` - All links with title attribute
- `a[href^="https://"]` - Links starting with "https://"
- `a[href$=".pdf"]` - Links ending with ".pdf"
- `a[href*="github"]` - Links containing "github"

### Pseudo-selectors

- `li:first-child` - First list item
- `li:last-child` - Last list item
- `li:nth-child(2n)` - Even-numbered list items
- `p:not(.special)` - Paragraphs without "special" class

### Complex Examples

- `.article-content p, .article-content h2` - Paragraphs and H2s in article
  content
- `nav ul li a` - Navigation links
- `table tr:nth-child(odd) td` - Cells in odd table rows
- `form input[required]` - Required form inputs

## Dependencies

- `@modelcontextprotocol/sdk@1.8.0` - MCP SDK for server implementation
- `@b-fuze/deno-dom@^0.1.49` - Fast DOM parser for HTML content
- `zod@3.24.2` - Runtime type validation and schema definition

## Error Handling

The server provides comprehensive error handling for:

- **Network Issues**: Invalid URLs, connection timeouts, DNS failures
- **HTTP Errors**: 404 Not Found, 403 Forbidden, 500 Server Error, etc.
- **Parsing Failures**: Malformed HTML, encoding issues
- **Selector Issues**: Invalid CSS selectors, no matching elements
- **Content Issues**: Elements found but no text content available

All errors are returned as readable text messages through the MCP protocol.

## Best Practices

- **Respect robots.txt**: Always check the target site's robots.txt file
- **Add delays**: Use reasonable delays between requests to avoid overwhelming
  servers
- **User-Agent**: The scraper uses the JavaScript runtime's default User-Agent

## Security

### Required Permissions

- `--allow-net` - To fetch web pages from the internet

### Security Features

- **No arbitrary code execution**: Only CSS selectors are accepted, no
  JavaScript
- **Network sandboxing**: Only outbound HTTP/HTTPS requests allowed
- **Input validation**: All inputs validated using Zod schemas

## Troubleshooting

**"Permission denied" errors:**

```bash
# Ensure all required permissions are granted
deno run --allow-net jsr:@sigma/scrap-mcp
```

**"No elements found" with valid selector:**

- The page might load content dynamically with JavaScript
- Try different selectors or inspect the actual HTML source
- Some sites block automated requests

## License

MIT License - see LICENSE file for details
