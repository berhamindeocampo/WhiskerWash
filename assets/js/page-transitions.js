document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-transition-ready');

  const links = Array.from(document.querySelectorAll('a[href]')).filter(link => {
    const url = link.getAttribute('href');
    return url &&
      !url.startsWith('mailto:') &&
      !url.startsWith('tel:') &&
      !url.startsWith('http') &&
      !link.hasAttribute('target');
  });

  links.forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');

      if (!href || href.startsWith('#')) return;

      event.preventDefault();
      document.body.classList.add('page-transition-exit');

      window.setTimeout(() => {
        window.location.href = href;
      }, 450);
    });
  });
});