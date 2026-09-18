# Static preview examples

These small examples contain fictional content and no external requests or forms. The
client in `../client/` is the exact MIT bundle published as `aifra@0.2.0-beta.2`,
including upstream license notices. It is bundled JavaScript, not the private service
repository. Run it with Node.js 24; no install or build is required for these examples.

1. Create a separate trusted local project folder. Copy the contents of `slides/` or
   `report/` into its `dist/` subfolder. Keep the client outside `dist`.
2. Follow [the English MCP guide](https://aifra.ru/en/docs/mcp/) or
   [the Russian agent guide](https://aifra.ru/docs/agent/). The `setup` command
   generates connection files; it does not merge settings or upload anything.
3. Read the linked service terms and explicitly consent before creating a public link.
4. Check the viewer URL on desktop and mobile. Slides use the Next button or arrow keys;
   the report renders without JavaScript.
5. Delete your own preview when finished. Updates keep the original 48-hour expiry.

Limits: three active previews per source IP, 50 MiB uploaded/extracted per preview, 150
MiB active extracted content per IP. URLs are public; noindex is not access control. No
backend, server builds, confidential data or production hosting.
