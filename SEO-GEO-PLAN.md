# SEO and GEO plan — sammyhawari.com

Drafted September 21, 2026. Original research plan. Site-side implementation is now documented in SEO-SETUP.md; later instructions narrowed scope to preserve all visible page content. No deployment performed.

**Objective and constraints**

Make sammyhawari.com the authoritative destination for Sammy Hawari and mindlesstruffle, then earn discovery for his projects and specific engineering work. Preserve the medieval homepage, its copy, three banners, artwork, cursor, animals, and navigation. Put substantial new editorial content on existing detail pages and project notes. No framework migration or hosting change is needed.

First-page rankings are goals for named queries, not an outcome any implementation can guarantee. AI answers may omit citations or not appear at all. Initial targets are Sammy Hawari, Sammy Hawari Waterloo, mindlesstruffle, Icon Emulator Sammy Hawari, Larpmegle creator, and The Number Company Sammy Hawari. Treat broad terms such as software developer, AI icon generator, and Roblox developer as competitive expansion opportunities, not launch promises. Validate demand and competition with actual Search Console data before expanding.

**Observed baseline**

Read-only checks against the live domain and current repository found:

| Finding | Implication |
|---|---|
| HTTPS homepage returns 200 and actual portfolio HTML | Domain and static HTML delivery work |
| HTTP homepage also returns 200 | HTTPS is not enforced; consolidate versions |
| Old GitHub homepage and Icon Emulator URL return 301 to matching HTTP domain paths | Migration preserves tested paths, but redirect target should resolve to HTTPS |
| www CNAME still points to gbl.insystem.xyz; HTTPS www failed resolution | DreamHost account owner must correct www |
| robots.txt and sitemap.xml return 404 | Add discovery/configuration files; missing robots.txt does not itself block crawling |
| Generated pages have titles/descriptions but no canonical or JSON-LD | Add explicit URL and identity metadata |
| Full project HTML is available at real URLs; Icon Emulator returns 200 directly | Preserve this strong foundation; sword portal is progressive enhancement |
| Social metadata includes title/description but lacks a full image/URL card | Improve sharing appearance; not a direct ranking promise |
| Active refined background PNG is approximately 1.66 MB on disk | Candidate for visually equivalent compression, subject to measurement |

No Search Console account, real-user Core Web Vitals data, or reliable Google ranking baseline was available. Public search samples are not proof of index coverage or ranking. Lighthouse scores have not been measured in this audit.

**Priority 0 — finish domain consolidation**

1. DreamHost owner changes only www CNAME to mindlesstruffle.github.io. Root A records already point to GitHub Pages.
2. In GitHub Pages, verify the certificate and enable Enforce HTTPS when available. Retest HTTP, HTTPS, www, old GitHub URLs, and several deep links. Every alternate should end at the corresponding HTTPS canonical page, without loops or dropping the path.
3. Keep docs/CNAME as sammyhawari.com. Confirm main/docs remains the publishing source. Check a nonexistent URL still returns a genuine 404.
4. Do not restore client-side redirects. Use hosting redirects and a consistent canonical strategy.

Acceptance: primary pages return 200 over HTTPS; alternate domains/protocols permanently redirect correctly; assets have no mixed-content requests. DNS needs the account owner on the other device. These actions do not alter homepage copy.

**Priority 1 — technical SEO with no visible redesign**

Add one page manifest to the build containing slug, preferred URL, title, description, content type, sharing image, and meaningful publication/modification dates. Generate metadata and discovery files from that same source to avoid drift.

- Absolute, self-referencing HTTPS canonicals for each indexable page. Never canonicalize every project to the homepage. Normalize /index.html aliases and tracking parameters to the page's clean URL. Use redirects, canonicals, and sitemap consistently. [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- Generate sitemap.xml containing canonical indexable pages only; exclude 404, utility files, and duplicate aliases. lastmod changes only when content meaningfully changes, not whenever animation code is deployed.
- Add robots.txt with sitemap location and crawl access to public HTML, CSS, JavaScript, and images. Keep important content eligible for snippets. No blanket bot blocks.
- Improve unique titles/descriptions. Proposed homepage title: Sammy Hawari | Software Developer in Waterloo. Proposed project title: Icon Emulator — Game Art Workflow | Sammy Hawari. Descriptions should describe actual capabilities, without unsupported superlatives. These change search/browser metadata, not banner copy.
- Complete og:url, og:type, og:image, image dimensions/alt text, and Twitter card metadata. Produce a lightweight sharing image using existing artwork and identity; keep all resource URLs absolute. Sharing cards improve presentation, not guaranteed positions.
- Review document headings and link labels without changing their appearance. Keep one clear primary heading per document. Existing full-name header already provides text; do not insert invisible keyword paragraphs.
- Keep real anchor hrefs, direct HTML routes, and content accessible with JavaScript disabled. Maintain consistent metadata when the sword portal changes the current URL, and restore it on close; direct document metadata remains the authoritative baseline.
- Maintain genuine 404 behavior and add noindex to the error document. Do not block it in robots.txt just to control indexing.

Acceptance: inspect generated HTML for unique metadata, valid sitemap, no accidental noindex, no localhost links in public output, and correct direct/deep-link behavior. Validate actual URLs through Search Console after deployment.

**Priority 2 — establish a consistent identity**

Create a small JSON-LD graph referencing https://sammyhawari.com/#person: name Sammy Hawari, alternateName mindlesstruffle, canonical URL, verified public social profiles, and only roles/affiliations supported by visible content. Use Person and WebSite; use ProfilePage for a page whose primary purpose is profiling Sammy. Google explicitly supports single-person profile pages; this does not guarantee a knowledge panel or rich result. [ProfilePage documentation](https://developers.google.com/search/docs/appearance/structured-data/profile-page)

Project case studies can use CreativeWork with creator pointing to the same Person. Use SoftwareApplication only where the page and real application match that type; never invent ratings, downloads, prices, or an offer to satisfy rich-result requirements. Notes can use Article with actual author and dates. BreadcrumbList is appropriate where a real visible breadcrumb exists.

Keep profile images genuine if adding Person.image; do not use generated scenery as a portrait. City-level location is sufficient. Keep structured data aligned with public text; do not promote private biographical details.

Optional second-stage /about/ or HTML /resume/ page can collect an accurate short biography, roles, award references, and dated experience in one readable place. Add one unobtrusive navigation/footer link if created. This is optional: the first technical release needs no new homepage section or copy.

**Priority 3 — improve existing detail pages for search and AI answers**

Each case study should answer, in ordinary visible HTML: what the project is, who built it, whom it helps, how it works, what Sammy specifically contributed, its current availability, and what evidence supports the results. A concise opening answer, a compact facts table, descriptive headings, original screenshots, and a few genuinely useful questions are appropriate. No arbitrary word count or padded FAQ wall.

| Existing page | Expansion using real project evidence |
|---|---|
| /icon-emulator/ | Show the prompt → branching → refinement → export workflow; describe feedback/training trees precisely without implying model-weight training unless true; explain audience and availability; document reported 7.9K images, 1.1K trees, 540+ export requests with dates and definitions |
| /larpmegle/ | Explain two debaters plus judge, 100-second rounds, matching, WebRTC, and Sammy's role; date and define 13K games; verify the scope of any #1 search claim before repeating it |
| /number-company/ | Explain the increasing shirt-number concept, assignment mechanism, and actual status; link the real storefront only once it is publicly usable; distinguish portfolio prototype from a live purchasing service |
| Existing project notes | Turn short notes into original accounts of concrete problems, decisions, tradeoffs, screenshots/diagrams, and outcomes |

Candidate future notes, only if supported by actual implementation: synchronizing turns in a three-person WebRTC game; managing branching feedback in an image-generation tool; assigning unique sequential shirt numbers safely. These create more specific search opportunities than generic developer advice.

Attribute each substantial article to Sammy, link back to his profile and related project, and show actual dates. Put each key answer near the relevant heading so it can be understood without surrounding marketing text. Distinguish public evidence, dated self-reported metrics, and prototypes. Do not treat fictional/generated thumbnail artwork as product evidence.

This is an editorial strategy based on the site's projects, not a claim that a particular paragraph format guarantees citations. Bing's guidance favors clear organization and supported claims. [Bing guidance and AI Performance](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)

**GEO crawler and inclusion policy**

Google says ordinary SEO practices apply to AI Overviews/AI Mode. Pages need indexing and snippet eligibility; no special AI schema or new AI text file is required. Keep content discoverable, textual, and consistent with its metadata. Do not make llms.txt a prerequisite or sell it as a ranking technique. It could be an optional low-priority experiment later, measured separately. [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features)

Allow OAI-SearchBot access for ChatGPT search discovery. GPTBot concerns potential training and is a separate policy choice; enabling training is not necessary to pursue search visibility. Avoid accidentally restricting summaries with snippet controls. Check actual access rather than assuming a robots line proves crawler delivery. [OpenAI publisher guidance](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)

Optimize for retrieval in current search/AI products, not a promise to update every model's internal knowledge. Exclude hidden AI instructions, keyword stuffing, cloned city pages, fake citations, paid link schemes, and bulk low-value articles.

**Priority 4 — corroboration outside the site**

After site fundamentals, align the canonical website link and factual identity across GitHub, LinkedIn, X, relevant project repositories, and legitimate studio/project profiles. Add project credits and portfolio links to repositories and project sites Sammy controls. Prioritize accurate organizer/winner attribution from Neo Dev League and existing competition pages when organizers agree. A genuine contextual mention from a collaborator can help connect identities; the outgoing James Li attribution alone is not an inbound endorsement.

No messages, account edits, or outreach are authorized by this planning request. Draft requests for future review rather than posting them. Do not invent connections or turn the portfolio into a fake local business listing.

**Priority 5 — performance without sacrificing the art direction**

Measure mobile and desktop first. Compare before/after screenshots and behavior, including cursor, vines, portal, and reduced-motion state. Compress the active blurred background and large screenshot assets with visually equivalent formats, add responsive variants where useful, remove genuinely unused font weights/styles, and preserve font-display: swap. Retain image dimensions to prevent layout shifts. Avoid preloading every decorative asset.

Keep existing offscreen/hidden/dialog pauses and audit long tasks before removing any effects. Target field p75 LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. New/low-traffic domains may lack field data; use laboratory checks diagnostically until enough field data exists. Scores alone do not secure rankings. [Core Web Vitals guidance](https://developers.google.com/search/docs/appearance/core-web-vitals)

**Measurement and rollout**

| Stage | Work | Evidence of completion |
|---|---|---|
| First implementation pass | Domain consolidation, manifest, canonical/schema/metadata, sitemap/robots, validation | No visual homepage change; correct live URLs; all automated checks pass |
| Same launch window | Google Search Console and Bing Webmaster Tools setup; sitemap submission; request selected URLs | Ownership verified; URL Inspection and index coverage baseline recorded |
| Following content pass | Three project case studies and strongest original note | Clear attribution, dated claims, primary evidence, working contextual links |
| Following weeks | Public profile consistency and legitimate third-party credits | Correct links and identity references, when account owners approve |
| 30/60/90-day reviews | Review query/page data; expand topics showing relevant demand | Logged changes and comparable search/citation/referral trends |

Timing above defines work/review cadence, not a deadline for ranking. Use Google URL-prefix verification via HTML file/meta if DreamHost DNS access is unavailable; domain-property verification can follow with the owner. Request access through the normal account flow, not by sharing passwords.

Track branded and non-branded queries separately by country/device: impressions, clicks, CTR, average position, indexed canonical pages, and project/resume engagement. Search Console's Web reporting includes AI-feature traffic but does not provide a clean standalone AI Overview attribution report. Bing AI Performance can report citation activity on supported surfaces; those counts are not rankings. Supplement with a small, repeatable set of AI prompts and referral measurements, recording date/product/query and whether an actual citation appeared. Manual prompts are a sample, not a universal GEO score.

Optional IndexNow submission after meaningful URL changes can aid discovery by participating engines; it is not Google's general indexing API or a ranking boost. No need to add a persistent server for it.

**Implementation map and release guardrails**

- scripts/build.mjs: shared page metadata, Person/project/article graph, accessible content templates.
- scripts/build-pages.mjs: absolute public origin, sitemap.xml, robots.txt, canonical URLs, verified public asset paths.
- dist/assets/sword-tear.js: metadata consistency during in-page navigation, without changing the transition.
- New SEO check script: parse all generated pages, validate canonicals/JSON-LD/sitemap relationships, ensure no accidental crawl blocks or localhost/public URL mixing.
- docs/: rebuild static public output and preserve CNAME. Keep localhost:4174 usable.
- Search Console/Bing/GitHub settings: use verified accounts; DreamHost www edit remains external.

Acceptance requires valid structured data, real status/redirect checks, no broken links, no visual homepage regression, and no fabricated claims. No site changes or push were performed while drafting this plan.
