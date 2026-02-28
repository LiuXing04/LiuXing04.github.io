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

function currentHash() {
  return window.location.hash || '#home';
}

function activate(route, hash) {
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

  if (hash && hash !== '#home') {
    const target = document.querySelector(hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 70);
    }
  }

  closeMobileDropdowns();
}

function render() {
  const hash = currentHash();
  const route = anchorToRoute[hash] || 'home';
  activate(route, hash);
}

window.addEventListener('hashchange', render);
render();

function isMobileNav() {
  return mobileQuery.matches;
}

function closeMobileDropdowns() {
  navGroups.forEach((group) => group.classList.remove('mobile-open'));
}

navParents.forEach((parent) => {
  parent.addEventListener('click', (event) => {
    if (!isMobileNav()) return;
    const group = parent.closest('.nav-group');
    if (!group) return;
    const parentHash = parent.getAttribute('href') || '#home';
    const currentRoute = anchorToRoute[currentHash()] || 'home';
    const parentRoute = anchorToRoute[parentHash] || 'home';

    // First tap on a different section: navigate directly.
    if (parentRoute !== currentRoute) {
      closeMobileDropdowns();
      return;
    }

    // Tap again on current section: toggle submenu.
    event.preventDefault();
    const isOpen = group.classList.contains('mobile-open');
    closeMobileDropdowns();
    if (!isOpen) group.classList.add('mobile-open');
  });
});

document.addEventListener('click', (event) => {
  if (!isMobileNav()) return;
  if (event.target.closest('.nav-group')) return;
  closeMobileDropdowns();
});
