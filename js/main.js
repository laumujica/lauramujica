const burger = document.getElementById('burgerBtn');
const overlay = document.getElementById('menuOverlay');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  burger.classList.toggle('open', menuOpen);
  burger.setAttribute('aria-expanded', String(menuOpen));
  overlay.classList.toggle('open', menuOpen);
});

// Every view is a standalone HTML document in its section folder,
// available directly at a URL and editable independently of index.html.
const pageUrls = {
  home: '/',
  about: '/pages/about/',
  projects: '/pages/projects/',
  services: '/pages/services/',
  playground: '/pages/playground/',
  'playground-type': '/pages/playground/type.html',
  'playground-illustration': '/pages/playground/illustration.html',
  'playground-motion': '/pages/playground/motion.html',
  'playground-pattern': '/pages/playground/pattern.html',
  contact: '/pages/contact/'
};

function showPage(id) {
  if (!Object.hasOwn(pageUrls, id)) return;
  const destination = pageUrls[id];
  if (location.pathname === destination || (destination === '/' && location.pathname === '/index.html')) {
    menuOpen = false;
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
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

const contactMessageForm = document.getElementById('contactMessageForm');

if (contactMessageForm) {
  contactMessageForm.addEventListener('submit', async event => {
    event.preventDefault();

    const errorMessage = document.getElementById('formError');
    const successMessage = document.getElementById('formSuccess');
    const submitButton = document.getElementById('contactSubmit');
    const fields = [
      document.getElementById('cf-name'),
      document.getElementById('cf-email'),
      document.getElementById('cf-message'),
    ];

    errorMessage.classList.remove('show');
    errorMessage.textContent = '';

    const emptyFields = fields.filter(field => !field.value.trim());
    if (emptyFields.length) {
      emptyFields.forEach(field => {
        field.style.borderColor = 'rgba(255,100,100,0.6)';
        field.addEventListener('input', () => field.style.borderColor = '', { once: true });
      });
      emptyFields[0].focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
      const response = await fetch(contactMessageForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(new FormData(contactMessageForm))),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("I couldn't confirm that your message was sent. Please try again in a moment.");
      }

      if (!response.ok || result.success === false || result.success === 'false' || result.error) {
        throw new Error(result.message || "I couldn't send your message. Please try again in a moment.");
      }

      document.getElementById('contactForm').style.display = 'none';
      successMessage.classList.add('show');
    } catch (error) {
      errorMessage.textContent = error.message || 'Something went wrong. Please try again in a moment.';
      errorMessage.classList.add('show');
      submitButton.disabled = false;
      submitButton.textContent = 'Send message ⚡';
    }
  });
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
  const modal = document.getElementById('videoModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  const v = document.getElementById('introVideo');
  if (v) { v.pause(); v.currentTime = 0; }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeVideoModal();
});
