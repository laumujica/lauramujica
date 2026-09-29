const burger = document.getElementById('burgerBtn');
const overlay = document.getElementById('menuOverlay');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  burger.classList.toggle('open', menuOpen);
  overlay.classList.toggle('open', menuOpen);
});

// Every view is a standalone HTML document, so its content is available
// directly at a URL and can be edited independently of index.html.
const pageUrls = {
  home: 'index.html',
  about: 'about.html',
  projects: 'projects.html',
  'project-volka': 'project-volka.html',
  services: 'services.html',
  playground: 'playground.html',
  'playground-type': 'playground-type.html',
  'playground-illustration': 'playground-illustration.html',
  'playground-motion': 'playground-motion.html',
  'playground-pattern': 'playground-pattern.html',
  contact: 'contact.html'
};

function showPage(id) {
  if (!Object.hasOwn(pageUrls, id)) return;
  const destination = pageUrls[id];
  if (location.pathname.endsWith('/' + destination) || (id === 'home' && location.pathname.endsWith('/'))) {
    menuOpen = false;
    burger.classList.remove('open');
    overlay.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  location.assign(destination);
}

if (document.getElementById('projects')) animateCounters();

function toggleVideo() {
  const video = document.getElementById('featuredVideo');
  const fallback = document.getElementById('videoFallback');
  const icon = document.getElementById('playIcon');
  if (!video.src && !video.querySelector('source')) return;
  fallback.style.display = 'none';
  if (video.paused) {
    video.play();
    icon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
  } else {
    video.pause();
    icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
  }
}

function animateCounters() {
  document.querySelectorAll('.proj-stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 900;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;
    el.textContent = '0';
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + (target >= 10 ? '+' : '');
    }, step);
  });
}

function submitForm() {
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const message = document.getElementById('cf-message').value.trim();
  if (!name || !email || !message) {
    const empty = [
      !name && document.getElementById('cf-name'),
      !email && document.getElementById('cf-email'),
      !message && document.getElementById('cf-message'),
    ].filter(Boolean);
    empty.forEach(el => {
      el.style.borderColor = 'rgba(255,100,100,0.6)';
      el.addEventListener('input', () => el.style.borderColor = '', {once:true});
    });
    return;
  }
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').classList.add('show');
}


const canvas = document.getElementById('noiseCanvas');
const ctx = canvas.getContext('2d');
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawNoise();
}
function drawNoise() {
  const w = canvas.width, h = canvas.height;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random() * 255 | 0;
    d[i] = d[i+1] = d[i+2] = v;
    d[i+3] = 38;
  }
  ctx.putImageData(img, 0, 0);
}
window.addEventListener('resize', resize);
resize();

// --- Video modal controls ---
function openVideoModal() {
  document.getElementById('videoModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  const v = document.getElementById('introVideo');
  if (v) v.play();
}
function closeVideoModal() {
  document.getElementById('videoModal').classList.remove('open');
  document.body.style.overflow = '';
  const v = document.getElementById('introVideo');
  if (v) { v.pause(); v.currentTime = 0; }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeVideoModal();
});
