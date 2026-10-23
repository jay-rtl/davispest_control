(() => {
  const grid = document.querySelector('#home-reviews');
  if (!grid) return;
  fetch('/api/public-reviews.php', {credentials:'same-origin'})
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(reviews => {
      if (!Array.isArray(reviews) || reviews.length === 0) return;
      grid.replaceChildren();
      reviews.slice(0,2).forEach(review => {
        const card = document.createElement('article'); card.className = 'review-card';
        const stars = document.createElement('p'); stars.className = 'review-stars'; stars.textContent = '★'.repeat(review.rating) + '☆'.repeat(5-review.rating); stars.setAttribute('aria-label', `${review.rating} out of 5 stars`);
        const quote = document.createElement('blockquote'); quote.textContent = review.message;
        const by = document.createElement('p'); by.className = 'review-by';
        const name = document.createElement('strong'); name.textContent = review.display_name; by.append(name);
        if (review.service) { const service = document.createElement('span'); service.textContent = ` · ${review.service}`; by.append(service); }
        card.append(stars, quote, by); grid.append(card);
      });
    }).catch(() => {});
})();
