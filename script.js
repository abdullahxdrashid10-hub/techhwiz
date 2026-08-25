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

});
