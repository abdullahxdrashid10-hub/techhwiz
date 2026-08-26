/**
 * FurEver Care — AI Chat Assistant Engine
 * Local intent classifier with safety triage and optional Gemini API fallback.
 */

const GEMINI_API_KEY = localStorage.getItem('furever_gemini_key') || "";

const SITE_DATA = {
  products: [
    { name: 'Premium Chicken Kibble', cat: 'Dog/Cat Food', price: 29.99, badge: 'Best Seller', img: 'assets/Chiken kibble.png', desc: 'High-protein formula with real roasted chicken and brown rice for adult dogs.' },
    { name: 'Organic Salmon Cat Food', cat: 'Dog/Cat Food', price: 24.99, badge: 'Organic', img: 'assets/Salmon cat food.png', desc: 'Grain-free wild salmon recipe packed with omega-3 fatty acids for healthy coats.' },
    { name: 'Crunchy Dental Treats', cat: 'Dog/Cat Food', price: 12.99, badge: 'Vet Approved', img: 'assets/Crunchy dental treats.png', desc: 'Vet-recommended dental sticks that reduce tartar, plaque and freshen breath.' },
    { name: 'Interactive Puzzle Ball', cat: 'Toys', price: 15.99, badge: 'Top Rated', img: 'assets/interactive puzzle ball.png', desc: 'Treat-dispensing interactive puzzle ball that keeps pets mentally stimulated.' },
    { name: 'Tough Braided Chew Rope', cat: 'Toys', price: 11.99, badge: 'Durable', img: 'assets/Tough Braided Chew Rope.png', desc: 'Durable cotton braided rope toy perfect for tug-of-war and gentle chewing.' },
    { name: 'Bamboo Deshedding Brush', cat: 'Grooming Essentials', price: 18.99, badge: 'Eco-Friendly', img: 'assets/Bamboo Deshedding Brush.png', desc: 'Eco-friendly bamboo brush that removes loose undercoat fur without skin irritation.' },
    { name: 'Orthopedic Memory Foam Bed', cat: 'Bedding and Apparel', price: 49.99, badge: 'Top Comfort', img: 'assets/Orthopedic Memory Foam Bed.png', desc: 'Premium memory foam donut bed with ultra-soft cushion for joint support.' },
    { name: 'Daily Multivitamin Chews', cat: 'Health Supplements', price: 22.99, badge: 'Vet Approved', img: 'assets/Daily Multivitamin Chews.png', desc: 'Vet-formulated daily wellness drops and chewables with vitamins A, D, and E.' }
  ],
  emergencyContacts: [
    { name: 'Pet Poison Helpline', phone: '(855) 764-7661', role: '24/7 National Hotline' },
    { name: 'ASPCA Animal Poison Control', phone: '(888) 426-4435', role: 'Toxic Ingestion Center' },
    { name: 'Animal Emergency Rescue', phone: '(555) 911-PETS', role: 'Rapid Transit & Trauma' },
    { name: 'City Animal Hospital', phone: '(555) 456-7890', role: '24/7 ICU & Critical Care' }
  ],
  careGuides: {
    feeding: {
      title: 'Nutrition & Portion Guides',
      puppy: '🍼 Puppies & Kittens (0–12 mo) require 3–4 daily nutrient-dense meals with softened kibble and adequate hydration.',
      adult: '🐕 Adult pets thrive on 2 measured meals/day: 1/2–1 cup for small breeds, 1–2 cups for medium, and 2–3 cups for large breeds.',
      senior: '🐈 Senior pets (7+ yrs) benefit from a 10–15% calorie reduction with added Glucosamine, Omega-3s, and probiotics for joint support.'
    },
    grooming: {
      brushing: '🪮 Regular coat brushing 2–3 times a week distributes natural skin oils, detangles knots, and reduces shedding and hairballs by up to 60%.',
      bathing: '🛁 Use lukewarm water and pet-specific pH-balanced shampoo. Avoid water in the ears and towel dry thoroughly.',
      trimming: '✂️ Trim nails every 3–4 weeks avoiding the pink quick. Keep fur trimmed around paw pads for traction and cleanliness.'
    },
    health: {
      dental: '🦷 Over 80% of pets show signs of dental disease by age 3. Brush teeth weekly with pet-safe paste and offer dental chews.',
      weight: '⚖️ Maintain lean body condition through daily exercise and portion control to protect joints and prevent metabolic issues.',
      parasites: '💊 Administer monthly flea, tick, and heartworm preventatives year-round to protect your companion from vector diseases.'
    },
    training: {
      sitStay: '🎯 Hold a treat above your pet\'s nose and lure backward. As hips touch the floor, mark "Yes!" and reward in short 5-minute sessions.',
      leash: '🦮 Practice loose-leash walking indoors first. Stop whenever the leash pulls taut and reward immediately when slack is restored.',
      house: '🏠 Take your pet outside immediately after naps, meals, and playtime. Praise enthusiastically with treats right after they go outside.'
    }
  }
};

const SYMPTOM_KEYWORDS = [
  'vomit', 'vomiting', 'threw up', 'limp', 'limping', 'bleed', 'bleeding', 'blood',
  'lethargic', 'lethargy', 'weak', 'weakness', 'diarrhea', 'runny stool', 'not eating',
  'refused food', 'no appetite', 'seizure', 'convulsion', 'choking', 'cough', 'coughing',
  'poison', 'toxic', 'chocolate', 'ate raisin', 'ate grape', 'ate lily', 'bitten', 'fever',
  'panting heavily', 'pale gums', 'unconscious', 'crying in pain', 'swollen eye', 'swollen face'
];

const CARE_AND_TOPIC_KEYWORDS = [
  'feed', 'food', 'eat', 'eating', 'meal', 'portion', 'diet', 'kibble', 'salmon', 'chicken',
  'groom', 'bath', 'bathing', 'wash', 'brush', 'brushing', 'nail', 'trim', 'trimming', 'shed', 'shedding', 'fur', 'coat',
  'health', 'weight', 'flea', 'tick', 'parasite', 'oral', 'teeth', 'dental', 'chew',
  'train', 'training', 'sit', 'stay', 'leash', 'potty', 'bark', 'barking', 'bite', 'biting', 'crate', 'puppy', 'kitten', 'dog', 'cat',
  'product', 'products', 'buy', 'shop', 'store', 'treat', 'treats', 'toy', 'toys', 'bed', 'supplement', 'supplements', 'vitamin', 'vitamins',
  'cart', 'checkout', 'vaccin', 'vaccine', 'vaccines', 'shot', 'shots', 'immuniz', 'emergency', 'vet', 'hospital', 'doctor', 'clinic'
];

const GREETING_RESPONSES = [
  "Hello there! 🐾 I'm your FurEver Care Assistant. How can I help you and your furry companion today?",
  "Hey there! 🐾 Ready to explore pet nutrition, grooming tips, training guides, or find products?",
  "Hi! So wonderful to see you! What can I help your companion with today? 🐶🐱"
];

const WELLBEING_RESPONSES = [
  "I'm doing great and always excited to help your furry companion thrive! 🐾 How are you and your pet doing today?",
  "Feeling pawsome and ready to assist with nutrition, grooming, training, or emergency contacts! What's on your mind?",
  "Doing fantastic, thank you! I'm here whenever you need pet advice or supply recommendations. ✨"
];

const FAREWELL_RESPONSES = [
  "You're so welcome! Wishing you and your furry friend a wonderful, happy day! 🐾",
  "Happy to help anytime! Give your companion an extra treat for me. Goodbye! 💛",
  "Anytime! Remember, I'm always right here whenever you need care advice or emergency guidance. 🐾"
];

const FALLBACK_RESPONSES = [
  "Hmm, I didn't quite catch that — try asking about feeding, grooming, symptoms, or products!",
  "I'm not sure about that one! Try asking me about pet diets, training tips, supplies, or 24/7 vet contacts.",
  "Paws for a moment — I didn't get that. Feel free to ask about health tips, nutrition portions, or emergency help!"
];

let lastGreetingIndex = -1;
let lastWellbeingIndex = -1;
let lastFarewellIndex = -1;
let lastFallbackIndex = -1;

function getVariedResponse(pool, lastIndex = -1) {
  let idx;
  do {
    idx = Math.floor(Math.random() * pool.length);
  } while (pool.length > 1 && idx === lastIndex);
  return { text: pool[idx], index: idx };
}

function classifyIntent(rawText) {
  const text = (rawText || '').toLowerCase().trim();
  if (!text) return { intent: 'unrecognized' };

  const matchedSymptom = SYMPTOM_KEYWORDS.find(kw => text.includes(kw));
  if (matchedSymptom) {
    return { intent: 'symptom-mention', match: matchedSymptom };
  }

  if (
    text.includes('who are you') ||
    text.includes('what are you') ||
    text.includes('what can you do') ||
    text.includes('what do you do') ||
    text.includes('tell me about yourself') ||
    text.includes('who made you') ||
    text === 'help' ||
    text === 'help me'
  ) {
    return { intent: 'smalltalk-identity' };
  }

  if (
    text.includes('how are you') ||
    text.includes("how're you") ||
    text.includes('how you doing') ||
    text.includes('how are you doing') ||
    text.includes("how's it going") ||
    text.includes('hows it going') ||
    text.includes('how do you do') ||
    text.includes('how is everything') ||
    text.includes("what's up") ||
    text.includes('whats up') ||
    text.includes('you doing good')
  ) {
    return { intent: 'smalltalk-wellbeing' };
  }

  if (
    text.includes('thank') ||
    text.includes('thx') ||
    text.includes('appreciate it') ||
    text === 'ty' ||
    text.includes('goodbye') ||
    text.includes('bye') ||
    text.includes('see you') ||
    text.includes('cya') ||
    text.includes('have a good day') ||
    text.includes('have a nice day') ||
    text.includes('good night')
  ) {
    return { intent: 'smalltalk-farewell' };
  }

  const greetingPattern = /^(hi|hello|hey|hiya|yo|howdy|sup|greetings|bonjour|holla|good\s*(morning|afternoon|evening))\b/i;
  if (greetingPattern.test(text)) {
    const words = text.split(/\s+/).filter(Boolean);
    const remainder = text.replace(greetingPattern, '').replace(/[^\w\s]/g, ' ').trim();
    const hasTopicKeywords = CARE_AND_TOPIC_KEYWORDS.some(kw => remainder.includes(kw)) || SYMPTOM_KEYWORDS.some(kw => remainder.includes(kw));

    if (words.length <= 5 && !hasTopicKeywords) {
      return { intent: 'smalltalk-greeting' };
    }
  }

  if (text.includes('vaccin') || text.includes('shot') || text.includes('immuniz')) {
    return { intent: 'navigation-help', target: 'petcare', label: 'Vaccination & Health Center' };
  }
  if (text.includes('cart') || text.includes('checkout') || text.includes('basket')) {
    return { intent: 'navigation-help', target: 'cart', label: 'Shopping Cart' };
  }
  if (text.includes('adopt') || text.includes('shelter') || text.includes('rescue') || text.includes('foster')) {
    return { intent: 'navigation-help', target: 'gallery', label: 'Pet Adoption Gallery' };
  }
  if (text.includes('consultation') || text.includes('appointment') || text.includes('book vet') || text.includes('time slot') || text.includes('opd')) {
    return { intent: 'navigation-help', target: 'slots', label: 'Doctor Consultation Booking' };
  }
  if (text.includes('emergency') || text.includes('poison') || text.includes('hotline') || text.includes('vet number') || text.includes('hospital')) {
    return { intent: 'navigation-help', target: 'emergency', label: '24/7 Emergency Directory' };
  }
  if (text.includes('add pet') || text.includes('new pet') || text.includes('switch pet') || text.includes('profile')) {
    return { intent: 'navigation-help', target: 'petcare', label: 'Pet Profile Center' };
  }

  if (text.includes('product') || text.includes('buy') || text.includes('shop') || text.includes('store') ||
      text.includes('food') || text.includes('kibble') || text.includes('treat') || text.includes('toy') ||
      text.includes('brush') || text.includes('bed') || text.includes('supplement') || text.includes('vitamin') ||
      text.includes('itchy') || text.includes('shedding') || text.includes('teeth') || text.includes('dental')) {
    
    let matchedProducts = [];
    if (text.includes('cat') || text.includes('salmon')) {
      matchedProducts.push(SITE_DATA.products[1]);
    } else if (text.includes('dog') || text.includes('chicken') || text.includes('kibble') || text.includes('puppy')) {
      matchedProducts.push(SITE_DATA.products[0]);
    }

    if (text.includes('brush') || text.includes('shed') || text.includes('fur') || text.includes('groom')) {
      matchedProducts.push(SITE_DATA.products[5]);
    }
    if (text.includes('treat') || text.includes('teeth') || text.includes('dental') || text.includes('breath')) {
      matchedProducts.push(SITE_DATA.products[2]);
    }
    if (text.includes('toy') || text.includes('play') || text.includes('puzzle') || text.includes('bored')) {
      matchedProducts.push(SITE_DATA.products[3]);
    }
    if (text.includes('rope') || text.includes('chew') || text.includes('tough')) {
      matchedProducts.push(SITE_DATA.products[4]);
    }
    if (text.includes('bed') || text.includes('sleep') || text.includes('comfort') || text.includes('cushion')) {
      matchedProducts.push(SITE_DATA.products[6]);
    }
    if (text.includes('supplement') || text.includes('vitamin') || text.includes('joint') || text.includes('health') || text.includes('chews')) {
      matchedProducts.push(SITE_DATA.products[7]);
    }

    if (matchedProducts.length === 0) {
      matchedProducts = [SITE_DATA.products[0], SITE_DATA.products[3]];
    }

    return { intent: 'product-need', products: matchedProducts.slice(0, 2) };
  }

  if (text.includes('feed') || text.includes('meal') || text.includes('portion') || text.includes('diet') || text.includes('eat')) {
    return { intent: 'care-question', topic: 'feeding', query: text };
  }
  if (text.includes('groom') || text.includes('bath') || text.includes('wash') || text.includes('brush') || text.includes('nail') || text.includes('trim')) {
    return { intent: 'care-question', topic: 'grooming', query: text };
  }
  if (text.includes('health') || text.includes('weight') || text.includes('flea') || text.includes('tick') || text.includes('parasite') || text.includes('oral')) {
    return { intent: 'care-question', topic: 'health', query: text };
  }
  if (text.includes('train') || text.includes('sit') || text.includes('stay') || text.includes('leash') || text.includes('potty') || text.includes('bark') || text.includes('bite') || text.includes('crate')) {
    return { intent: 'care-question', topic: 'training', query: text };
  }

  return { intent: 'unrecognized' };
}

function buildLocalResponse(classified, rawText) {
  switch (classified.intent) {
    case 'symptom-mention':
      return {
        text: `I understand you're concerned about your pet. Because symptoms like "${classified.match}" can have many underlying causes, **please consult a licensed veterinarian right away for proper diagnosis and care.**`,
        emergencyData: SITE_DATA.emergencyContacts,
        action: { text: '🚨 Open 24/7 Emergency Directory', tab: 'emergency' },
        chips: ['Call Poison Control', 'View Vet Clinics', 'First Aid Tips']
      };

    case 'smalltalk-greeting': {
      const g = getVariedResponse(GREETING_RESPONSES, lastGreetingIndex);
      lastGreetingIndex = g.index;
      return {
        text: g.text,
        chips: ['Feeding tips', 'Find a product', 'Emergency contacts', 'Training advice']
      };
    }

    case 'smalltalk-wellbeing': {
      const w = getVariedResponse(WELLBEING_RESPONSES, lastWellbeingIndex);
      lastWellbeingIndex = w.index;
      return {
        text: w.text,
        chips: ['Feeding tips', 'Find a product', 'Emergency contacts', 'Grooming help']
      };
    }

    case 'smalltalk-farewell': {
      const f = getVariedResponse(FAREWELL_RESPONSES, lastFarewellIndex);
      lastFarewellIndex = f.index;
      return {
        text: f.text,
        chips: ['Feeding tips', 'Find a product', 'Emergency contacts', 'Grooming help']
      };
    }

    case 'smalltalk-identity':
      return {
        text: `I'm your **FurEver Care Assistant**! 🐾 I help you navigate pet nutrition schedules, grooming tips, training guides, product recommendations, and 24/7 veterinary emergency helplines.`,
        chips: ['Feeding tips', 'Find a product', 'Emergency contacts', 'Training advice']
      };

    case 'product-need':
      return {
        text: `Here are hand-picked recommendations from our curated showcase that match what you're looking for:`,
        products: classified.products,
        action: { text: '🛍️ Explore Product Showcase', tab: 'products' },
        chips: ['Open Cart', 'Food & Nutrition', 'Grooming Tools', 'Interactive Toys']
      };

    case 'care-question': {
      const guide = SITE_DATA.careGuides[classified.topic];
      let answer = '';
      if (classified.topic === 'feeding') {
        answer = `${guide.puppy}\n\n${guide.adult}\n\n${guide.senior}`;
      } else if (classified.topic === 'grooming') {
        answer = `${guide.brushing}\n\n${guide.bathing}\n\n${guide.trimming}`;
      } else if (classified.topic === 'health') {
        answer = `${guide.dental}\n\n${guide.weight}\n\n${guide.parasites}`;
      } else if (classified.topic === 'training') {
        answer = `${guide.sitStay}\n\n${guide.leash}\n\n${guide.house}`;
      }
      return {
        text: answer,
        action: { text: `📘 View Complete ${classified.topic.toUpperCase()} Guide`, tab: 'petcare', subtab: classified.topic === 'feeding' ? 'nutrition' : classified.topic },
        chips: ['Feeding Schedule', 'Grooming Tips', 'Health Advice', 'Training Guide']
      };
    }

    case 'navigation-help':
      return {
        text: `I've got you covered! You can jump directly to ${classified.label} using the button below:`,
        action: classified.target === 'cart'
          ? { text: '🛒 Open Shopping Cart Drawer', isCart: true }
          : { text: `👉 Go to ${classified.label}`, tab: classified.target },
        chips: ['Pet Care Guides', 'Product Showcase', 'Emergency Help', 'Add Companion']
      };

    case 'unrecognized':
    default: {
      const fallback = getVariedResponse(FALLBACK_RESPONSES, lastFallbackIndex);
      lastFallbackIndex = fallback.index;
      return {
        text: fallback.text,
        chips: ['Feeding tips', 'Find a product', 'Emergency contacts', 'Grooming help']
      };
    }
  }
}

async function queryGeminiApi(promptText) {
  const apiKey = GEMINI_API_KEY || localStorage.getItem('furever_gemini_key') || '';
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return null;
  }

  const systemInstruction = "You are a friendly pet care assistant for FurEver Care. Only discuss general pet care topics. Never diagnose medical conditions or suggest medications/dosages. If the user describes any symptom or health concern, respond with empathy and firmly redirect them to consult a veterinarian — do not speculate on causes. Keep responses under 3 sentences, warm and conversational tone.";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nUser Question: ${promptText}` }]
          }
        ]
      })
    });

    clearTimeout(timeoutId);
    if (!res.ok) return null;

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply ? reply.trim() : null;
  } catch (err) {
    clearTimeout(timeoutId);
    return null;
  }
}

async function processUserMessage(userInput) {
  const classified = classifyIntent(userInput);

  if (classified.intent !== 'unrecognized') {
    return buildLocalResponse(classified, userInput);
  }

  try {
    const aiText = await queryGeminiApi(userInput);
    if (aiText) {
      return {
        text: aiText,
        chips: ['Feeding tips', 'Find a product', 'Emergency contacts', 'Training advice']
      };
    }
  } catch (e) {}

  return buildLocalResponse(classified, userInput);
}

window.FurEverChatEngine = {
  processUserMessage,
  classifyIntent,
  SITE_DATA
};
