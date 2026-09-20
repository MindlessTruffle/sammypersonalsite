# Pixel artwork and icons

Four AI-generated pixel-art illustrations were created with built-in imagegen in one batch, using a shared grass-field and anime-sky brief. They aim for deliberate pixel clusters and a handmade feeling; they are not claimed to be human-made. Soft blur, reduced saturation, and static translucent shine overlays keep them secondary to content.

Saved site assets (relative to this directory):
- dist/assets/meadow-pixel.webp — profile landscape
- dist/assets/number-pixel.webp — Number Company thumbnail
- dist/assets/icon-pixel.webp — Icon Emulator thumbnail
- dist/assets/larp-pixel.webp — Larpmegle thumbnail

All four remain 1536×1024. Exact final prompts: IMAGE-PROMPTS.md.

Company marks were copied from the actual local project repositories: Number Company favicon, Icon Emulator's prism icon, and Larpmegle's app icon. Number Company's existing typographic logo is rasterized as a PNG asset, not rebuilt with interface text. Roblox icons are the official community icons retained from previous revisions.

GitHub, LinkedIn, and X icons come from Font Awesome Free brand SVG assets; the license is included in dist/assets/icons/LICENSE.txt. Interface search, back, external-link, close, and notes symbols are SVG paths. No icon fonts or Unicode arrow decorations are used.

Layout attribution: James Li, https://jame.li.

The pixel interface uses self-hosted Pixelify Sans (SIL Open Font License in `dist/assets/fonts/PixelifySans-OFL.txt`). Yupp's favicon was retrieved through Google's public favicon service for yupp.ai; Campfire's favicon comes from https://campfire.hackclub.com/favicon.png. These marks identify linked work and event entries.

The Number Company homepage feature is now a noninteractive live iframe of Sammy's existing local storefront. Its offline fallback is the existing `number-company.webp` project render. No generated illustration is presented as a screenshot of the storefront.

The local purchase button reuses the original SVG paths from Number Company's `drawn-button-surface.tsx` and follows its styles. Geist Regular is self-hosted from Google Fonts, with its SIL Open Font License included. Decorative pixel-frame sprites, meadow vignette, and cloud motifs are code-native SVG drawings. GitHub and X marks use black; LinkedIn uses #0a66c2.

Current biome assets: `pixel-forest.svg`, `pixel-embers.svg`, and `pixel-water.svg`, drawn as local code-native SVGs. Frame palettes were adjusted to muted forest, terracotta, and teal. Sticky-note paper, tape, folded corners, and cork texture use CSS. James Li's work and recent sections were visually reviewed at https://jame.li/ for the company/role row and inline-logo sentence treatments.

## Medieval banners variant

Cloth textures, rods, seams, and cut hems are authored CSS. Forest, fire, and water shield crests are original inline SVG paths in scripts/build.mjs. No new generated raster assets or external dependencies were added. Existing project artwork and genuine logos are reused. Local Playfair Display and Nunito Sans supply display/body text.

## Pixel fantasy update

castle-courtyard-pixel.png is an original background generated with the built-in imagegen tool. Its prompt is preserved in PIXEL-ART-PROMPT.md. Pixelify Sans is used for headings, with Nunito Sans body text. Pixel rods, stepped hems, bevels, and subtle embroidery are code-native CSS/SVG. Actual brand logos and the original purchase control remain.

## Cloth, cat, and section details

neo-league-logo.png is the exact user-supplied logo attachment. The embroidered divider is original SVG. The cat is an original integer-pixel canvas sprite; banner-motion.js renders cloth in WebGL and banner-physics.js provides damped spring response and the cat route. No game sprites were copied. Number Company frame is an SVG rainbow sweep over the existing white stage.

castle-courtyard-refined.png is the built-in imagegen refinement of the earlier background. See PIXEL-ART-REFINEMENT.md for its exact prompt.

## Active medieval adventure update

The cloth weave is original static SVG. Cat, fox, rabbit, and bird sprites are original code-native pixel maps with cached animation frames. Sword/tear, book badges, and link symbols are original SVG/CSS interface artwork. No new generated raster assets or dependencies were needed. The WebGL cloth shader has been removed.

## Manuscript notes and split thumbnails

Icon Emulator and Larpmegle captures are exact user-supplied PNG attachments, stored as icon-emulator-capture.png and larpmegle-capture.png. CSS combines them with existing illustrations using a 7-degree feathered seam; Larpmegle artwork is reframed left to preserve its participants. Original image files remain intact. Manuscript parchment is CSS, and scribe-quill.svg is an original code-native ornament.
