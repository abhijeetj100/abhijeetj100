/* =====================================================
   script.js — Portfolio Interactive Logic
   ===================================================== */

/* ── Navbar scroll ──────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Hamburger menu ─────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
// close on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── Active nav highlight ───────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
const observerNav = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
sections.forEach(s => observerNav.observe(s));

/* ── Typewriter effect ──────────────────────────────── */
const phrases = [
  'Senior Software Engineer',
  'Full-Stack Developer',
  'AI & LLM Integrations Builder',
  'Vue.js + TypeScript Specialist',
  'C#/.NET Backend Engineer',
  'Platform & Systems Engineer',
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typeEl = document.getElementById('typeText');

function type() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typeEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typeEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
  }

  let speed = isDeleting ? 45 : 85;

  if (!isDeleting && charIdx === current.length) {
    speed = 2000; // pause at end
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    speed = 400;
  }

  setTimeout(type, speed);
}
type();

/* ── Animated counter stats ─────────────────────────── */
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-value').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
      });
      statObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

/* ── Scroll reveal animations ───────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, (entry.target.dataset.delay || 0) * 1);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Apply reveal to various elements with stagger
function addRevealClasses() {
  const revealGroups = [
    { selector: '.about-text', cls: 'reveal-left' },
    { selector: '.about-card', cls: 'reveal', stagger: 100 },
    { selector: '.skill-category', cls: 'reveal', stagger: 80 },
    { selector: '.timeline-card', cls: 'reveal', stagger: 120 },
    { selector: '.project-card', cls: 'reveal', stagger: 100 },
    { selector: '.edu-card', cls: 'reveal', stagger: 100 },
    { selector: '.achievements-block', cls: 'reveal' },
    { selector: '.contact-card', cls: 'reveal', stagger: 80 },
    { selector: '.about-card-stack', cls: 'reveal' },
  ];

  revealGroups.forEach(group => {
    document.querySelectorAll(group.selector).forEach((el, i) => {
      el.classList.add(group.cls);
      if (group.stagger) {
        el.style.transitionDelay = `${i * group.stagger}ms`;
      }
      revealObserver.observe(el);
    });
  });
}
addRevealClasses();

/* ── Particles ──────────────────────────────────────── */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${8 + Math.random() * 12}s`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    particle.style.width = particle.style.height = `${2 + Math.random() * 3}px`;
    particle.style.opacity = `${0.2 + Math.random() * 0.5}`;
    container.appendChild(particle);
  }
}
createParticles();

/* ── Footer year ────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Project card tilt effect ───────────────────────── */
document.querySelectorAll('.project-card, .about-card, .timeline-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── Smooth section transitions ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
