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
const arrow = '<span aria-hidden="true">↗</span>';
const quote = `<a class="film-quote" href="/contact/#request-service">Request a Quote ${arrow}</a>`;
export const sceneImage = (scene, {priority = false, sizes = '100vw', alt = ''} = {}) =>
  `<img src="/assets/images/story/${scene}-1280.webp" srcset="/assets/images/story/${scene}-640.webp 640w, /assets/images/story/${scene}-1280.webp 1280w, /assets/images/story/${scene}-1672.webp 1672w" sizes="${sizes}" width="1672" height="941" alt="${alt}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const clientPhoto = (file, widths, alt, sizes, width, height) =>
  `<img src="/assets/images/client/${file}-${widths[1]}.webp" srcset="${widths.map(w=>`/assets/images/client/${file}-${w}.webp ${w}w`).join(', ')}" sizes="${sizes}" width="${width}" height="${height}" alt="${alt}" loading="lazy" decoding="async">`;

const featuredPests = ['cockroach','rodent','ant'].map(key => sightings.find(pest => pest.key === key));
const mobileQuery = '(max-width: 760px) and (orientation: portrait)';
const openingWide = '/assets/images/story/approach-640.webp 640w, /assets/images/story/approach-1280.webp 1280w, /assets/images/story/approach-1672.webp 1672w';
const openingPortrait = '/assets/images/story/approach-portrait-480.webp 480w, /assets/images/story/approach-portrait-704.webp 704w';
const openingPortraitAvif = openingPortrait.replaceAll('.webp','.avif');
export const openingPreloads = `
    <link rel="preload" as="image" type="image/avif" fetchpriority="high" media="${mobileQuery}" imagesrcset="${openingPortraitAvif}" imagesizes="100vw">
    <link rel="preload" as="image" type="image/webp" fetchpriority="high" media="not all and ${mobileQuery}" imagesrcset="${openingWide}" imagesizes="100vw">`;

const sprite = (pest, count = 1) => Array.from({length:count}, () =>
  `<img class="pest-sprite" src="/assets/images/story/${pest}-sprite.webp" loading="lazy" decoding="async" alt="">`).join('');

const sentence = new Intl.Segmenter('en', {granularity:'sentence'});
const reviewControls = id => `<div class="review-nav" data-review-controls hidden>
  <button type="button" data-review-step="-1" aria-label="Previous review" aria-controls="${id}">←</button>
  <span data-review-position role="status"></span>
  <button type="button" data-review-step="1" aria-label="Next review" aria-controls="${id}">→</button>
</div>`;
const reviewPanels = (data, compact = false) => data.reviews.map((review, index) => {
  const paragraph = review.paragraphs.find(text => !text.startsWith('⭐')) ?? review.paragraphs[0];
  const excerpt = [...sentence.segment(paragraph)].slice(0, 2).map(item => item.segment).join('').trim();
  return `<figure class="review-entry" data-review-panel${compact && index > 0 ? ' hidden' : ''}>
    <div class="review-stars" role="img" aria-label="${review.rating} out of 5 stars">${'★'.repeat(review.rating)}</div>
    <blockquote>“${escape(excerpt)}”</blockquote>${compact ? '' : `
    <details class="review-transcript"><summary>Read full review</summary><blockquote>${review.paragraphs.map(text => `<p>${escape(text)}</p>`).join('')}</blockquote></details>`}
    <figcaption><strong>${escape(review.author)}</strong> <span>· Google review</span></figcaption>
  </figure>`;
}).join('');

export function renderReviews(data) {
  return `<section class="section section--light customer-reviews review-spread" id="customer-reviews" aria-labelledby="reviews-title">
    <div class="interior-width review-spread-grid" data-review-gallery>
      <div class="review-spread-intro">
        <h2 id="reviews-title">What customers <em>say.</em></h2>
        <a class="ink-link" href="${escape(data.sourceUrl)}">Read on Google ${arrow}</a>
        ${reviewControls('review-reader')}
      </div>
      <div class="review-stage" id="review-reader">${reviewPanels(data)}</div>
    </div>
  </section>`;
}

export function renderHome(reviews) {
  return `<main class="property-film" id="main" tabindex="-1">
  <div class="arrival">
    <section class="film-home" id="the-home" data-film-scene aria-labelledby="home-headline">
      <div class="film-view" aria-hidden="true"><picture>
        <source type="image/avif" media="${mobileQuery}" srcset="${openingPortraitAvif}" sizes="100vw">
        <source type="image/webp" media="${mobileQuery}" srcset="${openingPortrait}" sizes="100vw">
        <img src="/assets/images/story/approach-1280.webp" srcset="${openingWide}" sizes="100vw" width="1672" height="941" fetchpriority="high" alt="">
      </picture></div>
      <div class="film-gutter film-home-copy">
        <p class="film-kicker">Auckland pest control</p>
        <h1 id="home-headline">Pest control,<br><em>done right.</em></h1>
        <p>For homes and businesses.</p>
        ${quote}
      </div>
      <a class="film-down" href="#inspect" aria-label="Explore inside the property">↓</a>
    </section>

    <section class="film-inspection" id="inspect" data-film-scene aria-labelledby="inspection-headline" data-pest="cockroach">
      <div class="inspection-media" aria-hidden="true">
        <div class="inspection-view inspection-kitchen">${sceneImage('interior')}${sprite('cockroach')}${sprite('ant',3)}</div>
        <div class="inspection-view inspection-roof" hidden>${sceneImage('roof')}${sprite('rodent')}</div>
      </div>
      <div class="film-gutter film-inspection-copy">
        <h2 id="inspection-headline">Look a <em>little closer.</em></h2>
        <p class="inspection-detail" data-pest-location>Along the kitchen cabinetry</p>
        <div class="pest-tools">
          <div class="pest-choices" role="group" aria-label="Explore a pest" hidden>
            ${featuredPests.map((pest,index) => `<button type="button" aria-pressed="${index === 0}" data-pest-choice="${pest.key}" data-href="/services/${pest.slug}/" data-location="${escape(pest.spot)}">${pest.name}</button>`).join('')}
          </div>
          <a class="film-link" href="/services/" data-pest-link>Explore pest services ${arrow}</a>
        </div>
      </div>
    </section>
  </div>

  <section class="film-solution" id="the-process" data-film-scene aria-labelledby="solution-headline">
    <div class="solution-photo">${clientPhoto('residential-treatment',[640,941],'Davis technician treating the exterior of a home','(max-width: 760px) 100vw, 60vw',941,1672)}</div>
    <div class="film-solution-copy">
      <h2 id="solution-headline">Done right.<br><em>Done safely.</em></h2>
      <ol>
        <li>Inspect and identify</li>
        <li id="treatment">Provide targeted treatment</li>
        <li>Restore peace of mind</li>
      </ol>
      <a class="film-link" href="/services/" id="property-services">Explore our services ${arrow}</a>
    </div>
  </section>

  <section class="film-human" id="meet-ej" data-film-scene aria-labelledby="ej-headline">
    <figure>${clientPhoto('ej-portrait',[640,960,1024],'EJ, founder of Davis Pest Solutions','(max-width: 760px) 100vw, 44vw',960,1440)}</figure>
    <div class="film-human-copy">
      <h2 id="ej-headline">Meet <em>EJ.</em></h2>
      <p>Your Filo Pestie. Auckland local and founder of Davis Pest Solutions.</p>
      <a class="film-link" href="/about/">About Davis ${arrow}</a>
      <div class="film-testimonial" id="customer-voices" data-review-gallery role="region" aria-label="Customer reviews">
        <div class="review-stage" id="home-review-reader">${reviewPanels(reviews, true)}</div>
        <div class="film-review-actions">
          ${reviewControls('home-review-reader')}
          <a class="film-link" href="/about/#customer-reviews">Read customer reviews ${arrow}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="film-end" id="next-step" data-film-scene aria-labelledby="contact-headline">
    <div class="film-view" aria-hidden="true">${sceneImage('approach')}</div>
    <div class="film-gutter film-end-copy">
      <h2 id="contact-headline">Let's take care of <em>your space.</em></h2>
      ${quote}
      <div class="film-contact"><a href="tel:0204732847">02047-DAVIS</a><a href="mailto:ej@davispestsol.co.nz">ej@davispestsol.co.nz</a></div>
    </div>
  </section>
</main>`;
}
