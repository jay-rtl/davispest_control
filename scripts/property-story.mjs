const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export const sightings = [
  {key:'cockroach', slug:'cockroach-control', summary:'Targeted assessment and treatment planning for active cockroach problems.', name:'Cockroaches', spot:'Kitchen cabinetry', scene:'interior'},
  {key:'rodent', slug:'rodent-control', summary:'Practical rat and mouse control with prevention advice for homes and businesses.', name:'Rodents', spot:'Roof space', scene:'exterior'},
  {key:'ant', slug:'ant-control', summary:'Identify activity, likely pathways and an approach suited to the property.', name:'Ants', spot:'Food on the bench', scene:'interior'},
  {key:'fly', slug:'fly-control', summary:'Reduce fly pressure with treatment and practical sanitation guidance.', name:'Flies', spot:'Kitchen window', scene:'interior'},
  {key:'wasp', slug:'wasp-control', summary:'Careful assessment of wasp activity and the surrounding environment.', name:'Wasps', spot:'Sheltered eaves', scene:'exterior'},
  {key:'flea', slug:'flea-treatment', summary:'A coordinated treatment and preparation approach for persistent flea activity.', name:'Fleas', spot:'Floor coverings', scene:'interior'},
  {key:'spider', slug:'spider-control', summary:'Management options tailored to the species, site and level of activity.', name:'Spiders', spot:'Exterior corners', scene:'exterior'}
];
export const number = value => String(value).padStart(2, '0');
const chapterNames = ['The home','The unseen problem','Understand the problem','Targeted management','Restore comfort','Meet EJ','Customer reviews','Request a quote'];
const chapterIds = ['the-home','inspect','the-process','treatment','property-services','meet-ej','customer-voices','next-step'];
const chapter = index => `<span class="chapter-label"><span>${number(index+1)} / 08</span> ${chapterNames[index]}</span>`;
const arrow = '<span aria-hidden="true">↗</span>';
const quote = `<a class="story-button" href="/contact/#request-service">Request a Quote ${arrow}</a>`;
export const sceneImage = (scene, {priority = false, sizes = '100vw', alt = ''} = {}) =>
  `<img src="/assets/images/story/${scene}-1280.webp" srcset="/assets/images/story/${scene}-640.webp 640w, /assets/images/story/${scene}-1280.webp 1280w, /assets/images/story/${scene}-1672.webp 1672w" sizes="${sizes}" width="1672" height="941" alt="${alt}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const clientPhoto = (file, widths, alt, sizes, width, height) =>
  `<img src="/assets/images/client/${file}-${widths[1]}.webp" srcset="${widths.map(w=>`/assets/images/client/${file}-${w}.webp ${w}w`).join(', ')}" sizes="${sizes}" width="${width}" height="${height}" alt="${alt}" loading="lazy" decoding="async">`;
const stepText = [
  ["Tell us what's happening","Share the signs and where you have seen them."],
  ['Assess the problem','Understand the pest, property and conditions.'],
  ['Agree on an approach','Get a plan suited to the findings.'],
  ['Carry out treatment','Complete the work agreed for your site.'],
  ['Plan what comes next','Receive relevant aftercare and prevention advice.']
];
const fieldGuide = catalog => `<section id="inspect" class="story-section guide-section"><div class="story-width">
  ${chapter(1)}<div class="story-heading"><h2>Look a little <em>closer.</em></h2><p>Choose a pest to see where activity may appear around a property.</p></div>
  <div class="guide-layout"><div class="guide-stage">
    ${['interior','exterior'].map(scene=>`<div class="guide-view" data-view="${scene}" ${scene==='exterior'?'hidden':''}>
      ${sceneImage(scene,{sizes:'(max-width: 800px) 100vw, 65vw',alt:scene==='interior'?'Illustrated kitchen with a pantry, bench and garden door':'Illustrated home exterior showing the roof and sheltered eaves'})}
      ${sightings.map((s,i)=>s.scene===scene?`<a class="guide-pin pin-${s.key}" href="#observation-${s.key}" data-pick="${s.key}" aria-label="Inspect ${escape(s.spot)} for ${s.name.toLowerCase()}">${number(i+1)}</a>`:'').join('')}
    </div>`).join('')}
    <div class="scene-caption"><span>Property inspection</span><span data-view-name>Kitchen interior</span></div>
  </div><div class="guide-readout">
    <nav class="species-switch" aria-label="Choose a pest">${sightings.map(s=>`<a href="#observation-${s.key}" data-pick="${s.key}">${s.name}</a>`).join('')}</nav>
    <span class="sr-only" data-guide-status aria-live="polite"></span><div class="observations">${sightings.map((s,i)=>`<article id="observation-${s.key}" class="observation"><div class="specimen-row"><div><span class="mono">Observation ${number(i+1)}</span><h3>${s.name}</h3></div><img src="/assets/images/field/${s.key}.webp" alt="" width="440" height="440" loading="lazy"></div><strong>${s.spot}</strong><p>${escape(catalog.get(s.slug).signs)}</p><p>${s.summary}</p><a class="ink-link" href="/services/${s.slug}/">${escape(catalog.get(s.slug).name)} ${arrow}</a></article>`).join('')}</div>
  </div></div><div class="guide-foot"><a class="ink-link" href="/services/">Explore all pest services ${arrow}</a><a class="ink-link" href="/contact/#request-service">General pest control enquiries ${arrow}</a></div>
</div></section>`;
function reviewSpread(data) {
  return `<section class="story-section voices" id="customer-voices"><div class="story-width">${chapter(6)}
    <div class="story-heading"><h2>In their <em>words.</em></h2><a class="ink-link" href="${escape(data.sourceUrl)}" target="_blank" rel="noopener noreferrer">Read all reviews on Google ${arrow}</a></div>
    <div class="review-spread">${data.reviews.map((r,i)=>`<article class="review-sheet"><div class="review-byline"><strong>${escape(r.author)}</strong><span>Google review</span><span class="stars" aria-label="${r.rating} out of 5 stars">${'★'.repeat(r.rating)}</span></div><div><blockquote>${escape(r.paragraphs[0])}</blockquote>${r.paragraphs.length>1?`<details><summary>Read full review</summary>${r.paragraphs.slice(1).map(p=>`<p>${escape(p)}</p>`).join('')}</details>`:''}</div></article>`).join('')}</div>
    <div class="review-controls" hidden><button type="button" data-review-step="-1" aria-label="Previous review">←</button><output aria-live="polite">Review 1 of 6</output><button type="button" data-review-step="1" aria-label="Next review">→</button></div></div></section>`;
}
export function renderHome(services, locations, reviews) {
  return `<main id="main" class="property-story">
  <section class="property-opening" id="the-home" aria-labelledby="home-headline">
    <div class="opening-view"><div class="camera-plane"><picture><source media="(max-width:760px) and (orientation:portrait)" srcset="/assets/images/story/exterior-portrait-480.webp 480w, /assets/images/story/exterior-portrait-704.webp 704w" sizes="100vw">${sceneImage('exterior',{priority:true,alt:'Illustrated Auckland-style cedar home at dusk, with a warmly lit kitchen beyond the glass'})}</picture></div></div>
    <div class="opening-content story-width"><p class="scene-locator"><i aria-hidden="true"></i>Auckland, New Zealand</p>
    <h1 id="home-headline">Pest control,<br><em>done right.</em></h1>
    <p class="opening-lead">Thoughtful pest management for Auckland homes and businesses.</p>
    <div class="opening-actions">${quote}<a class="light-link" href="/services/">Our services <span aria-hidden="true">↗</span></a></div></div>
    <a class="window-target" href="#inspect" aria-label="Explore pest activity around the property"><span class="target-ring" aria-hidden="true">+</span><span>Explore the property</span></a>
    <div class="opening-rail story-width"><details class="chapter-menu"><summary><span class="chapter-counter">01 <small>/ 08</small></span> The home <b aria-hidden="true">⌃</b></summary><nav aria-label="Story chapters">${chapterNames.map((name,i)=>`<a href="#${chapterIds[i]}"><span>${number(i+1)}</span>${name}</a>`).join('')}</nav></details><a href="#inspect" class="scroll-cue">Scroll to explore <span aria-hidden="true">↓</span></a></div>
  </section>
  ${fieldGuide(new Map(services.map(service=>[service.slug,service])))}
  <section class="story-section process-scene" id="the-process"><div class="story-width process-grid"><figure class="tall-shot">${clientPhoto('ej-preparing-equipment',[640,960,1280,1600],'EJ preparing equipment at the Davis service vehicle','(max-width: 760px) 100vw, 47vw',960,640)}<figcaption>EJ preparing for the job</figcaption></figure><div>${chapter(2)}<h2>From first signs<br>to a <em>clear plan.</em></h2><ol class="process-steps">${stepText.map(([title,copy])=>`<li><strong>${title}</strong><p>${copy}</p></li>`).join('')}</ol></div></div></section>
  <section class="story-section plan-scene" id="treatment"><div class="story-width plan-grid"><div>${chapter(3)}<h2>Done Right.<br><em>Done Safely.</em></h2><p>Treatment methods and products are selected and applied with safety, effectiveness and the environment being treated in mind.</p><a class="light-link" href="/faqs/">Preparation and aftercare ${arrow}</a></div><figure>${clientPhoto('rodent-control-stations',[640,960,1280,1600],'Davis rodent monitoring stations before placement','(max-width: 760px) 100vw, 51vw',960,640)}<figcaption>Davis rodent monitoring stations</figcaption></figure></div></section>
  <section class="comfort-scene" id="property-services"><div class="comfort-image">${sceneImage('interior')}</div><div class="story-width comfort-copy">${chapter(4)}<h2>Care for <em>your space.</em></h2><p>Support for homes, rentals, workplaces and organisations.</p><div class="property-links"><a href="/residential-pest-control/">Residential ${arrow}</a><a href="/commercial-pest-control/">Commercial ${arrow}</a></div></div></section>
  <section class="story-section portrait-scene" id="meet-ej"><div class="story-width portrait-grid"><div>${chapter(5)}<h2>Your Filo <em>Pestie.</em></h2><p>Davis Pest Solutions was founded by EJ, an Auckland-based licensed pest technician with years of industry experience.</p><p>Before working in the field, EJ spent years on the supplier side of pest control, learning professional products, equipment and application methods. That background helps him understand not only what a solution does, but when, where and how it should be used responsibly.</p><a class="ink-link" href="/about/">Meet EJ &amp; Davis ${arrow}</a></div><figure>${clientPhoto('ej-portrait',[640,960,1024],'EJ, the person behind Davis Pest Solutions','(max-width: 760px) 90vw, 42vw',960,1440)}<figcaption>EJ · Davis Pest Solutions</figcaption></figure></div></section>
  ${reviewSpread(reviews)}
  <section class="return-scene" id="next-step"><div class="return-image">${sceneImage('exterior')}</div><div class="story-width return-copy">${chapter(7)}<h2>Tell us what<br><em>you’ve noticed.</em></h2><p>Tell EJ what you are seeing. He will help you find a practical next step.</p><div class="opening-actions">${quote}<a class="light-link" href="tel:0204732847">Call 02047-DAVIS</a><a class="light-link" data-whatsapp-link href="https://wa.me/message/UWW3VICS2VATD1">WhatsApp EJ ${arrow}</a></div></div></section>
  <nav class="coverage-strip story-width" aria-label="Auckland service areas"><a href="/service-areas/"><strong>Areas we serve</strong> ${arrow}</a>${locations.map(l=>`<a href="/pest-control/${l.slug}/">${escape(l.name)}</a>`).join('')}</nav>
  </main>`;
}
