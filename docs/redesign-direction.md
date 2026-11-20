# Davis property story

An Auckland homeowner should be able to recognise a problem, meet the person who will assess it and request a quote from any chapter. Commercial customers get a direct route to their existing programme information. The working sitemap, source wording and asset inventory are recorded in redesign-inventory.md.

The main visual is an architectural photograph-style illustration of a home at dusk. A warm interior beyond the glass leads into the inspection. Lusion's use of movement between scenes informs the continuous camera, while Davis's subject supplies the environment, pacing, words and imagery. The design uses the official lockup, forest green, safety orange, pale paper, local Manrope and Inter, with Instrument Serif italic for a quieter second line. Fine rules, rectangular photographs, circular inspection points and a small chapter index repeat throughout. Mobile gets a shorter camera move, visible scene controls and single-column reading order.

| Chapter | Material and interaction |
| --- | --- |
| The home | Original exterior illustration. Subtle depth and scroll movement. Quote, services and window inspection links are immediately accessible. |
| The unseen problem | Navigate seven numbered observations across kitchen and exterior views. Each opens an illustrated pest, the existing signs and a dedicated service link. |
| Understand the problem | Client photograph of EJ preparing equipment beside the real vehicle and the five existing process steps. |
| Targeted management | Client equipment and treatment photography with site-specific preparation wording. |
| Restore comfort | Return to the sunlit kitchen and choose residential or commercial assistance. |
| Meet EJ | Original portrait, supplier background, Filipino identity, qualifications and About link. |
| Trust | Six client-supplied, attributed Google reviews with full wording and manual paging. |
| Next step | Dusk exterior, published coverage links, contact channels and original quote handoff. |

The house and pest plates are original generated illustrations. The client did not supply architectural models, pest scans or room photography. A procedural three-dimensional cutaway on the rodent service page illustrates roof access without suggesting a documented infestation. All business and technician photographs, the area map, credentials and logo come from the existing client collection. Critical information and booking destinations live in static HTML. Motion is optional.

## Delivered imagery and rendering

| Source | Files | Production use |
| --- | --- | --- |
| Original ImageGen exterior | `assets/images/story/exterior-{640,1280,1672}.webp` | Cedar home at dusk, warm windows on the right and pōhutukawa on the left. 38,742–212,722 bytes. Reused for the closing chapter. Separate 480- and 704-pixel portrait crops serve the mobile opening. |
| Original ImageGen interior | `assets/images/story/interior-{640,1280,1672}.webp` | The garden door, fruit bowl, window and cabinetry give the guide visible places to inspect. 50,190–242,368 bytes. |
| Original ImageGen natural-history illustrations | `assets/images/field/{cockroach,rodent,ant,fly,wasp,flea,spider}.webp` | Seven separate 440 × 440 plates, each about 12–21 KB. They depict broad pest categories. |
| Original procedural diagram | `assets/js/house-model.mjs` | Shared orthographic projection renders the initial roof section at build time and updates it from keyboard-operable roof and viewing-angle sliders. |
| Client work and portrait collection | `assets/images/client/` | Only these photographs depict EJ, equipment or service work. The full original galleries and qualification artwork remain on About. |
| Instrument Serif italic | `assets/fonts/InstrumentSerif-italic.woff2`, `InstrumentSerif-OFL.txt` | Locally hosted Latin font with its SIL Open Font License. Manrope and Inter remain locally hosted. |

The exterior is a photographic depth plate with a small WebGL perspective shift on capable fine-pointer devices. A texture shader distinguishes the garden, façade and sky. It loads after interaction, draws on demand, caps pixel density and releases its resources when the page closes or the motion preference changes. Scrolling toward the next chapter enlarges the exterior and dissolves into the kitchen. A static image, scene links and all business copy remain available with scripting disabled.
