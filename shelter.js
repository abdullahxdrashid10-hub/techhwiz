/**
 * FurEver Care — Animal Shelter & Adoption Portal Controller
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

const FALLBACK_SHELTER_PETS_DATA = [
  {
    id: 1,
    name: 'Barnaby',
    species: 'Dog',
    breed: 'Golden Retriever Mix',
    age: '2 Years',
    img: 'assets/pet_barnaby.jpg',
    badge: 'Gentle & Social',
    desc: 'A cheerful and affectionate companion who loves chasing tennis balls and offering warm paw shakes. He is fully leash trained, gentle with children, and gets along well with other pets.'
  },
  {
    id: 2,
    name: 'Mochi',
    species: 'Cat',
    breed: 'Calico Shorthair',
    age: '8 Months',
    img: 'assets/pet_mochi.jpg',
    badge: 'Playful Kitten',
    desc: 'An inquisitive little kitten with striking tricolor markings. Mochi loves batting at feather wands and curling up for cozy afternoon naps on warm laps.'
  },
  {
    id: 3,
    name: 'Luna',
    species: 'Dog',
    breed: 'Border Collie',
    age: '1.5 Years',
    img: 'assets/pet_luna.jpg',
    badge: 'Active & Clever',
    desc: 'Smart, athletic, and eager to learn new agility tricks. Luna thrives in active outdoor households that enjoy hiking and interactive problem-solving toys.'
  },
  {
    id: 4,
    name: 'Oliver',
    species: 'Cat',
    breed: 'Domestic Tabby',
    age: '3 Years',
    img: 'assets/pet_oliver.jpg',
    badge: 'Calm & Affectionate',
    desc: 'A quiet, observant cat who enjoys watching birds from high window perches. He enjoys chin scratches and makes a low-stress, soothing household companion.'
  },
  {
    id: 5,
    name: 'Thumper',
    species: 'Rabbit',
    breed: 'Holland Lop',
    age: '1 Year',
    img: 'assets/pet_thumper.jpg',
    badge: 'Litter-Box Trained',
    desc: 'A sweet floppy-eared rabbit with a curious personality. Thumper loves fresh organic romaine lettuce, timothy hay, and doing joyful binkies around carpeted playpens.'
  },
  {
    id: 6,
    name: 'Buster',
    species: 'Dog',
    breed: 'Beagle',
    age: '4 Years',
    img: 'assets/pet_buster.jpg',
    badge: 'Friendly & Food-Motivated',
    desc: 'A soulful hound with gentle eyes and a friendly demeanor. Buster enjoys leisurely neighborhood scent walks followed by long naps on orthopedic dog beds.'
  },
  {
    id: 7,
    name: 'Cocoa',
    species: 'Rabbit',
    breed: 'Mini Rex',
    age: '2 Years',
    img: 'assets/pet_cocoa.jpg',
    badge: 'Velvety Soft',
    desc: 'Incredibly soft and well-behaved rabbit with a quiet temperament. Cocoa is comfortable with gentle handling and enjoys exploring bunny-safe play tunnels.'
  },
  {
    id: 8,
    name: 'Cleo',
    species: 'Cat',
    breed: 'Russian Blue Mix',
    age: '2 Years',
    img: 'assets/pet_cleo.jpg',
    badge: 'Quiet Companion',
    desc: 'Elegant and graceful feline who prefers calm environments. Once she bonds with her guardian, she is devoted, talkative, and extremely affectionate.'
  },
  {
    id: 9,
    name: 'Sunny',
    species: 'Other',
    breed: 'Cockatiel',
    age: '2 Years',
    img: 'assets/pet_sunny.jpg',
    badge: 'Musical & Friendly',
    desc: 'A bright cockatiel who whistles cheerful melodies and enjoys shoulder perching. Sunny is hand-tamed and loves nibbling fresh millet sprays.'
  },
  {
    id: 10,
    name: 'Pip & Peanut',
    species: 'Other',
    breed: 'Bonded Guinea Pigs',
    age: '1 Year',
    img: 'assets/pet_pip_peanut.jpg',
    badge: 'Bonded Pair',
    desc: 'A delightful bonded brother pair looking to be adopted together. They squeak with excitement at bell pepper slices and enjoy cozy fleece hideouts.'
  }
];

const FALLBACK_STORIES_DATA = [
  {
    id: 1,
    petName: 'Bella the Retriever',
    adopter: 'The Miller Family',
    date: 'March 2026',
    img: 'assets/story_bella.jpg',
    story: 'Bella was brought in scared after being found lost during a storm. After two weeks of medical care and socialization, she was adopted by the Millers and is now their devoted trail hiking companion.'
  },
  {
    id: 2,
    petName: 'Milo the Cat',
    adopter: 'Eleanor Vance',
    date: 'January 2026',
    img: 'assets/story_milo.jpg',
    story: 'Milo spent three months rehabilitating from an injured leg at our shelter clinic. Today, he lives peacefully in a sunlit apartment, spending his days purring beside Eleanor while she reads.'
  },
  {
    id: 3,
    petName: 'Daisy the Bunny',
    adopter: 'Sarah & Liam',
    date: 'April 2026',
    img: 'assets/story_daisy.jpg',
    story: 'Rescued from an overcrowded pen, Daisy found her dream home with experienced rabbit caregivers. She has her own free-roam play area and enjoys organic apple treats daily.'
  },
  {
    id: 4,
    petName: 'Rocky the Shepherd Mix',
    adopter: 'Kevin Zhang',
    date: 'May 2026',
    img: 'assets/training-coach.jpg',
    story: 'Rocky had severe kennel anxiety when he first arrived. Thanks to dedicated foster rehabilitation, he gained confidence and is now Kevin’s certified emotional support dog.'
  },
  {
    id: 5,
    petName: 'Simba & Nala (Bonded Pair)',
    adopter: 'The Davis Family',
    date: 'February 2026',
    img: 'assets/avatar-cat.jpg',
    story: 'These inseparable sibling cats were adopted together into a spacious home. They love racing up cat towers and curling into a single purring bundle during evenings.'
  }
];

const FALLBACK_EVENTS_DATA = [
  {
    id: 1,
    name: 'Paws & Hearts Weekend Adoption Fair',
    date: 'Saturday, Sep 12, 2026 · 10:00 AM – 4:00 PM',
    location: 'FurEver Shelter Courtyard · 108 Rescue Way',
    desc: 'Meet over 30 rescue dogs, cats, and small animals ready for immediate adoption. Adoption fees are 50% sponsored by community partners with free starter kits provided.'
  },
  {
    id: 2,
    name: 'Free Community Microchip & Rabies Clinic',
    date: 'Sunday, Sep 27, 2026 · 9:00 AM – 1:00 PM',
    location: 'Green Valley Community Pavilion',
    desc: 'Protect your companion animals with complimentary microchipping and low-cost core vaccinations administered by licensed volunteer veterinarians.'
  },
  {
    id: 3,
    name: 'Foster Guardian & Volunteer Orientation',
    date: 'Saturday, Oct 10, 2026 · 11:00 AM – 1:00 PM',
    location: 'Shelter Training Hall (Room B)',
    desc: 'Discover how temporary fostering saves lives. Learn basic neonatal kitten feeding, rescue dog handling, and shelter event volunteer roles.'
  },
  {
    id: 4,
    name: 'Bark in the Park Charity 5K Walkathon',
    date: 'Sunday, Oct 25, 2026 · 8:30 AM – 12:00 PM',
    location: 'Riverside Park Trailhead',
    desc: 'Bring your dogs for a scenic 5K morning walk to raise critical funds for the shelter medical recovery fund. Includes sponsor booths and pet photo booths.'
  }
];

let petsData = [];
let storiesData = [];
let eventsData = [];

document.addEventListener('DOMContentLoaded', async () => {

  petsData = await loadData('data/shelter-pets.json', FALLBACK_SHELTER_PETS_DATA);
  storiesData = await loadData('data/stories.json', FALLBACK_STORIES_DATA);
  eventsData = await loadData('data/events.json', FALLBACK_EVENTS_DATA);

  const desktopNav        = document.getElementById('desktop-nav');
  const navPill           = document.getElementById('nav-pill');
  const navTabs           = document.querySelectorAll('.nav-tab');
  const tabPanels         = document.querySelectorAll('.tab-panel');
  const hamburger         = document.getElementById('hamburger');
  const mobileMenu        = document.getElementById('mobile-menu');
  const petGrid           = document.getElementById('pet-grid');
  const noPets            = document.getElementById('no-pets');
  const noPetsTitle       = document.getElementById('no-pets-title');
  const noPetsDesc        = document.getElementById('no-pets-desc');
  const petSearch         = document.getElementById('pet-search');
  const filterBtns        = document.querySelectorAll('.filter-btn');
  const favCountBadge     = document.getElementById('fav-count-badge');
  const storiesGrid       = document.getElementById('stories-grid');
  const eventsGrid        = document.getElementById('events-grid');

  const petModal          = document.getElementById('pet-detail-modal');
  const petModalBox       = petModal?.querySelector('div > div');
  const closeModalBtn     = document.getElementById('close-modal-btn');
  const modalContactBtn   = document.getElementById('modal-contact-btn');
  const modalPetImg       = document.getElementById('modal-pet-img');
  const modalPetBadge     = document.getElementById('modal-pet-badge');
  const modalPetName      = document.getElementById('modal-pet-name');
  const modalPetAge       = document.getElementById('modal-pet-age');
  const modalPetSub       = document.getElementById('modal-pet-sub');
  const modalPetDesc      = document.getElementById('modal-pet-desc');
  const modalTraitTags    = document.getElementById('modal-trait-tags');

  let activeFilter = 'All';
  let searchQuery  = '';

  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem('favoritedPets')) || [];
    } catch {
      return [];
    }
  }

  function saveFavorites(favs) {
    localStorage.setItem('favoritedPets', JSON.stringify(favs));
    updateFavoritesBadge();
  }

  function updateFavoritesBadge() {
    const favs = getFavorites();
    if (favCountBadge) {
      favCountBadge.textContent = favs.length;
    }
  }

  function toggleFavorite(petId, favBtn) {
    const favs = getFavorites();
    const index = favs.indexOf(petId);
    const isFav = index > -1;

    if (isFav) {
      favs.splice(index, 1);
    } else {
      favs.push(petId);
    }

    saveFavorites(favs);

    if (favBtn) {
      const nowFav = !isFav;
      favBtn.setAttribute('aria-label', nowFav ? 'Remove from favorites' : 'Add to favorites');
      favBtn.innerHTML = nowFav
        ? '<span class="text-base text-red-500 scale-110 inline-block transition-transform">❤️</span>'
        : '<span class="text-base text-slate-400 group-hover:text-red-400 inline-block transition-transform">🤍</span>';
    }

    if (activeFilter === 'Favorites') {
      renderPets();
    }
  }

  function updateNavPill(activeBtn) {
    if (!navPill || !activeBtn || window.innerWidth < 768) return;
    navPill.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    navPill.style.width = `${activeBtn.offsetWidth}px`;
  }

  function switchTab(tabKey) {
    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabKey}`);
    });

    navTabs.forEach(btn => {
      const match = btn.dataset.tab === tabKey;
      btn.classList.toggle('active', match);
      if (match && btn.closest('#desktop-nav')) {
        updateNavPill(btn);
      }
    });

    if (mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
    }

    if (tabKey === 'stories') {
      observeStoryCards();
    }
  }

  navTabs.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  window.addEventListener('resize', () => {
    const activeBtn = desktopNav?.querySelector('.nav-tab.active');
    if (activeBtn) updateNavPill(activeBtn);
  });

  function deriveTraits(pet) {
    const text = `${pet.badge} ${pet.desc}`.toLowerCase();
    const traits = [];

    if (text.includes('gentle')) traits.push('Gentle');
    if (text.includes('playful') || text.includes('kitten')) traits.push('Playful');
    if (text.includes('social') || text.includes('friendly')) traits.push('Social & Friendly');
    if (text.includes('smart') || text.includes('clever')) traits.push('Smart');
    if (text.includes('active') || text.includes('agility')) traits.push('Active');
    if (text.includes('calm') || text.includes('quiet')) traits.push('Calm');
    if (text.includes('affectionate') || text.includes('cuddles')) traits.push('Affectionate');
    if (text.includes('leash') || text.includes('trained')) traits.push('Trained');
    if (text.includes('children') || text.includes('kids')) traits.push('Great with Kids');
    if (text.includes('bonded')) traits.push('Bonded Pair');
    if (text.includes('musical') || text.includes('whistles')) traits.push('Vocal & Cheerful');

    if (traits.length === 0) traits.push('Loving Companion', 'Health-Checked');
    return traits.slice(0, 4);
  }

  function openPetModal(pet) {
    if (!petModal) return;

    modalPetImg.src = pet.img;
    modalPetImg.alt = pet.name;
    modalPetBadge.textContent = pet.badge;
    modalPetName.textContent = pet.name;
    modalPetAge.textContent = pet.age;
    modalPetSub.textContent = `${pet.breed} · ${pet.species}`;
    modalPetDesc.textContent = pet.desc;

    const traits = deriveTraits(pet);
    modalTraitTags.innerHTML = traits.map(t => `
      <span class="text-xs font-bold text-oceanteal bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
        ✨ ${t}
      </span>
    `).join('');

    petModal.classList.remove('opacity-0', 'pointer-events-none');
    petModal.classList.add('opacity-100', 'pointer-events-auto');
    if (petModalBox) {
      petModalBox.classList.remove('scale-95');
      petModalBox.classList.add('scale-100');
    }
    document.body.style.overflow = 'hidden';
  }

  function closePetModal() {
    if (!petModal) return;

    petModal.classList.add('opacity-0', 'pointer-events-none');
    petModal.classList.remove('opacity-100', 'pointer-events-auto');
    if (petModalBox) {
      petModalBox.classList.add('scale-95');
      petModalBox.classList.remove('scale-100');
    }
    document.body.style.overflow = '';
  }

  closeModalBtn?.addEventListener('click', closePetModal);
  petModal?.addEventListener('click', e => {
    if (e.target === petModal) closePetModal();
  });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && petModal && !petModal.classList.contains('opacity-0')) {
      closePetModal();
    }
  });

  modalContactBtn?.addEventListener('click', () => {
    closePetModal();
    switchTab('contact');
  });

  function debounce(fn, ms = 250) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  function initTilt() {
    const canHover = window.matchMedia('(hover: hover)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reducedMotion) return;

    document.querySelectorAll('.pet-card').forEach(card => {
      if (card.dataset.tiltInit) return;
      card.dataset.tiltInit = 'true';

      let rAF = null;
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (rAF) cancelAnimationFrame(rAF);
        rAF = requestAnimationFrame(() => {
          const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
          const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
          card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        if (rAF) cancelAnimationFrame(rAF);
        card.style.transform = '';
      });
    });
  }

  function renderPets() {
    if (!petGrid) return;

    const favs = getFavorites();

    const filtered = petsData.filter(pet => {
      const isFavorited = favs.includes(pet.id);
      const matchFilter = activeFilter === 'All'
        ? true
        : activeFilter === 'Favorites'
          ? isFavorited
          : pet.species.toLowerCase() === activeFilter.toLowerCase();

      const matchSearch = !searchQuery ||
        pet.name.toLowerCase().includes(searchQuery) ||
        pet.breed.toLowerCase().includes(searchQuery) ||
        pet.desc.toLowerCase().includes(searchQuery);

      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      petGrid.innerHTML = '';
      if (activeFilter === 'Favorites') {
        noPetsTitle.textContent = 'No favorited pets yet ❤️';
        noPetsDesc.textContent = 'Click the heart icon on any pet card to save your favorite companions.';
      } else {
        noPetsTitle.textContent = 'No adoptable pets match your filter';
        noPetsDesc.textContent = 'Try clearing your search query or selecting "All Pets".';
      }
      noPets.classList.remove('hidden');
      return;
    }

    noPets.classList.add('hidden');
    petGrid.innerHTML = filtered.map((pet, index) => {
      const isFav = favs.includes(pet.id);
      return `
        <div class="pet-card tilt-card animate-card-in bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group" style="animation-delay: ${index * 0.04}s;">
          <div>
            <div class="h-48 w-full relative overflow-hidden bg-slate-100">
              <img src="${pet.img}" alt="${pet.name}" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span class="absolute top-3 left-3 bg-white/95 text-oceanteal text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                ${pet.badge}
              </span>
              <button 
                class="fav-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow flex items-center justify-center transition-transform hover:scale-110 active:scale-125 z-10"
                data-id="${pet.id}"
                aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}"
                title="${isFav ? 'Remove from favorites' : 'Save to favorites'}"
              >
                ${isFav
                  ? '<span class="text-base text-red-500 scale-110 inline-block transition-transform">❤️</span>'
                  : '<span class="text-base text-slate-400 group-hover:text-red-400 inline-block transition-transform">🤍</span>'
                }
              </button>
            </div>
            <div class="p-5">
              <div class="flex items-center justify-between gap-2 mb-1">
                <h3 class="font-black text-lg text-slate-800">${pet.name}</h3>
                <span class="text-xs font-bold text-softcoral bg-softcoral/10 px-2 py-0.5 rounded-full">${pet.age}</span>
              </div>
              <p class="text-xs font-bold text-slate-400 mb-3">${pet.breed} · ${pet.species}</p>
              <p class="text-xs text-slate-600 leading-relaxed">${pet.desc}</p>
            </div>
          </div>
          <div class="p-5 pt-0">
            <button class="meet-btn w-full py-2.5 px-4 bg-gradient-to-r from-softcoral to-oceanteal text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5" data-id="${pet.id}">
              <span>Meet ${pet.name}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    petGrid.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id, 10);
        toggleFavorite(id, btn);
      });
    });

    petGrid.querySelectorAll('.meet-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        const pet = petsData.find(p => p.id === id);
        if (pet) openPetModal(pet);
      });
    });

    initTilt();
  }

  function renderStories() {
    if (!storiesGrid) return;

    storiesGrid.innerHTML = storiesData.map(story => `
      <div class="story-card-reveal bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          <div class="h-44 w-full relative overflow-hidden bg-slate-100">
            <img src="${story.img}" alt="${story.petName}" loading="lazy" decoding="async" class="w-full h-full object-cover" />
            <span class="absolute bottom-3 left-3 bg-white/95 text-slate-700 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
              Adopted: ${story.date}
            </span>
          </div>
          <div class="p-5">
            <h3 class="font-black text-base text-slate-800 mb-0.5">${story.petName}</h3>
            <p class="text-xs font-bold text-oceanteal mb-2">Loving Parent: ${story.adopter}</p>
            <p class="text-xs text-slate-600 leading-relaxed">${story.story}</p>
          </div>
        </div>
      </div>
    `).join('');

    observeStoryCards();
  }

  let storyObserver = null;
  function observeStoryCards() {
    const cards = document.querySelectorAll('.story-card-reveal');
    if (!cards.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach(c => c.classList.add('revealed'));
      return;
    }

    if (!storyObserver) {
      storyObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
    }

    cards.forEach(c => storyObserver.observe(c));
  }

  function parseEventDate(dateStr) {
    try {
      const match = dateStr.match(/[A-Za-z]+,\s+([A-Za-z]+\s+\d+,\s+\d{4})/);
      if (match && match[1]) {
        return new Date(match[1]).getTime();
      }
    } catch {
      return Infinity;
    }
    return Infinity;
  }

  function renderEvents() {
    if (!eventsGrid) return;

    let closestId = null;
    let minTime = Infinity;

    eventsData.forEach(event => {
      const t = parseEventDate(event.date);
      if (t < minTime) {
        minTime = t;
        closestId = event.id;
      }
    });

    eventsGrid.innerHTML = eventsData.map(event => {
      const isSoonest = event.id === closestId;
      return `
        <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div>
            <div class="flex items-center justify-between gap-2 flex-wrap mb-3">
              <span class="text-[11px] font-black text-oceanteal bg-teal-50 border border-teal-100 px-3 py-1 rounded-full inline-block">
                📍 ${event.location}
              </span>
              ${isSoonest ? `
                <span class="text-[11px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full inline-flex items-center gap-1.5 pulse-soon shadow-sm">
                  <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  <span>Upcoming Soon</span>
                </span>
              ` : ''}
            </div>
            <h3 class="font-black text-lg text-slate-800 mb-1">${event.name}</h3>
            <p class="text-xs font-bold text-softcoral mb-2">🗓️ ${event.date}</p>
            <p class="text-xs text-slate-600 leading-relaxed">${event.desc}</p>
          </div>
          <div>
            <button class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">
              Event Details / RSVP →
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderPets();
    });
  });

  if (petSearch) {
    petSearch.addEventListener('input', debounce(e => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderPets();
    }, 250));
  }

  updateFavoritesBadge();
  renderPets();
  renderStories();
  renderEvents();

  const mapFrame = document.getElementById('shelter-map-frame');
  const mapFallback = document.getElementById('map-fallback-card');
  if (mapFrame && mapFallback) {
    mapFrame.addEventListener('error', () => {
      mapFrame.classList.add('hidden');
      mapFallback.classList.remove('hidden');
    });
  }

  const initialTab = desktopNav?.querySelector('.nav-tab.active');
  if (initialTab) {
    setTimeout(() => updateNavPill(initialTab), 50);
  }
});
