(() => {
  const grid = document.querySelector('#home-reviews');
  if (!grid) return;
  fetch('/api/google-reviews.php', { credentials: 'same-origin' })
    .then(response => response.ok ? response.json() : Promise.reject(new Error('Reviews unavailable')))
    .then(data => {
      if (!Array.isArray(data.reviews) || data.reviews.length === 0) return;
      const cards = data.reviews.slice(0, 5).map(review => {
        const card = document.createElement('article');
        card.className = 'google-review';
        const stars = document.createElement('p');
        stars.className = 'google-review__stars';
        stars.textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        stars.setAttribute('aria-label', `${review.rating} out of 5 stars`);
        const quote = document.createElement('blockquote');
        quote.textContent = review.comment;
        const footer = document.createElement('p');
        footer.className = 'google-review__by';
        const name = document.createElement('strong');
        name.textContent = review.author;
        footer.append(name);
        if (review.date) {
          const date = document.createElement('time');
          date.dateTime = review.date;
          const parsed = new Date(review.date);
          if (!Number.isNaN(parsed.valueOf())) date.textContent = new Intl.DateTimeFormat('en-NZ', {month: 'short', year: 'numeric'}).format(parsed);
          footer.append(date);
        }
        card.append(stars, quote, footer);
        return card;
      });
      grid.replaceChildren(...cards);
      grid.classList.add('has-reviews');
      window.ScrollTrigger?.refresh();
    })
    .catch(() => {});
})();
