document.addEventListener('DOMContentLoaded', () => {

  // ── Auth guard: redirect if no user session ──
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

  // ── Product data ──
  const products = [
    { name:'Premium Chicken Kibble',     cat:'Dog/Cat Food',        price:29.99, img:'assets/product-kibble.jpg',     desc:'High-protein formula with real chicken and brown rice for adult dogs.' },
    { name:'Organic Salmon Cat Food',    cat:'Dog/Cat Food',        price:24.99, img:'assets/product-kibble.jpg',     desc:'Grain-free wild salmon recipe packed with omega-3 for healthy coats.' },
    { name:'Crunchy Dental Treats',      cat:'Dog/Cat Food',        price:12.99, img:'assets/product-supplement.jpg', desc:'Vet-recommended dental sticks that reduce plaque and freshen breath.' },
    { name:'Interactive Puzzle Ball',    cat:'Toys',                price:15.99, img:'assets/product-toy.jpg',        desc:'Treat-dispensing puzzle ball that keeps pets mentally stimulated.' },
    { name:'Feather Teaser Wand',        cat:'Toys',                price:8.99,  img:'assets/product-toy.jpg',        desc:'Irresistible feather wand with bell for hours of interactive play.' },
    { name:'Tough Chew Rope',            cat:'Toys',                price:11.99, img:'assets/product-toy.jpg',        desc:'Durable braided rope toy perfect for tug-of-war and chewing.' },
    { name:'Bamboo Deshedding Brush',    cat:'Grooming Essentials', price:18.99, img:'assets/product-brush.jpg',      desc:'Eco-friendly bamboo brush that removes loose fur without irritation.' },
    { name:'Oatmeal Soothing Shampoo',   cat:'Grooming Essentials', price:14.99, img:'assets/product-supplement.jpg', desc:'Gentle pH-balanced shampoo with colloidal oatmeal for sensitive skin.' },
    { name:'Pet Nail Clipper Pro',       cat:'Grooming Essentials', price:12.99, img:'assets/product-brush.jpg',      desc:'Safety-guard clippers with LED light for precise, stress-free trims.' },
    { name:'Orthopedic Memory Foam Bed', cat:'Bedding and Apparel', price:49.99, img:'assets/product-bed.jpg',        desc:'Premium memory foam bed with washable cover for joint support.' },
    { name:'Waterproof Winter Jacket',   cat:'Bedding and Apparel', price:32.99, img:'assets/product-bed.jpg',        desc:'Reflective, insulated jacket for cold weather walks and adventures.' },
    { name:'Daily Multivitamin Chews',   cat:'Health Supplements',  price:22.99, img:'assets/product-supplement.jpg', desc:'Vet-formulated soft chews with vitamins A, D, E and glucosamine.' },
  ];

  // ── DOM refs ──
  const petFormSection = document.getElementById('pet-form-section');
  const petForm        = document.getElementById('pet-form');
  const dashboard      = document.getElementById('dashboard');
  const desktopNav     = document.getElementById('desktop-nav');
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

  // ═══════════════════════════════════
  //  PET FORM
  // ═══════════════════════════════════

  // Float label fix for <select> (needs a .has-value class since it can't use :placeholder-shown)
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
  }

  // Check for existing pet data (returning user)
  const existingPet = localStorage.getItem('fureverPet');
  if (existingPet) {
    showDashboard(JSON.parse(existingPet));
  }

  petForm.addEventListener('submit', e => {
    e.preventDefault();
    const pet = {
      name:    document.getElementById('pet-name').value.trim(),
      species: speciesSelect.value,
      breed:   document.getElementById('pet-breed').value.trim(),
      age:     parseInt(document.getElementById('pet-age').value, 10),
    };
    localStorage.setItem('fureverPet', JSON.stringify(pet));
    showDashboard(pet);
  });

  // ═══════════════════════════════════
  //  TAB SWITCHING
  // ═══════════════════════════════════

  function switchTab(tabId) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + tabId)?.classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Close mobile menu after selection
    mobileMenu.classList.remove('open');
    hamburgerIcon.style.transform = '';
  }

  desktopNav.addEventListener('click', e => {
    const tab = e.target.closest('[data-tab]');
    if (tab) switchTab(tab.dataset.tab);
  });

  mobileMenu.addEventListener('click', e => {
    const tab = e.target.closest('[data-tab]');
    if (tab) switchTab(tab.dataset.tab);
  });

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburgerIcon.style.transform = open ? 'rotate(90deg)' : '';
  });

  // ── Sub-tabs (Pet Care) ──
  const subNav = document.getElementById('petcare-sub-nav');
  subNav.addEventListener('click', e => {
    const btn = e.target.closest('[data-sub]');
    if (!btn) return;
    document.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('sub-' + btn.dataset.sub)?.classList.add('active');
    subNav.querySelectorAll('.sub-tab').forEach(b => b.classList.toggle('active', b === btn));
  });

  // ═══════════════════════════════════
  //  PRODUCT RENDERING
  // ═══════════════════════════════════

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
      card.className = 'product-card animate-card-in';
      card.style.animationDelay = `${i * 0.06}s`;
      card.innerHTML = `
        <div class="h-44 bg-creambg/40 overflow-hidden relative group">
          <img src="${p.img}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <span class="absolute top-2.5 right-2.5 text-xs font-bold text-softcoral bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full shadow-sm">${p.cat}</span>
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between mb-1.5">
            <h3 class="font-bold text-slate-800 text-sm">${p.name}</h3>
            <span class="text-base font-black text-oceanteal">$${p.price.toFixed(2)}</span>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">${p.desc}</p>
          <button class="buy-btn w-full py-2.5 rounded-xl font-bold text-xs tracking-wide bg-gradient-to-r from-softcoral to-oceanteal text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.97] transition-all duration-200">
            Buy Now 🛒
          </button>
        </div>`;
      productGrid.appendChild(card);
    });
  }

  productSearch?.addEventListener('input', renderProducts);

  catFilters?.addEventListener('click', e => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    activeCat = btn.dataset.cat;
    catFilters.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b === btn));
    renderProducts();
  });

  // Buy Now toast
  document.addEventListener('click', e => {
    if (!e.target.closest('.buy-btn')) return;
    const name = e.target.closest('.product-card').querySelector('h3').textContent;
    showToast(`🛒 "${name}" added — checkout coming soon!`);
  });

  function showToast(msg) {
    const el = document.createElement('div');
    el.className = 'toast bg-white rounded-2xl shadow-2xl border border-slate-100 px-5 py-3.5 flex items-center gap-3 max-w-sm';
    el.innerHTML = `<span class="text-sm font-medium text-slate-700">${msg}</span>`;
    document.getElementById('toast-container').appendChild(el);
    setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 300); }, 2800);
  }

  // ═══════════════════════════════════
  //  TICKER
  // ═══════════════════════════════════

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
      // Duplicate for seamless loop
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

  // ═══════════════════════════════════
  //  VISITOR COUNTER
  // ═══════════════════════════════════

  function initVisitorCounter() {
    let count = parseInt(localStorage.getItem('fureverVisitors') ?? '0', 10);
    count++;
    localStorage.setItem('fureverVisitors', String(count));
    visitorCount.textContent = count.toLocaleString();
  }

  // ═══════════════════════════════════
  //  FEEDBACK FORM
  // ═══════════════════════════════════

  feedbackForm?.addEventListener('submit', e => {
    e.preventDefault();
    feedbackForm.querySelector('button[type="submit"]').classList.add('hidden');
    feedbackForm.querySelectorAll('input, textarea').forEach(el => el.classList.add('hidden'));
    fbSuccess.classList.remove('hidden');
    setTimeout(() => {
      feedbackForm.reset();
      fbSuccess.classList.add('hidden');
      feedbackForm.querySelector('button[type="submit"]').classList.remove('hidden');
      feedbackForm.querySelectorAll('input, textarea').forEach(el => el.classList.remove('hidden'));
    }, 3000);
  });

});
