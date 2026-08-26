/**
 * FurEver Care — Veterinary Practice & Clinic Portal Controller
 */
const DATA_CACHE = new Map();
async function loadData(path, fallbackData) {
  if (DATA_CACHE.has(path)) return DATA_CACHE.get(path);
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    DATA_CACHE.set(path, data);
    return data;
  } catch (err) {
    DATA_CACHE.set(path, fallbackData);
    return fallbackData;
  }
}

const FALLBACK_VETS_DATA = [
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    specialization: "Surgery & Emergency Critical Care",
    clinic: "FurEver Central Hospital",
    phone: "+1 (800) 555-0192",
    email: "dr.mitchell@furevercare.org",
    experience: "12 Years",
    img: "assets/vet-clinic.jpg",
    availableSlots: ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"],
    bookedSlots: ["10:00 AM", "01:00 PM", "03:30 PM"]
  },
  {
    id: 2,
    name: "Dr. James Wilson",
    specialization: "Canine Internal Medicine & Nutrition",
    clinic: "Westside Animal Clinic",
    phone: "+1 (800) 555-0144",
    email: "dr.wilson@furevercare.org",
    experience: "9 Years",
    img: "assets/training-coach.jpg",
    availableSlots: ["08:30 AM", "10:30 AM", "01:30 PM", "03:00 PM"],
    bookedSlots: ["09:30 AM", "11:30 AM", "02:30 PM"]
  },
  {
    id: 3,
    name: "Dr. Priya Kapoor",
    specialization: "Feline Wellness & Preventive Care",
    clinic: "Metro Paws Specialty Care",
    phone: "+1 (800) 555-0188",
    email: "dr.kapoor@furevercare.org",
    experience: "8 Years",
    img: "assets/feeding-fresh.jpg",
    availableSlots: ["09:00 AM", "10:00 AM", "02:30 PM", "04:00 PM"],
    bookedSlots: ["11:00 AM", "01:00 PM", "03:00 PM"]
  },
  {
    id: 4,
    name: "Dr. Elena Rostova",
    specialization: "Exotics & Small Mammals (Avian/Rabbits)",
    clinic: "Green Valley Exotic Pet Clinic",
    phone: "+1 (800) 555-0165",
    email: "dr.rostova@furevercare.org",
    experience: "10 Years",
    img: "assets/pet_thumper.jpg",
    availableSlots: ["10:00 AM", "11:30 AM", "03:00 PM"],
    bookedSlots: ["09:00 AM", "01:30 PM", "04:30 PM"]
  }
];

document.addEventListener('DOMContentLoaded', async () => {
  let vets = await loadData('data/vets.json', FALLBACK_VETS_DATA);

  const desktopNav = document.getElementById('desktop-nav');
  const navPill = document.getElementById('nav-pill');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const vetsGrid = document.getElementById('vets-grid');
  const scheduleContainer = document.getElementById('schedule-container');
  const consultForm = document.getElementById('consult-form');
  const consultSuccess = document.getElementById('consult-success');
  const bookConsultBtn = document.getElementById('book-consult-btn');

  function updateNavPill(activeBtn) {
    if (!navPill || !activeBtn || window.innerWidth < 768) return;
    navPill.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    navPill.style.width = `${activeBtn.offsetWidth}px`;
  }

  function switchTab(tabId) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + tabId)?.classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    const activeDesktopBtn = desktopNav?.querySelector(`[data-tab="${tabId}"]`);
    if (activeDesktopBtn) updateNavPill(activeDesktopBtn);

    mobileMenu?.classList.remove('open');
  }

  desktopNav?.addEventListener('click', e => {
    const tab = e.target.closest('[data-tab]');
    if (tab) switchTab(tab.dataset.tab);
  });

  mobileMenu?.addEventListener('click', e => {
    const tab = e.target.closest('[data-tab]');
    if (tab) switchTab(tab.dataset.tab);
  });

  hamburger?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
  });

  bookConsultBtn?.addEventListener('click', () => {
    switchTab('consultations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function renderDoctors() {
    if (!vetsGrid) return;
    vetsGrid.innerHTML = vets.map(v => `
      <div class="bg-white rounded-3xl p-5 border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
        <div class="space-y-4">
          <div class="relative h-48 rounded-2xl overflow-hidden bg-slate-100">
            <img src="${v.img}" alt="${v.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
            <span class="absolute bottom-2.5 left-2.5 bg-white/95 text-oceanteal text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
              ★ ${v.experience} Exp
            </span>
          </div>

          <div>
            <h3 class="font-black text-slate-800 text-lg">${v.name}</h3>
            <p class="text-xs font-bold text-softcoral">${v.specialization}</p>
            <p class="text-xs text-slate-400 mt-1">${v.clinic}</p>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 mt-4 space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>📞 Direct Line:</span>
            <a href="tel:${v.phone.replace(/[^0-9]/g, '')}" class="font-bold text-oceanteal hover:underline">${v.phone}</a>
          </div>
          <button onclick="window.bookWithDoctor('${v.name}')" class="w-full py-2.5 bg-sageaccent/20 hover:bg-oceanteal text-oceanteal hover:text-white rounded-xl text-xs font-black transition-all">
            Book Consultation
          </button>
        </div>
      </div>
    `).join('');
  }

  function renderSchedule() {
    if (!scheduleContainer) return;
    scheduleContainer.innerHTML = vets.map(v => `
      <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-black text-slate-800 text-base">${v.name}</h3>
            <p class="text-xs text-slate-400">${v.clinic}</p>
          </div>
          <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            ● Clinical Practice
          </span>
        </div>

        <div class="space-y-2">
          <p class="text-xs font-black uppercase tracking-wider text-slate-400">Available Slots Today</p>
          <div class="flex flex-wrap gap-2">
            ${v.availableSlots.map(s => `
              <button onclick="window.bookSlot('${v.name}', '${s}')" class="slot-pill px-3 py-1.5 bg-oceanteal/10 hover:bg-oceanteal text-oceanteal hover:text-white text-xs font-bold rounded-xl border border-oceanteal/20">
                ${s}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-xs font-black uppercase tracking-wider text-slate-300">Booked / In Session</p>
          <div class="flex flex-wrap gap-2">
            ${v.bookedSlots.map(s => `
              <span class="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-medium rounded-xl line-through">
                ${s}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  window.bookWithDoctor = function(docName) {
    const select = document.getElementById('c-doctor');
    if (select) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value.includes(docName.split(' ')[1])) {
          select.selectedIndex = i;
          break;
        }
      }
    }
    switchTab('consultations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.bookSlot = function(docName, slot) {
    window.bookWithDoctor(docName);
    const dateInput = document.getElementById('c-date');
    if (dateInput) dateInput.value = `Today ${slot}`;
  };

  consultForm?.addEventListener('submit', e => {
    e.preventDefault();
    consultSuccess?.classList.remove('hidden');
    consultForm.reset();
    setTimeout(() => {
      consultSuccess?.classList.add('hidden');
    }, 5000);
  });

  renderDoctors();
  renderSchedule();

  requestAnimationFrame(() => {
    const activeNav = desktopNav?.querySelector('.nav-tab.active');
    if (activeNav) updateNavPill(activeNav);
  });
});
