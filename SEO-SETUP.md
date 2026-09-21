# Search and AI discovery setup

Implemented September 21, 2026. Site-side changes are prepared locally; publishing is a separate action.

## What is ready

- The visible name no longer has a logo before it. Favicons use a bubbly cream pixel S on red checkers. Sharing artwork blends the Icon Emulator meadow and branching workspace capture.
- All existing homepage and detail-page bodies remain unchanged apart from that requested logo removal. A saved body-hash baseline checks both local and public builds.
- Each of eight public pages has a unique search title, description, HTTPS canonical URL, social metadata, and connected structured data. Person, WebSite, ProfilePage, CreativeWork, and Article entities describe existing content without invented dates, ratings, or claims.
- Opening and closing project dialogs updates and restores metadata alongside the existing navigation.
- robots.txt allows crawlers, including OAI-SearchBot. sitemap.xml lists the eight canonical HTML pages. The 404 page uses noindex.
- llms.txt, llms-full.txt, and linked index.md versions expose existing public project descriptions and notes. These files are discovery aids, not a requirement or promise of AI citations.
- The courtyard background uses lossless WebP: identical decoded pixels, 367,153 fewer bytes. This is an asset improvement, not a measured Core Web Vitals result.
- Google and Bing verification tags are supported but remain absent until real account-issued tokens are supplied. A public IndexNow verification file and guarded submission command are ready.

## Local development and checks

Run npm run build:brand after editing logo artwork. Run npm run build:pages to regenerate both outputs, then npm run check and npm run check:pages. Start localhost:4174 with start-local.cmd or npm run dev.

Content lives in scripts/content.mjs and the existing homepage templates in scripts/build.mjs. SEO/discovery output comes from scripts/seo.mjs. Do not edit generated metadata or Markdown copies by hand. The content-body baseline in scripts/fixtures is a guard for this no-copy-changes request; update it deliberately only after future authorized visible-content edits, never to hide a regression.

No build or test sends indexing requests. No runtime Node.js server is required on GitHub Pages.

## Finish after publishing is explicitly requested

1. Publish the checked docs output through the existing GitHub Pages setup. Confirm https://sammyhawari.com/robots.txt, /sitemap.xml, /llms.txt, /llms-full.txt, and direct project routes respond successfully. Confirm an unknown route returns HTTP 404 with noindex.
2. In Google Search Console, add the URL-prefix property https://sammyhawari.com/. Copy the HTML-tag token into google in scripts/search-verification.json, rebuild, publish, then verify. A domain property can instead be verified later by the DreamHost account owner through DNS.
3. In Bing Webmaster Tools, import the verified Search Console property or copy Bing's HTML-tag token into bing in the same JSON file, rebuild, publish, then verify. Do not put full tags or placeholder tokens in the config.
4. Submit https://sammyhawari.com/sitemap.xml in both consoles. Inspect the homepage and main project URLs. Request indexing once when appropriate; repeated requests do not establish ranking.
5. Preview IndexNow submission with npm run seo:indexnow. After publication, send it with npm run seo:indexnow -- --submit. The command verifies the live ownership file and sitemap first. A 200 or 202 means receipt, not indexing. For later edits, pass only changed routes, such as npm run seo:indexnow -- --submit icon-emulator/.
6. Validate deployed structured data with Google's Rich Results Test and Schema.org Validator. Generic CreativeWork data need not generate a Google rich result. Check mobile Core Web Vitals with PageSpeed Insights and then real Search Console data; no performance score is claimed by local checks.
7. Check Search Console indexing, canonical selection, and branded queries after launch, then at roughly 30/60/90 days. Review Bing AI Performance where available and referral traffic. Expand project writing only if separately approved; homepage copy remains untouched.

## Domain account work still needed

The last live audit found the root domain serving the site, but www.sammyhawari.com still pointing to gbl.insystem.xyz. The DreamHost account owner should change the www CNAME to mindlesstruffle.github.io (without a repository path), preserving the working root records and unrelated email records.

After DNS is correct and GitHub's certificate is ready, enable Enforce HTTPS in the repository's Pages settings. Verify HTTP and www consolidate to HTTPS sammyhawari.com, including project paths. The last audit found HTTP still returning 200 and old GitHub URLs redirecting to HTTP. HTML canonicals help, but cannot replace server redirects.

## Limits and sources

First-page placement and AI Overview citations cannot be guaranteed. This work improves crawlability, identity, metadata, and reuse of existing content; it does not create backlinks or change third-party account settings. No outreach, profile edits, indexing submission, or deployment occurred as part of this local implementation.

- Google AI features: https://developers.google.com/search/docs/appearance/ai-features
- Google ProfilePage: https://developers.google.com/search/docs/appearance/structured-data/profile-page
- Canonical URLs: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- OpenAI crawler guidance: https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
- llms.txt proposal: https://llmstxt.org/
- IndexNow protocol: https://www.indexnow.org/documentation

SEO-GEO-PLAN.md preserves the original research plan. This setup file records the narrower implementation approved afterward: no visible homepage or detail-page rewriting.
