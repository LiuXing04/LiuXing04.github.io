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
}

function render() {
  const hash = currentHash();
  const route = anchorToRoute[hash] || 'home';
  activate(route, hash);
}

window.addEventListener('hashchange', render);
render();
