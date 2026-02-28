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

  closeMobileDropdowns();

  if (allowScroll && hash && !topLevelHashes.has(hash)) {
    scrollToHash(hash);
  }
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
  return 0;
}

function scrollToHash(hash) {
  const targetSelector = hash === '#home' ? '#home-profile' : hash;
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const getDocumentTop = (el) => {
    let top = 0;
    let node = el;
    while (node) {
      top += node.offsetTop || 0;
      node = node.offsetParent;
    }
    return top;
  };

  const alignToTarget = (behavior = 'auto') => {
    const top = getDocumentTop(target) - getScrollOffset();
    window.scrollTo({ top: Math.max(top, 0), behavior });
  };

  // Wait one frame so section display toggle is committed before measuring.
  requestAnimationFrame(() => {
    alignToTarget('smooth');
    // Final exact pass to keep target title fully visible at the top edge.
    setTimeout(() => alignToTarget('auto'), 260);
  });
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
    event.preventDefault();
    event.stopPropagation();
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    if (currentHash() !== href) {
      history.pushState({}, '', href);
    }
    const route = anchorToRoute[href] || 'home';
    activate(route, href, { allowScroll: true });
  });
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    if (link.closest('.dropdown')) return;
    if (topLevelHashes.has(href)) return;

    // Same-hash clicks do not trigger hashchange; force scroll for consistency.
    if (href === currentHash()) {
      event.preventDefault();
      const route = anchorToRoute[href] || 'home';
      activate(route, href, { allowScroll: true });
    }
  });
});
