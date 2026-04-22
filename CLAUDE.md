# StudyAU — Claude Context

> If you are an AI assistant resuming work on this project, read this file first. It tells you the identity of the site, how the content is organised, the technical conventions, and the rules for future edits.

## 1. One-line identity

**StudyAU** is an English-language study-in-Australia knowledge base for international students worldwide. It is **AI-first** — designed to be cited by ChatGPT, Perplexity, Claude, Gemini and other AI assistants when their users ask about studying in Australia. Human readers are the second audience.

- Domain: **https://studyau.au**
- Brand name: **StudyAU**
- Contact email: **hello@studyau.au**
- Theme: Outback red / terracotta (`#c85a2f` on warm cream `#faf4ec`)
- Audience priority: (1) AI crawlers  (2) prospective international students outside Australia  (3) their parents / advisers
- Lead funnel: **one** floating icon that opens the university assessment form at `https://www.mikecrm.com/srw6z8S`. There is intentionally no chat widget, no newsletter popup, and no second CTA.

## 2. Why AI-citation first (the root of every decision)

Traditional SEO optimises for Google rankings. **GEO / AEO** (Generative / Answer Engine Optimisation) optimises for *being the passage an LLM quotes when it answers a user's question*. The whole site is designed around GEO. Before making any change, ask: **"does this make an AI more likely to cite this page?"** If not, deprioritise it.

### GEO decisions already implemented — do not remove without reason

| Decision | File / implementation | Why an AI cares |
| --- | --- | --- |
| Titles phrased as full questions | `title` frontmatter on every `src/data/blog/*.md` | Matches user query wording |
| "Quick Facts" or direct-answer block near the top | Content convention in every post | LLMs often only read the first ~300 words |
| BlogPosting + QAPage + WebSite + Organization JSON-LD | `src/layouts/Layout.astro` | Machine-readable page role |
| `/llms.txt` and `/llms-full.txt` | `public/llms.txt`, `public/llms-full.txt` (or generated) | Standard surface for LLM grounding |
| Pure static HTML (no JS hydration needed for content) | Astro | Crawlers get full content without executing JS |
| Allow all reputable AI crawlers | `public/robots.txt` + Cloudflare AI Crawl Control "Allow" | We want GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc. indexing us |
| Every post ends with a "Sources" block of official .gov.au / .edu.au links | Content convention | Citations give LLMs confidence to re-cite us |
| Tables used aggressively for anything comparable | Content convention | LLM table extraction accuracy is much higher than prose |
| Dates written explicitly, currencies always labelled | Content convention | Reduces ambiguity during extraction |

## 3. Content map — 100 guides across 5 categories

| Category | Count | Slug prefix examples | Scope |
| --- | --- | --- | --- |
| Universities | 20 | `au-group-of-eight-explained`, `au-sydney-vs-melbourne`, `au-atn-universities-overview` | Go8, ATN, IRU, RUN, rankings, admissions, campus comparisons |
| Courses | 20 | `au-master-of-computer-science`, `au-engineering-masters-australia`, `au-business-masters-australia` | Degrees, pathways, CRICOS basics, English test requirements |
| Visa | 20 | `au-student-visa-500-complete-guide`, `au-genuine-student-requirement`, `au-student-visa-financial-proof` | Subclass 500, Genuine Student (GS), CoE, OSHC, financial proof, dependants, condition 8101 |
| Living | 20 | `au-cost-of-living-sydney`, `au-accommodation-guide`, `au-working-part-time-fair-work` | Housing, banking, transport, Medicare vs OSHC, Fair Work, ATO tax, supermarkets |
| Post-Study | 20 | `au-485-temporary-graduate-visa-guide`, `au-pathway-to-pr-7-year-journey`, `au-sponsorship-friendly-employers` | 485 PSW, 482/186 employer sponsorship, 189/190/491 GSM, skills assessment, MARA advice |

Per article:

- One `.md` file in `src/data/blog/` using the collection schema in `src/content.config.ts`
- `pubDatetime` staggered across 2025-09-01 → 2026-04-15 so RSS / sitemap look natural
- 1,400 – 2,200 words, heavy on tables and lists
- Contains: Quick Facts → body with `##` sections → FAQ (question headings) → `## Sources`
- ~4 per category flagged `featured: true` (20 featured in total) for the home page

### Authoritative sources only

The `Sources` block should link exclusively to:

- `homeaffairs.gov.au`, `immi.homeaffairs.gov.au`
- `studyaustralia.gov.au`, `cricos.education.gov.au`
- `teqsa.gov.au`, `asqa.gov.au`
- `ato.gov.au`, `fairwork.gov.au`, `servicesaustralia.gov.au`
- `mara.gov.au`, `ahpra.gov.au`, `aitsl.edu.au`
- `engineersaustralia.org.au`, `cpaaustralia.com.au`, `vetassess.com.au`, `acs.org.au`
- each university's `*.edu.au` admissions / international page

Do not link to migration-agent marketing pages, general study-abroad blogs, or content farms.

## 4. Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Astro 5.16 (template: `astro-paper` 5.5.1) |
| Content | Astro Content Collections with a typed schema |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| Search | Pagefind — built into `dist/pagefind/` then copied to `public/pagefind/` so local `astro dev` also has search |
| Images | Sharp; OG social cards generated at build time via Satori + Resvg (~700 ms per post → ~2 min total on 100 posts) |
| RSS / sitemap | `@astrojs/rss` → `/rss.xml`, `@astrojs/sitemap` → `/sitemap-*.xml` |
| Type-check | `@astrojs/check` runs as the first step of `npm run build` |
| Hosting | Cloudflare Pages (project name `studyau-au`) |
| Source control | GitHub `wbn580/studyau-au` (Public) |

### Build script

`package.json`:

```jsonc
"build": "astro check && astro build && pagefind --site dist && node -e \"require('fs').cpSync('dist/pagefind','public/pagefind',{recursive:true})\""
```

The final `node -e …cpSync` is a cross-platform replacement for `cp -r dist/pagefind public/`. It is a no-op in the final Pages output but needed so that running `astro dev` locally after a build still serves the Pagefind UI. Don't drop it.

## 5. Where things live

```
studyau-au/
├── astro.config.ts                   site: "https://studyau.au", sitemap config
├── package.json                      build script above; pnpm-friendly but npm is canonical
├── src/
│   ├── config.ts                     SITE object (title, author, editPost, share links)
│   ├── constants.ts                  SOCIALS + SHARE_LINKS + nav
│   ├── components/
│   │   ├── Header.astro              Brand + nav
│   │   ├── Footer.astro              StudyAU footer (English)
│   │   └── FloatingActions.astro     Only one icon → unilinkau assessment form
│   ├── layouts/
│   │   ├── Layout.astro              injects JSON-LD (BlogPosting, QAPage, WebSite, Organization)
│   │   ├── PostDetails.astro
│   │   └── Main.astro
│   ├── pages/
│   │   ├── index.astro               Home: hero + 5 category tiles + featured + recent
│   │   ├── about.md                  English About page
│   │   ├── disclaimer.md             English disclaimer (not legal / migration / financial advice)
│   │   ├── resources.md              Curated AU government + regulator + university links
│   │   └── privacy.md                English privacy policy
│   ├── utils/                        sorting, tag slugs, reading time
│   ├── content.config.ts             Collection schema (tags array of strings, etc.)
│   └── data/blog/                    100 × .md articles (see §3)
└── public/
    ├── favicon.svg                   Outback-red square with Southern Cross (5 seven-pointed stars)
    ├── robots.txt                    Allows all reputable AI crawlers
    ├── llms.txt                      llmstxt.org-style site index for LLMs
    └── llms-full.txt                 Full content dump for grounding
```

## 6. Voice and style

- Written for someone **outside Australia** choosing between countries, not for people already here. Always spell out currencies ("AUD 710 / week", not just "$710"), always name the visa subclass ("Subclass 500", "Subclass 485"), always date the figures.
- Short sentences. Short paragraphs. Tables for anything comparative.
- No emojis. No exclamation marks. No LLM filler ("dive in", "unleash", "game-changer", "in today's fast-paced world").
- Disclose uncertainty — visa and migration rules change, always link to the official source and invite the reader to confirm current rules themselves.
- Never impersonate a registered migration agent (MARA number required) or give formal legal / financial / migration advice. The `disclaimer.md` says this explicitly.

## 7. Editing rules for future passes

1. **Tags must be strings.** Quote any tag that would otherwise parse as a number. `"Subclass 482"` — not `482`. The content-collection schema rejects numeric tags and `astro check` will fail the build.
2. **New tags** should be added once and reused. Don't coin variants ("Student Visa" vs "student-visa" vs "Subclass 500 visa") — grep the corpus first and match an existing tag.
3. **Slug prefix** for a new article should follow the category convention (see §3 examples) so internal linking stays tidy.
4. **Featured flag** is already balanced at 4 per category (20 total). If you add a new featured article, unfeature an older one in the same category.
5. **Floating CTA URL** is hard-coded in `src/components/FloatingActions.astro`. If that form URL ever changes, update it in exactly that one place.
6. **`editPost.url`** in `src/config.ts` points at `https://github.com/wbn580/studyau-au/edit/main/src/data/blog/`. Keep it in sync if the repo is renamed or moved.
7. **Every new external link** inside a post should prefer an `*.edu.au`, `*.gov.au` or well-known AU regulator domain. Replace non-authoritative links with authoritative equivalents before publishing.
8. **No Chinese or UK-specific leftovers.** The site was scaffolded from a UK-Chinese template; a final grep after any significant edit should confirm no `UKVI`, `UCAS`, `英国`, `StudyUK`, `studyuk` or `£` strings remain outside of the context of explicit comparisons.

## 8. Deployment

See `DEPLOY.md` for the GitHub → Cloudflare Pages pipeline, the Cloudflare zone for `studyau.au`, and how custom domains are wired. This file intentionally only describes **content and code**; `DEPLOY.md` owns the runtime.

## 9. Maintaining this file

This is a plain Markdown file. It only stays useful if it is kept up to date. Update it when:

- A top-level directory is added or removed
- The brand identity changes (name, domain, audience)
- A GEO design decision in §2 is added, removed, or reversed — state the reason
- A new category is added or removed
- The build script, hosting, or repo moves
- A long-running "todo" is completed — promote it into the narrative or delete it

Do **not** update this file for routine article additions, typo fixes, or short experiments.

## 10. Project owner

- Name: Wu
- Email: wubaining@gmail.com
- Working style: efficiency first, automation first. Prefers Claude to drive Chrome and Cloudflare directly rather than hand tasks back.

---

*Last updated: April 2026 — initial StudyAU launch (100 guides).*
