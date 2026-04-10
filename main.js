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

const desktopQuery = window.matchMedia('(min-width: 1101px)');

function isDesktop() {
  return desktopQuery.matches;
}

function initCursor() {
  if (!cursorDot || !cursorRing || !isDesktop()) return;

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
  const revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.14 });

  revealItems.forEach((el) => observer.observe(el));
}

function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;

  const originalHTML = track.innerHTML;
  track.innerHTML = originalHTML + originalHTML;

  let x = 0;
  let speed = 0.6;
  let halfWidth = 0;

  function measure() {
    halfWidth = track.scrollWidth / 2;
  }

  function loop() {
    x -= speed;

    if (Math.abs(x) >= halfWidth) {
      x = 0;
    }

    track.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(loop);
  }

  measure();
  window.addEventListener('resize', measure);
  loop();
}

function initScrollProgress() {
  if (!progressBar) return;

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
  const lines = document.querySelectorAll('.liquid-line');

  if (!lines.length) return;

  window.addEventListener('mousemove', (e) => {
    if (!isDesktop()) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    lines.forEach((line) => {
      const depth = Number(line.dataset.depth || 0.08);
      line.style.transform = `translate(${dx * depth * 36}px, ${dy * depth * 22}px)`;
    });
  });
}

function initLiquidLetters() {
  if (!isDesktop()) return;

  const filtersSvg = document.getElementById('liquidFilters');
  const lineEls = document.querySelectorAll('.liquid-line');

  if (!filtersSvg || !lineEls.length) return;

  const lettersData = [];

  lineEls.forEach((lineEl, lineIndex) => {
    const text = lineEl.dataset.text || '';
    const isOutline = lineEl.classList.contains('title-outline');
    const isAccent = lineEl.classList.contains('title-accent');
    const depth = Number(lineEl.dataset.depth || 0.08);

    lineEl.innerHTML = '';

    text.split('').forEach((char, charIndex) => {
      const span = document.createElement('span');
      span.className = 'liquid-letter';
      span.textContent = char === ' ' ? '\u00A0' : char;

      if (isOutline) span.classList.add('is-outline');
      if (isAccent) span.classList.add('is-accent');

      const filterId = `liquid-letter-filter-${lineIndex}-${charIndex}`;
      span.style.filter = `url(#${filterId})`;

      lineEl.appendChild(span);

      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', filterId);
      filter.setAttribute('x', '-40%');
      filter.setAttribute('y', '-40%');
      filter.setAttribute('width', '180%');
      filter.setAttribute('height', '180%');

      const turbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
      turbulence.setAttribute('type', 'turbulence');
      turbulence.setAttribute('baseFrequency', '0.008 0.014');
      turbulence.setAttribute('numOctaves', '2');
      turbulence.setAttribute('seed', String(lineIndex * 20 + charIndex + 1));
      turbulence.setAttribute('result', 'noise');

      const displacement = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
      displacement.setAttribute('in', 'SourceGraphic');
      displacement.setAttribute('in2', 'noise');
      displacement.setAttribute('scale', '0');
      displacement.setAttribute('xChannelSelector', 'R');
      displacement.setAttribute('yChannelSelector', 'G');

      filter.appendChild(turbulence);
      filter.appendChild(displacement);
      filtersSvg.appendChild(filter);

      lettersData.push({
        el: span,
        lineEl,
        turbulence,
        displacement,
        depth,
        seedOffset: lineIndex * 0.75 + charIndex * 0.18,
        currentScale: 0,
        targetScale: 0,
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0
      });
    });
  });

  let localMouseX = -9999;
  let localMouseY = -9999;
  let time = 0;

  window.addEventListener('mousemove', (e) => {
    localMouseX = e.clientX;
    localMouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    localMouseX = -9999;
    localMouseY = -9999;
  });

  function animate() {
    time += 0.018;

    lettersData.forEach((item) => {
      const rect = item.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = localMouseX - cx;
      const dy = localMouseY - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const radius = 120;
      const influence = Math.max(0, 1 - distance / radius);

      item.targetScale = influence * 16;
      item.currentScale += (item.targetScale - item.currentScale) * 0.12;

      item.targetX = Math.sin(time * 3.8 + item.seedOffset + cx * 0.01) * 2.4 * influence;
      item.targetY = Math.cos(time * 3.2 + item.seedOffset + cy * 0.01) * 1.8 * influence;

      item.currentX += (item.targetX - item.currentX) * 0.14;
      item.currentY += (item.targetY - item.currentY) * 0.14;

      item.el.style.transform = `translate(${item.currentX}px, ${item.currentY}px)`;

      const freqX = 0.008 + Math.sin(time * 0.7 + item.seedOffset) * 0.0012 * influence;
      const freqY = 0.014 + Math.cos(time * 0.9 + item.seedOffset) * 0.0016 * influence;

      item.turbulence.setAttribute(
        'baseFrequency',
        `${freqX.toFixed(4)} ${freqY.toFixed(4)}`
      );

      item.displacement.setAttribute('scale', item.currentScale.toFixed(2));
    });

    requestAnimationFrame(animate);
  }

  animate();
}

function fakeLoader() {
  if (!loader || !loaderBar || !loaderPercent) return;

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
  initLiquidLetters();
  initMarquee();
});