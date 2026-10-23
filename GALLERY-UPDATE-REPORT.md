# Davis gallery update — 10 September 2026

All five supplied briefs were identical. Implemented one curated gallery on About, immediately after EJ's main story, replacing the previous three-photo collage. This keeps the homepage at its current length. The gallery uses six distinct client photos and is not duplicated on another page.

## Gallery selection

| Original | Gallery role | Optimized asset prefix |
| --- | --- | --- |
| `IMG_4360.JPG` | Main working/equipment image | `ej-preparing-equipment` |
| `Rodent stations .JPG` | Rodent-control equipment | `rodent-control-stations` |
| `_MG_4247.JPG` | E DAVIS vehicle plate | `davis-vehicle-detail` |
| `YOUR FILO PESTIE.png` | EJ and the vehicle in a residential neighbourhood | `your-filo-pestie` |
| `IMG_4410.JPG` | Embroidered cap / brand detail | `davis-brand-detail` |
| `Residential.png` | Actual residential treatment | `residential-treatment` |

The new YOUR FILO PESTIE image was preserved in the originals folder and converted to 640, 960, 1280 and 1600 pixel WebPs. Existing optimized versions were reused for the other photos. All fourteen supplied originals match their preserved copies by file hash.

## Images retained elsewhere

- Homepage hero: `_MG_4234.JPG`, EJ seated by the vehicle and equipment.
- Homepage Meet EJ: `E4E9BA0B-3F23-43EB-B6BD-4FFC19A51831.png`, EJ beside the vehicle.
- About introduction: `Meet ej.png`, the smiling portrait.
- Residential main visual: `Residential.png`, retained for its direct service context. It also appears once in the gallery.
- Commercial main visual: the existing WebP conversion of `Commercial.HEIC`.

None of the hero or Meet EJ portraits is repeated inside the gallery. Commercial treatment remains on its service page to keep the gallery to six images.

## Intentionally unused alternatives

- `2AE483D1-430F-4969-BDEA-902DCF1E1154.png`: byte-identical duplicate of Residential.png.
- `IMG_4346.JPG`, `Meet ej.JPG`, `_MG_4187.JPG`: alternative working/vehicle shots; omitted to avoid repeating similar settings and poses.

## Services changes

All ten normal service cards remain text-focused, with matching icons, padding, spacing and natural row alignment. There are no photos in the normal cards or the separate Services feature. The rodent photograph moved into the About gallery. Its existing headline, descriptions and WhatsApp action remain in a compact text block after the uninterrupted service grid. No existing service text was removed.

## Gallery behavior

- Desktop: one large main photograph, two stacked supporting photos, then a three-image supporting row.
- Medium screens: main image, paired support row, remaining images.
- Mobile: six readable images stacked naturally with responsive proportions and no floating positions.
- Lightbox: full uncropped optimized image, descriptive caption, accessible close button, keyboard opening, contained keyboard focus, Escape closing, outside-click closing and focus return to the original photo.
- Photo links still open the full optimized image if JavaScript is unavailable.
- Responsive srcsets, lazy loading, intrinsic dimensions and restrained desktop hover zoom; reduced motion is respected.

## Verification

- About and Services checked at 320, 360, 390, 430, 768, 1280, 1440 and 1920 pixels: 16 layout checks passed.
- All six gallery images opened and closed at every width: 48 lightbox checks passed.
- No horizontal document overflow, broken loaded images or browser script errors.
- All 37 optimized client-photo URLs returned HTTP 200 locally.
- The ten service cards contain no photos. Desktop card heights match within each row.
- Reviewed desktop and mobile gallery screenshots and enlarged-image views; adjusted the residential crop to keep the technician and work readable.
- All existing About and Services text verified as preserved. Homepage, shared navigation and WhatsApp scripts, Contact/ServiceM8, Residential, Commercial, map page and sitemap are unchanged against the previous package.

Checks used local Edge/Chromium viewports, not physical phones or a live Hostinger deployment. No live upload was performed.

## Changed public files

- `about/index.html`
- `services/index.html`
- `assets/css/gallery.css` (new)
- `assets/js/gallery.js` (new)
- `assets/images/client/your-filo-pestie-{640,960,1280,1600}.webp` (new)

Pre-gallery HTML copies are in `backup/gallery-before/`. The deployment ZIP excludes originals, backups, reports and local QA tools.
