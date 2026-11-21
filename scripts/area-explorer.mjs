const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const fullMap = '/assets/images/auckland-service-area-map-client-2026-08.jpg';

export function renderAreaExplorer(locations) {
  if (locations.some(item => !item.directoryContext)) throw Error('Published suburbs need directory context');
  const pins = locations.map(item => `<button type="button" class="coverage-pin pin-${item.slug}" data-area-select="${item.slug}" aria-label="${escape(item.name)} on the map" aria-pressed="false"><span aria-hidden="true"></span></button>`).join('');
  const choices = locations.map(item => `<button type="button" data-area-select="${item.slug}" aria-pressed="false">${escape(item.region)}</button>`).join('');
  const panels = locations.map(item => `<div class="coverage-place" data-area-place="${item.slug}">
    <a class="location-card" href="/pest-control/${item.slug}/"><span class="location-card-region" data-nearby="${escape(item.nearby.join(', '))}">${escape(item.region)}</span><h3 class="location-card-name">${escape(item.name)} <span aria-hidden="true">↗</span></h3><span class="location-card-context">${escape(item.directoryContext)}</span></a>
    <p class="coverage-nearby"><strong>Nearby suburbs</strong> ${escape(item.nearby.join(', '))}</p>
  </div>`).join('');
  return `<section class="coverage-explorer" id="suburb-directory" data-area-explorer aria-labelledby="coverage-title">
    <div class="interior-width coverage-layout">
      <div class="coverage-heading" data-reveal>
        <h2 id="coverage-title">Pest Control <em>Across Auckland.</em></h2>
        <p>The shaded map shows Davis Pest Solutions' Auckland service area. If your suburb is near the boundary, send us your address and we can confirm availability.</p>
      </div>
      <figure class="coverage-map" id="coverage-map">
        <div class="coverage-canvas">
          <img src="/assets/images/auckland-coverage-640.webp" srcset="/assets/images/auckland-coverage-640.webp 640w, /assets/images/auckland-coverage-1200.webp 1200w" sizes="(max-width: 850px) 90vw, 50vw" width="1200" height="1137" alt="Map showing the Davis Pest Solutions coverage area, shaded green, across Auckland" loading="lazy" decoding="async">
          <div class="coverage-pins" data-area-controls hidden>${pins}</div>
        </div>
        <figcaption><a data-map-preview hidden></a><a href="${fullMap}" target="_blank" rel="noopener noreferrer">Open the full-size map <span aria-hidden="true">↗</span></a></figcaption>
      </figure>
      <div class="coverage-directory">
        <div class="area-finder" data-area-controls hidden>
          <label for="area-search">Find your suburb or region</label>
          <input type="search" id="area-search" placeholder="e.g. Papatoetoe" autocomplete="off">
          <output for="area-search" role="status" data-area-status></output>
          <div class="coverage-choices" role="group" aria-label="Auckland regions">${choices}</div>
        </div>
        <div class="coverage-results">${panels}</div>
        <div class="coverage-help"><h3>Don't see your suburb?</h3><a class="ink-link" href="/contact/#request-service">Ask about your address <span aria-hidden="true">↗</span></a></div>
      </div>
    </div>
  </section>`;
}
