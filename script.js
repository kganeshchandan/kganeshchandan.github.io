const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

document.querySelectorAll('[data-year]').forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const closeMenu = (returnFocus = false) => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
  if (returnFocus) menuToggle?.focus();
};

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
const menuIsOpen = () => menuToggle?.getAttribute('aria-expanded') === 'true';
window.addEventListener('keydown', (event) => {
  if (!menuIsOpen()) return;
  // Only claim Escape while the menu is actually open, so it never steals focus from other widgets.
  if (event.key === 'Escape') closeMenu(true);
  // While the menu covers the page, Tab cycles between the toggle and the menu links.
  if (event.key === 'Tab') {
    const stops = [menuToggle, ...nav.querySelectorAll('a')];
    const index = stops.indexOf(document.activeElement);
    const next = event.shiftKey ? (index <= 0 ? stops.length - 1 : index - 1) : (index === stops.length - 1 ? 0 : index + 1);
    event.preventDefault();
    stops[next].focus();
  }
});
document.addEventListener('pointerdown', (event) => {
  if (menuIsOpen() && !header.contains(event.target)) closeMenu();
});

const scrollProgress = document.querySelector('[data-scroll-progress]');
if (scrollProgress) {
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}

// Timeline year dial: follows the entry crossing 40% of the viewport, like a calendar turning over.
const dial = document.querySelector('[data-year-dial]');
if (dial) {
  const track = document.querySelector('.repo-timeline');
  const entries = [...track.querySelectorAll('.repo-entry')];
  const yearEl = dial.querySelector('[data-dial-year]');
  const captionEl = dial.querySelector('[data-dial-caption]');
  const countEl = dial.querySelector('[data-dial-count]');
  const monthCells = [...dial.querySelectorAll('[data-dial-months] li')];
  const yearLinks = [...dial.querySelectorAll('.dial-years a')];
  const monthOf = (entry) => new Date(entry.querySelector('time').dateTime).getUTCMonth();
  // A year's first entry turns over when its section header reaches the reading line, so the dial
  // never keeps showing last year while the new year's heading is already on screen.
  const triggers = entries.map((entry) => (entry === entry.parentElement.firstElementChild
    ? entry.closest('[data-timeline-year]').querySelector('header')
    : entry));
  let current = null;

  const showEntry = (entry) => {
    if (entry === current) return;
    const section = entry.closest('[data-timeline-year]');
    const previousSection = current?.closest('[data-timeline-year]');
    current?.classList.remove('is-current');
    entry.classList.add('is-current');
    current = entry;

    if (section !== previousSection) {
      const header = section.querySelector('header');
      const nextYear = header.querySelector('p').textContent;
      const lastYear = yearEl.textContent;
      const rollClass = Number(nextYear) < Number(lastYear) ? 'is-rolling-back' : 'is-rolling';
      yearEl.replaceChildren(...[...nextYear].map((digit, index) => {
        const span = document.createElement('span');
        span.textContent = digit;
        span.style.setProperty('--i', index);
        if (previousSection && digit !== lastYear[index]) span.className = rollClass;
        return span;
      }));
      captionEl.textContent = header.querySelector('h2').textContent;
      countEl.textContent = header.querySelector('span').textContent;
      const months = new Set([...section.querySelectorAll('.repo-entry')].map(monthOf));
      monthCells.forEach((cell, index) => cell.classList.toggle('has-repo', months.has(index)));
      yearLinks.forEach((link) => {
        if (link.hash === `#${section.id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }
    const month = monthOf(entry);
    monthCells.forEach((cell, index) => cell.classList.toggle('is-current', index === month));
    const dotCentre = parseFloat(getComputedStyle(entry, '::before').top) + 5;
    const dotY = entry.getBoundingClientRect().top - track.getBoundingClientRect().top + dotCentre;
    track.style.setProperty('--rail-fill', `${Math.max(0, dotY)}px`);
  };

  let pending = false;
  const updateDial = () => {
    pending = false;
    const line = window.innerHeight * .4;
    let active = entries[0];
    for (const [index, entry] of entries.entries()) {
      if (triggers[index].getBoundingClientRect().top <= line) active = entry;
      else break;
    }
    showEntry(active);
  };
  const requestUpdate = () => {
    if (!pending) { pending = true; requestAnimationFrame(updateDial); }
  };
  const reducedMotionPage = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Clicking a marked month jumps to that month's first repository in the year on show.
  monthCells.forEach((cell, month) => cell.addEventListener('click', () => {
    const section = current?.closest('[data-timeline-year]');
    const target = section && [...section.querySelectorAll('.repo-entry')].find((entry) => monthOf(entry) === month);
    if (!target) return;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - window.innerHeight * .34, behavior: reducedMotionPage ? 'auto' : 'smooth' });
  }));
  updateDial();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The header slides away while reading down a page and returns as soon as the reader scrolls back up.
if (header && !document.body.classList.contains('graph-page')) {
  const root = document.documentElement;
  let lastY = window.scrollY;
  let ticking = false;
  const updateHeaderVisibility = () => {
    ticking = false;
    const y = window.scrollY;
    const menuOpen = menuToggle?.getAttribute('aria-expanded') === 'true';
    if (menuOpen || y < 160 || y < lastY - 4 || header.contains(document.activeElement)) root.classList.remove('header-hidden');
    else if (y > lastY + 4) root.classList.add('header-hidden');
    if (Math.abs(y - lastY) > 4) lastY = y;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateHeaderVisibility); }
  }, { passive: true });
  header.addEventListener('focusin', () => root.classList.remove('header-hidden'));
}

// Content below the first screen fades up as it arrives; anything already visible is left alone.
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealTargets = [...document.querySelectorAll('.resume-facts article, .resume-section > header, .resume-rows article, .publication-rows li, .skills-grid p, .pdf-section, .timeline-year-section > header, .repo-entry, .timeline-note, .email-row, .contact-links a')]
    .filter((element) => element.getBoundingClientRect().top > window.innerHeight * .92);
  const revealer = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry, index) => {
      entry.target.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 70}ms`);
      entry.target.classList.add('is-revealed');
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  revealTargets.forEach((element) => {
    element.classList.add('reveal');
    revealer.observe(element);
  });
}

// Headline figures count up once on load, keeping their zero padding.
if (!prefersReducedMotion) {
  document.querySelectorAll('.timeline-intro dd').forEach((figure) => {
    const text = figure.textContent.trim();
    const target = Number(text);
    if (!Number.isFinite(target)) return;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 900);
      figure.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3)))).padStart(text.length, '0');
      if (t < 1) requestAnimationFrame(tick);
    };
    figure.textContent = '0'.padStart(text.length, '0');
    requestAnimationFrame(tick);
  });
}

// Copy the email address; if the clipboard is unavailable, select it so it can be copied by hand.
document.querySelectorAll('[data-copy-email]').forEach((button) => {
  const label = button.textContent;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copyEmail);
      button.textContent = 'Copied';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.email-link strong'));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      button.textContent = 'Selected';
    }
    button.classList.add('is-done');
    clearTimeout(button.resetTimer);
    button.resetTimer = setTimeout(() => {
      button.textContent = label;
      button.classList.remove('is-done');
    }, 1800);
  });
});
