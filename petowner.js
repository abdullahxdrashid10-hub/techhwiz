/**
 * FurEver Care — Pet Owner Portal Controller
 */
async function loadData(path, fallbackData) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('fetch failed');
    return await res.json();
  } catch (err) {
    console.warn(`Could not fetch ${path}, using embedded fallback data (likely running via file:// protocol).`);
    return fallbackData;
  }
}

const FALLBACK_PRODUCTS_DATA = [
  { name:'Premium Chicken Kibble',     cat:'Dog/Cat Food',        price:29.99, badge:'Best Seller',  img:'assets/Chiken kibble.png',                desc:'High-protein formula with real roasted chicken and brown rice for adult dogs.' },
  { name:'Organic Salmon Cat Food',    cat:'Dog/Cat Food',        price:24.99, badge:'Organic',      img:'assets/Salmon cat food.png',              desc:'Grain-free wild salmon recipe packed with omega-3 fatty acids for healthy coats.' },
  { name:'Crunchy Dental Treats',      cat:'Dog/Cat Food',        price:12.99, badge:'Vet Approved', img:'assets/Crunchy dental treats.png',        desc:'Vet-recommended dental sticks that reduce tartar, plaque and freshen breath.' },
  { name:'Interactive Puzzle Ball',    cat:'Toys',                price:15.99, badge:'Top Rated',    img:'assets/interactive puzzle ball.png',         desc:'Treat-dispensing interactive puzzle ball that keeps pets mentally stimulated.' },
  { name:'Tough Braided Chew Rope',    cat:'Toys',                price:11.99, badge:'Durable',      img:'assets/Tough Braided Chew Rope.png',      desc:'Durable cotton braided rope toy perfect for tug-of-war and gentle chewing.' },
  { name:'Bamboo Deshedding Brush',    cat:'Grooming Essentials', price:18.99, badge:'Eco-Friendly', img:'assets/Bamboo Deshedding Brush.png',      desc:'Eco-friendly bamboo brush that removes loose undercoat fur without skin irritation.' },
  { name:'Orthopedic Memory Foam Bed', cat:'Bedding and Apparel', price:49.99, badge:'Top Comfort',  img:'assets/Orthopedic Memory Foam Bed.png',   desc:'Premium memory foam donut bed with ultra-soft cushion for joint support.' },
  { name:'Daily Multivitamin Chews',   cat:'Health Supplements',  price:22.99, badge:'Vet Approved', img:'assets/Daily Multivitamin Chews.png',     desc:'Vet-formulated daily wellness drops and chewables with vitamins A, D, and E.' },
];

let products = [];

document.addEventListener('DOMContentLoaded', async () => {

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

  products = await loadData('data/products.json', FALLBACK_PRODUCTS_DATA);

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
    if (activeBtn.offsetWidth === 0) {
      setTimeout(() => {
        if (activeBtn.offsetWidth > 0) {
          subnavPill.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
          subnavPill.style.width = `${activeBtn.offsetWidth}px`;
        }
      }, 50);
      return;
    }
    subnavPill.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    subnavPill.style.width = `${activeBtn.offsetWidth}px`;
  }

  const speciesSelect = document.getElementById('pet-species');
  speciesSelect?.addEventListener('change', () => {
    speciesSelect.classList.toggle('has-value', speciesSelect.value !== '');
  });

  const newPetSpeciesSelect = document.getElementById('new-pet-species');
  newPetSpeciesSelect?.addEventListener('change', () => {
    newPetSpeciesSelect.classList.toggle('has-value', newPetSpeciesSelect.value !== '');
  });

  /* -------------------------------------------------------------
     🐾 MULTI-PET PROFILE STATE MANAGEMENT
  ------------------------------------------------------------- */
  let pets = [];
  try {
    const savedPets = localStorage.getItem('fureverPets');
    if (savedPets) {
      pets = JSON.parse(savedPets);
    } else {
      const legacyPet = localStorage.getItem('fureverPet');
      if (legacyPet) {
        pets = [JSON.parse(legacyPet)];
        localStorage.setItem('fureverPets', JSON.stringify(pets));
      }
    }
  } catch (_) { pets = []; }

  let activePetIndex = 0;
  try {
    const savedIndex = localStorage.getItem('fureverActivePetIndex');
    if (savedIndex !== null) activePetIndex = Math.min(Math.max(0, parseInt(savedIndex, 10)), Math.max(0, pets.length - 1));
  } catch (_) { activePetIndex = 0; }

  function getActivePet() {
    return pets[activePetIndex] || pets[0] || null;
  }

  function savePets() {
    localStorage.setItem('fureverPets', JSON.stringify(pets));
    localStorage.setItem('fureverActivePetIndex', String(activePetIndex));
    const active = getActivePet();
    if (active) localStorage.setItem('fureverPet', JSON.stringify(active));
  }

  function formatPetAge(pet) {
    if (!pet) return '';
    const unit = pet.ageUnit || 'years';
    if (unit === 'months') {
      return `${pet.age} month${pet.age == 1 ? '' : 's'}`;
    }
    return `${pet.age} year${pet.age == 1 ? '' : 's'}`;
  }

  function getLifeStage(pet) {
    if (!pet) return 'Adult';
    if (pet.ageUnit === 'months' || pet.age <= 1) {
      return pet.species === 'Cat' ? 'Kitten' : (pet.species === 'Dog' ? 'Puppy' : 'Junior');
    }
    if (pet.age >= 8) return 'Senior';
    return 'Adult';
  }

  function renderPetSwitcher() {
    const track = document.getElementById('pet-switcher-track');
    const badge = document.getElementById('pet-count-badge');
    const deleteBtn = document.getElementById('delete-pet-btn');

    if (badge) {
      badge.textContent = `${pets.length} Pet${pets.length === 1 ? '' : 's'} Registered`;
    }

    if (deleteBtn) {
      deleteBtn.classList.toggle('hidden', pets.length <= 1);
    }

    if (!track) return;
    track.innerHTML = '';

    pets.forEach((p, idx) => {
      const isActive = idx === activePetIndex;
      const card = document.createElement('div');
      card.className = `cursor-pointer rounded-2xl p-3.5 border transition-all duration-300 relative group flex items-center gap-3 ${
        isActive 
          ? 'bg-gradient-to-r from-softcoral/10 via-white to-oceanteal/10 border-oceanteal shadow-md ring-2 ring-oceanteal/20' 
          : 'bg-white/70 hover:bg-white border-slate-200/80 hover:border-softcoral/60 hover:shadow-sm'
      }`;
      
      const avatarSrc = speciesAvatar[p.species] ?? 'assets/avatar-dog.jpg';
      const emoji = speciesEmoji[p.species] ?? '🐾';
      const ageStr = formatPetAge(p);

      card.innerHTML = `
        <div class="relative shrink-0">
          <img src="${avatarSrc}" alt="${p.name}" class="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm ${isActive ? 'ring-2 ring-oceanteal' : ''}"/>
          <span class="absolute -bottom-1 -right-1 text-xs bg-white rounded-full p-0.5 shadow-sm">${emoji}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-1">
            <h4 class="font-extrabold text-xs text-slate-800 truncate">${p.name}</h4>
            ${isActive ? '<span class="text-[9px] font-black uppercase tracking-wider bg-oceanteal text-white px-1.5 py-0.2 rounded-md">Active</span>' : ''}
          </div>
          <p class="text-[11px] text-slate-400 truncate">${p.breed || p.species}</p>
          <p class="text-[10px] font-bold text-slate-500 mt-0.5">${ageStr}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        if (activePetIndex !== idx) {
          activePetIndex = idx;
          savePets();
          const current = getActivePet();
          if (current) {
            showDashboard(current);
            showToast(`🐾 Switched active profile to <b>${current.name}</b>!`);
          }
        }
      });

      track.appendChild(card);
    });
  }

  const defaultVaccines = [
    { id: 1, name: "Rabies Immunization", date: "2024", status: "Completed", clinic: "FurEver Care Clinic" },
    { id: 2, name: "Core DHPP / FVRCP", date: "2024", status: "Completed", clinic: "Community Wellness" },
    { id: 3, name: "Bordetella Booster", date: "Due in 3 months", status: "Due Soon", clinic: "Scheduled" },
    { id: 4, name: "Parasite & Deworming Check", date: "2023", status: "Completed", clinic: "Dr. Evans" }
  ];

  function ensurePetVaccines(pet) {
    if (!pet.vaccines || !Array.isArray(pet.vaccines)) {
      pet.vaccines = JSON.parse(JSON.stringify(defaultVaccines));
    }
  }

  function renderVaccineRecords(pet) {
    ensurePetVaccines(pet);
    const list = document.getElementById('vaccine-records-list');
    const badge = document.getElementById('vaccine-count-badge');
    if (!list) return;

    if (badge) badge.textContent = `${pet.vaccines.length} Logged`;
    list.innerHTML = '';

    if (pet.vaccines.length === 0) {
      list.innerHTML = `
        <div class="text-center py-6 bg-white/60 rounded-xl border border-dashed border-slate-200">
          <p class="text-xs text-slate-400 font-medium">No vaccination records logged yet.</p>
          <button onclick="window.furEverOpenVaccineModal()" class="mt-2 text-xs font-bold text-oceanteal hover:underline">+ Log your pet's first vaccine</button>
        </div>
      `;
      return;
    }

    pet.vaccines.forEach((v, vIdx) => {
      const row = document.createElement('div');
      row.className = 'flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white/85 hover:bg-white border border-slate-100 hover:border-slate-200 shadow-sm transition-all group';

      let statusStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      let statusIcon = '✓';
      if (v.status === 'Due Soon') {
        statusStyle = 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
        statusIcon = '⏳';
      } else if (v.status === 'Scheduled') {
        statusStyle = 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100';
        statusIcon = '📅';
      }

      row.innerHTML = `
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="w-7 h-7 rounded-lg bg-sageaccent/15 text-oceanteal flex items-center justify-center text-xs shrink-0">💉</span>
          <div class="min-w-0">
            <p class="font-bold text-slate-800 truncate">${v.name}</p>
            <p class="text-[11px] text-slate-400 truncate">${v.date} ${v.clinic ? `· ${v.clinic}` : ''}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button class="toggle-vaccine-status px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${statusStyle}" data-index="${vIdx}" title="Click to cycle status (Completed → Due Soon → Scheduled)">
            <span>${statusIcon}</span>
            <span>${v.status}</span>
          </button>
          <button class="delete-vaccine-btn text-slate-300 hover:text-red-500 text-xs p-1 transition-colors" data-index="${vIdx}" title="Remove record">✕</button>
        </div>
      `;

      row.querySelector('.toggle-vaccine-status').addEventListener('click', e => {
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

        if (v.status === 'Completed') v.status = 'Due Soon';
        else if (v.status === 'Due Soon') v.status = 'Scheduled';
        else v.status = 'Completed';

        savePets();
        renderVaccineRecords(pet);
        showToast(`💉 Updated <b>${v.name}</b> status to <b>${v.status}</b>`);
      });

      row.querySelector('.delete-vaccine-btn').addEventListener('click', () => {
        pet.vaccines.splice(vIdx, 1);
        savePets();
        renderVaccineRecords(pet);
        showToast(`🗑️ Removed vaccine record`);
      });

      list.appendChild(row);
    });
  }

  function showDashboard(pet) {
    if (!pet) return;
    ensurePetVaccines(pet);
    petFormSection.style.display = 'none';
    dashboard.classList.remove('hidden');

    const emoji = speciesEmoji[pet.species] ?? '🐾';
    const avatar = speciesAvatar[pet.species] ?? 'assets/avatar-dog.jpg';
    const ageStr = formatPetAge(pet);
    const stage = getLifeStage(pet);

    document.getElementById('header-pet-name').textContent = pet.name;
    document.getElementById('header-pet-icon').textContent = emoji;

    const aboutUserName = document.getElementById('about-user-name');
    if (aboutUserName && user?.name) aboutUserName.textContent = user.name;

    const aboutPetName = document.getElementById('about-pet-name');
    if (aboutPetName) aboutPetName.textContent = pet.name;

    const aboutHeroAvatar = document.getElementById('about-hero-avatar');
    if (aboutHeroAvatar) aboutHeroAvatar.src = avatar;

    const profileImg = document.getElementById('profile-img');
    if (profileImg) profileImg.src = avatar;

    const speciesBadge = document.getElementById('profile-species-badge');
    if (speciesBadge) speciesBadge.textContent = emoji;

    const stageBadge = document.getElementById('profile-stage-badge');
    if (stageBadge) {
      stageBadge.textContent = stage;
      stageBadge.className = `text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
        stage === 'Puppy' || stage === 'Kitten' || stage === 'Junior'
          ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
          : (stage === 'Senior' ? 'bg-purple-50 text-purple-600 border border-purple-200/60' : 'bg-emerald-50 text-emerald-600 border border-emerald-200/60')
      }`;
    }

    document.getElementById('profile-name').textContent = pet.name;
    document.getElementById('profile-sub').textContent = `${pet.breed} · ${ageStr} old`;
    document.getElementById('profile-species').textContent = pet.species;
    document.getElementById('profile-breed').textContent = pet.breed;
    document.getElementById('profile-age').textContent = ageStr;

    const feedbackPetName = document.getElementById('feedback-pet-name');
    if (feedbackPetName) feedbackPetName.textContent = pet.name || 'your companion';

    renderPetSwitcher();
    renderVaccineRecords(pet);
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

  if (pets.length > 0) {
    showDashboard(getActivePet());
  }

  petForm.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = document.getElementById('pet-form-btn');
    const rect = submitBtn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

    const initialPet = {
      id: Date.now(),
      name:    document.getElementById('pet-name').value.trim(),
      species: speciesSelect.value,
      breed:   document.getElementById('pet-breed').value.trim(),
      age:     parseInt(document.getElementById('pet-age').value, 10),
      ageUnit: document.getElementById('pet-age-unit')?.value || 'years',
      vaccines: JSON.parse(JSON.stringify(defaultVaccines))
    };

    pets = [initialPet];
    activePetIndex = 0;
    savePets();
    setTimeout(() => showDashboard(initialPet), 400);
  });

  /* -------------------------------------------------------------
     ➕ ADD PET MODAL & DELETE HANDLERS
  ------------------------------------------------------------- */
  const addPetModal = document.getElementById('add-pet-modal');
  const openAddPetBtn = document.getElementById('open-add-pet-btn');
  const closeAddPetBtn = document.getElementById('close-add-pet-modal-btn');
  const addPetForm = document.getElementById('add-pet-form');
  const deletePetBtn = document.getElementById('delete-pet-btn');

  function openAddModal() {
    if (!addPetModal) return;
    addPetModal.classList.remove('opacity-0', 'pointer-events-none');
    addPetModal.classList.add('opacity-100');
    addPetModal.querySelector('.relative')?.classList.remove('scale-95');
    addPetModal.querySelector('.relative')?.classList.add('scale-100');
    document.body.style.overflow = 'hidden';
    document.getElementById('new-pet-name')?.focus();
  }

  function closeAddModal() {
    if (!addPetModal) return;
    addPetModal.classList.remove('opacity-100');
    addPetModal.classList.add('opacity-0', 'pointer-events-none');
    addPetModal.querySelector('.relative')?.classList.remove('scale-100');
    addPetModal.querySelector('.relative')?.classList.add('scale-95');
    document.body.style.overflow = '';
  }

  openAddPetBtn?.addEventListener('click', e => {
    const rect = openAddPetBtn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    openAddModal();
  });

  closeAddPetBtn?.addEventListener('click', closeAddModal);
  addPetModal?.addEventListener('click', e => {
    if (e.target === addPetModal) closeAddModal();
  });

  addPetForm?.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-new-pet-btn');
    const rect = submitBtn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

    const newPet = {
      id: Date.now(),
      name:    document.getElementById('new-pet-name').value.trim(),
      species: document.getElementById('new-pet-species').value,
      breed:   document.getElementById('new-pet-breed').value.trim(),
      age:     parseInt(document.getElementById('new-pet-age').value, 10),
      ageUnit: document.getElementById('new-pet-age-unit').value,
      vaccines: JSON.parse(JSON.stringify(defaultVaccines))
    };

    pets.push(newPet);
    activePetIndex = pets.length - 1;
    savePets();

    showDashboard(newPet);
    showToast(`🎉 <b>${newPet.name}</b> was added to your FurEver family!`);
    addPetForm.reset();
    newPetSpeciesSelect?.classList.remove('has-value');
    closeAddModal();
  });

  deletePetBtn?.addEventListener('click', () => {
    if (pets.length <= 1) return;
    const current = getActivePet();
    const confirmed = confirm(`Are you sure you want to remove ${current.name} from your pet profiles?`);
    if (!confirmed) return;

    pets.splice(activePetIndex, 1);
    activePetIndex = Math.max(0, activePetIndex - 1);
    savePets();

    const nextPet = getActivePet();
    showDashboard(nextPet);
    showToast(`🗑️ Removed pet profile`);
  });

  /* -------------------------------------------------------------
     💉 ADD VACCINE MODAL HANDLERS
  ------------------------------------------------------------- */
  const addVaccineModal = document.getElementById('add-vaccine-modal');
  const openAddVaccineBtn = document.getElementById('open-add-vaccine-btn');
  const closeAddVaccineBtn = document.getElementById('close-add-vaccine-modal-btn');
  const addVaccineForm = document.getElementById('add-vaccine-form');
  const vaccineModalPetName = document.getElementById('vaccine-modal-pet-name');
  const vaccineChips = document.getElementById('vaccine-quick-chips');

  function openVaccineModal() {
    if (!addVaccineModal) return;
    const current = getActivePet();
    if (vaccineModalPetName && current) {
      vaccineModalPetName.textContent = current.name;
    }
    addVaccineModal.classList.remove('opacity-0', 'pointer-events-none');
    addVaccineModal.classList.add('opacity-100');
    addVaccineModal.querySelector('.relative')?.classList.remove('scale-95');
    addVaccineModal.querySelector('.relative')?.classList.add('scale-100');
    document.body.style.overflow = 'hidden';
    document.getElementById('new-vaccine-name')?.focus();
  }

  function closeVaccineModal() {
    if (!addVaccineModal) return;
    addVaccineModal.classList.remove('opacity-100');
    addVaccineModal.classList.add('opacity-0', 'pointer-events-none');
    addVaccineModal.querySelector('.relative')?.classList.remove('scale-100');
    addVaccineModal.querySelector('.relative')?.classList.add('scale-95');
    document.body.style.overflow = '';
  }

  window.furEverOpenVaccineModal = openVaccineModal;
  openAddVaccineBtn?.addEventListener('click', e => {
    const rect = openAddVaccineBtn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    openVaccineModal();
  });

  closeAddVaccineBtn?.addEventListener('click', closeVaccineModal);
  addVaccineModal?.addEventListener('click', e => {
    if (e.target === addVaccineModal) closeVaccineModal();
  });

  vaccineChips?.addEventListener('click', e => {
    const btn = e.target.closest('button[data-name]');
    if (!btn) return;
    const nameInput = document.getElementById('new-vaccine-name');
    if (nameInput) {
      nameInput.value = btn.dataset.name;
      nameInput.focus();
    }
  });

  addVaccineForm?.addEventListener('submit', e => {
    e.preventDefault();
    const current = getActivePet();
    if (!current) return;

    ensurePetVaccines(current);

    const submitBtn = document.getElementById('submit-new-vaccine-btn');
    const rect = submitBtn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

    const newVaccine = {
      id: Date.now(),
      name: document.getElementById('new-vaccine-name').value.trim(),
      date: document.getElementById('new-vaccine-date').value.trim() || '2026',
      status: document.getElementById('new-vaccine-status').value,
      clinic: document.getElementById('new-vaccine-clinic').value.trim()
    };

    current.vaccines.push(newVaccine);
    savePets();
    renderVaccineRecords(current);
    showToast(`💉 Logged <b>${newVaccine.name}</b> for ${current.name}!`);

    addVaccineForm.reset();
    closeVaccineModal();
  });

  function switchTab(tabId) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + tabId)?.classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    const activeDesktopBtn = desktopNav.querySelector(`[data-tab="${tabId}"]`);
    if (activeDesktopBtn) updateNavPill(activeDesktopBtn);

    if (tabId === 'petcare') {
      const activeSub = document.querySelector('#petcare-sub-nav .sub-tab.active');
      if (activeSub) {
        requestAnimationFrame(() => updateSubNavPill(activeSub));
        setTimeout(() => updateSubNavPill(activeSub), 60);
      }
    }

    mobileMenu.classList.remove('open');
    hamburgerIcon.style.transform = '';

    requestAnimationFrame(() => {
      initTilt();
      initMagnetic();
    });
  }

  desktopNav.addEventListener('click', e => {
    const tab = e.target.closest('[data-tab]');
    if (tab) switchTab(tab.dataset.tab);
  });

  mobileMenu.addEventListener('click', e => {
    const tab = e.target.closest('[data-tab]');
    if (tab) switchTab(tab.dataset.tab);
  });

  document.querySelectorAll('.footer-nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      if (tabId) {
        switchTab(tabId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
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

  const tips = [
    "Regular gentle brushing stimulates natural coat oils and reduces digestive hairballs by up to 60%.",
    "Keep your pet hydrated! Always supply fresh, cool water in multiple accessible locations.",
    "Dental hygiene matters: brushing your pet's teeth 2–3 times a week prevents early gum disease.",
    "Mental stimulation through puzzle toys reduces anxious behavior and boosts canine cognitive health.",
    "Consistent daily walking routines help maintain joint flexibility and prevent pet obesity."
  ];
  let tipIndex = 0;
  const refreshTipBtn = document.getElementById('refresh-tip-btn');
  const dailyTipText = document.getElementById('daily-tip-text');

  refreshTipBtn?.addEventListener('click', e => {
    const rect = refreshTipBtn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    tipIndex = (tipIndex + 1) % tips.length;
    if (dailyTipText) {
      dailyTipText.style.opacity = '0';
      setTimeout(() => {
        dailyTipText.textContent = `"${tips[tipIndex]}"`;
        dailyTipText.style.opacity = '1';
      }, 150);
    }
  });

  let cart = [];
  try {
    const savedCart = localStorage.getItem('fureverCart');
    if (savedCart) cart = JSON.parse(savedCart);
  } catch (_) { cart = []; }

  let appliedDiscount = 0;

  const cartOverlay        = document.getElementById('cart-overlay');
  const cartDrawer         = document.getElementById('cart-drawer');
  const cartBtn            = document.getElementById('cart-btn');
  const closeCartBtn       = document.getElementById('close-cart-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartEmptyView      = document.getElementById('cart-empty-view');
  const cartFooter         = document.getElementById('cart-footer');
  const cartBadge          = document.getElementById('cart-badge');
  const productCartCount   = document.getElementById('product-cart-count');
  const drawerItemCount    = document.getElementById('drawer-item-count');
  const cartSubtotalEl     = document.getElementById('cart-subtotal');
  const cartDiscountEl     = document.getElementById('cart-discount');
  const discountRow        = document.getElementById('discount-row');
  const cartTotalEl        = document.getElementById('cart-total');
  const promoInput         = document.getElementById('promo-input');
  const applyPromoBtn      = document.getElementById('apply-promo-btn');
  const promoStatus        = document.getElementById('promo-status');
  const clearCartBtn       = document.getElementById('clear-cart-btn');
  const cartBrowseBtn      = document.getElementById('cart-browse-btn');
  const viewCartLink       = document.getElementById('view-cart-link');
  const placeOrderDemoBtn  = document.getElementById('place-order-demo-btn');

  function saveCart() {
    localStorage.setItem('fureverCart', JSON.stringify(cart));
    updateCartUI();
  }

  function openCart() {
    cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
    cartOverlay.classList.add('opacity-100');
    cartDrawer.classList.remove('translate-x-full');
    cartDrawer.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
    renderCartItems();
  }

  function closeCart() {
    cartOverlay.classList.remove('opacity-100');
    cartOverlay.classList.add('opacity-0', 'pointer-events-none');
    cartDrawer.classList.remove('translate-x-0');
    cartDrawer.classList.add('translate-x-full');
    document.body.style.overflow = '';
  }

  cartBtn?.addEventListener('click', openCart);
  viewCartLink?.addEventListener('click', openCart);
  closeCartBtn?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);
  cartBrowseBtn?.addEventListener('click', () => {
    closeCart();
    switchTab('products');
  });

  /* -------------------------------------------------------------
     🎬 GROOMING VIDEO PLAYER MODAL CONTROLLER
  ------------------------------------------------------------- */
  const videoModal = document.getElementById('grooming-video-modal');
  const videoFrame = document.getElementById('grooming-video-frame');
  const closeVideoBtn = document.getElementById('close-video-modal-btn');
  const doneVideoBtn = document.getElementById('done-video-btn');
  const videoTitle = document.getElementById('video-modal-title');
  const videoTime = document.getElementById('video-modal-time');
  const videoDesc = document.getElementById('video-modal-desc');

  function openVideoModal(card) {
    if (!videoModal || !card) return;
    const vId = card.dataset.videoId;
    const vTitle = card.dataset.videoTitle || 'Pet Grooming Masterclass';
    const vDesc = card.dataset.videoDesc || '';
    const vTime = card.dataset.videoTime || '';

    if (videoTitle) videoTitle.textContent = vTitle;
    if (videoTime) videoTime.textContent = vTime;
    if (videoDesc) videoDesc.textContent = vDesc;
    if (videoFrame && vId) {
      videoFrame.src = `https://www.youtube.com/embed/${vId}?autoplay=1&rel=0`;
    }

    videoModal.classList.remove('opacity-0', 'pointer-events-none');
    videoModal.classList.add('opacity-100');
    videoModal.querySelector('.relative')?.classList.remove('scale-95');
    videoModal.querySelector('.relative')?.classList.add('scale-100');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove('opacity-100');
    videoModal.classList.add('opacity-0', 'pointer-events-none');
    videoModal.querySelector('.relative')?.classList.remove('scale-100');
    videoModal.querySelector('.relative')?.classList.add('scale-95');
    if (videoFrame) {
      videoFrame.src = '';
    }
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.vid-card').forEach(card => {
    card.addEventListener('click', e => {
      const rect = card.getBoundingClientRect();
      spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
      openVideoModal(card);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openVideoModal(card);
      }
    });
  });

  closeVideoBtn?.addEventListener('click', closeVideoModal);
  doneVideoBtn?.addEventListener('click', closeVideoModal);
  videoModal?.addEventListener('click', e => {
    if (e.target === videoModal) closeVideoModal();
  });

  /* -------------------------------------------------------------
     🎧 INTERACTIVE PET CARE & TRAINING AUDIO PLAYERS
  ------------------------------------------------------------- */
  const audioCards = document.querySelectorAll('.audio-card-container');
  let currentActiveAudio = null;

  function formatAudioTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function stopCurrentAudio() {
    if (!currentActiveAudio) return;
    const { container, audio, timer } = currentActiveAudio;
    clearInterval(timer);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const playIcon = container.querySelector('.play-icon');
    const pauseIcon = container.querySelector('.pause-icon');
    const btn = container.querySelector('.audio-play-btn');
    const badge = container.querySelector('.audio-status-badge');

    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
    if (btn) btn.classList.remove('ring-4', 'ring-softcoral/30', 'animate-pulse');
    if (badge) badge.textContent = 'Click to Listen';

    currentActiveAudio = null;
  }

  audioCards.forEach(container => {
    const playBtn = container.querySelector('.audio-play-btn');
    const playIcon = container.querySelector('.play-icon');
    const pauseIcon = container.querySelector('.pause-icon');
    const audioBar = container.querySelector('.audio-bar');
    const audioFill = container.querySelector('.audio-fill');
    const audioTimeEl = container.querySelector('.audio-time');
    const badge = container.querySelector('.audio-status-badge');
    const src = container.dataset.audioSrc;
    const totalDuration = parseInt(container.dataset.duration || '180', 10);
    const speechText = container.dataset.speech || '';

    let localAudio = new Audio(src);
    localAudio.loop = true;

    function updateProgress(elapsed) {
      const pct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
      if (audioFill) audioFill.style.width = `${pct}%`;
      if (audioTimeEl) audioTimeEl.textContent = `${formatAudioTime(elapsed)} / ${formatAudioTime(totalDuration)}`;
    }

    function togglePlay() {
      const isCurrentlyPlaying = currentActiveAudio && currentActiveAudio.container === container;

      if (isCurrentlyPlaying) {
        stopCurrentAudio();
        showToast('⏸️ Audio guide paused');
        return;
      }

      stopCurrentAudio();

      let elapsed = 0;
      localAudio.currentTime = 0;
      localAudio.volume = 0.4;
      localAudio.play().catch(() => {});

      if ('speechSynthesis' in window && speechText) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(speechText);
        utter.rate = 0.95;
        utter.pitch = 1.05;
        window.speechSynthesis.speak(utter);
      }

      if (playIcon) playIcon.classList.add('hidden');
      if (pauseIcon) pauseIcon.classList.remove('hidden');
      if (playBtn) playBtn.classList.add('ring-4', 'ring-softcoral/30', 'animate-pulse');
      if (badge) badge.textContent = 'Playing Guide…';

      showToast(`🎧 Playing <b>${container.querySelector('p')?.textContent || 'Audio Guide'}</b>`);

      const timer = setInterval(() => {
        elapsed += 1;
        updateProgress(elapsed);
        if (elapsed >= totalDuration) {
          stopCurrentAudio();
          updateProgress(0);
          showToast('✅ Audio guide completed');
        }
      }, 1000);

      currentActiveAudio = {
        container,
        audio: localAudio,
        timer,
        duration: totalDuration,
        get elapsed() { return elapsed; },
        set elapsed(v) { elapsed = v; }
      };
    }

    playBtn?.addEventListener('click', e => {
      e.stopPropagation();
      const rect = playBtn.getBoundingClientRect();
      spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
      togglePlay();
    });

    audioBar?.addEventListener('click', e => {
      const rect = audioBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      const targetSec = Math.floor(pct * totalDuration);

      if (currentActiveAudio && currentActiveAudio.container === container) {
        currentActiveAudio.elapsed = targetSec;
        updateProgress(targetSec);
      } else {
        updateProgress(targetSec);
      }
    });
  });

  /* -------------------------------------------------------------
     📖 TRAINING TIPS EXPANDABLE IN-DEPTH GUIDES
  ------------------------------------------------------------- */
  document.querySelectorAll('.training-expand-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

      const targetId = btn.dataset.target;
      const content = document.getElementById(targetId);
      const icon = btn.querySelector('.expand-icon');
      const text = btn.querySelector('.btn-text');

      if (!content) return;
      const isExpanded = !content.classList.contains('hidden');

      if (isExpanded) {
        content.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
        if (icon) icon.textContent = '▼';
        if (text) text.textContent = 'Read In-Depth Guide';
        btn.classList.remove('bg-slate-100');
      } else {
        content.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
        if (icon) icon.textContent = '▲';
        if (text) text.textContent = 'Hide Detailed Guide';
        btn.classList.add('bg-slate-100');
      }
    });
  });

  /* -------------------------------------------------------------
     🤝 MISSION & PLEDGE MODAL + IN-APP NAVIGATION
  ------------------------------------------------------------- */
  const pledgeModal = document.getElementById('pledge-modal');
  const openPledgeBtn = document.getElementById('open-pledge-modal-btn');
  const closePledgeBtn = document.getElementById('close-pledge-modal-btn');
  const gotItPledgeBtn = document.getElementById('got-it-pledge-btn');

  function openPledge() {
    if (!pledgeModal) return;
    pledgeModal.classList.remove('opacity-0', 'pointer-events-none');
    pledgeModal.classList.add('opacity-100');
    pledgeModal.querySelector('.relative')?.classList.remove('scale-95');
    pledgeModal.querySelector('.relative')?.classList.add('scale-100');
    document.body.style.overflow = 'hidden';
  }

  function closePledge() {
    if (!pledgeModal) return;
    pledgeModal.classList.remove('opacity-100');
    pledgeModal.classList.add('opacity-0', 'pointer-events-none');
    pledgeModal.querySelector('.relative')?.classList.remove('scale-100');
    pledgeModal.querySelector('.relative')?.classList.add('scale-95');
    document.body.style.overflow = '';
  }

  openPledgeBtn?.addEventListener('click', e => {
    const rect = openPledgeBtn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    openPledge();
  });

  closePledgeBtn?.addEventListener('click', closePledge);
  gotItPledgeBtn?.addEventListener('click', () => {
    closePledge();
    showToast('💛 Thank you for supporting our pet welfare pledge!');
  });
  pledgeModal?.addEventListener('click', e => {
    if (e.target === pledgeModal) closePledge();
  });

  document.querySelectorAll('.nav-redirect-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
      const targetTab = btn.dataset.targetTab;
      if (targetTab) {
        switchTab(targetTab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeCart();
      closeAddModal();
      closeVaccineModal();
      closeVideoModal();
      closePledge();
      stopCurrentAudio();
    }
  });

  function addToCart(productName) {
    const prod = products.find(p => p.name === productName);
    if (!prod) return;

    const existing = cart.find(item => item.name === productName);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        name: prod.name,
        cat: prod.cat,
        price: prod.price,
        img: prod.img,
        qty: 1
      });
    }

    saveCart();

    if (cartBadge) {
      cartBadge.classList.remove('animate-bounce');
      void cartBadge.offsetWidth;
      cartBadge.classList.add('animate-bounce');
    }

    showToast(`🛍️ Added <b>${prod.name}</b> to cart! <button onclick="window.furEverOpenCart()" class="underline font-black text-oceanteal ml-2">View Cart</button>`);
  }

  window.furEverOpenCart = openCart;

  function updateQty(name, delta) {
    const item = cart.find(i => i.name === name);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.name !== name);
    }
    saveCart();
    renderCartItems();
  }

  function removeItem(name) {
    cart = cart.filter(i => i.name !== name);
    saveCart();
    renderCartItems();
    showToast(`🗑️ Removed item from cart`);
  }

  clearCartBtn?.addEventListener('click', () => {
    if (cart.length === 0) return;
    cart = [];
    appliedDiscount = 0;
    promoStatus.classList.add('hidden');
    promoInput.value = '';
    saveCart();
    renderCartItems();
    showToast(`🧹 Your cart has been cleared`);
  });

  applyPromoBtn?.addEventListener('click', () => {
    const code = promoInput.value.trim().toUpperCase();
    if (!code) return;

    if (code === 'FUREVER10' || code === 'PETLOVE') {
      appliedDiscount = 0.10;
      promoStatus.textContent = `✓ 10% Discount Applied (${code})!`;
      promoStatus.className = 'text-[11px] font-bold text-emerald-600 block';
      promoInput.classList.remove('animate-shake', 'border-red-400');
      promoInput.classList.add('border-emerald-400');
      showToast('🎉 Promo code applied: 10% OFF your subtotal!');
    } else {
      appliedDiscount = 0;
      promoStatus.textContent = '✕ Invalid promo code. Try FUREVER10 or PETLOVE';
      promoStatus.className = 'text-[11px] font-bold text-red-500 block';
      promoInput.classList.remove('animate-shake');
      void promoInput.offsetWidth;
      promoInput.classList.add('animate-shake', 'border-red-400');
    }
    updateCartUI();
  });

  placeOrderDemoBtn?.addEventListener('click', e => {
    if (cart.length === 0) return;
    const rect = placeOrderDemoBtn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

    showToast('🎉 This is a demo — no real order was placed!');

    placeOrderDemoBtn.disabled = true;
    placeOrderDemoBtn.classList.add('opacity-70');

    setTimeout(() => {
      cart = [];
      appliedDiscount = 0;
      promoInput.value = '';
      promoStatus.classList.add('hidden');
      saveCart();
      renderCartItems();
      placeOrderDemoBtn.disabled = false;
      placeOrderDemoBtn.classList.remove('opacity-70');
      closeCart();
    }, 2400);
  });

  function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = subtotal * appliedDiscount;
    const total = Math.max(0, subtotal - discount);
    return { subtotal, discount, total };
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, i) => sum + i.qty, 0);

    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.classList.toggle('hidden', totalCount === 0);
    }
    if (productCartCount) {
      productCartCount.textContent = totalCount;
    }
    if (drawerItemCount) {
      drawerItemCount.textContent = totalCount;
    }

    const { subtotal, discount, total } = calculateTotals();

    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;

    if (discount > 0) {
      discountRow?.classList.remove('hidden');
      if (cartDiscountEl) cartDiscountEl.textContent = `-$${discount.toFixed(2)}`;
    } else {
      discountRow?.classList.add('hidden');
    }
  }

  function renderCartItems() {
    updateCartUI();

    if (cart.length === 0) {
      cartItemsContainer.classList.add('hidden');
      cartEmptyView.classList.remove('hidden');
      cartFooter.classList.add('hidden');
      return;
    }

    cartItemsContainer.classList.remove('hidden');
    cartEmptyView.classList.add('hidden');
    cartFooter.classList.remove('hidden');

    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'pt-3 pb-1 flex items-center gap-3 group';
      row.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover border border-slate-100 bg-creambg/40 shrink-0"/>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-1">
            <h4 class="text-xs font-bold text-slate-800 truncate">${item.name}</h4>
            <button class="remove-item-btn text-slate-300 hover:text-red-500 transition-colors text-xs p-1" data-name="${item.name}" title="Remove item">✕</button>
          </div>
          <p class="text-[11px] text-slate-400 mb-2">${item.cat} · $${item.price.toFixed(2)}</p>
          <div class="flex items-center justify-between">
            <div class="inline-flex items-center border border-slate-200 rounded-lg bg-slate-50">
              <button class="qty-btn px-2 py-0.5 text-xs font-bold text-slate-600 hover:text-oceanteal hover:bg-slate-200 rounded-l-lg transition-colors" data-name="${item.name}" data-delta="-1">−</button>
              <span class="px-2.5 text-xs font-bold text-slate-800">${item.qty}</span>
              <button class="qty-btn px-2 py-0.5 text-xs font-bold text-slate-600 hover:text-oceanteal hover:bg-slate-200 rounded-r-lg transition-colors" data-name="${item.name}" data-delta="1">+</button>
            </div>
            <span class="text-xs font-black text-oceanteal">$${(item.price * item.qty).toFixed(2)}</span>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(row);
    });

    cartItemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        updateQty(btn.dataset.name, parseInt(btn.dataset.delta, 10));
      });
    });

    cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        removeItem(btn.dataset.name);
      });
    });
  }

  /* -------------------------------------------------------------
     🛍️ PRODUCTS CATALOG RENDERING & BUY ACTIONS
  ------------------------------------------------------------- */
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
      card.className = 'product-card tilt-card animate-card-in flex flex-col justify-between';
      card.style.animationDelay = `${i * 0.05}s`;
      card.innerHTML = `
        <div>
          <div class="h-44 bg-creambg/40 overflow-hidden relative group">
            <img src="${p.img}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <span class="badge-shimmer absolute top-2.5 right-2.5 text-xs font-bold text-softcoral bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full shadow-sm">${p.cat}</span>
            ${p.badge ? `<span class="badge-shimmer absolute top-2.5 left-2.5 text-[10px] font-black tracking-wide uppercase bg-oceanteal text-white px-2 py-0.5 rounded-md shadow-sm">${p.badge}</span>` : ''}
          </div>
          <div class="p-4 pb-2">
            <div class="flex items-center justify-between mb-1.5">
              <h3 class="font-bold text-slate-800 text-sm">${p.name}</h3>
              <span class="text-base font-black text-oceanteal">$${p.price.toFixed(2)}</span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">${p.desc}</p>
          </div>
        </div>
        <div class="p-4 pt-0">
          <button class="buy-btn btn-magnetic w-full py-2.5 rounded-xl font-bold text-xs tracking-wide bg-gradient-to-r from-softcoral to-oceanteal text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-1.5" data-name="${p.name}">
            <span>Add to Cart</span>
            <span>🛒</span>
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
    const rect = buyBtn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    const name = buyBtn.dataset.name || buyBtn.closest('.product-card').querySelector('h3').textContent;
    addToCart(name);
  });

  /* -------------------------------------------------------------
     🔔 FOOTER NEWSLETTER & UTILITIES
  ------------------------------------------------------------- */
  const newsletterForm = document.getElementById('footer-newsletter-form');
  const newsletterSuccess = document.getElementById('newsletter-success');
  const backToTopBtn = document.getElementById('back-to-top');

  newsletterForm?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('button[type="submit"]');
    const rect = btn.getBoundingClientRect();
    spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

    newsletterSuccess.classList.remove('hidden');
    newsletterForm.reset();
    showToast('💌 Thank you for joining the FurEver Pack!');
    setTimeout(() => {
      newsletterSuccess.classList.add('hidden');
    }, 4000);
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function showToast(msg) {
    const el = document.createElement('div');
    el.className = 'toast bg-white rounded-2xl shadow-2xl border border-slate-100 px-5 py-3.5 flex items-center gap-3 max-w-sm';
    el.innerHTML = `<span class="text-sm font-medium text-slate-700">${msg}</span>`;
    document.getElementById('toast-container').appendChild(el);
    setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 300); }, 3200);
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
    if (visitorCount) visitorCount.textContent = count.toLocaleString();
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

  document.querySelectorAll('.gallery-like-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const rect = btn.getBoundingClientRect();
      spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

      const countEl = btn.querySelector('.like-count');
      if (countEl) {
        let count = parseInt(countEl.textContent, 10) || 0;
        count++;
        countEl.textContent = count;
      }
      btn.classList.add('scale-125');
      setTimeout(() => btn.classList.remove('scale-125'), 200);
      showToast('💖 Thanks for loving this FurEver moment!');
    });
  });

  /* -------------------------------------------------------------
     ✨ INTERACTIVE BACKGROUND CONTROLLER (CURSOR GLOW & PARALLAX)
  ------------------------------------------------------------- */
  const cursorGlow = document.getElementById('interactive-cursor-glow');
  const parallaxElements = document.querySelectorAll('.parallax-element');
  let targetMouseX = window.innerWidth / 2;
  let targetMouseY = window.innerHeight / 2;
  let currentMouseX = targetMouseX;
  let currentMouseY = targetMouseY;
  let isMoving = false;

  window.addEventListener('pointermove', e => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
    if (!isMoving && cursorGlow) {
      cursorGlow.style.opacity = '0.75';
      isMoving = true;
    }
  });

  window.addEventListener('pointerleave', () => {
    if (cursorGlow) cursorGlow.style.opacity = '0';
    isMoving = false;
  });

  function renderInteractiveBg() {
    currentMouseX += (targetMouseX - currentMouseX) * 0.1;
    currentMouseY += (targetMouseY - currentMouseY) * 0.1;

    if (cursorGlow) {
      cursorGlow.style.left = `${currentMouseX}px`;
      cursorGlow.style.top = `${currentMouseY}px`;
    }

    const offsetX = (currentMouseX - window.innerWidth / 2);
    const offsetY = (currentMouseY - window.innerHeight / 2);

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.speed || '0.04');
      const x = offsetX * speed;
      const y = offsetY * speed;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    requestAnimationFrame(renderInteractiveBg);
  }
  requestAnimationFrame(renderInteractiveBg);

  updateCartUI();

});

