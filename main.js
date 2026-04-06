const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const progressBar = document.querySelector('.scroll-progress');
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderPercent = document.getElementById('loaderPercent');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

const desktop = window.matchMedia('(min-width: 1101px)').matches;

function initCursor() {
  if (!desktop) return;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  document.querySelectorAll('a, button, .magnetic, .project-card, .photo-card, .skill-box').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
  });

  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * 8;
      const rotX = (0.5 - py) * 6;
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function initScrollProgress() {
  const update = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const value = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    progressBar.style.transform = `scaleX(${value})`;
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function initHeroParallax() {
  const lines = document.querySelectorAll('.title-line');

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    lines.forEach((line) => {
      const depth = Number(line.dataset.depth || 0.08);
      line.style.transform = `translate(${dx * depth * 60}px, ${dy * depth * 40}px)`;
    });
  });
}

function fakeLoader() {
  let progress = 0;
  const timer = setInterval(() => {
    progress += Math.random() * 12;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      setTimeout(() => loader.classList.add('is-hidden'), 350);
    }
    loaderBar.style.width = `${progress}%`;
    loaderPercent.textContent = `${Math.floor(progress)}%`;
  }, 90);
}

window.addEventListener('load', () => {
  fakeLoader();
  initCursor();
  initReveal();
  initScrollProgress();
  initHeroParallax();
});