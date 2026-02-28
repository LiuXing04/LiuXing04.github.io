const anchorToRoute = {
  '#home': 'home',
  '#home-profile': 'home',
  '#home-focus': 'home',
  '#home-contact': 'home',

  '#education': 'education',
  '#edu-undergrad': 'education',
  '#edu-master': 'education',

  '#science': 'science',
  '#sci-research': 'science',
  '#sci-innovation': 'science',
  '#sci-competition': 'science',

  '#projects': 'projects',
  '#proj-company': 'projects',
  '#proj-carbon': 'projects',

  '#blog': 'blog',
  '#blog-overview': 'blog'
};

const views = [...document.querySelectorAll('.view')];
const navLinks = [...document.querySelectorAll('.nav-link, .dropdown a')];
const navGroups = [...document.querySelectorAll('.nav-group')];
const navParents = [...document.querySelectorAll('.nav-parent')];
const mobileQuery = window.matchMedia('(max-width: 700px)');
const topbar = document.querySelector('.topbar');
const topLevelHashes = new Set(['#home', '#education', '#science', '#projects', '#blog']);

function currentHash() {
  return window.location.hash || '#home';
}

function activate(route, hash, options = {}) {
  const allowScroll = options.allowScroll ?? true;
  views.forEach((view) => {
    view.classList.toggle('active', view.dataset.route === route);
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (link.classList.contains('nav-parent')) {
      link.classList.toggle('active', anchorToRoute[href] === route);
      return;
    }
    if (link.closest('.dropdown')) {
      link.classList.toggle('active', href === hash);
      return;
    }
    link.classList.toggle('active', href === hash);
  });

  const revealItems = document.querySelectorAll('.view.active .reveal');
  revealItems.forEach((el, index) => {
    el.classList.remove('in');
    setTimeout(() => el.classList.add('in'), 60 + index * 55);
  });

  if (allowScroll && hash && !topLevelHashes.has(hash)) {
    scrollToHash(hash);
  }

  closeMobileDropdowns();
}

function render(options = {}) {
  const hash = currentHash();
  const route = anchorToRoute[hash] || 'home';
  activate(route, hash, options);
}

window.addEventListener('hashchange', () => render({ allowScroll: true }));
render({ allowScroll: false });

function isMobileNav() {
  return mobileQuery.matches;
}

function closeMobileDropdowns() {
  navGroups.forEach((group) => group.classList.remove('mobile-open'));
}

function navigateTopLevel(hash) {
  const route = anchorToRoute[hash] || 'home';
  if (currentHash() !== hash) {
    history.pushState({}, '', hash);
  }
  activate(route, hash, { allowScroll: false });
}

function getScrollOffset() {
  if (!topbar) return 10;
  const style = window.getComputedStyle(topbar);
  if (style.position === 'sticky' || style.position === 'fixed') {
    return topbar.getBoundingClientRect().height + 12;
  }
  return 10;
}

function scrollToHash(hash) {
  const targetSelector = hash === '#home' ? '#home-profile' : hash;
  const target = document.querySelector(targetSelector);
  if (!target) return;
  setTimeout(() => {
    const top = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }, 70);
}

navParents.forEach((parent) => {
  parent.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const group = parent.closest('.nav-group');
    const parentHash = parent.getAttribute('href') || '#home';

    if (!isMobileNav()) {
      navigateTopLevel(parentHash);
      return;
    }

    if (!group) {
      navigateTopLevel(parentHash);
      return;
    }

    // Mobile: one tap switches section and opens current submenu.
    closeMobileDropdowns();
    navigateTopLevel(parentHash);
    group.classList.add('mobile-open');
  });
});

document.addEventListener('click', (event) => {
  if (!isMobileNav()) return;
  if (event.target.closest('.nav-group')) return;
  closeMobileDropdowns();
});

document.querySelectorAll('.dropdown a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.stopPropagation();
  });
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    if (topLevelHashes.has(href)) return;

    // Same-hash clicks do not trigger hashchange; force scroll for consistency.
    if (href === currentHash()) {
      event.preventDefault();
      const route = anchorToRoute[href] || 'home';
      activate(route, href, { allowScroll: true });
    }
  });
});
