(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targets = document.querySelectorAll('.hero-copy > *, .hero-art, .values-inner, .section-heading, .treatment-grid article, .clinic-image, .about-copy, .team > .eyebrow, .team > h2, .team > p, .team-placeholder, .contact');
  let observer;

  function showAll() {
    observer?.disconnect();
    targets.forEach(element => {
      element.classList.remove('reveal-pending');
      element.classList.add('is-visible');
    });
  }

  if (preference.matches || !('IntersectionObserver' in window)) return;

  try {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 24px 0px' });

    targets.forEach(element => {
      const siblings = element.parentElement;
      const stagger = siblings.matches('.hero-copy, .treatment-grid')
        ? Array.from(siblings.children).indexOf(element) % 4 : 0;
      element.style.setProperty('--reveal-delay', `${stagger * 70}ms`);
      element.classList.add('reveal-pending');
      observer.observe(element);
    });

    // Keyboard navigation must never focus an invisible element.
    document.addEventListener('focusin', event => {
      event.target.closest('.reveal-pending')?.classList.add('is-visible');
    });
    preference.addEventListener('change', event => {
      if (event.matches) showAll();
    });
  } catch {
    showAll();
  }
})();
