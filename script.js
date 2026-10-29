(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const navigationLinks = [...document.querySelectorAll('.nav-link')];
  const sections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation menu');
    sidebar?.classList.remove('is-open');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    sidebar?.classList.toggle('is-open', !isOpen);
  });

  navigationLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.querySelectorAll('.project-card[data-project-url]').forEach((card) => {
    const projectUrl = card.dataset.projectUrl?.trim();
    if (!projectUrl) return;

    let resolvedUrl;
    try {
      resolvedUrl = new URL(projectUrl, window.location.href);
    } catch {
      return;
    }
    if (!['http:', 'https:'].includes(resolvedUrl.protocol)) return;

    const projectLink = document.createElement('a');
    projectLink.className = 'project-link';
    projectLink.href = resolvedUrl.href;
    projectLink.textContent = card.dataset.projectLabel || 'View project';
    projectLink.target = '_blank';
    projectLink.rel = 'noopener noreferrer';
    card.insertBefore(projectLink, card.querySelector('.tag-row'));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((section) => revealObserver.observe(section));

    const sectionObserver = new IntersectionObserver((entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
      if (!visibleSection) return;
      navigationLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${visibleSection.target.id}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.15, 0.4] });

    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    document.querySelectorAll('.reveal').forEach((section) => section.classList.add('is-visible'));
  }
})();
