/**
 * FurEver Care — Role Selection & Onboarding Controller
 */
document.addEventListener('DOMContentLoaded', () => {

  const nameInput       = document.getElementById('user-name-input');
  const ctaBtn          = document.getElementById('cta-btn');
  const btnLabel        = document.getElementById('btn-label');
  const btnSpinner      = document.getElementById('btn-spinner');
  const landingScreen   = document.getElementById('landing-screen');
  const welcomeScreen   = document.getElementById('welcome-screen');
  const welcomeName     = document.getElementById('welcome-name');
  const welcomeIcon     = document.getElementById('welcome-icon');
  const welcomeCategory = document.getElementById('welcome-category');
  const progressBar     = document.getElementById('progress-bar');
  const profileCards    = document.querySelectorAll('.profile-card');

  const state = { name: '', category: null };

  const categoryIcons = {
    'Pet Owner':     '🐶',
    'Veterinarian':  '🩺',
    'Animal Shelter':'🏠',
  };

  function syncBtn() {
    const valid = state.name.length > 0 && state.category !== null;
    ctaBtn.disabled = !valid;
    ctaBtn.setAttribute('aria-disabled', String(!valid));

    if (valid) {
      ctaBtn.classList.remove('bg-slate-200', 'text-slate-400', 'cursor-not-allowed', 'shadow-none');
      ctaBtn.classList.add('btn-active', 'bg-gradient-to-r', 'from-softcoral', 'to-oceanteal', 'text-white', 'cursor-pointer', 'shadow-lg');
    } else {
      ctaBtn.classList.add('bg-slate-200', 'text-slate-400', 'cursor-not-allowed', 'shadow-none');
      ctaBtn.classList.remove('btn-active', 'bg-gradient-to-r', 'from-softcoral', 'to-oceanteal', 'text-white', 'cursor-pointer', 'shadow-lg');
    }
  }

  function clearCards() {
    profileCards.forEach(card => {
      card.classList.remove('selected');
      card.setAttribute('aria-checked', 'false');
      const badge = card.querySelector('.check-badge');
      badge.style.animation = 'none';
      badge.style.transform = 'scale(0)';
      badge.style.opacity   = '0';
      void badge.offsetWidth;
      badge.style.animation = '';
    });
  }

  function selectCard(card) {
    clearCards();
    card.classList.add('selected');
    card.setAttribute('aria-checked', 'true');
    state.category = card.dataset.category;
    syncBtn();
  }

  nameInput.addEventListener('input', () => {
    state.name = nameInput.value.trim();
    syncBtn();
  });

  profileCards.forEach(card => {
    card.addEventListener('click', () => selectCard(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectCard(card); }
    });
  });

  function createRipple(e, btn) {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  function spawnParticleBurst(x, y) {
    const symbols = ['🐾', '✨', '💛', '🌸'];
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${14 + Math.random() * 12}px;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.75s cubic-bezier(0.22, 1, 0.36, 1);
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 1;
      `;
      document.body.appendChild(p);

      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.5;
      const distance = 40 + Math.random() * 65;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance - 20;

      requestAnimationFrame(() => {
        p.style.transform = `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(1.1)`;
        p.style.opacity = '0';
      });

      setTimeout(() => p.remove(), 800);
    }
  }

  ctaBtn.addEventListener('click', e => {
    if (!state.name || !state.category) return;
    createRipple(e, ctaBtn);
    spawnParticleBurst(e.clientX, e.clientY);

    btnLabel.classList.add('hidden');
    btnSpinner.classList.remove('hidden');
    btnSpinner.classList.add('flex');
    ctaBtn.disabled = true;

    try {
      localStorage.setItem('fureverUser', JSON.stringify({ name: state.name, category: state.category }));
    } catch (_) {}

    const pages = { 'Pet Owner': 'petowner.html', 'Veterinarian': 'veterinarian.html', 'Animal Shelter': 'shelter.html' };
    const targetPage = pages[state.category] || 'petowner.html';

    const redirectBtn = document.getElementById('welcome-redirect-btn');
    if (redirectBtn) redirectBtn.href = targetPage;

    if (landingScreen) {
      landingScreen.classList.add('animate-page-out');
      landingScreen.style.display = 'none';
    }

    if (welcomeName) welcomeName.textContent = state.name;
    if (welcomeIcon) welcomeIcon.textContent = categoryIcons[state.category] ?? '🐾';
    if (welcomeCategory) welcomeCategory.textContent = state.category;
    if (welcomeScreen) welcomeScreen.classList.add('visible');
    if (progressBar) progressBar.style.width = '100%';

    setTimeout(() => {
      window.location.assign(targetPage);
    }, 450);
  });

  const canHover = window.matchMedia('(hover: hover)').matches;
  if (canHover) {
    [ctaBtn].forEach(btn => {
      if (!btn) return;
      let btnRaf = null;
      btn.addEventListener('mousemove', e => {
        if (btn.disabled) return;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        if (btnRaf) cancelAnimationFrame(btnRaf);
        btnRaf = requestAnimationFrame(() => {
          btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
        });
      });
      btn.addEventListener('mouseleave', () => {
        if (btnRaf) cancelAnimationFrame(btnRaf);
        btn.style.transform = '';
      });
    });

    const tiltElements = document.querySelectorAll('.profile-card, #onboarding-card');
    tiltElements.forEach(card => {
      let cardRaf = null;
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (cardRaf) cancelAnimationFrame(cardRaf);
        cardRaf = requestAnimationFrame(() => {
          const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
          const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
          card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        if (cardRaf) cancelAnimationFrame(cardRaf);
        card.style.transform = '';
      });
    });
  }

  syncBtn();

  try {
    const stored = JSON.parse(localStorage.getItem('fureverUser') ?? 'null');
    if (stored?.name) {
      nameInput.value = stored.name;
      state.name = stored.name.trim();
      nameInput.dispatchEvent(new Event('input'));
    }
  } catch (_) {}

  const cursorGlow = document.getElementById('cursor-glow');
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let glowRaf = null;

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (glowRaf) return;
    glowRaf = requestAnimationFrame(() => {
      glowRaf = null;
      if (cursorGlow) {
        cursorGlow.style.transform = `translate3d(${mouse.x - 200}px, ${mouse.y - 200}px, 0)`;
      }
    });
  });

  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const symbols = ['🐾', '✨', '💛', '•', '•'];
    const colors = ['rgba(44,110,107,0.22)', 'rgba(244,168,150,0.28)', 'rgba(168,195,160,0.25)', 'rgba(244,168,150,0.18)'];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 20;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = -(0.4 + Math.random() * 0.7);
        this.baseSize = 10 + Math.random() * 16;
        this.size = this.baseSize;
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.02;
        this.alpha = 0.2 + Math.random() * 0.4;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.spin;

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 130;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          this.x += (dx / dist) * force * 3;
          this.y += (dy / dist) * force * 3;
        }

        if (this.y < -30 || this.x < -30 || this.x > width + 30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.alpha;

        if (this.symbol === '•') {
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        } else {
          ctx.font = `${this.size}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.symbol, 0, 0);
        }

        ctx.restore();
      }
    }

    const particles = Array.from({ length: 32 }, () => new Particle());

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

});

