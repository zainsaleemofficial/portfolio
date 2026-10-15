# Zain Saleem Portfolio

The new personal portfolio for [zainsaleem.co](https://zainsaleem.co), built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, and Lucide React.

This repository currently contains the development foundation only. The portfolio's visual design and content will be created separately.

## Requirements

- Node.js 24 or a current supported Node.js LTS release
- npm 11+

## Local development

```bash
npm ci
npm run dev
```

Vite serves the site at `http://localhost:5173` by default. Copy `.env.example` to `.env.local` when local public configuration is needed. Variables exposed to browser code must start with `VITE_`; never store secrets in them.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

The production bundle is written to `dist/`.

## Design tooling

UI UX Pro Max is installed for Codex under `.agents/skills/ui-ux-pro-max`. Use it when planning or implementing the visual design, accessibility, interaction, responsive behavior, typography, color, and motion.

MotionSites is configured as a project MCP server in `.codex/config.toml`. It runs through `mcp-remote` and connects to a third-party Supabase Functions endpoint. Only send content to its tools that may be shared with that service. Confirm registration with:

```bash
codex mcp list
```

## Cloudflare deployment

For Cloudflare Pages, connect `zainsaleemofficial/portfolio` and use:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `24`

No DNS records or production deployment are configured by this repository. Add `zainsaleem.co` as a custom domain only when the site is ready to publish.
