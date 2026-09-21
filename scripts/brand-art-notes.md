# Share artwork provenance

Created September 21, 2026 with the built-in imagegen tool (compositing mode). Final asset: `dist/assets/sammy-icon-emulator-social.png`, copied to `docs/assets/` by the Pages build. Favicon graphics are deterministic native pixel rectangles in `build-brand.mjs`, not generated raster artwork.

Inputs: `dist/assets/icon-pixel.webp` (left meadow artwork) and `dist/assets/icon-emulator-capture.png` (right workspace capture).

Final prompt:

Use case: compositing. Create a 1200x630 wide social sharing banner using ONLY the two input images. Image 1 is the pixel-art green meadow, lake, blue sky and tree with art desk; use it on the LEFT roughly 55% of the banner, keeping the desk/star/gem and leafy tree visible. Image 2 is the actual Icon Emulator white checkerboard branching UI screenshot; place it on the RIGHT roughly 50%, keeping its parent dice card and child dice/clover cards within frame. Composite the actual supplied images faithfully, do not invent different UI, don't redraw icons, preserve the original image style and screenshot content. Between them use a slightly diagonal approximately 7-degree-from-vertical cut with a narrow, softly feathered overlap, seamless but not a wide foggy blur. Full bleed, no frames, no border, no logo, no extra text, no title or name. This is the share image of a joyful pixel-art medieval portfolio. Both original images should remain clearly recognizable.

The tool returned 1730x909; retained that native resolution and declared its actual dimensions in sharing metadata. The original on-page project images and composition CSS are unchanged.
