# Photography composition refinement — 9 September 2026

## What changed

- Homepage hero: retained EJ seated beside the service vehicle. Added a thin glass frame, soft green shadow, a restrained ambient glow and a compact attached caption. The headline size is unchanged; the photo has no continuous movement.
- Homepage Meet EJ: replaced the cap/partial-body photo with the supplied portrait of EJ standing beside the vehicle. Simplified the green panel to one photograph, a small quote and the existing slogan. Removed the watermark and decorative line from these photo panels.
- About introduction: retained the smiling portrait and tightened its framing to a centered 4:5 preview with a compact quote beneath it.
- About collage: the working photograph now shares a balanced composition with two substantial stacked detail photos: the E DAVIS plate and cap. At mobile widths all three stack naturally; medium widths use a main image with a paired detail row.
- Services: removed the rodent photograph from the regular card. Inserted a separate full-width image/text feature after the Ant and Fly cards, with the requested headline and shared WhatsApp action. Normal cards retain compact text layouts with consistent spacing and matching height within each row.
- Icons: connected the homepage pest cards and all ten Services cards to the existing unified SVG pest/service illustrations.

## Exact photo placement

| Client original | Current page and placement | Change |
| --- | --- | --- |
| `_MG_4234.JPG` | Homepage hero | Retained; refined frame and caption |
| `E4E9BA0B-3F23-43EB-B6BD-4FFC19A51831.png` | Homepage Meet EJ | Replaces the cap image |
| `Meet ej.png` | About introduction | Retained; tighter portrait frame |
| `IMG_4360.JPG` | About collage, main working photo | Recomposed with paired details |
| `_MG_4247.JPG` | About collage, upper detail | Enlarged from the floating thumbnail |
| `IMG_4410.JPG` | About collage, lower detail | Moved from homepage Meet EJ |
| `Rodent stations .JPG` | Services, separate rodent feature | Moved out of the regular rodent card |
| `Residential.png` | Residential main visual | Retained |
| `Commercial.HEIC` | Commercial main visual, existing WebP conversion | Retained |

The duplicate Residential PNG and alternative working portraits remain preserved in the source-assets folder. No original image was modified. No photo is repeated between these page placements.

## New responsive files

All are in `assets/images/client/`, generated directly from the supplied vehicle portrait without upscaling or retouching:

| Filename | Width | Bytes |
| --- | ---: | ---: |
| `ej-vehicle-portrait-640.webp` | 640 | 50,624 |
| `ej-vehicle-portrait-960.webp` | 960 | 89,138 |
| `ej-vehicle-portrait-1280.webp` | 1280 | 125,648 |
| `ej-vehicle-portrait-1536.webp` | 1536 | 157,578 |

All other optimized images were reused. Images have intrinsic dimensions and responsive sources; below-fold images remain lazy-loaded.

## Verification

- Local Edge/Chromium checked Home, About, Services, Residential and Commercial at 320, 360, 390, 430, 768, 1024, 1280, 1440 and 1920 pixels: 45 passing layout/image checks.
- No document horizontal overflow or broken images detected.
- Desktop and mobile screenshots reviewed against the prior captures for the hero, Meet EJ, About collage and Services feature.
- The 29 existing responsive asset URLs returned HTTP 200. The new portrait also loaded successfully during page checks.
- All ten Services cards use SVG icons; none contains a photo. The rodent feature is a separate grid-wide section.
- The feature link resolves through the shared configuration to `https://wa.me/message/UWW3VICS2VATD1`.
- SEO head contents are unchanged (line endings were normalized in Services). Shared navigation/WhatsApp scripts, ServiceM8 Contact page, sitemap, map page, Residential and Commercial HTML are unchanged against the previous deployment package.
- Ambient glow and hover transitions respect reduced-motion preferences. Mobile layouts have no floating photo positions or overlapping photo captions.

These are local browser viewport checks, not physical-device or live Hostinger tests. The update has not been uploaded.

## Changed public files

- `index.html`
- `about/index.html`
- `services/index.html`
- `assets/css/client-photos.css`
- Four `ej-vehicle-portrait-*.webp` files listed above

Pre-change source copies are in `backup/photo-composition-before/`. The new deployment archive excludes source photos, backup files, reports and testing tools.
