// ==============================
// Ambient aurora light background
// ==============================
(function() {
  const canvas = document.getElementById('ambient-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  // Light streaks
  const beams = [
    { angle: -35, speed: 0.00015, drift: 0.0003, width: 180, color: [232, 173, 168], opacity: 0.15, phase: 0, cx: 0.4, cy: 0.3 },
    { angle: -40, speed: 0.0002, drift: 0.00025, width: 120, color: [200, 160, 200], opacity: 0.1, phase: 1.5, cx: 0.6, cy: 0.5 },
    { angle: -30, speed: 0.00018, drift: 0.00035, width: 200, color: [180, 150, 190], opacity: 0.08, phase: 3, cx: 0.3, cy: 0.6 },
    { angle: -45, speed: 0.00012, drift: 0.0002, width: 100, color: [240, 190, 185], opacity: 0.12, phase: 4.5, cx: 0.7, cy: 0.4 },
    { angle: -25, speed: 0.00022, drift: 0.0003, width: 150, color: [210, 170, 195], opacity: 0.07, phase: 2, cx: 0.5, cy: 0.7 },
  ];

  function draw(t) {
    ctx.clearRect(0, 0, w, h);

    const scrollFactor = scrollY * 0.15;

    beams.forEach(beam => {
      ctx.save();

      // Drifting center position
      const cx = w * beam.cx + Math.sin(t * beam.drift + beam.phase) * w * 0.15;
      const cy = h * beam.cy + Math.cos(t * beam.drift * 0.7 + beam.phase) * h * 0.1 - (scrollFactor % (h * 0.5));

      ctx.translate(cx, cy);

      // Slowly rotating angle
      const angle = beam.angle + Math.sin(t * beam.speed + beam.phase) * 15;
      ctx.rotate(angle * Math.PI / 180);

      // Draw the light beam as a long soft gradient
      const len = Math.max(w, h) * 1.5;
      const bw = beam.width + Math.sin(t * beam.speed * 2 + beam.phase) * 40;
      const [r, g, b] = beam.color;

      const grad = ctx.createLinearGradient(0, -bw, 0, bw);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
      grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${beam.opacity * 0.3})`);
      grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${beam.opacity})`);
      grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${beam.opacity * 0.3})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = grad;
      ctx.fillRect(-len, -bw, len * 2, bw * 2);

      // Add a bright core
      const coreGrad = ctx.createLinearGradient(0, -bw * 0.15, 0, bw * 0.15);
      coreGrad.addColorStop(0, `rgba(255, 255, 255, 0)`);
      coreGrad.addColorStop(0.5, `rgba(255, 255, 255, ${beam.opacity * 0.4})`);
      coreGrad.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.fillStyle = coreGrad;
      ctx.fillRect(-len, -bw * 0.15, len * 2, bw * 0.3);

      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();

// ==============================
// Video loop — play once, then loop last 5s
// ==============================
(function() {
  const video = document.getElementById('bg-video');
  if (!video) return;
  let loopStart = 0;
  let firstPlay = true;

  video.addEventListener('loadedmetadata', () => {
    loopStart = Math.max(0, video.duration - 2);
  });

  const dim = document.getElementById('bg-video-dim');

  video.addEventListener('ended', () => {
    // Fade to dark, seek, then fade back
    if (dim) dim.style.opacity = '1';
    setTimeout(() => {
      video.currentTime = loopStart;
      video.play();
      setTimeout(() => {
        if (dim) dim.style.opacity = '0.6';
      }, 100);
    }, 500);
  });
})();

// ==============================
// NAV — scroll-based background
// ==============================
const nav = document.querySelector('.nav');

function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ==============================
// Mobile nav toggle
// ==============================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a:not(.retreats-link)').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ==============================
// Retreats "Coming Soon" modal
// ==============================
const modal = document.getElementById('comingSoonModal');
const retreatsLinks = document.querySelectorAll('.retreats-link');
const modalClose = document.querySelector('.modal-close');

retreatsLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

modalClose.addEventListener('click', () => {
  modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.classList.remove('active');
  }
});

// ==============================
// Form submission
// ==============================
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Thank You — We\'ll Be in Touch';
  btn.disabled = true;
  btn.style.opacity = '0.6';
  btn.style.cursor = 'default';
  form.reset();
}

// ==============================
// Modal form submission
// ==============================
function handleModalSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const input = form.querySelector('input');
  btn.textContent = 'Thank You!';
  btn.disabled = true;
  btn.style.opacity = '0.6';
  btn.style.cursor = 'default';
  input.disabled = true;
  input.style.opacity = '0.6';
}

// ==============================
// Scroll reveal with staggering
// ==============================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

// Apply reveal to all sections
document.querySelectorAll('.section').forEach(section => {
  section.classList.add('reveal');
  revealObserver.observe(section);
});

// Apply staggered reveal to grids
document.querySelectorAll('.objectives-grid, .schedule-timeline').forEach(grid => {
  grid.classList.add('reveal-stagger');
  revealObserver.observe(grid);
});

// Reveal facilitator cards individually
document.querySelectorAll('.facilitator').forEach(card => {
  card.classList.add('reveal');
  revealObserver.observe(card);
});
