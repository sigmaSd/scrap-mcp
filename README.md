# Web Scraper MCP Server

A Deno-based MCP (Model Context Protocol) server that can scrape web pages and
extract content using CSS selectors. Built with deno-dom for fast HTML parsing.

## Why

Most LLM clients already have some HTTP fetching capabilities, but fetching a page directly often returns a lot of unnecessary content. This not only confuses the LLM, but also quickly fills up the context window.

That's where this MCP comes in—it enables targeted scraping using CSS selectors, so you only extract the content you actually need.

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
deno run --allow-net server.ts
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
- **User-Agent**: The scraper uses Deno's default User-Agent

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
deno run --allow-net server.ts
```

**"No elements found" with valid selector:**

- The page might load content dynamically with JavaScript
- Try different selectors or inspect the actual HTML source
- Some sites block automated requests

## License

MIT License - see LICENSE file for details

## Example from Zed

```md
# Scraping Tunisianet Laptop Listings

## User

scrap this page from 1 to 2 https://www.tunisianet.com.tn/301-pc-portable-tunisie?prix=1000-13899&page= with this querystring ".item-product"

## Agent

I'll help you scrape the Tunisia Net website for PC portable products. Let me scrape both pages and extract the items using the ".item-product" CSS selector.

**Use Tool: scrape_page (toolu_018qsjLRTs8dCZ16iDSdVenQ)**
```json
{
  "url": "https://www.tunisianet.com.tn/301-pc-portable-tunisie?prix=1000-13899&page=1",
  "query_selector": ".item-product"
}
```

**Tool Results: toolu_018qsjLRTs8dCZ16iDSdVenQ**

Found 24 elements matching selector ".item-product" on https://www.tunisianet.com.tn/301-pc-portable-tunisie?prix=1000-13899&page=1:

Element 1: Pc Portable Lenovo IdeaPad 1 15AMN7 / Ryzen 3 7320U / 8 Go / 512 Go SSD / Gris Avec Sacoche Lenovo Offerte [82VG00Q5FG-2Y] Écran 15.6" HD (1366 x 768), antireflet - Processeur AMD Ryzen 3 7320U, (jusqu’à 4.1 GHz, 6 Mo de mémoire cache) - Mémoire 8 Go LPDDR5 - Disque SSD M.2 NVMe 512 Go - Carte graphique AMD Radeon 610M intégrée - Lecteur de carte SD - 2x Haut-parleurs stéréo 1.5 W, Dolby Audio - Caméra HD 720p avec obturateur de confidentialité - Wi-Fi 6 - Bluetooth 5.2 - 1x USB 2.0 - 1x USB 3.2 - 1x USB-C 3.2 - 1x HDMI 1.4b - 1x prise combinée casque/microphone (3.5 mm) - FreeDOS - Couleur Gris nuage - Garantie 2 ans Avec Sacoche Lenovo Offerte En stock 1 009,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 009,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 2: Pc Portable Lenovo IdeaPad 1 15AMN7 / Ryzen 3 7320U / 16 Go / 512 Go SSD / Gris Avec SACOCHE LENOVO Offerte [82VG00T4FG-2Y] Écran 15.6" Full HD (1920 x 1080 px), antireflet - Processeur AMD Ryzen 3 7320U, (jusqu’à 4.3 GHz, 6 Mo de mémoire cache) - Mémoire 16 Go LPDDR5 - Disque SSD M.2 NVMe 512 Go - Carte graphique AMD Radeon 610M Graphics intégrée - Lecteur de carte SD - 2x Haut-parleurs stéréo 1.5 W Dolby Audio - Caméra HD 720p avec obturateur de confidentialité - Wi-Fi 6 - Bluetooth 5.2 - 1x USB 2.0 - 1x USB 3.2 - 1x USB-C 3.2 - 1x HDMI 1.4b - 1x prise combinée casque/microphone (3.5 mm) - FreeDOS - Couleur Gris nuage - Garantie 2 ans Avec SACOCHE LENOVO Offerte En stock 1 049,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 049,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 3: Pc Portable DELL Vostro 3520 / i3-1215U / 8 Go / 512 Go SSD / Noir Avec SACOCHE Offert [V3520I3-UBUSAC] Écran 15.6" Full HD - Processeur Intel Core i3-1215U, 12e génération, (jusqu'à 4.4 GHz, 10 Mo de mémoire Cache) - Mémoire 8 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte Graphique Intel UHD Graphics - Caméra HD 720p - WiFi - Bluetooth - USB 3.2 - 1x prise casque - 1x HDMI 1.4 - 1x RJ-45 - FreeDos - Couleur Noir - Garantie 1 an Avec SACOCHE Offert En stock 1 049,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 049,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 4: Pc Portable DELL Vostro 3520 / i3-1215U / 12 Go / 512 Go SSD / Noir [V3520I3-UBU-12] Écran 15.6" Full HD - Processeur Intel Core i3-1215U, 12e génération, (jusqu'à 4.4 GHz, 10 Mo de mémoire Cache) - Mémoire 12 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte Graphique Intel UHD Graphics - Caméra HD 720p - WiFi - Bluetooth - USB 3.2 - 1x prise casque - 1x HDMI 1.4 - 1x RJ-45 - FreeDos - Couleur Noir - Garantie 1 an En stock 1 055,000 DT Prix Ajouter au panier Favoris Comparer 1 055,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 5: Pc Portable Lenovo IdeaPad 1 15AMN7 / Ryzen 3 7320U / 8 Go / 512 Go SSD / Windows 11 Pro / Gris Avec Sacoche Lenovo Offerte [82VG00Q5FG-2Y-W11P] Écran 15.6" HD (1366 x 768), antireflet - Processeur AMD Ryzen 3 7320U, (jusqu’à 4.1 GHz, 6 Mo de mémoire cache) - Mémoire 8 Go LPDDR5 - Disque SSD M.2 NVMe 512 Go - Carte graphique AMD Radeon 610M intégrée - Lecteur de carte SD - 2x Haut-parleurs stéréo 1.5 W, Dolby Audio - Caméra HD 720p avec obturateur de confidentialité - Wi-Fi 6 - Bluetooth 5.2 - 1x USB 2.0 - 1x USB 3.2 - 1x USB-C 3.2 - 1x HDMI 1.4b - 1x prise combinée casque/microphone (3.5 mm) - Windows 11 Pro - Couleur Gris nuage - Garantie 2 ans Avec Sacoche Lenovo Offerte En stock 1 069,000 DT Prix Ajouter au panier Favoris Comparer 1 069,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 6: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 8 Go / 512 Go SSD / Silver [X1504VA-NJ725] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 8 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré - Wi-Fi 6E - Bluetooth 5.3 - FreeDos - Couleur Silver - Garantie 1 an En stock 1 089,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 089,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 7: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 8 Go / 512 Go SSD / Bleu [X1504VA-NJ739] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 8 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré - Wi-Fi 6E - Bluetooth 5.3 - FreeDos - Couleur Bleu - Garantie 1 an En stock 1 089,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 089,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 8: Pc Portable DELL Vostro 3520 / i3-1215U / 24 Go / 512 Go SSD / Noir Avec SACOCHE Offert [V3520I3-UBU-24-SAC] Écran 15.6" Full HD - Processeur Intel Core i3-1215U, 12e génération, (jusqu'à 4.4 GHz, 10 Mo de mémoire Cache) - Mémoire 24 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte Graphique Intel UHD Graphics - Caméra HD 720p - WiFi - Bluetooth - USB 3.2 - 1x prise casque - 1x HDMI 1.4 - 1x RJ-45 - FreeDos - Couleur Noir - Garantie 1 an Avec SACOCHE Offert En stock 1 089,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 089,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 9: Pc Portable DELL Vostro 3520 / i3-1215U / 16 Go / 512 Go SSD / WINDOWS 11 PROFESSIONNEL / Noir [V3520I3-UBU-16W11P] Écran 15.6" Full HD - Processeur Intel Core i3-1215U, 12e génération, (jusqu'à 4.4 GHz, 10 Mo de mémoire Cache) - Mémoire 16 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte Graphique Intel UHD Graphics - Caméra HD 720p - WiFi - Bluetooth - USB 3.2 - 1x prise casque - 1x HDMI 1.4 - 1x RJ-45 - FreeDos - Couleur Noir - WINDOWS 11 PRO - Garantie 1 an En stock 1 105,000 DT Prix Ajouter au panier Favoris Comparer 1 105,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 10: Pc Portable DELL Vostro 3520 / i3-1215U / 8 Go / 512 Go SSD / Windows 11 Pro / Noir [V3520I3-W11P-SS] Écran 15.6" Full HD - Processeur Intel Core i3-1215U, 12e génération, (jusqu'à 4.4 GHz, 10 Mo de mémoire Cache) - Mémoire 8 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte Graphique Intel UHD Graphics - Caméra HD 720p - WiFi - Bluetooth - USB 3.2 - 1x prise casque - 1x HDMI 1.4 - 1x RJ-45 - Windows 11 Pro - Couleur Noir - Garantie 1 an Avec Souris Optique USB Macro M390 / Noir + Tapis de souris Havit MP846 En stock 1 119,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 119,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 11: Pc Portable DELL Vostro 3520 / i3-1215U / 8 Go / 512 Go SSD /Windows 11 pro /Noir [V3520I3-UBUW11P] Écran 15.6" Full HD - Processeur Intel Core i3-1215U, 12e génération, (jusqu'à 4.4 GHz, 10 Mo de mémoire Cache) - Mémoire 8 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte Graphique Intel UHD Graphics - Caméra HD 720p - WiFi - Bluetooth - USB 3.2 - 1x prise casque - 1x HDMI 1.4 - 1x RJ-45 - FreeDos - Couleur Noir - Windows 11 pro - Garantie 1 an En stock 1 139,000 DT Prix Ajouter au panier Favoris Comparer 1 139,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 12: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 16 Go / 512 Go SSD / Bleu [X1504VA-NJ739-16] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 16 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré - Wi-Fi 6E - Bluetooth 5.3 - FreeDos - Couleur Bleu - Garantie 1 an En stock 1 145,000 DT Prix Ajouter au panier Favoris Comparer 1 145,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 13: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 16 Go / 512 Go SSD / Silver [X1504VA-NJ725-16] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 16 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré - Wi-Fi 6E - Bluetooth 5.3 - FreeDos - Couleur Silver - Garantie 1 an En stock 1 145,000 DT Prix Ajouter au panier Favoris Comparer 1 145,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 14: Pc Portable Dell Vostro 3530 / i3-1305U / 12 Go / Windows 11 Pro / 512 Go SSD / Noir Avec Sacoche Offerte [LAP-I312W11P-SAC] Écran15.6" Full HD (1920 x 1 080 px), 120 Hz, antiéblouissement - Processeur Intel Core i3-1305U 13e génération, (jusqu'à 4.5 GHz, 10 Mo de mémoire cache) - Mémoire 12 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel UHD Graphics intégrée - Clavier non rétroéclairé, Carbon Black - 1x USB 3.2 - 1x USB 2.0 - 1x USB-C 3.2 - 1x USB-C 3.2 DisplayPort 1.4 - 1x port audio universel - 1x port HDMI 1.4 - 1x port Ethernet RJ45 - 1 logement de carte SD - Webcam HD RVB 720p - 2x Haut-parleurs stéréo 2 W - Wi-Fi 5 - Bluetooth 5.3 - Windows 11 Pro - Couleur Noir - Garantie 1 an Avec Sacoche Offerte En stock 1 149,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 149,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 15: Pc Portable HP 15-fd0052nk / i3-N305 / 8 Go / 512 Go SSD / Bleu [A2MM1EA] Écran 15.6" Full HD (1920 x 1080), antireflet - Processeur Intel Core i3-N305, (jusqu'à 3.8 GHz, 6 Mo de mémoire cache) - Mémoire 8 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel UHD Graohics Intégrée - Wi-Fi 6 - Bluetooth 5.3 - Caméra HP True Vision HD 720p - Doubles haut-parleurs - 1x USB Type-C - 2x USB Type-A - 1x HDMI 1.4b - 1x combinée casque/microphone - FreeDOS - Couleur Bleu - Garantie 1 an En stock 1 149,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 149,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 16: -126,000 DT -126,000 DT Pc Portable HP 15-fd0055nk / i3-N305 / 8 Go / 512 Go SSD / Noir [A2AP1EA] Écran Full HD 15.6" (1920 x 1080), antireflet - Processeur Intel Core i3-N305, (jusqu’à 3.8 GHz, 6 Mo de mémoire cache) - Mémoire 8 Go DDR4 - Disque SSD NVMe M.2 512 Go - Carte graphique Intel UHD Intégré - Wi-Fi 6 - Bluetooth 5.3 - Clavier complet gris clair avec pavé numérique - Caméra HP True Vision HD 720p - Doubles haut-parleurs - 1x USB-C - 2x USB-A - 1x HDMI 1.4b - 1x prise combinée casque/microphone - FreeDOS - Couleur Noir - Garantie 1 an En stock 1 149,000 DT Prix de base 1 275,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 149,000 DT Prix de base 1 275,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 17: -100,000 DT -100,000 DT Pc Portable HP 15-fd0053nk / i3-N305 / 8 Go / 512 Go SSD / Silver [A2AP0EA] Écran Full HD 15.6" (1920 x 1080), antireflet - Processeur Intel Core i3-N305, (jusqu’à 3.8 GHz, 6 Mo de mémoire cache) - Mémoire 8 Go DDR4 - Disque SSD NVMe M.2 512 Go - Carte graphique Intel UHD Intégré - Wi-Fi 6 - Bluetooth 5.3 - Clavier complet gris clair avec pavé numérique - Caméra HP True Vision HD 720p - Doubles haut-parleurs - 1x USB-C - 2x USB-A - 1x HDMI 1.4b - 1x prise combinée casque/microphone - FreeDOS - Couleur Silver - Garantie 1 an En stock 1 149,000 DT Prix de base 1 249,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 149,000 DT Prix de base 1 249,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 18: -150,000 DT -150,000 DT Pc Portable HP 15-fd0051nk / i3-N305 / 8 Go / 512 Go SSD / Gold [A2AN9EA] Écran Full HD 15.6" (1920 x 1080), antireflet - Processeur Intel Core i3-N305, (jusqu’à 3.8 GHz, 6 Mo de mémoire cache) - Mémoire 8 Go DDR4 - Disque SSD NVMe M.2 512 Go - Carte graphique Intel UHD Intégré - Wi-Fi 6 - Bluetooth 5.3 - Clavier complet gris clair avec pavé numérique - Caméra HP True Vision HD 720p - Doubles haut-parleurs - 1x USB-C - 2x USB-A - 1x HDMI 1.4b - 1x prise combinée casque/microphone - FreeDOS - Couleur Gold - Garantie 1 an En stock 1 149,000 DT Prix de base 1 299,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 149,000 DT Prix de base 1 299,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 19: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 8 Go / 512 Go SSD / Windows 11 Pro / Bleu [X1504VA-NJ739-W11P] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 8 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré - Wi-Fi 6E - Bluetooth 5.3 - Windows 11 Pro - Couleur Bleu - Garantie 1 an En stock 1 155,000 DT Prix Ajouter au panier Favoris Comparer 1 155,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 20: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 8 Go / 512 Go SSD / Windows 11 Pro / Silver [X1504VA-NJ725-W11P] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 8 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré - Wi-Fi 6E - Bluetooth 5.3 - Windows 11 Pro - Couleur Silver - Garantie 1 an En stock 1 155,000 DT Prix Ajouter au panier Favoris Comparer 1 155,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 21: Pc Portable Lenovo IdeaPad Slim 3 15IAN8 / i3-N305 / 8 Go / 256 Go SSD / Windows 11 / Gris Avec Sac à dos Lenovo Offert [82XB006DFG-2Y] Écran 15.6" Full HD (1920 x 1080), antireflet - Processeur Intel Core i3-N305, (jusqu’à 3.8 GHz, 6 Mo de mémoire cache) - Mémoire 8 Go LPDDR5-4800 - Disque SSD M.2 NVMe 256 Go - Carte graphique Intel UHD Graphics intégrée - lecteur de carte SD - 2x Haut-parleurs stéréo orientés utilisateur, 1.5 W optimisés avec Dolby Audio - Caméra HD 720p avec obturateur de confidentialité - Wi-Fi 6 - Bluetooth 5.2 - 2x USB 3.2 - 1x USB-C 3.2 - 1x HDMI 1.4 - 1x prise combinée casque/microphone (3.5 mm) - Windows 11 - Couleur Gris arctique - Garantie 2 ans Avec Sac à dos Lenovo Offert En stock 1 159,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 159,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 22: -110,000 DT -110,000 DT Pc Portable DELL Inspiron 3535 / Ryzen 5 7520U / 8 Go / 512 GO [INSP-3535R5] Écran 15.6" FHD (1 920 x 1 080) - Taux de Rafraichissement 120 Hz - Processeur AMD Ryzen 5 7520U, up to 4.3 GHz, 4 Mo de mémoire cache- Mémoire 8 Go DDR5 - Disque SSD 512 Go M.2 PCIe NVMe - Carte graphique AMD Radeon Graphics - 1x USB 3.2 - 1x USB-C 3.2 - 1x USB 2.0 - 1x Jack 3.5 mm - 1x HDMI 1.4 - Caméra HD - 2x Haut-parleurs stéréo 2W - Wifi - Bluetooth - Couleur Noir - Garantie 1 an En stock 1 169,000 DT Prix de base 1 279,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 169,000 DT Prix de base 1 279,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 23: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 24 Go / 512 Go SSD / Silver [X1504VA-NJ725-24] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 24 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré- Wi-Fi 6E - Bluetooth 5.3 - FreeDos - Couleur Silver - Garantie 1 an En stock 1 175,000 DT Prix Ajouter au panier Favoris Comparer 1 175,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 24: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 24 Go / 512 Go SSD / Bleu [X1504VA-NJ739-24] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 24 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré - Wi-Fi 6E - Bluetooth 5.3 - FreeDos - Couleur Bleu - Garantie 1 an En stock 1 175,000 DT Prix Ajouter au panier Favoris Comparer 1 175,000 DT Prix En stock Ajouter au panier Favoris Comparer


## Agent

Now let me scrape page 2:

**Use Tool: scrape_page (toolu_018fVKwVVoaKZk4W2Y11YZZU)**
```json
{
  "query_selector": ".item-product",
  "url": "https://www.tunisianet.com.tn/301-pc-portable-tunisie?prix=1000-13899&page=2"
}
```

**Tool Results: toolu_018fVKwVVoaKZk4W2Y11YZZU**

Found 24 elements matching selector ".item-product" on https://www.tunisianet.com.tn/301-pc-portable-tunisie?prix=1000-13899&page=2:

Element 1: Pc Portable Lenovo IdeaPad Slim 3 15IRU8 / i3-1315U / 8 Go / 512 Go SSD / Gris [82X700DFFG-2Y] Écran 15.6" FHD (1920 x 1080 px), antireflet - Processeur Intel Core i3-1315U, (jusqu’à 4.5 GHz, 10 Mo de mémoire cache) - Mémoire 8 Go - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel UHD Graphics intégrée - Lecteur de carte SD - 2x Haut-parleurs stéréo 1.5 W Dolby Audio - Caméra HD 720p avec obturateur de confidentialité - Wi-Fi 6 - Bluetooth 5.2 - 2x USB 3.2 - 1x USB-C 3.2 - 1x HDMI 1.4 - 1x prise combinée casque/microphone (3.5 mm) - FreeDOS - Couleur Gris arctique - Garantie 2 ans En stock 1 179,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 179,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 2: -110,000 DT -110,000 DT Pc Portable DELL Inspiron 3535 / Ryzen 5 7520U / 8 Go / 512 GO Avec Sacoche Offerte [INSP-3535R5-SAC] Écran 15.6" FHD (1 920 x 1 080) - Taux de Rafraichissement 120 Hz - Processeur AMD Ryzen 5 7520U, up to 4.3 GHz, 4 Mo de mémoire cache- Mémoire 8 Go DDR5 - Disque SSD 512 Go M.2 PCIe NVMe - Carte graphique AMD Radeon Graphics - 1x USB 3.2 - 1x USB-C 3.2 - 1x USB 2.0 - 1x Jack 3.5 mm - 1x HDMI 1.4 - Caméra HD - 2x Haut-parleurs stéréo 2W - Wifi - Bluetooth - Couleur Noir - Garantie 1 an Avec Sacoche Offerte En stock 1 179,000 DT Prix de base 1 289,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 179,000 DT Prix de base 1 289,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 3: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 8 Go / 512 Go SSD / Windows 11 / Silver [X1504VA-NJ814W] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U 13e génération, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 8 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré -- Wi-Fi 6E - Bluetooth 5.3 - Windows 11 - Couleur Silver - Garantie 1 an En stock 1 189,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 189,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 4: Pc Portable HP 15-fd0052nk / i3-N305 / 16 Go / 512 Go SSD / Bleu [A2MM1EA-16] Écran 15.6" Full HD (1920 x 1080), antireflet - Processeur Intel Core i3-N305, (jusqu'à 3.8 GHz, 6 Mo de mémoire cache) - Mémoire 16 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel UHD Graohics Intégrée - Wi-Fi 6 - Bluetooth 5.3 - Caméra HP True Vision HD 720p - Doubles haut-parleurs - 1x USB Type-C - 2x USB Type-A - 1x HDMI 1.4b - 1x combinée casque/microphone - FreeDOS - Couleur Bleu - Garantie 1 an En stock 1 189,000 DT Prix Ajouter au panier Favoris Comparer 1 189,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 5: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 8 Go / 512 Go SSD / Windows 11 / Bleu [X1504VA-NJ518W] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U 13e génération, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 8 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré - Wi-Fi 6E - Bluetooth 5.3 - Windows 11 - Couleur Bleu calme - Garantie 1 an En stock 1 189,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 189,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 6: -150,000 DT -150,000 DT Pc Portable HP 15-fd0051nk / i3-N305 / 16 Go / 512 Go SSD / Gold [A2AN9EA-16] Écran Full HD 15.6" (1920 x 1080), antireflet - Processeur Intel Core i3-N305, (jusqu’à 3.8 GHz, 6 Mo de mémoire cache) - Mémoire 16 Go DDR4 - Disque SSD NVMe M.2 512 Go - Carte graphique Intel UHD Intégré - Wi-Fi 6 - Bluetooth 5.3 - Clavier complet gris clair avec pavé numérique - Caméra HP True Vision HD 720p - Doubles haut-parleurs - 1x USB-C - 2x USB-A - 1x HDMI 1.4b - 1x prise combinée casque/microphone - FreeDOS - Couleur Gold - Garantie 1 an En stock 1 189,000 DT Prix de base 1 339,000 DT Prix Ajouter au panier Favoris Comparer 1 189,000 DT Prix de base 1 339,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 7: -100,000 DT -100,000 DT Pc Portable HP 15-fd0053nk / i3-N305 / 16 Go / 512 Go SSD / Silver [A2AP0EA-16] Écran Full HD 15.6" (1920 x 1080), antireflet - Processeur Intel Core i3-N305, (jusqu’à 3.8 GHz, 6 Mo de mémoire cache) - Mémoire 16 Go DDR4 - Disque SSD NVMe M.2 512 Go - Carte graphique Intel UHD Intégré - Wi-Fi 6 - Bluetooth 5.3 - Clavier complet gris clair avec pavé numérique - Caméra HP True Vision HD 720p - Doubles haut-parleurs - 1x USB-C - 2x USB-A - 1x HDMI 1.4b - 1x prise combinée casque/microphone - FreeDOS - Couleur Silver - Garantie 1 an En stock 1 189,000 DT Prix de base 1 289,000 DT Prix Ajouter au panier Favoris Comparer 1 189,000 DT Prix de base 1 289,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 8: -126,000 DT -126,000 DT Pc Portable HP 15-fd0055nk / i3-N305 / 16 Go / 512 Go SSD / Noir [A2AP1EA-16] Écran Full HD 15.6" (1920 x 1080), antireflet - Processeur Intel Core i3-N305, (jusqu’à 3.8 GHz, 6 Mo de mémoire cache) - Mémoire 16 Go DDR4 - Disque SSD NVMe M.2 512 Go - Carte graphique Intel UHD Intégré - Wi-Fi 6 - Bluetooth 5.3 - Clavier complet gris clair avec pavé numérique - Caméra HP True Vision HD 720p - Doubles haut-parleurs - 1x USB-C - 2x USB-A - 1x HDMI 1.4b - 1x prise combinée casque/microphone - FreeDOS - Couleur Noir - Garantie 1 an En stock 1 189,000 DT Prix de base 1 315,000 DT Prix Ajouter au panier Favoris Comparer 1 189,000 DT Prix de base 1 315,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 9: Pc portable Asus ExpertBook B2 B2502CBA / I3-1215U / 24 Go / 512Go SSD / Bleu [B2502CBA-KJ1662-24] Écran 15.6" Full HD (1920 x 1080 ) - Processeur Intel Core i3-1215U (Up to 4.4 GHz, 10 Mo de mémoire cache) - Mémoire 24 Go DDR4 - Disque SSD 512 Go - Carte graphique Intel UHD graphics - WiFi - Bluetooth - HDMI - 1x USB 2.0 Type-A - 1x USB 3.2 Gen 1 Type-A - 1x USB 3.2 Gen 2 Type-C - RJ45 - Jack 3,5mm - 720p HD camera - Capteur d'empreintes digitales intégré - Clavier rétroéclairé avec SensePoin - Couleur Bleu - Garantie 1 an En stock 1 195,000 DT Prix Ajouter au panier Favoris Comparer 1 195,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 10: Pc Portable Dell Vostro 3530 / i3-1305U / 8 Go / 512 Go SSD / Noir [N1612QVNB3530-UBU] Écran15.6" Full HD (1920 x 1 080 px), 120 Hz, antiéblouissement - Processeur Intel Core i3-1305U 13e génération, (jusqu'à 4.5 GHz, 10 Mo de mémoire cache) - Mémoire 8 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel UHD Graphics intégrée - Clavier non rétroéclairé, Carbon Black - 1x USB 3.2 - 1x USB 2.0 - 1x USB-C 3.2 - 1x USB-C 3.2 DisplayPort 1.4 - 1x port audio universel - 1x port HDMI 1.4 - 1x port Ethernet RJ45 - 1 logement de carte SD - Webcam HD RVB 720p - 2x Haut-parleurs stéréo 2 W - Wi-Fi 6 - Bluetooth 5.3 - FreeDos - Couleur Noir - Garantie 1 an En stock 1 199,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 199,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 11: Pc Portable DELL Vostro 3520 / i5-1235U / 4 Go / 256 Go SSD / Noir [3520I5V-UBU] Écran 15,6" FHD, 120Hz - Processeur Processeur Intel Core i5-1235U, 12e génération, (jusqu'à 4.4 GHz, 12 Mo de mémoire Cache) - Mémoire 4 Go - Disque SSD 256 Go M.2, PCIe NVMe - Carte Graphique Intel UHD Graphics - Caméra HD 720p - WiFi - Bluetooth - USB 3.2 - 1 prise casque - 1x HDMI 1.4 - 1x RJ-45 - Lecteur de carte SD - FreeDos - Couleur Noir - Garantie 1 an En stock 1 199,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 199,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 12: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 8 Go / 512 Go SSD / Windows 11 / Bleu + Sacoche 15.6" [X1504VA-NJ518W-SAC] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U 13e génération, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 8 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré - Wi-Fi 6E - Bluetooth 5.3 - Windows 11 - Couleur Bleu calme - Garantie 1 an+ Sacoche 15.6" En stock 1 199,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 199,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 13: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 16 Go / 512 Go SSD / Windows 11 Pro / Silver [X1504VA-NJ725-16-W11P] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 16 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré - Wi-Fi 6E - Bluetooth 5.3 - Windows 11 Pro - Couleur Silver - Garantie 1 an En stock 1 205,000 DT Prix Ajouter au panier Favoris Comparer 1 205,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 14: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 16 Go / 512 Go SSD / Windows 11 Pro / Bleu [X1504VA-NJ739-16-W11P] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 16 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré - Wi-Fi 6E - Bluetooth 5.3 - Windows 11 Pro - Couleur Bleu - Garantie 1 an En stock 1 205,000 DT Prix Ajouter au panier Favoris Comparer 1 205,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 15: Pc Portable Dell Vostro 3530 / i3-1305U / 8 Go / 512 Go SSD / Noir Avec Sacoche Offerte [N1612QVNB3530-UBU-SAC] Écran15.6" Full HD (1920 x 1 080 px), 120 Hz, antiéblouissement - Processeur Intel Core i3-1305U 13e génération, (jusqu'à 4.5 GHz, 10 Mo de mémoire cache) - Mémoire 8 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel UHD Graphics intégrée - Clavier non rétroéclairé, Carbon Black - 1x USB 3.2 - 1x USB 2.0 - 1x USB-C 3.2 - 1x USB-C 3.2 DisplayPort 1.4 - 1x port audio universel - 1x port HDMI 1.4 - 1x port Ethernet RJ45 - 1 logement de carte SD - Webcam HD RVB 720p - 2x Haut-parleurs stéréo 2 W - Wi-Fi 6 - Bluetooth 5.3 - FreeDos - Couleur Noir - Garantie 1 an Avec Sacoche Offerte En stock 1 209,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 209,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 16: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 16 Go / 512 Go SSD / Windows 11 / Bleu [X1504VA-NJ518W-16] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U 13e génération, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 16 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré - Wi-Fi 6E - Bluetooth 5.3 - Windows 11 - Couleur Bleu calme - Garantie 1 an En stock 1 209,000 DT Prix Ajouter au panier Favoris Comparer 1 209,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 17: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 16 Go / 512 Go SSD / Windows 11 / Silver [X1504VA-NJ814W-16] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U 13e génération, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 16 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré -- Wi-Fi 6E - Bluetooth 5.3 - Windows 11 - Couleur Silver - Garantie 1 an En stock 1 209,000 DT Prix Ajouter au panier Favoris Comparer 1 209,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 18: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 16 Go / 512 Go SSD / Windows 11 / Silver Avec Sacoche Offerte [X1504VA-NJ814W-16-SAC] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U 13e génération, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 16 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré -- Wi-Fi 6E - Bluetooth 5.3 - Windows 11 - Couleur Silver - Garantie 1 an Avec Sacoche Offerte En stock 1 219,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 219,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 19: -120,000 DT -120,000 DT Pc Portable DELL Inspiron 3535 / Ryzen 5 7520U / 8 Go / 512 GO / Windows 11 Pro [INSP-3535R5-W] Écran 15.6" FHD (1 920 x 1 080) - Taux de Rafraichissement 120 Hz - Processeur AMD Ryzen 5 7520U, up to 4.3 GHz, 4 Mo de mémoire cache- Mémoire 8 Go DDR5 - Disque SSD 512 Go M.2 PCIe NVMe - Carte graphique AMD Radeon Graphics - 1x USB 3.2 - 1x USB-C 3.2 - 1x USB 2.0 - 1x Jack 3.5 mm - 1x HDMI 1.4 - Caméra HD - 2x Haut-parleurs stéréo 2W - Wifi - Bluetooth - Couleur Noir - Windows 11 Pro - Garantie 1 an En stock 1 219,000 DT Prix de base 1 339,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 219,000 DT Prix de base 1 339,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 20: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 16 Go / 512 Go SSD / Windows 11 / Bleu + Sacoche Pour PC 15.6" [X1504VA-NJ518W-16-SAC] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U 13e génération, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 16 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré - Wi-Fi 6E - Bluetooth 5.3 - Windows 11 - Couleur Bleu calme - Garantie 1 an+ Sacoche Pour PC Portable 15.6" En stock 1 219,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 219,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 21: -120,000 DT -120,000 DT Pc Portable DELL Inspiron 3535 / Ryzen 5 7520U / 8 Go / 512 GO / Windows 11 Pro Avec Sacoche Offerte [INSP-3535R5-W-SAC] Écran 15.6" FHD (1 920 x 1 080) - Taux de Rafraichissement 120 Hz - Processeur AMD Ryzen 5 7520U, up to 4.3 GHz, 4 Mo de mémoire cache- Mémoire 8 Go DDR5 - Disque SSD 512 Go M.2 PCIe NVMe - Carte graphique AMD Radeon Graphics - 1x USB 3.2 - 1x USB-C 3.2 - 1x USB 2.0 - 1x Jack 3.5 mm - 1x HDMI 1.4 - Caméra HD - 2x Haut-parleurs stéréo 2W - Wifi - Bluetooth - Windows 11 Pro - Couleur Noir - Garantie 1 an Avec Sacoche Offerte En stock 1 229,000 DT Prix de base 1 349,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 229,000 DT Prix de base 1 349,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


Element 22: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 24 Go / 512 Go SSD / Windows 11 Pro / Bleu [X1504VA-NJ739-24-W11P] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 24 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré - Wi-Fi 6E - Bluetooth 5.3 - Windows 11 Pro - Couleur Bleu - Garantie 1 an En stock 1 235,000 DT Prix Ajouter au panier Favoris Comparer 1 235,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 23: Pc Portable ASUS Vivobook 15 X1504VA / i3-1315U / 24 Go / 512 Go SSD / Windows 11 Pro / Silver [X1504VA-NJ725-24-W11P] Écran 15.6" Full HD (1920 x 1080), rétroéclairage LED,60 Hz, antireflet - Processeur Intel Core i3-1315U, (jusqu'à 4.5 GHz,10 Mo de mémoire cache) - Mémoire 24 Go DDR4 - Disque SSD M.2 NVMe 512 Go - Carte graphique Intel Graphics - 1x USB 2.0 - 1x USB Type-C 3.2 - 2x USB 3.2 - 1x HDMI 1.4 - 1x prise audio combinée 3.5 mm - Clavier Chiclet - Caméra HD 720p avec obturateur de confidentialité - Haut-parleur / Microphone intégré- Wi-Fi 6E - Bluetooth 5.3 - Windows 11 Pro - Couleur Silver - Garantie 1 an En stock 1 235,000 DT Prix Ajouter au panier Favoris Comparer 1 235,000 DT Prix En stock Ajouter au panier Favoris Comparer


Element 24: Pc Portable HP 15-fd0315nk / i3-1315U / 8 Go / 256 Go SSD / Argent [B63KXEA] Écran 15.6" Full HD (1920 x 1080), micro-bords, antireflet - Processeur Intel Core i3-1315U 13e génération, (jusqu’à 4.5 GHz, 10 Mo de mémoire cache) - Mémoire 8 Go DDR4 - Disque SSD NVMe M.2 256 Go - Carte graphique Intel UHD Graphics Intégré - Wi-Fi 6 - Bluetooth 5.3 - Clavier complet gris clair rétroéclairé avec pavé numérique - Caméra HP True Vision HD 720p - Doubles haut-parleurs - 1x USB Type-C - 2x USB - 1x port HDMI 1.4b - 1x prise combinée casque/microphone - Windows 11 - Couleur Argent naturel - Garantie 1 an En stock 1 245,000 DT Prix Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN 1 245,000 DT Prix En stock Ajouter au panier Favoris Comparer Disponibilité Boutique Tunis Sousse Sfax Tunis Drive-IN


## Agent

Perfect! I've successfully scraped both pages of the Tunisia Net website for PC portable products in the price range of 1000-13899 DT. Here's a summary of what I found:

## Scraping Results Summary

**Page 1**: Found **24 laptop products** matching the `.item-product` selector
**Page 2**: Found **24 laptop products** matching the `.item-product` selector

**Total**: **48 laptop products** scraped from both pages

### Key Information Extracted:

The scraping captured detailed information for each laptop including:
- Product names and model numbers
- Specifications (processor, RAM, storage, display)
- Prices in Tunisian Dinars (DT)
- Availability status
- Colors and variants
- Included accessories (like bags/sacoches)
- Warranty information

### Price Range:
- Lowest price: **1,009,000 DT** (Lenovo IdeaPad 1 15AMN7)
- Highest price: **1,245,000 DT** (HP 15-fd0315nk)

### Popular Brands Found:
- **Lenovo** (IdeaPad series)
- **DELL** (Vostro and Inspiron series)
- **ASUS** (Vivobook series)
- **HP** (15-fd series)

### Common Specifications:
- Most laptops feature 15.6" displays
- RAM options range from 8GB to 24GB
- Storage is primarily 512GB SSD
- Processors include Intel Core i3 and AMD Ryzen 3/5
- Many include FreeDOS with Windows 11 options available

The scraping was successful and captured all the product information from both pages using the specified CSS selector `.item-product`.

## User

what do you recommend, dont recommend intel hp dell

## Agent

**Use Tool: thinking (toolu_01FG3rJHbJNTweCPfZcmnb3h)**
```json
{
  "content": "The user is asking for recommendations from the scraped laptop data, but they specifically don't want Intel processors, HP, or Dell brands. Let me analyze what's left from the scraped data:\n\nFrom the scraped results, I need to filter out:\n1. Intel processors (i3, i5, etc.)\n2. HP brand laptops\n3. Dell brand laptops\n\nLooking at the data, this leaves us with:\n- Lenovo laptops with AMD processors\n- ASUS laptops with AMD processors (if any)\n\nFrom the scraped data, I can see:\n1. Lenovo IdeaPad 1 15AMN7 with AMD Ryzen 3 7320U - multiple variants with different RAM/storage configurations\n2. DELL Inspiron 3535 with AMD Ryzen 5 7520U - but this is Dell, so excluded\n3. Most ASUS laptops seem to have Intel processors, so they're excluded\n\nSo the main recommendations would be the Lenovo laptops with AMD Ryzen processors. Let me identify the best options based on specs and value."
}
```

**Tool Results: toolu_01FG3rJHbJNTweCPfZcmnb3h**

Finished thinking.
## Agent

Based on your criteria (no Intel, HP, or Dell), here are my **top recommendations** from the scraped data:

## 🏆 **Best AMD + Lenovo Options**

### 1. **Lenovo IdeaPad 1 15AMN7 - 16GB RAM** ⭐⭐⭐⭐⭐
**Price: 1,049,000 DT**
- **AMD Ryzen 3 7320U** (up to 4.3 GHz)
- **16GB LPDDR5** RAM
- **512GB SSD**
- **Full HD 1920x1080** display
- **Windows-ready** (FreeDOS included)
- **Includes Lenovo bag**

**Why I recommend it:** Best bang for buck with 16GB RAM and modern Ryzen processor.

### 2. **Lenovo IdeaPad 1 15AMN7 - 8GB RAM** ⭐⭐⭐⭐
**Price: 1,009,000 DT**
- **AMD Ryzen 3 7320U** (up to 4.1 GHz)
- **8GB LPDDR5** RAM
- **512GB SSD**
- **HD 1366x768** display
- **Includes Lenovo bag**

**Why I recommend it:** Most affordable AMD option, though lower resolution screen.

### 3. **Lenovo IdeaPad 1 15AMN7 - Windows 11 Pro** ⭐⭐⭐⭐
**Price: 1,069,000 DT**
- **AMD Ryzen 3 7320U**
- **8GB LPDDR5** RAM
- **512GB SSD**
- **Windows 11 Pro pre-installed**
- **Includes Lenovo bag**

## ⚠️ **Limited Options Due to Your Criteria**

Unfortunately, your restrictions eliminate most options:
- **90% of laptops** in this price range use Intel processors
- **HP and Dell** dominate the budget laptop market
- **ASUS Vivobook series** all use Intel processors

## 💡 **My Strong Recommendation**

Go with the **Lenovo IdeaPad 1 15AMN7 with 16GB RAM (1,049,000 DT)**

**Reasons:**
✅ **AMD Ryzen 3 7320U** - Modern, efficient processor
✅ **16GB RAM** - Future-proof for multitasking
✅ **512GB SSD** - Fast storage
✅ **Full HD display** - Better screen quality
✅ **Great value** - Only 40,000 DT more than 8GB version
✅ **2-year warranty** - Longer coverage
✅ **Free Lenovo bag** included

This laptop offers the best balance of performance, future-proofing, and value within your constraints.
```
