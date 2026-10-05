// ====================
// TYPING EFFECT - Hero
// ====================
let typingEl, heroSubEl, heroText, heroSubText;
let charIndex = 0;
let subCharIndex = 0;
const typingSpeed = 50;
const subTypingSpeed = 30;

function typeHero() {
  if (charIndex < heroText.length) {
    typingEl.textContent += heroText.charAt(charIndex);
    charIndex++;
    setTimeout(typeHero, typingSpeed);
  } else {
    setTimeout(typeSub, 400);
  }
}

function typeSub() {
  if (subCharIndex < heroSubText.length) {
    if (heroSubText.charAt(subCharIndex) === '\n') {
      heroSubEl.innerHTML += '<br>';
    } else {
      heroSubEl.textContent += heroSubText.charAt(subCharIndex);
    }
    subCharIndex++;
    setTimeout(typeSub, subTypingSpeed);
  }
}

window.addEventListener('load', () => {
  typingEl = document.getElementById('typing-text');
  heroSubEl = document.getElementById('hero-sub');
  heroText = typingEl.dataset.text || '';
  heroSubText = heroSubEl.dataset.text || '';
  setTimeout(typeHero, 500);
});

// ====================
// REVEAL ON SCROLL
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .skill-card, .lib-card, .price-card, .pricing-details, .section-header').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[data-section]');

function updateActiveNav() {
  const scrollY = window.scrollY + 150;
  let currentId = '';
  sections.forEach(section => {
    if (section.offsetTop <= scrollY) {
      currentId = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === currentId);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ASCII drift: floating terminal glyphs, no connecting lines
(function() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const GLYPHS = ['$', '>', '#', '0', '1', '{', '}', '/', ';', '+'];
  let glyphs = [];
  let mouse = { x: null, y: null, radius: 120 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Glyph {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.baseX = this.x;
      this.baseY = this.y;
      this.targetX = this.x;
      this.targetY = this.y;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.speedY = (Math.random() - 0.5) * 0.25;
      this.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      this.size = 11 + Math.random() * 7;
      this.alpha = 0.14 + Math.random() * 0.18;
    }

    update() {
      this.baseX += this.speedX;
      this.baseY += this.speedY;
      let wrapped = false;
      if (this.baseX < -20) { this.baseX = canvas.width + 20; wrapped = true; }
      if (this.baseX > canvas.width + 20) { this.baseX = -20; wrapped = true; }
      if (this.baseY < -20) { this.baseY = canvas.height + 20; wrapped = true; }
      if (this.baseY > canvas.height + 20) { this.baseY = -20; wrapped = true; }
      if (wrapped) {
        this.x = this.baseX;
        this.y = this.baseY;
        this.targetX = this.baseX;
        this.targetY = this.baseY;
      }

      let dx = mouse.x - this.baseX;
      let dy = mouse.y - this.baseY;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius && mouse.x !== null && distance > 0.1) {
        let force = (mouse.radius - distance) / mouse.radius;
        this.targetX = this.baseX - (dx / distance) * force * 30;
        this.targetY = this.baseY - (dy / distance) * force * 30;
      } else {
        this.targetX = this.baseX;
        this.targetY = this.baseY;
      }

      this.x += (this.targetX - this.x) * 0.05;
      this.y += (this.targetY - this.y) * 0.05;
    }

    draw() {
      ctx.fillStyle = 'rgba(0, 255, 65, ' + this.alpha.toFixed(3) + ')';
      ctx.font = this.size + 'px "JetBrains Mono", monospace';
      ctx.fillText(this.char, this.x, this.y);
    }
  }

  function init() {
    glyphs = [];
    let n = Math.min((canvas.width * canvas.height) / 22000, 90);
    for (let i = 0; i < n; i++) glyphs.push(new Glyph());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < glyphs.length; i++) {
      glyphs[i].update();
      glyphs[i].draw();
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
  resize(); init(); animate();
})();
