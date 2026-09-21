# Sammy Hawari — medieval portfolio

Standalone repository: sammypersonalsite, main branch. Medieval portfolio.
GitHub Pages: https://mindlesstruffle.github.io/sammypersonalsite/
Custom domain: sammyhawari.com. Preserve docs/CNAME; the public build uses root URLs.

GitHub Pages publishes the ready-built `docs/` folder from `main`. Visitors and hosting
need no Node.js server: these are static HTML, CSS, JavaScript, images, and fonts.
Node.js is only a development tool for regenerating pages and running the local preview.
No npm dependencies need installing. To publish edits, run `npm run build:pages` and
`npm run check:pages`, then commit and push `docs/` with the source changes.
The build preserves `docs/CNAME` and uses root URLs when a custom domain is configured;
without CNAME it uses `/sammypersonalsite/` for the default GitHub Pages URL.

Local preview: http://127.0.0.1:4174/. Double-click start-local.cmd, or run
`npm run build` and `npm run dev`. GitHub Pages hosting is explicitly authorized for
this project; do not switch hosting providers without a new request.

Three static textured cloth columns retain all portfolio content. The former WebGL cloth
shader is removed. Four cached pixel animals replace full-page canvas rendering, pausing
when hidden, covered, or reduced motion is requested.

Internal project/note links open a native dialog through a sword slash and single flash.
Temporary inert page copies split apart and are discarded. The destination article remains
live HTML, framed by large red checkered close buttons. Escape and browser Back close the
portal; modified clicks and direct URLs retain normal navigation. Reduced motion skips effects.
Opening takes two seconds: a tapered 2D katana crescent and afterimage, one impact flash,
then a jagged fissure, followed by page expansion. Both torn edges share the same curved seam.
The article and red menu buttons settle together. Escape remains
available throughout. The article becomes interactive after the reveal completes.

Number Company uses the existing localhost:3000 shirt preview during local development.
GitHub Pages shows the saved shirt image and a link to project details, with no localhost
requests or live purchase claims. Background polling and decorative animations pause while
offscreen/covered. Artwork and genuine company logos remain.

npm run check covers local references, the cat route, and portal navigation eligibility.
Main additions: adventure-ui.css, creature-motion.js, pixel-animals.js, and sword-tear.js.

Social keys and handles are centered. Three quiet pixel scenes idle beneath the larger logos:
birds banking and soaring, binary flowing along commit branches, and a black pen tracing a signature, a wax seal, and a handshake. They pause offscreen, in dialogs, and for reduced motion.

Fine pointers use a rounded 26px cream cursor with a thick dark outline, a rainbow link state,
and smoothly cycling rainbow fill while hovering clickable elements. Reduced motion keeps the fill static; glitch effects are removed. Fresh vines can begin with an immediate flower,
limited to one starter flower every four seconds across all banners.
Pointer movement paints temporary vines into banner backgrounds. Marks remain fixed to the
cloth, draw responsive stems immediately, grow paired leaves and varied flowers later, and fade over 3.4 seconds. No trails appear
outside banners. Text fields keep the insertion cursor, and reduced motion disables effects.

Closing a submenu uses a dark cloth wipe with “thanks for checking me out :)”. It covers
the subpage before restoring the underlying page, holds the message briefly, and slides away.
Buttons, Escape, and Back share this transition. Preserve focus restoration, interruption
handling for Forward navigation, and immediate closing for reduced motion.

Vines have no fixed trail-length or mark-count cap; age-based fading bounds their lifetime.
Paths batch together, leaf/flower geometry is reused, and completed growth stops receiving
per-frame updates. Low opacity keeps the richer offshoots faded without reducing their detail. Fresh strokes
render each display frame; only leaf/flower growth and fading use the slower animation clock.

The purchase orbit reuses sampled geometry until resized. The shirt preview loads when it
becomes visible; status requests cannot overlap. Animals, money, and the arcade frame pause
behind dialogs, including the command menu and closing wipe.

Fast pointer strokes use coalesced samples and cached cloth-boundary clipping so quick
sweeps remain continuous across sections without drawing through banner gaps. Offshoots are
spaced about 52px apart; stems remain immediate and leaf/flower growth stays delayed.
Vines and leaves use 16% opacity; flowers use 22%. Speed-adaptive smoothing softens hand tremors, midpoint curves
round the path, and a short eased tail settles to the pointer when it stops moving.

The courtyard stays static. Twelve leaves drift down from above, while seven tiny black
two-stroke birds cross behind the banners in 23–32 seconds, softened with blur. Phones show fewer sprites. CSS
transforms handle motion without a JavaScript animation loop or scroll listener.
Hidden tabs and dialogs pause the scenery; reduced motion hides it entirely.

Personal identity assets use a friendly gold pixel S with tiny eyes and blush on blue cloth. The name heading has no logo.
`npm run build:brand` regenerates SVG/PNG/ICO favicons, the touch icon, and 512px square export using Node built-ins. Versioned cute-icon URLs refresh browser caches.
The social preview at dist/assets/sammy-icon-emulator-social.png blends the existing Icon Emulator meadow artwork and workspace capture with a feathered diagonal seam. It is a curated 1730x909 image, preserved by builds. Open Graph and Twitter tags reference its new absolute URL and actual dimensions. See scripts/brand-art-notes.md for the generation prompt.

SEO and AI discovery files are generated from existing content. See [SEO-SETUP.md](SEO-SETUP.md) for account verification, crawler files, IndexNow, and domain follow-up. These are local changes until a push is requested.
