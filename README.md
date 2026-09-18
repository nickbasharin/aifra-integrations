# AIfra: temporary static previews for coding agents

A ready HTML/CSS/JS folder becomes a public HTTPS link for **48 hours**. Suitable for
static sites, HTML presentations and static reports. AIfra is a preview SaaS, not
production hosting. It never builds your project or executes a user backend.

- [English MCP quickstart](https://aifra.ru/en/docs/mcp/)
- [Инструкция для агента на русском](https://aifra.ru/docs/agent/)
- [npm aifra@0.2.0-beta.2](https://www.npmjs.com/package/aifra/v/0.2.0-beta.2)
- [Official MCP Registry](https://registry.modelcontextprotocol.io/?q=io.github.nickbasharin%2Faifra)
- [Runnable slides and report examples](examples/README.md)

## Connect from a web chat

Remote MCP: **https://api.aifra.ru/mcp** — Streamable HTTP, no authentication. No AIfra
account, existing hosted project or API key is needed for a new preview. Add the
endpoint in a client that supports custom remote MCP; no npm installation is needed. See
the [ChatGPT / Claude walkthrough](https://aifra.ru/docs/chat/).

Six tools: get_deploy_instructions, create_preview, update_preview, delete_preview,
get_operation_status and get_preview_status. After explicit terms acceptance,
create/update/delete prepare an operation and return approval_url. The user opens it and
confirms in their browser; the agent must never confirm on their behalf. Poll
get_operation_status for the actual result. Pending is not published.

Pass static file contents in files (up to 1 MiB total), or archive_base64 (up to 50 MiB
decoded ZIP). A chat-local path is not an upload; provider URL downloads are disabled.
Unconfirmed files expire after 10 minutes, operation metadata after one hour, with
cleanup on the next worker pass. Management keys stay in the approving browser; use that
browser for updates and deletion. Do not retry uncertain operations blindly.

## Install and connect locally

Node.js **24** is required. In a trusted local project:

```sh
npm install --save-dev --save-exact --ignore-scripts --no-audit --no-fund aifra@0.2.0-beta.2
node node_modules/aifra/aifra.cjs setup --api-origin https://api.aifra.ru
```

Review the new `aifra-setup` folder and merge its AIfra entry into your client's MCP
configuration. Setup never edits existing settings or uploads files. Keep configuration
and private token state outside the uploaded `dist`. See the guide for exact steps.

Local MCP exposes `get_deploy_instructions`, `create_preview`, `update_preview`,
`get_preview_status`, and `delete_preview`. Creating/replacing requires explicit user
consent and `accept_terms: true`. Deleting requires `confirm_delete: true`. Tokens stay
in private local state and are never tool arguments or results.

## What this repository contains

`client/` contains the **exact bundled JavaScript client published on npm as beta.2**,
its SDK declarations, README, MIT license and third-party notices. It can be inspected
and run with `node client/aifra.cjs --help`, without installing dependencies. This is
the published bundle, not an export of the private service source or Git history.

`clients/` contains manual configuration examples; `server.json` is Registry submission
metadata (metadata version beta.3, npm client version beta.2). A prepared card is not
proof that a catalog has accepted it. `examples/` contains small fictional examples
without forms or external requests.

## Limits and safety

48-hour expiry is enforced on the server; updates preserve the original expiry. At most
3 active previews per source IP, 50 MiB uploaded/extracted per preview, 150 MiB active
extracted content per IP. Free unpaid beta, no user accounts or billing. No backend,
SSR, functions, databases, server builds, login forms or custom domains.

Links are public. Noindex is not privacy or password protection. Inspect the ready
output and remove confidential/personal data before upload. Read the
[terms](https://aifra.ru/legal/terms/), [privacy](https://aifra.ru/legal/privacy/) and
[retention policy](https://aifra.ru/legal/retention/) before consent. Support and abuse:
support@aifra.ru.

## Verification and availability

On 18 September 2026, the clean beta.2 npm package and generated configuration passed
create/update/status/delete against the public API, with fixed TTL and HTTPS/noindex
checks. Four local Codex cases passed; Claude Code/Cursor application-level testing
remains open. The public remote endpoint passed SDK and desktop/mobile browser lifecycle
checks. The owner reported a successful ChatGPT connector publication; Claude consumer
UI verification remains open. A Registry listing does not automatically install AIfra or
guarantee recommendations in AI answers.

## License

MIT for this client and integration material. Preserve `client/THIRD_PARTY_NOTICES.txt`
when redistributing the bundle. The MIT license does not cover the private service or
replace the terms governing uploads.
