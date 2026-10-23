# Client photography update — 9 September 2026

## Delivery

Updated the existing Home, About, Residential, Commercial and Services pages. Existing wording, branding, Tuatara artwork, qualification content, service-area map and contact/quote flows were preserved. The About story has a portrait plus a restrained two-image supporting strip; the homepage has two photos. No client photos were AI-generated, retouched or colour-filtered. Full-frame proportions preserve faces, equipment and branding.

Originals: `source-assets/client-2026-09/` (all 13 originals, untouched; not deployed).
Public copies: `assets/images/client/` (29 responsive WebPs, 3,537,342 bytes combined).

## Original inventory and placement

| Original | Original bytes | Placement / reason unused |
| --- | ---: | --- |
| 2AE483D1-430F-4969-BDEA-902DCF1E1154.png | 2713239 | Duplicate residential source |
| Commercial.HEIC | 1580462 | Commercial |
| E4E9BA0B-3F23-43EB-B6BD-4FFC19A51831.png | 3438348 | Alternative pose/composition; retained as an original to avoid repetitive imagery. |
| IMG_4346.JPG | 7110241 | Alternative pose/composition; retained as an original to avoid repetitive imagery. |
| IMG_4360.JPG | 6959012 | About |
| IMG_4410.JPG | 7156582 | Home |
| Meet ej.JPG | 6852705 | Alternative pose/composition; retained as an original to avoid repetitive imagery. |
| Meet ej.png | 3596524 | About |
| Residential.png | 2713239 | Residential |
| Rodent stations .JPG | 9360239 | Services |
| _MG_4187.JPG | 10827815 | Alternative pose/composition; retained as an original to avoid repetitive imagery. |
| _MG_4234.JPG | 9187905 | Home |
| _MG_4247.JPG | 8792017 | About |

The two Residential PNG files have identical SHA-256 hashes. `Commercial.HEIC` was successfully decoded, visually inspected and converted to WebP. It shows a technician treating a commercial interior. Other unused working/vehicle portraits are retained as alternatives to avoid repeating similar poses. No image requires further client direction.

## Every generated version

| Public file | Dimensions | Bytes |
| --- | --- | ---: |
| assets/images/client/commercial-treatment-640.webp | 640 × 853 | 85872 |
| assets/images/client/commercial-treatment-960.webp | 960 × 1280 | 169706 |
| assets/images/client/commercial-treatment-1280.webp | 1280 × 1707 | 267152 |
| assets/images/client/commercial-treatment-1600.webp | 1600 × 2133 | 376222 |
| assets/images/client/ej-preparing-equipment-640.webp | 640 × 427 | 46586 |
| assets/images/client/ej-preparing-equipment-960.webp | 960 × 640 | 80538 |
| assets/images/client/ej-preparing-equipment-1280.webp | 1280 × 853 | 116390 |
| assets/images/client/ej-preparing-equipment-1600.webp | 1600 × 1067 | 155068 |
| assets/images/client/davis-brand-detail-640.webp | 640 × 427 | 37266 |
| assets/images/client/davis-brand-detail-960.webp | 960 × 640 | 62460 |
| assets/images/client/davis-brand-detail-1280.webp | 1280 × 853 | 89554 |
| assets/images/client/davis-brand-detail-1600.webp | 1600 × 1067 | 121850 |
| assets/images/client/ej-portrait-640.webp | 640 × 960 | 78570 |
| assets/images/client/ej-portrait-960.webp | 960 × 1440 | 137294 |
| assets/images/client/ej-portrait-1024.webp | 1024 × 1536 | 149770 |
| assets/images/client/residential-treatment-640.webp | 640 × 1137 | 154736 |
| assets/images/client/residential-treatment-941.webp | 941 × 1672 | 289020 |
| assets/images/client/rodent-control-stations-640.webp | 640 × 427 | 32876 |
| assets/images/client/rodent-control-stations-960.webp | 960 × 640 | 63910 |
| assets/images/client/rodent-control-stations-1280.webp | 1280 × 853 | 104816 |
| assets/images/client/rodent-control-stations-1600.webp | 1600 × 1067 | 157444 |
| assets/images/client/ej-service-vehicle-640.webp | 640 × 427 | 58384 |
| assets/images/client/ej-service-vehicle-960.webp | 960 × 640 | 103312 |
| assets/images/client/ej-service-vehicle-1280.webp | 1280 × 853 | 159012 |
| assets/images/client/ej-service-vehicle-1600.webp | 1600 × 1067 | 218462 |
| assets/images/client/davis-vehicle-detail-640.webp | 640 × 427 | 22490 |
| assets/images/client/davis-vehicle-detail-960.webp | 960 × 640 | 40384 |
| assets/images/client/davis-vehicle-detail-1280.webp | 1280 × 853 | 63800 |
| assets/images/client/davis-vehicle-detail-1600.webp | 1600 × 1067 | 94398 |

Images are EXIF-orientation corrected and resized without upscaling; WebP quality 84. The originals are not modified. Responsive sets stop at original width for smaller source photos.

## Page photo budgets

These are the added photo bytes, not whole-page transfer measurements. Browsers select one version of each image; they do not download every srcset candidate.

| Page | All photos at smallest size | All photos at largest size |
| --- | ---: | ---: |
| Home | 95650 bytes | 340312 bytes |
| About | 147646 bytes | 399236 bytes |
| Residential | 154736 bytes | 289020 bytes |
| Commercial | 85872 bytes | 376222 bytes |
| Services | 32876 bytes | 157444 bytes |

## QA

- Local Edge/Chromium: all five updated pages at 320, 360, 390, 430, 768, 1024, 1280, 1440 and 1920 px (45 checks).
- Zero document horizontal-overflow failures and zero broken images.
- All 29 generated image URLs returned HTTP 200 on the local server.
- Desktop and mobile screenshots inspected; treatment photos use uncropped natural proportions, portrait is centered, and images remain within their containers.
- Explicit intrinsic dimensions, responsive srcsets, root-relative paths and async decoding are present. Primary hero images are not lazy-loaded; below-fold photos are.
- Exact original HTML text content checked against the pre-change version for all five pages: unchanged.
- Local automated browser checks do not verify physical phones, real mobile network speed or live Hostinger deployment. External fonts and embedded services are not included in the photo budgets. No live upload was performed.

## Changed public source files

- index.html
- about/index.html
- residential-pest-control/index.html
- commercial-pest-control/index.html
- services/index.html
- assets/css/client-photos.css (new, scoped photo styles)
- assets/images/client/ (29 new images listed above)

HTML tag boundaries were mechanically formatted in the five pages to permit precise patches. No shared scripts or unrelated pages were edited. The deployment ZIP excludes originals, local conversion tools, QA screenshots and reports.

