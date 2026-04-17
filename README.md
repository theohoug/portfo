# Juno Varga — Portfolio

Creative developer portfolio. Next.js 16 (App Router) + Tailwind v4 + Framer Motion.

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy — GitHub Pages

Auto-deploys on push to `main` or `claude/mcp-magic-ui-ux-UDISx` via
`.github/workflows/deploy.yml`.

**One-time setup:** repo **Settings → Pages → Build and deployment → Source:
GitHub Actions**. The site is served at
`https://<user>.github.io/portfo/`.

The workflow sets `DEPLOY_TARGET=pages`, which enables `basePath` / `assetPrefix`
(`/portfo`) in `next.config.ts`. Locally, leave the env var unset so you can
open `out/index.html` or run the dev server normally.
