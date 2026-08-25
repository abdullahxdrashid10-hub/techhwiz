document.addEventListener('DOMContentLoaded', () => {

  const userRaw = localStorage.getItem('fureverUser');
  if (!userRaw) { window.location.href = 'index.html'; return; }
  const user = JSON.parse(userRaw);

  const speciesEmoji = { Dog: '🐶', Cat: '🐱', Bird: '🐦', Other: '🐾' };
  const speciesAvatar = {
    Dog: 'assets/avatar-dog.jpg',
    Cat: 'assets/avatar-cat.jpg',
    Bird: 'assets/avatar-bird.jpg',
    Other: 'assets/avatar-dog.jpg'
  };

  const products = [
    { name:'Premium Chicken Kibble',     cat:'Dog/Cat Food',        price:29.99, badge:'Best Seller',  img:'assets/Chiken kibble.png',                desc:'High-protein formula with real roasted chicken and brown rice for adult dogs.' },
    { name:'Organic Salmon Cat Food',    cat:'Dog/Cat Food',        price:24.99, badge:'Organic',      img:'assets/Salmon cat food.png',              desc:'Grain-free wild salmon recipe packed with omega-3 fatty acids for healthy coats.' },
    { name:'Crunchy Dental Treats',      cat:'Dog/Cat Food',        price:12.99, badge:'Vet Approved', img:'assets/Crunchy dental treats.png',        desc:'Vet-recommended dental sticks that reduce tartar, plaque and freshen breath.' },
    { name:'Interactive Puzzle Ball',    cat:'Toys',                price:15.99, badge:'Top Rated',    img:'assets/interactive puzzle ball.png',         desc:'Treat-dispensing interactive puzzle ball that keeps pets mentally stimulated.' },
    { name:'Tough Braided Chew Rope',    cat:'Toys',                price:11.99, badge:'Durable',      img:'assets/Tough Braided Chew Rope.png',      desc:'Durable cotton braided rope toy perfect for tug-of-war and gentle chewing.' },
    { name:'Bamboo Deshedding Brush',    cat:'Grooming Essentials', price:18.99, badge:'Eco-Friendly', img:'assets/Bamboo Deshedding Brush.png',      desc:'Eco-friendly bamboo brush that removes loose undercoat fur without skin irritation.' },
    { name:'Orthopedic Memory Foam Bed', cat:'Bedding and Apparel', price:49.99, badge:'Top Comfort',  img:'assets/Orthopedic Memory Foam Bed.png',   desc:'Premium memory foam donut bed with ultra-soft cushion for joint support.' },
    { name:'Daily Multivitamin Chews',   cat:'Health Supplements',  price:22.99, badge:'Vet Approved', img:'assets/Daily Multivitamin Chews.png',     desc:'Vet-formulated daily wellness drops and chewables with vitamins A, D, and E.' },
  ];

  const petFormSection = document.getElementById('pet-form-section');
  const petForm        = document.getElementById('pet-form');
  const dashboard      = document.getElementById('dashboard');
  const desktopNav     = document.getElementById('desktop-nav');
  const navPill        = document.getElementById('nav-pill');
  const subnavPill     = document.getElementById('subnav-pill');
  const mobileMenu     = document.getElementById('mobile-menu');
  const hamburger      = document.getElementById('hamburger');
  const hamburgerIcon  = document.getElementById('hamburger-icon');
  const productGrid    = document.getElementById('product-grid');
  const productSearch  = document.getElementById('product-search');
  const catFilters     = document.getElementById('cat-filters');
  const noProducts     = document.getElementById('no-products');
  const feedbackForm   = document.getElementById('feedback-form');
  const fbSuccess      = document.getElementById('fb-success');
  const tickerTrack    = document.getElementById('ticker-track');
  const visitorCount   = document.getElementById('visitor-count');

  let activeCat = 'All';

  function spawnParticles(x, y) {
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

  function initTilt() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.product-card, .tilt-card, .vid-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -6;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  function initMagnetic() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.querySelectorAll('.buy-btn, #pet-form-btn, #feedback-form button').forEach(btn => {
      btn.classList.add('btn-magnetic');
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  function updateNavPill(activeBtn) {
    if (!navPill || !activeBtn || window.innerWidth < 768) return;
    navPill.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    navPill.style.width = `${activeBtn.offsetWidth}px`;
  }

  function updateSubNavPill(activeBtn) {
    if (!subnavPill || !activeBtn) return;
    subnavPill.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    subnavPill.style.width = `${activeBtn.offsetWidth}px`;
  }

  const speciesSelect = document.getElementById('pet-species');
  speciesSelect.addEventListener('change', () => {
    speciesSelect.classList.toggle('has-value', speciesSelect.value !== '');
  });

  function showDashboard(pet) {
    petFormSection.style.display = 'none';
    dashboard.classList.remove('hidden');

    document.getElementById('header-pet-name').textContent = pet.name;
    document.getElementById('header-pet-icon').textContent = speciesEmoji[pet.species] ?? '🐾';

    const profileImg = document.getElementById('profile-img');
    if (profileImg) {
      profileImg.src = speciesAvatar[pet.species] ?? 'assets/avatar-dog.jpg';
    }
    document.getElementById('profile-name').textContent = pet.name;
    document.getElementById('profile-sub').textContent = `${pet.breed} · ${pet.age} year${pet.age == 1 ? '' : 's'} old`;
    document.getElementById('profile-species').textContent = pet.species;
    document.getElementById('profile-breed').textContent = pet.breed;
    document.getElementById('profile-age').textContent = `${pet.age} year${pet.age == 1 ? '' : 's'}`;

    initTicker();
    renderProducts();
    initVisitorCounter();

    requestAnimationFrame(() => {
      const activeNav = desktopNav.querySelector('.nav-tab.active');
      if (activeNav) updateNavPill(activeNav);
      const activeSub = document.querySelector('.sub-tab.active');
      if (activeSub) updateSubNavPill(activeSub);
      initTilt();
      initMagnetic();
    });
  }

  const existingPet = localStorage.getItem('fureverPet');
  if (existingPet) {
    showDashboard(JSON.parse(existingPet));
  }

  petForm.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = document.getElementById('pet-form-btn');
    const rect = submitBtn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

    const pet = {
      name:    document.getElementById('pet-name').value.trim(),
      species: speciesSelect.value,
      breed:   document.getElementById('pet-breed').value.trim(),
      age:     parseInt(document.getElementById('pet-age').value, 10),
    };
    localStorage.setItem('fureverPet', JSON.stringify(pet));
    setTimeout(() => showDashboard(pet), 400);
  });

  function switchTab(tabId, clickedBtn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + tabId)?.classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    const activeDesktopBtn = desktopNav.querySelector(`[data-tab="${tabId}"]`);
    if (activeDesktopBtn) updateNavPill(activeDesktopBtn);

    mobileMenu.classList.remove('open');
    hamburgerIcon.style.transform = '';

    requestAnimationFrame(() => {
      initTilt();
      initMagnetic();
    });
  }

  desktopNav.addEventListener('click', e => {
    const tab = e.target.closest('[data-tab]');
    if (tab) switchTab(tab.dataset.tab, tab);
  });

  mobileMenu.addEventListener('click', e => {
    const tab = e.target.closest('[data-tab]');
    if (tab) switchTab(tab.dataset.tab, tab);
  });

  window.addEventListener('resize', () => {
    const activeNav = desktopNav.querySelector('.nav-tab.active');
    if (activeNav) updateNavPill(activeNav);
    const activeSub = document.querySelector('.sub-tab.active');
    if (activeSub) updateSubNavPill(activeSub);
  });

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburgerIcon.style.transform = open ? 'rotate(90deg)' : '';
  });

  const subNav = document.getElementById('petcare-sub-nav');
  subNav.addEventListener('click', e => {
    const btn = e.target.closest('[data-sub]');
    if (!btn) return;
    document.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('sub-' + btn.dataset.sub)?.classList.add('active');
    subNav.querySelectorAll('.sub-tab').forEach(b => b.classList.toggle('active', b === btn));
    updateSubNavPill(btn);
  });

  function renderProducts() {
    const query = (productSearch?.value ?? '').toLowerCase().trim();
    const filtered = products.filter(p => {
      const matchCat = activeCat === 'All' || p.cat === activeCat;
      const matchSearch = !query || p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });

    productGrid.innerHTML = '';
    noProducts.classList.toggle('hidden', filtered.length > 0);

    filtered.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'product-card tilt-card animate-card-in';
      card.style.animationDelay = `${i * 0.05}s`;
      card.innerHTML = `
        <div class="h-44 bg-creambg/40 overflow-hidden relative group">
          <img src="${p.img}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <span class="badge-shimmer absolute top-2.5 right-2.5 text-xs font-bold text-softcoral bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full shadow-sm">${p.cat}</span>
          ${p.badge ? `<span class="badge-shimmer absolute top-2.5 left-2.5 text-[10px] font-black tracking-wide uppercase bg-oceanteal text-white px-2 py-0.5 rounded-md shadow-sm">${p.badge}</span>` : ''}
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between mb-1.5">
            <h3 class="font-bold text-slate-800 text-sm">${p.name}</h3>
            <span class="text-base font-black text-oceanteal">$${p.price.toFixed(2)}</span>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">${p.desc}</p>
          <button class="buy-btn btn-magnetic w-full py-2.5 rounded-xl font-bold text-xs tracking-wide bg-gradient-to-r from-softcoral to-oceanteal text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.97] transition-all duration-200">
            Buy Now 🛒
          </button>
        </div>`;
      productGrid.appendChild(card);
    });

    initTilt();
    initMagnetic();
  }

  productSearch?.addEventListener('input', renderProducts);

  catFilters?.addEventListener('click', e => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    activeCat = btn.dataset.cat;
    catFilters.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b === btn));
    renderProducts();
  });

  document.addEventListener('click', e => {
    const buyBtn = e.target.closest('.buy-btn');
    if (!buyBtn) return;
    createRipple(e, buyBtn);
    const name = buyBtn.closest('.product-card').querySelector('h3').textContent;
    showToast(`🛒 "${name}" added — checkout coming soon!`);
  });

  function showToast(msg) {
    const el = document.createElement('div');
    el.className = 'toast bg-white rounded-2xl shadow-2xl border border-slate-100 px-5 py-3.5 flex items-center gap-3 max-w-sm';
    el.innerHTML = `<span class="text-sm font-medium text-slate-700">${msg}</span>`;
    document.getElementById('toast-container').appendChild(el);
    setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 300); }, 2800);
  }

  function initTicker() {
    let locationText = '📍 Detecting location…';
    const announcements = [
      '🐾 New grooming products just arrived!',
      '🩺 Free vet consultations every Saturday',
      '🎉 Adoption drive this weekend — find your new best friend!',
    ];

    function buildTicker() {
      const now = new Date();
      const clock = `🕐 ${now.toLocaleTimeString()}`;
      const items = [locationText, clock, ...announcements];
      const html = items.map(t => `<span class="mx-6 inline-block">${t}</span>`).join('');
      tickerTrack.innerHTML = html + html;
    }

    buildTicker();
    setInterval(buildTicker, 1000);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => { locationText = `📍 ${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E`; },
        () => { locationText = '📍 Location access denied'; }
      );
    } else {
      locationText = '📍 Geolocation not supported';
    }
  }

  function initVisitorCounter() {
    let count = parseInt(localStorage.getItem('fureverVisitors') ?? '0', 10);
    count++;
    localStorage.setItem('fureverVisitors', String(count));
    visitorCount.textContent = count.toLocaleString();
  }

  feedbackForm?.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = feedbackForm.querySelector('button[type="submit"]');
    const rect = submitBtn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

    submitBtn.classList.add('hidden');
    feedbackForm.querySelectorAll('input, textarea').forEach(el => el.classList.add('hidden'));
    fbSuccess.classList.remove('hidden');
    setTimeout(() => {
      feedbackForm.reset();
      fbSuccess.classList.add('hidden');
      submitBtn.classList.remove('hidden');
      feedbackForm.querySelectorAll('input, textarea').forEach(el => el.classList.remove('hidden'));
    }, 3000);
  });

});
