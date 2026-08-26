document.addEventListener('DOMContentLoaded', () => {

  const doctorsData = [
    {
      id: 'sarah',
      license: 'VET-101',
      passcode: 'vet123',
      name: 'Dr. Sarah Ahmed',
      spec: 'Small Animal Specialist',
      exp: '8+ Years Experience',
      contact: '(555) 234-5678',
      timing: '09:00 AM — 02:00 PM (Mon — Fri)',
      availableDays: [1, 2, 3, 4, 5],
      availableDaysLabel: 'Monday to Friday',
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80',
      bio: 'Dedicated to clinical warmth and non-stress examinations. Combining gentle handling with advanced diagnostics so every visit is comfortable for both you and your furry companion.',
      quote: '“Every pet deserves to feel safe, understood, and cared for.”',
      stats: { exp: '8+', pets: '1.2K+', rating: '4.9/5', support: '24/7' },
      specialties: [
        { icon: '🐕', title: 'Canine Medicine', desc: 'Breed-specific health screening, cardiac monitoring, and musculoskeletal exams.' },
        { icon: '🐈', title: 'Feline Wellness', desc: 'Stress-free feline visits, renal health assessments, and early metabolic care routines.' },
        { icon: '🩹', title: 'Preventive Care', desc: 'Routine wellness checks, vaccinations, parasite deworming, and early health monitoring.' },
        { icon: '🦷', title: 'Dental Care', desc: 'Ultrasonic scaling, enamel polishing, periodontal therapy, and gingival disease prevention.' },
        { icon: '💉', title: 'Vaccination', desc: 'Rabies, DHPP, FVRCP immunization schedules tailored to your pet’s lifestyle and age.' },
        { icon: '🥗', title: 'Nutrition & Diet', desc: 'Custom dietary planning, hypoallergenic feeding trials, and senior weight management programs.' }
      ],
      slots: [
        { id: 1, time: '09:00 AM - 09:45 AM' },
        { id: 2, time: '10:00 AM - 10:45 AM' },
        { id: 3, time: '11:00 AM - 11:45 AM' },
        { id: 4, time: '12:00 PM - 12:45 PM' },
        { id: 5, time: '01:00 PM - 01:45 PM' }
      ],
      snapshots: {
        rec1: { tabLabel: 'Bruno (Labrador)', header: 'Bruno · Labrador Retriever · 4 Years', microchip: 'Microchip ID: #985-1410-BR', conditionBadge: 'Condition: Atopic Skin Allergy', lastVisit: '18 Aug', condition: 'Allergic Pruritus', treatment: 'Cytopoint Therapy', nextCheckup: '01 Sep' },
        rec2: { tabLabel: 'Milo (Persian)', header: 'Milo · Persian Cat · 3 Years', microchip: 'Microchip ID: #442-9901-ML', conditionBadge: 'Condition: Periodontal Tartar', lastVisit: '22 Aug', condition: 'Dental Calculus', treatment: 'Ultrasonic Scaling', nextCheckup: '15 Oct' },
        rec3: { tabLabel: 'Coco (Parrot)', header: 'Coco · African Grey Parrot · 5 Years', microchip: 'Leg Band ID: #AG-772', conditionBadge: 'Condition: Beak Alignment', lastVisit: '10 Aug', condition: 'Beak Overgrowth', treatment: 'Precision Trimming', nextCheckup: '10 Nov' }
      }
    },
    {
      id: 'marcus',
      license: 'VET-102',
      passcode: 'vet123',
      name: 'Dr. Marcus Vance',
      spec: 'Canine Health & Cardiology',
      exp: '11+ Years Experience',
      contact: '(555) 345-6789',
      timing: '10:00 AM — 04:00 PM (Mon — Sat)',
      availableDays: [1, 2, 3, 4, 5, 6],
      availableDaysLabel: 'Monday to Saturday',
      img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
      bio: 'Specializing in canine cardiology, endurance conditioning, and chronic disease management. Focused on preventive longevity for working dogs and family companions.',
      quote: '“Protecting the unbreakable bond between dogs and their humans.”',
      stats: { exp: '11+', pets: '2.4K+', rating: '5.0/5', support: 'Mon-Sat' },
      specialties: [
        { icon: '🫀', title: 'Cardiology Screening', desc: 'Electrocardiogram (ECG) telemetry and heart murmur staging.' },
        { icon: '🐕', title: 'Canine Geriatrics', desc: 'Arthritis pain management, joint supplement plans, and mobility therapy.' },
        { icon: '🦮', title: 'Working Dog Care', desc: 'Musculoskeletal conditioning and high-performance nutritional regimens.' },
        { icon: '🔬', title: 'Blood Biomarkers', desc: 'Early organ dysfunction screening with rapid diagnostic blood panels.' },
        { icon: '💉', title: 'Booster Protocols', desc: 'Core viral boosters and kennel cough protection programs.' },
        { icon: '🩹', title: 'Wound Care', desc: 'Advanced laser wound healing and trauma recovery bandages.' }
      ],
      slots: [
        { id: 1, time: '10:00 AM - 10:45 AM' },
        { id: 2, time: '11:15 AM - 12:00 PM' },
        { id: 3, time: '12:30 PM - 01:15 PM' },
        { id: 4, time: '02:00 PM - 02:45 PM' },
        { id: 5, time: '03:15 PM - 04:00 PM' }
      ],
      snapshots: {
        rec1: { tabLabel: 'Thor (Rottweiler)', header: 'Thor · Rottweiler · 6 Years', microchip: 'Microchip ID: #774-2109-TH', conditionBadge: 'Condition: Dilated Cardiomyopathy Stage B1', lastVisit: '14 Aug', condition: 'Ventricular Ectopy', treatment: 'Pimobendan Regimen', nextCheckup: '28 Aug' },
        rec2: { tabLabel: 'Bella (Golden)', header: 'Bella · Golden Retriever · 8 Years', microchip: 'Microchip ID: #551-3092-BL', conditionBadge: 'Condition: Osteoarthritis Mobility', lastVisit: '19 Aug', condition: 'Stifle Joint Stiffness', treatment: 'Librela Monoclonal', nextCheckup: '19 Sep' },
        rec3: { tabLabel: 'Zeus (Malinois)', header: 'Zeus · Belgian Malinois · 3 Years', microchip: 'Microchip ID: #889-4401-ZS', conditionBadge: 'Condition: Athletic Stamina Eval', lastVisit: '25 Jul', condition: 'High Endurance Check', treatment: 'Electrolyte Optimizer', nextCheckup: '25 Oct' }
      }
    },
    {
      id: 'elena',
      license: 'VET-103',
      passcode: 'vet123',
      name: 'Dr. Elena Rostova',
      spec: 'Feline Medicine Specialist',
      exp: '7+ Years Experience',
      contact: '(555) 456-7890',
      timing: '11:00 AM — 05:00 PM (Tue — Sun)',
      availableDays: [0, 2, 3, 4, 5, 6],
      availableDaysLabel: 'Tuesday to Sunday (Monday Closed)',
      img: 'https://plus.unsplash.com/premium_photo-1702598773834-be6d566bb57f?q=80&w=687&auto=format&fit=crop',
      bio: 'Certified Cat-Friendly Practitioner creating a whisper-quiet, pheromone-enriched clinic atmosphere to treat cats without stress or trauma.',
      quote: '“Understanding the quiet language of feline wellness.”',
      stats: { exp: '7+', pets: '950+', rating: '4.9/5', support: 'Tue-Sun' },
      specialties: [
        { icon: '🐈', title: 'Feline Internal Care', desc: 'Chronic kidney disease (CKD) staging and endocrine thyroid care.' },
        { icon: '🧘', title: 'Fear-Free Clinics', desc: 'Zero-restraint gentle handling in quiet, feline-only treatment rooms.' },
        { icon: '🦷', title: 'Feline Dental (FORL)', desc: 'Specialized oral resorption treatment and gingival relief.' },
        { icon: '🥗', title: 'Renal Nutrition', desc: 'Hydration therapy formulas and wet-food moisture balancing.' },
        { icon: '💉', title: 'FVRCP & Rabies', desc: 'Non-adjuvant gentle vaccinations designed specifically for cats.' },
        { icon: '🔬', title: 'Urinary Health', desc: 'Feline Lower Urinary Tract Disease (FLUTD) diagnostics and ultrasound.' }
      ],
      slots: [
        { id: 1, time: '11:00 AM - 11:45 AM' },
        { id: 2, time: '12:15 PM - 01:00 PM' },
        { id: 3, time: '01:30 PM - 02:15 PM' },
        { id: 4, time: '03:00 PM - 03:45 PM' },
        { id: 5, time: '04:15 PM - 05:00 PM' }
      ],
      snapshots: {
        rec1: { tabLabel: 'Luna (Persian)', header: 'Luna · Persian Cat · 5 Years', microchip: 'Microchip ID: #610-8821-LN', conditionBadge: 'Condition: CKD Stage 2', lastVisit: '16 Aug', condition: 'Renal Azotemia', treatment: 'Phosphate Binder', nextCheckup: '05 Sep' },
        rec2: { tabLabel: 'Simba (Bengal)', header: 'Simba · Bengal Cat · 2 Years', microchip: 'Microchip ID: #331-5098-SM', conditionBadge: 'Condition: Idiopathic Cystitis', lastVisit: '20 Aug', condition: 'FLUTD Dysuria', treatment: 'Prazosin & Wet Diet', nextCheckup: '02 Sep' },
        rec3: { tabLabel: 'Cleo (Siamese)', header: 'Cleo · Siamese Cat · 9 Years', microchip: 'Microchip ID: #902-1144-CL', conditionBadge: 'Condition: Hyperthyroidism', lastVisit: '11 Aug', condition: 'Elevated T4', treatment: 'Methimazole Gel', nextCheckup: '11 Sep' }
      }
    },
    {
      id: 'james',
      license: 'VET-104',
      passcode: 'vet123',
      name: 'Dr. James Aris',
      spec: 'Critical Care & Emergency Director',
      exp: '12+ Years Experience',
      contact: '(555) 567-8901',
      timing: '24/7 Emergency & ICU Rotation',
      availableDays: [0, 1, 2, 3, 4, 5, 6],
      availableDaysLabel: 'All 7 Days (24/7 Active)',
      img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80',
      bio: 'Overseeing trauma triage, intensive care stabilization, and surgical resuscitation with round-the-clock emergency team readiness.',
      quote: '“When seconds count, precision and calm save lives.”',
      stats: { exp: '12+', pets: '3.1K+', rating: '4.8/5', support: '24/7 ICU' },
      specialties: [
        { icon: '🚨', title: 'Trauma & Triage', desc: 'Emergency shock resuscitation, blood transfusion, and vitals stabilization.' },
        { icon: '🫁', title: 'Oxygen ICU Ward', desc: 'High-flow oxygen therapy for acute respiratory distress patients.' },
        { icon: '🩸', title: 'Toxicology Protocol', desc: 'Poison ingestion antidote administration and rapid GI decontamination.' },
        { icon: '🩹', title: 'Emergency Surgery', desc: 'Immediate gastric torsion (GDV) and hemorrhage repair.' },
        { icon: '🔬', title: 'Stat Blood Gas', desc: 'Immediate electrolyte, lactate, and blood gas analysis within 5 minutes.' },
        { icon: '🩺', title: 'Telemetry ICU', desc: 'Continuous 24-hour cardiac monitoring and arterial pressure tracking.' }
      ],
      slots: [
        { id: 1, time: '08:00 AM - 08:45 AM' },
        { id: 2, time: '10:00 AM - 10:45 AM' },
        { id: 3, time: '01:00 PM - 01:45 PM' },
        { id: 4, time: '04:00 PM - 04:45 PM' },
        { id: 5, time: '06:00 PM - 06:45 PM' }
      ],
      snapshots: {
        rec1: { tabLabel: 'Cooper (Beagle)', header: 'Cooper · Beagle · 2 Years', microchip: 'Microchip ID: #109-3382-CP', conditionBadge: 'Condition: Chocolate Toxicosis', lastVisit: '21 Aug', condition: 'Theobromine Toxicity', treatment: 'Activated Charcoal', nextCheckup: '24 Aug' },
        rec2: { tabLabel: 'Oliver (Tabby)', header: 'Oliver · Domestic Tabby · 4 Years', microchip: 'Microchip ID: #822-1940-OL', conditionBadge: 'Condition: Pneumothorax', lastVisit: '17 Aug', condition: 'Fall Trauma', treatment: 'Thoracocentesis', nextCheckup: '30 Aug' },
        rec3: { tabLabel: 'Rex (Shepherd)', header: 'Rex · German Shepherd · 5 Years', microchip: 'Microchip ID: #701-9922-RX', conditionBadge: 'Condition: Post-GDV Surgery', lastVisit: '12 Aug', condition: 'Gastric Torsion', treatment: 'Gastropexy', nextCheckup: '26 Aug' }
      }
    },
    {
      id: 'priya',
      license: 'VET-105',
      passcode: 'vet123',
      name: 'Dr. Priya Kapoor',
      spec: 'Veterinary Orthopedic Lead',
      exp: '9+ Years Experience',
      contact: '(555) 678-9012',
      timing: '09:00 AM — 03:00 PM (Mon — Thu)',
      availableDays: [1, 2, 3, 4],
      availableDaysLabel: 'Monday to Thursday (Fri-Sun Off)',
      img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=600&auto=format&fit=crop&q=80',
      bio: 'Specialist in bone reconstruction, joint arthroscopy, and post-surgical rehabilitation helping pets run pain-free.',
      quote: '“Restoring movement and joy to every playful step.”',
      stats: { exp: '9+', pets: '1.5K+', rating: '5.0/5', support: 'Mon-Thu' },
      specialties: [
        { icon: '🦴', title: 'Fracture Repair', desc: 'Titanium compression plates and minimally invasive bone pinning.' },
        { icon: '🐕', title: 'Cruciate Ligament (TPLO)', desc: 'Advanced knee stabilization for active dogs with ligament tears.' },
        { icon: '🦵', title: 'Joint Dysplasia', desc: 'Early hip and elbow dysplasia corrective procedures.' },
        { icon: '🌊', title: 'Hydrotherapy Rehab', desc: 'Underwater treadmill recovery programs for muscle rebuilding.' },
        { icon: '🔬', title: 'Radiographic HD', desc: 'High-definition digital skeletal imaging and joint contrast studies.' },
        { icon: '🩹', title: 'Cartilage Therapy', desc: 'Stem-cell and platelet-rich plasma (PRP) joint injections.' }
      ],
      slots: [
        { id: 1, time: '09:00 AM - 09:45 AM' },
        { id: 2, time: '10:30 AM - 11:15 AM' },
        { id: 3, time: '12:00 PM - 12:45 PM' },
        { id: 4, time: '01:30 PM - 02:15 PM' },
        { id: 5, time: '02:30 PM - 03:15 PM' }
      ],
      snapshots: {
        rec1: { tabLabel: 'Shadow (Husky)', header: 'Shadow · Siberian Husky · 3 Years', microchip: 'Microchip ID: #440-8812-SH', conditionBadge: 'Condition: Cranial Cruciate Tear', lastVisit: '15 Aug', condition: 'Stifle Instability', treatment: 'TPLO Plate', nextCheckup: '29 Aug' },
        rec2: { tabLabel: 'Daisy (Golden)', header: 'Daisy · Golden Retriever · 1 Year', microchip: 'Microchip ID: #901-2241-DY', conditionBadge: 'Condition: Hip Dysplasia', lastVisit: '22 Aug', condition: 'Coxofemoral Laxity', treatment: 'JPS Procedure', nextCheckup: '22 Sep' },
        rec3: { tabLabel: 'Jasper (Cat)', header: 'Jasper · Domestic Shorthair · 2 Years', microchip: 'Microchip ID: #219-5501-JS', conditionBadge: 'Condition: Tibial Fracture', lastVisit: '10 Aug', condition: 'Diaphyseal Break', treatment: 'Locking Plate', nextCheckup: '24 Aug' }
      }
    }
  ];

  const allCaseStudies = [
    {
      id: 'cs1',
      title: 'Tibial Plateau Leveling Osteotomy (TPLO)',
      pet: 'Shadow (Siberian Husky, 3Y)',
      doctor: 'Dr. Priya Kapoor',
      dept: 'Orthopedics',
      img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=80',
      symptoms: 'Sudden non-weight bearing left hindlimb lameness after high jump.',
      treatment: 'Cranial cruciate rupture resolved using 3.5mm titanium TPLO locking plate and radial osteotomy.',
      outcome: 'Full bone consolidation at 8 weeks; unassisted athletic running restored.'
    },
    {
      id: 'cs2',
      title: 'Canine Dilated Cardiomyopathy Staging',
      pet: 'Thor (Rottweiler, 6Y)',
      doctor: 'Dr. Marcus Vance',
      dept: 'Cardiology',
      img: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500&auto=format&fit=crop&q=80',
      symptoms: 'Exercise intolerance, nocturnal cough, and systolic heart murmur.',
      treatment: 'Echocardiogram staging, Pimobendan inodilator protocol, and sodium-restricted cardiac diet.',
      outcome: 'Left ventricular dimensions stabilized; full energy and stamina returned.'
    },
    {
      id: 'cs3',
      title: 'Chronic Stage-2 Feline CKD Management',
      pet: 'Luna (Persian Cat, 5Y)',
      doctor: 'Dr. Elena Rostova',
      dept: 'Feline Medicine',
      img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80',
      symptoms: 'Polydipsia, weight loss, serum creatinine elevated at 2.4 mg/dL.',
      treatment: 'Renal wet diet therapy, aluminum hydroxide phosphate binders, and sub-Q hydration.',
      outcome: 'Creatinine stabilized at 1.8 mg/dL; coat vitality and appetite maintained.'
    },
    {
      id: 'cs4',
      title: 'Acute Theobromine Toxicosis Emergency',
      pet: 'Cooper (Beagle, 2Y)',
      doctor: 'Dr. James Aris',
      dept: 'Emergency',
      img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500&auto=format&fit=crop&q=80',
      symptoms: 'Ingestion of 250g dark baking chocolate, muscle tremors, tachycardia.',
      treatment: 'Emergency apomorphine emesis, multiple-dose activated charcoal, IV lipid emulsion.',
      outcome: 'Complete decontamination; discharged in 12 hours with normal heart rhythm.'
    },
    {
      id: 'cs5',
      title: 'Canine Atopic Dermatitis Rehabilitation',
      pet: 'Bruno (Labrador Retriever, 4Y)',
      doctor: 'Dr. Sarah Ahmed',
      dept: 'Dermatology',
      img: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500&auto=format&fit=crop&q=80',
      symptoms: 'Severe erythema, interdigital pruritus, chronic foot-licking.',
      treatment: 'Cytopoint biological monoclonal antibody therapy and hypoallergenic novel-protein diet.',
      outcome: '90% pruritus score reduction within 14 days; skin completely healed.'
    },
    {
      id: 'cs6',
      title: 'Feline Tibial Diaphyseal Fracture Plating',
      pet: 'Jasper (Domestic Shorthair, 2Y)',
      doctor: 'Dr. Priya Kapoor',
      dept: 'Orthopedics',
      img: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&auto=format&fit=crop&q=80',
      symptoms: 'Closed comminuted mid-shaft fracture after fall from balcony.',
      treatment: 'Internal rigid fixation utilizing 2.0mm mini-locking bone plate.',
      outcome: 'Full limb weight-bearing restored with perfect anatomical axial alignment.'
    }
  ];

  let currentDoctor = doctorsData[0];
  let activeSelectedSlot = null;
  let loggedInDoctor = null;

  const desktopNav             = document.getElementById('desktop-nav');
  const navPill                = document.getElementById('nav-pill');
  const mobileMenu             = document.getElementById('mobile-menu');
  const hamburger              = document.getElementById('hamburger');
  const hamburgerIcon          = document.getElementById('hamburger-icon');
  const docSelectorContainer   = document.getElementById('doc-selector-container');
  const specsContainer         = document.getElementById('specs-container');
  const fullSlotsGrid          = document.getElementById('full-slots-grid');
  const upcomingList           = document.getElementById('upcoming-list');
  const pastList               = document.getElementById('past-list');
  const upcomingCount          = document.getElementById('upcoming-count');
  const pastCount              = document.getElementById('past-count');
  const petSnapshotButtons     = document.getElementById('pet-snapshot-buttons');
  const casesDetailedGrid      = document.getElementById('cases-detailed-grid');
  const caseCategoryFilters    = document.getElementById('case-category-filters');
  const bookingModal           = document.getElementById('booking-modal');
  const bookingForm            = document.getElementById('booking-form');
  const closeModal             = document.getElementById('close-modal');
  const heroCtaSlots           = document.getElementById('hero-cta-slots');
  const doctorPortalBtn        = document.getElementById('doctor-portal-btn');
  const docBtnLabel            = document.getElementById('doc-btn-label');
  const doctorAuthModal        = document.getElementById('doctor-auth-modal');
  const closeAuthModal         = document.getElementById('close-auth-modal');
  const vetLoginForm           = document.getElementById('vet-login-form');
  const authLicense            = document.getElementById('auth-license');
  const authPassword           = document.getElementById('auth-password');
  const authError              = document.getElementById('auth-error');
  const doctorSecurePanel      = document.getElementById('doctor-secure-panel');
  const doctorPatientRosterBody= document.getElementById('doctor-patient-roster-body');
  const doctorLoggedTag        = document.getElementById('doctor-logged-tag');
  const joinVetForm            = document.getElementById('join-vet-form');
  const joinSuccess            = document.getElementById('join-success');
  const tickerTrack            = document.getElementById('ticker-track');
  const visitorCount           = document.getElementById('visitor-count');
  const heroStatusDot          = document.getElementById('hero-status-dot');
  const heroVetStatus          = document.getElementById('hero-vet-status');
  const backToTopBtn           = document.getElementById('back-to-top');

  document.querySelectorAll('.demo-fill').forEach(btn => {
    btn.addEventListener('click', () => {
      authLicense.value = btn.dataset.id;
      authPassword.value = btn.dataset.pass;
    });
  });

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

    const activeDesktopBtn = desktopNav.querySelector(`[data-tab="${tabId}"]`);
    if (activeDesktopBtn) updateNavPill(activeDesktopBtn);

    mobileMenu.classList.remove('open');
    hamburgerIcon.style.transform = '';
    setTimeout(initTilt, 50);
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

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburgerIcon.style.transform = open ? 'rotate(90deg)' : '';
  });

  heroCtaSlots?.addEventListener('click', () => {
    switchTab('slots');
  });

  function renderDoctorSelector() {
    docSelectorContainer.innerHTML = '';
    doctorsData.forEach(doc => {
      const btn = document.createElement('button');
      btn.className = `doc-selector-btn ${doc.id === currentDoctor.id ? 'active' : ''}`;
      btn.dataset.id = doc.id;
      btn.innerHTML = `
        <img src="${doc.img}" alt="${doc.name}" class="w-5 h-5 rounded-full object-cover"/>
        <span>${doc.name}</span>
      `;
      docSelectorContainer.appendChild(btn);
    });
  }

  function updateRealTimeAvailabilityBadge(doc) {
    const currentDay = new Date().getDay();
    const isAvailableToday = doc.availableDays.includes(currentDay);

    if (isAvailableToday) {
      heroStatusDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-indicator';
      heroVetStatus.textContent = 'Available Today';
      heroVetStatus.className = 'text-xs font-black text-slate-800';
    } else {
      heroStatusDot.className = 'w-2.5 h-2.5 rounded-full bg-rose-500';
      heroVetStatus.textContent = `Off Today (${doc.availableDaysLabel.split(' ')[0]})`;
      heroVetStatus.className = 'text-xs font-black text-rose-600';
    }
  }

  function setDoctorProfile(doc) {
    currentDoctor = doc;

    const headerVetEl = document.getElementById('header-vet-name');
    if (headerVetEl) headerVetEl.textContent = doc.name;
    document.getElementById('hero-vet-name').textContent = doc.name;
    document.getElementById('hero-vet-spec').textContent = doc.spec;
    document.getElementById('hero-vet-exp').textContent = doc.exp;
    document.getElementById('hero-vet-bio').textContent = doc.bio;
    document.getElementById('hero-vet-contact').textContent = doc.contact;
    document.getElementById('hero-vet-timing').textContent = doc.timing;
    document.getElementById('hero-vet-img').src = doc.img;

    document.getElementById('stat-exp').textContent = doc.stats.exp;
    document.getElementById('stat-pets').textContent = doc.stats.pets;
    document.getElementById('stat-rating').textContent = doc.stats.rating;
    document.getElementById('stat-support').textContent = doc.stats.support;

    document.getElementById('note-quote').textContent = doc.quote;
    document.getElementById('note-author').textContent = doc.name;
    document.getElementById('slots-active-doc-tag').textContent = `${doc.name}'s OPD (${doc.timing})`;

    updateRealTimeAvailabilityBadge(doc);

    specsContainer.innerHTML = '';
    doc.specialties.forEach(s => {
      const card = document.createElement('div');
      card.className = 'spec-card';
      card.innerHTML = `
        <div class="text-3xl mb-2">${s.icon}</div>
        <h3 class="font-bold text-base text-slate-800">${s.title}</h3>
        <p class="spec-desc text-xs text-slate-500 leading-relaxed">${s.desc}</p>
      `;
      specsContainer.appendChild(card);
    });

    renderFullSlots();
    renderDoctorSelector();
    renderDoctorSnapshots(doc);
    renderCaseStudiesGrid('All');
    renderDoctorRoster();
  }

  docSelectorContainer.addEventListener('click', e => {
    const btn = e.target.closest('.doc-selector-btn');
    if (!btn) return;
    const selected = doctorsData.find(d => d.id === btn.dataset.id);
    if (selected) {
      setDoctorProfile(selected);
      showToast(`Switched to ${selected.name} 🩺`);
    }
  });

  function renderFullSlots() {
    fullSlotsGrid.innerHTML = '';
    currentDoctor.slots.forEach(slot => {
      const card = document.createElement('div');
      card.className = 'p-4 rounded-2xl border-2 transition-all bg-white border-slate-100 hover:border-sageaccent shadow-sm flex flex-col justify-between';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-oceanteal">Slot #${slot.id}</span>
            <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sageaccent/20 text-oceanteal">
              Available
            </span>
          </div>
          <p class="font-bold text-slate-800 text-xs sm:text-sm mb-3">${slot.time}</p>
        </div>
        <button data-id="${slot.id}" data-time="${slot.time}" class="book-slot-btn w-full py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-softcoral to-oceanteal text-white hover:scale-[1.02] active:scale-[0.98] shadow-sm transition-all">
          Book Slot 📅
        </button>
      `;
      fullSlotsGrid.appendChild(card);
    });
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.book-slot-btn');
    if (!btn) return;
    activeSelectedSlot = {
      id: parseInt(btn.dataset.id, 10),
      time: btn.dataset.time
    };

    document.getElementById('modal-slot-info').textContent = `${currentDoctor.name} — Slot #${activeSelectedSlot.id} (${activeSelectedSlot.time})`;
    
    const bookDateInput = document.getElementById('book-date');
    const todayStr = new Date().toISOString().split('T')[0];
    bookDateInput.min = todayStr;
    bookDateInput.value = todayStr;

    bookingModal.classList.remove('hidden');
  });

  closeModal.addEventListener('click', () => {
    bookingModal.classList.add('hidden');
    bookingForm.reset();
  });

  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    const owner = document.getElementById('book-owner').value.trim();
    const phone = document.getElementById('book-phone').value.trim();
    const pet = document.getElementById('book-pet').value.trim();
    const dateVal = document.getElementById('book-date').value;
    const reason = document.getElementById('book-reason').value.trim();

    const chosenDateObj = new Date(dateVal + 'T00:00:00');
    const dayOfWeek = chosenDateObj.getDay();

    if (!currentDoctor.availableDays.includes(dayOfWeek)) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      showToast(`⚠️ ${currentDoctor.name} is NOT available on ${dayNames[dayOfWeek]}s! Schedule: ${currentDoctor.availableDaysLabel}`);
      return;
    }

    let allBookings = JSON.parse(localStorage.getItem('fureverAppointments') ?? '[]');
    const isAlreadyBooked = allBookings.some(b => 
      b.doctorId === currentDoctor.id && 
      b.date === dateVal && 
      b.slotTime === activeSelectedSlot.time
    );

    if (isAlreadyBooked) {
      showToast(`⚠️ This slot is already booked for ${dateVal}! Please select another date or time slot.`);
      return;
    }

    const newAppointment = {
      id: Date.now(),
      doctor: currentDoctor.name,
      doctorId: currentDoctor.id,
      slotTime: activeSelectedSlot.time,
      date: dateVal,
      owner: owner,
      phone: phone,
      pet: pet,
      reason: reason,
      token: `TCK-${Math.floor(1000 + Math.random() * 9000)}`
    };

    allBookings.push(newAppointment);
    localStorage.setItem('fureverAppointments', JSON.stringify(allBookings));

    bookingModal.classList.add('hidden');
    bookingForm.reset();
    renderPersonalBookingHistory();
    renderDoctorRoster();
    showToast(`🐾 Appointment Pass Generated! Token: ${newAppointment.token}`);
  });

  function renderPersonalBookingHistory() {
    const allBookings = JSON.parse(localStorage.getItem('fureverAppointments') ?? '[]');
    const today = new Date().toISOString().split('T')[0];

    const upcoming = allBookings.filter(b => b.date >= today);
    const past = allBookings.filter(b => b.date < today);

    upcomingCount.textContent = `${upcoming.length} Scheduled`;
    pastCount.textContent = `${past.length} Completed`;

    upcomingList.innerHTML = '';
    if (upcoming.length === 0) {
      upcomingList.innerHTML = '<p class="text-xs text-slate-400 py-4 text-center">No upcoming appointments scheduled on this device.</p>';
    } else {
      upcoming.forEach(b => {
        const item = document.createElement('div');
        item.className = 'p-3.5 rounded-2xl bg-creambg/50 border border-slate-100 flex items-center justify-between';
        item.innerHTML = `
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-slate-800">${b.pet} (${b.owner})</span>
              <span class="text-[10px] font-bold text-softcoral bg-softcoral/10 px-2 py-0.5 rounded-full">${b.token}</span>
            </div>
            <p class="text-xs text-oceanteal font-semibold mt-0.5">👨‍⚕️ ${b.doctor} · ⏱️ ${b.slotTime} (${b.date})</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Reason: ${b.reason}</p>
          </div>
          <button data-token="${b.token}" data-docid="${b.doctorId}" class="cancel-booking-btn text-xs text-rose-500 hover:underline font-bold">Cancel</button>
        `;
        upcomingList.appendChild(item);
      });
    }

    pastList.innerHTML = '';
    if (past.length === 0) {
      pastList.innerHTML = '<p class="text-xs text-slate-400 py-4 text-center">No past consultations on record.</p>';
    } else {
      past.forEach(b => {
        const item = document.createElement('div');
        item.className = 'p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between opacity-80';
        item.innerHTML = `
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-700">${b.pet}</span>
              <span class="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">Completed</span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">👨‍⚕️ ${b.doctor} · ${b.date}</p>
          </div>
          <span class="text-[11px] font-bold text-sageaccent">✓ Archived</span>
        `;
        pastList.appendChild(item);
      });
    }
  }

  upcomingList.addEventListener('click', e => {
    const btn = e.target.closest('.cancel-booking-btn');
    if (!btn) return;
    
    const token = btn.dataset.token;
    const appointmentDoctorId = btn.dataset.docid;

    if (loggedInDoctor && loggedInDoctor.id !== appointmentDoctorId) {
      showToast(`⛔ Access Denied: You cannot cancel Dr. ${doctorsData.find(d => d.id === appointmentDoctorId)?.name.split(' ')[1]}'s patient appointment.`);
      return;
    }

    let allBookings = JSON.parse(localStorage.getItem('fureverAppointments') ?? '[]');
    allBookings = allBookings.filter(b => b.token !== token);
    localStorage.setItem('fureverAppointments', JSON.stringify(allBookings));
    
    renderPersonalBookingHistory();
    renderDoctorRoster();
    showToast('Appointment cancelled successfully.');
  });

  doctorPatientRosterBody.addEventListener('click', e => {
    const btn = e.target.closest('.doc-cancel-btn');
    if (!btn || !loggedInDoctor) return;

    const token = btn.dataset.token;
    const appointmentDoctorId = btn.dataset.docid;

    if (loggedInDoctor.id !== appointmentDoctorId) {
      showToast('⛔ Security Alert: Unauthorized cancellation attempt.');
      return;
    }

    let allBookings = JSON.parse(localStorage.getItem('fureverAppointments') ?? '[]');
    allBookings = allBookings.filter(b => b.token !== token);
    localStorage.setItem('fureverAppointments', JSON.stringify(allBookings));

    renderPersonalBookingHistory();
    renderDoctorRoster();
    showToast(`Patient consultation (${token}) discharged / cancelled.`);
  });

  doctorPortalBtn.addEventListener('click', () => {
    if (loggedInDoctor) {
      loggedInDoctor = null;
      localStorage.removeItem('fureverVetDoctorAuth');
      doctorSecurePanel.classList.add('hidden');
      docBtnLabel.textContent = 'Doctor Login 🔐';
      showToast('Doctor logged out from confidential view 🚪');
    } else {
      doctorAuthModal.classList.remove('hidden');
    }
  });

  closeAuthModal.addEventListener('click', () => {
    doctorAuthModal.classList.add('hidden');
    authError.classList.add('hidden');
  });

  vetLoginForm.addEventListener('submit', e => {
    e.preventDefault();
    const licenseVal = authLicense.value.trim().toUpperCase();
    const passVal = authPassword.value.trim();

    const matchedDoc = doctorsData.find(d => d.license.toUpperCase() === licenseVal && d.passcode === passVal);

    if (matchedDoc) {
      loggedInDoctor = matchedDoc;
      localStorage.setItem('fureverVetDoctorAuth', JSON.stringify({ docId: matchedDoc.id }));
      doctorAuthModal.classList.add('hidden');
      authError.classList.add('hidden');
      vetLoginForm.reset();
      
      docBtnLabel.textContent = `Logout (${matchedDoc.name.split(' ')[1]}) 🚪`;
      setDoctorProfile(matchedDoc);
      renderDoctorRoster();
      showToast(`Welcome back, ${matchedDoc.name}! Confidential panel unlocked.`);
    } else {
      authError.classList.remove('hidden');
    }
  });

  function renderDoctorRoster() {
    if (!loggedInDoctor) {
      doctorSecurePanel.classList.add('hidden');
      return;
    }

    doctorSecurePanel.classList.remove('hidden');
    doctorLoggedTag.textContent = `Active Doctor: ${loggedInDoctor.name}`;
    
    const allBookings = JSON.parse(localStorage.getItem('fureverAppointments') ?? '[]');
    const myPatients = allBookings.filter(b => b.doctorId === loggedInDoctor.id);

    doctorPatientRosterBody.innerHTML = '';
    if (myPatients.length === 0) {
      doctorPatientRosterBody.innerHTML = `<tr><td colspan="7" class="p-4 text-center text-slate-400">No patient bookings currently registered under your schedule (${loggedInDoctor.name}).</td></tr>`;
    } else {
      myPatients.forEach(b => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-creambg/40 transition-colors';
        tr.innerHTML = `
          <td class="p-3 font-bold text-softcoral">${b.token}</td>
          <td class="p-3 font-bold text-slate-800">${b.owner}</td>
          <td class="p-3 font-bold text-oceanteal">${b.phone || 'N/A'}</td>
          <td class="p-3 font-medium text-slate-700">🐾 ${b.pet}</td>
          <td class="p-3 text-slate-600">${b.slotTime} <br/><span class="text-[10px] text-slate-400">(${b.date})</span></td>
          <td class="p-3 text-slate-500">${b.reason}</td>
          <td class="p-3">
            <button data-token="${b.token}" data-docid="${b.doctorId}" class="doc-cancel-btn text-[11px] font-black text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg transition-colors">
              Cancel
            </button>
          </td>
        `;
        doctorPatientRosterBody.appendChild(tr);
      });
    }
  }

  function renderCaseStudiesGrid(selectedCategory) {
    casesDetailedGrid.innerHTML = '';
    const filtered = selectedCategory === 'All' 
      ? allCaseStudies 
      : allCaseStudies.filter(c => c.dept === selectedCategory);

    filtered.forEach(cs => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-3xl overflow-hidden shadow-md border border-slate-50 flex flex-col justify-between hover:shadow-xl transition-shadow';
      card.innerHTML = `
        <div>
          <div class="h-44 overflow-hidden relative">
            <img src="${cs.img}" alt="${cs.pet}" class="w-full h-full object-cover"/>
            <span class="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-oceanteal text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">${cs.dept}</span>
            <span class="absolute bottom-3 right-3 bg-sageaccent text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">✓ Recovered</span>
          </div>
          <div class="p-5 space-y-2.5">
            <h4 class="font-black text-slate-800 text-base leading-snug">${cs.title}</h4>
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-softcoral">🐾 ${cs.pet}</span>
              <span class="text-slate-400">👨‍⚕️ ${cs.doctor}</span>
            </div>
            <div class="space-y-1.5 text-xs text-slate-600 bg-creambg/40 p-3.5 rounded-2xl">
              <p><b>Diagnosis:</b> ${cs.symptoms}</p>
              <p><b>Procedure:</b> ${cs.treatment}</p>
              <p class="text-sageaccent font-bold"><b>Outcome:</b> ${cs.outcome}</p>
            </div>
          </div>
        </div>
      `;
      casesDetailedGrid.appendChild(card);
    });
  }

  caseCategoryFilters?.addEventListener('click', e => {
    const btn = e.target.closest('.case-filter-btn');
    if (!btn) return;
    caseCategoryFilters.querySelectorAll('.case-filter-btn').forEach(b => {
      b.className = 'case-filter-btn px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-600 border hover:border-softcoral';
    });
    btn.className = 'case-filter-btn px-3.5 py-1.5 rounded-full text-xs font-bold bg-softcoral text-white shadow-sm';
    renderCaseStudiesGrid(btn.dataset.category);
  });

  function renderDoctorSnapshots(doc) {
    petSnapshotButtons.innerHTML = '';
    const keys = Object.keys(doc.snapshots);
    
    keys.forEach((key, index) => {
      const record = doc.snapshots[key];
      const btn = document.createElement('button');
      btn.className = `px-3 py-1 rounded-full text-xs font-bold transition-all ${index === 0 ? 'bg-softcoral text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`;
      btn.dataset.recKey = key;
      btn.textContent = record.tabLabel;
      petSnapshotButtons.appendChild(btn);
    });

    if (keys.length > 0) updateSnapshotDetails(doc.snapshots[keys[0]]);
  }

  function updateSnapshotDetails(data) {
    document.getElementById('snap-name').textContent = data.header;
    document.getElementById('snap-microchip').textContent = data.microchip;
    document.getElementById('snap-condition-badge').textContent = data.conditionBadge;
    document.getElementById('snap-last').textContent = data.lastVisit;
    document.getElementById('snap-cond').textContent = data.condition;
    document.getElementById('snap-treat').textContent = data.treatment;
    document.getElementById('snap-next').textContent = data.nextCheckup;
  }

  petSnapshotButtons.addEventListener('click', e => {
    const btn = e.target.closest('button[data-rec-key]');
    if (!btn) return;
    const key = btn.dataset.recKey;
    const data = currentDoctor.snapshots[key];
    if (!data) return;

    petSnapshotButtons.querySelectorAll('button').forEach(b => b.className = 'px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200');
    btn.className = 'px-3 py-1 rounded-full text-xs font-bold bg-softcoral text-white shadow-sm';
    updateSnapshotDetails(data);
  });

  joinVetForm?.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = joinVetForm.querySelector('button[type="submit"]');
    submitBtn.classList.add('hidden');
    joinVetForm.querySelectorAll('.float-label-wrapper, p').forEach(el => el.classList.add('hidden'));
    joinSuccess.classList.remove('hidden');

    setTimeout(() => {
      joinVetForm.reset();
      joinSuccess.classList.add('hidden');
      submitBtn.classList.remove('hidden');
      joinVetForm.querySelectorAll('.float-label-wrapper, p').forEach(el => el.classList.remove('hidden'));
      showToast('Veterinary partnership application registered!');
    }, 3500);
  });

  function showToast(msg) {
    const el = document.createElement('div');
    el.className = 'toast bg-white rounded-2xl shadow-2xl border border-slate-100 px-5 py-3.5 flex items-center gap-3 max-w-sm';
    el.innerHTML = `<span class="text-sm font-medium text-slate-700">${msg}</span>`;
    document.getElementById('toast-container').appendChild(el);
    setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 300); }, 2800);
  }

  function initTicker() {
    let locationText = '📍 Veterinary Hospital Wing: Active';
    const announcements = [
      '🩺 5 Board-certified specialists on duty today',
      '🐾 Online consultation bookings active with real OPD hours',
      '🩹 Level-1 emergency triage support open 24/7'
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
  }

  function initVisitorCounter() {
    let count = parseInt(localStorage.getItem('fureverVisitors') ?? '0', 10);
    if (visitorCount) visitorCount.textContent = count.toLocaleString();
  }

  document.querySelectorAll('.footer-nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      if (tabId) {
        switchTab(tabId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  const vetNewsletterForm = document.getElementById('vet-newsletter-form');
  const vetNewsletterSuccess = document.getElementById('vet-newsletter-success');
  vetNewsletterForm?.addEventListener('submit', e => {
    e.preventDefault();
    if (vetNewsletterSuccess) {
      vetNewsletterSuccess.classList.remove('hidden');
      vetNewsletterForm.reset();
      showToast('💌 Subscribed to Clinical Bulletin!');
      setTimeout(() => {
        vetNewsletterSuccess.classList.add('hidden');
      }, 4000);
    }
  });

  function initTilt() {
    const canHover = window.matchMedia('(hover: hover)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reducedMotion) return;

    document.querySelectorAll('.spec-card, .journey-step, .case-card, .vet-card').forEach(card => {
      if (card.dataset.tiltInit) return;
      card.dataset.tiltInit = 'true';

      let rAF = null;
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (rAF) cancelAnimationFrame(rAF);
        rAF = requestAnimationFrame(() => {
          const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -4;
          const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4;
          card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        if (rAF) cancelAnimationFrame(rAF);
        card.style.transform = '';
      });
    });
  }

  setDoctorProfile(doctorsData[0]);
  renderPersonalBookingHistory();
  initTicker();
  initVisitorCounter();
  initTilt();

  const initialNavTab = desktopNav?.querySelector('.nav-tab.active');
  if (initialNavTab) {
    updateNavPill(initialNavTab);
    setTimeout(() => updateNavPill(initialNavTab), 50);
    setTimeout(() => updateNavPill(initialNavTab), 250);
  }

  window.addEventListener('resize', () => {
    const currentActive = desktopNav?.querySelector('.nav-tab.active');
    if (currentActive) updateNavPill(currentActive);
  });

  try {
    const savedDocSession = JSON.parse(localStorage.getItem('fureverVetDoctorAuth') ?? 'null');
    if (savedDocSession?.docId) {
      const doc = doctorsData.find(d => d.id === savedDocSession.docId);
      if (doc) {
        loggedInDoctor = doc;
        docBtnLabel.textContent = `Logout (${doc.name.split(' ')[1]}) 🚪`;
        setDoctorProfile(doc);
      }
    }
  } catch (_) {}

  // Handle cross-page / chatbot routing via URL search parameters
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const targetTab = urlParams.get('tab');
    if (targetTab) {
      setTimeout(() => {
        switchTab(targetTab);
      }, 150);
    }
  } catch (_) {}

});