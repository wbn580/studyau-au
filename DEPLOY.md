# StudyAU — Deployment

Runtime details for the `studyau.au` site. Content and code conventions live in [`CLAUDE.md`](./CLAUDE.md); this file only covers the pipeline from `git push` to live HTTPS.

## 1. Accounts and IDs

| Thing | Value |
| --- | --- |
| GitHub repository | `https://github.com/wbn580/studyau-au` (public, `main` branch) |
| Cloudflare account | `wubaining@gmail.com` (account ID `e57c0b9cf3c0ff93ea9993f4c15acbc8`) |
| Cloudflare Pages project | `studyau-au` |
| Pages preview origin | `https://studyau-au.pages.dev` |
| Cloudflare zone | `studyau.au` (Free plan) |
| Registrar | CrazyDomains (account owner: Wu, `wubaining@gmail.com`) |
| Contact email for the brand | `hello@studyau.au` |

## 2. Everyday workflow

```bash
cd C:\Users\ben\websites\studyau-au
git add -A
git commit -m "…"
git push
```

Pushing to `main` triggers Cloudflare Pages: it runs `npm run build` and publishes `dist/`. A typical deploy takes 2–3 minutes; the first one took longer because the build container was cold.

## 3. Cloudflare Pages project configuration

Created via the **classic Pages flow** at `https://dash.cloudflare.com/e57c0b9cf3c0ff93ea9993f4c15acbc8/pages/new/provider/github`. The new unified Workers & Pages flow at `/workers-and-pages/create` defaults to `pnpm run build` / `npx wrangler deploy` which is wrong for a static Astro site — stick to the classic flow if the project ever needs to be recreated.

| Setting | Value |
| --- | --- |
| Framework preset | **Astro** |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(empty — repo root)* |
| Production branch | `main` |
| Node version | default (Pages picks up Astro's Node 18+ requirement) |
| Environment variables | *(none required)* |

The build script in `package.json` already does `astro check && astro build && pagefind --site dist && <copy pagefind into public/>`. Pages uploads whatever lands in `dist/` — the `public/pagefind` copy is only for `astro dev` to have search locally, it doesn't affect the deploy.

## 4. Cloudflare zone configuration

The zone is on the **Free plan**. Key toggles set during setup:

- **AI Crawl Control → Do not block (allow crawlers).** We *want* GPTBot, ClaudeBot, PerplexityBot, Google-Extended etc. indexing the site. GEO depends on it.
- **"Instruct AI bot traffic with robots.txt" → Off.** Our own `public/robots.txt` is authoritative.
- SSL/TLS mode: default (Full). Pages issues and renews the cert automatically.

## 5. Custom domain — nameserver change at CrazyDomains

Cloudflare issues these nameservers for the `studyau.au` zone:

```
alan.ns.cloudflare.com
maeve.ns.cloudflare.com
```

At CrazyDomains (`https://www.crazydomains.com.au/members/`), update the nameservers on `studyau.au` from the default `ns1.crazydomains.com` / `ns2.crazydomains.com` to the two Cloudflare names above. Propagation is usually minutes to a few hours.

Once Cloudflare shows the zone as **Active**, bind the domain in Pages:

1. Pages project → **Custom domains** → *Set up a domain*.
2. Add `studyau.au` (apex). Pages creates a CNAME flattened at the root automatically — no manual DNS needed because the zone is on Cloudflare.
3. Add `www.studyau.au`. Pages creates a CNAME to `studyau-au.pages.dev`.
4. Delete the two legacy `A` records on the zone that point to `103.67.235.120` (left over from CrazyDomains parking). Keep the TXT records unless we know what they were for.
5. Wait for both custom domains to show **Active** with SSL **Issued**. Confirm by `curl -I https://studyau.au` and `curl -I https://www.studyau.au` — both should return `200` with `server: cloudflare`.

## 6. Email (hello@studyau.au)

Not provisioned yet. When needed, use Cloudflare Email Routing (free) to forward `hello@studyau.au` → `wubaining@gmail.com`. It sets up the MX and SPF records automatically, doesn't interfere with the Pages CNAMEs, and keeps everything inside the Cloudflare zone.

## 7. Rebuild / rollback

- Manual rebuild: Pages dashboard → project → **Deployments** → *Retry deployment* (or push an empty commit).
- Rollback: Pages dashboard → **Deployments** → pick a previous successful build → *Rollback to this deployment*. Instant; no git revert required.
- Local dev: `npm run dev` (runs Astro on `http://localhost:4321`).
- Local production preview: `npm run build && npm run preview`.

## 8. Git credentials on this machine

Git is at `C:\Program Files\Git\cmd\git.exe` and is **not** in PATH when launched from the Run dialog. Helper scripts in `C:\Users\ben\websites\` (`_studyau_git.cmd`, `_studyau_push.cmd`) hard-code the full path — keep doing that if you add more automation. `git config user.email` is set to `hello@studyau.au` and `user.name` to `StudyAU` in this repo.

## 9. Things that are intentionally NOT done

- **No Baidu / Sogou / 360 submission.** The StudyUK sister site targets mainland China; StudyAU targets international students reading English and does not need `CN-submission.md`.
- **No analytics script.** GEO-first means we care about crawler citations, not pageview dashboards. Add Cloudflare Web Analytics (cookieless, free) only if we later need traffic data — it's a single snippet in `Layout.astro`.
- **No chat widget, no newsletter popup.** See `CLAUDE.md` §1 — there is exactly one CTA (the floating icon to the UniLink assessment form).
