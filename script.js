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
      // Kill animation so checkPop re-triggers cleanly on next selection
      badge.style.animation = 'none';
      badge.style.transform = 'scale(0)';
      badge.style.opacity   = '0';
      void badge.offsetWidth; // force reflow
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

  ctaBtn.addEventListener('click', () => {
    if (!state.name || !state.category) return;

    btnLabel.classList.add('hidden');
    btnSpinner.classList.remove('hidden');
    btnSpinner.classList.add('flex');
    ctaBtn.disabled = true;

    localStorage.setItem('fureverUser', JSON.stringify({ name: state.name, category: state.category }));

    setTimeout(() => {
      landingScreen.classList.add('animate-page-out');
      setTimeout(() => {
        landingScreen.style.display = 'none';
        welcomeName.textContent     = state.name;
        welcomeIcon.textContent     = categoryIcons[state.category] ?? '🐾';
        welcomeCategory.textContent = state.category;
        welcomeScreen.classList.add('visible');
        requestAnimationFrame(() => {
          setTimeout(() => { progressBar.style.width = '100%'; }, 80);
          const pages = { 'Pet Owner': 'petowner.html', 'Veterinarian': 'vet.html', 'Animal Shelter': 'shelter.html' };
          setTimeout(() => { window.location.href = pages[state.category] ?? 'index.html'; }, 2200);
        });
      }, 500);
    }, 900);
  });

  syncBtn();

  // Pre-fill returning user
  try {
    const stored = JSON.parse(localStorage.getItem('fureverUser') ?? 'null');
    if (stored?.name) {
      nameInput.value = stored.name;
      state.name = stored.name.trim();
      nameInput.dispatchEvent(new Event('input'));
    }
  } catch (_) {}

  // ═══════════════════════════════════════════════════════════
  //  INTERACTIVE DYNAMIC CANVAS & CURSOR GLOW
  // ═══════════════════════════════════════════════════════════

  const cursorGlow = document.getElementById('cursor-glow');
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 };

  window.addEventListener('mousemove', e => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  // Smooth lerp cursor glow
  function updateCursorGlow() {
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;
    if (cursorGlow) {
      cursorGlow.style.left = `${mouse.x}px`;
      cursorGlow.style.top = `${mouse.y}px`;
    }
    requestAnimationFrame(updateCursorGlow);
  }
  requestAnimationFrame(updateCursorGlow);

  // Background Particles Canvas
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

        // Subtle repulsion from mouse
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

