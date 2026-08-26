/**
 * FurEver Care — AI Chat Assistant Widget Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const triggerBtn = document.getElementById('chat-trigger-btn');
  const chatPanel = document.getElementById('chat-widget-panel');
  const closeBtn = document.getElementById('close-chat-btn');
  const clearBtn = document.getElementById('clear-chat-btn');
  const messagesContainer = document.getElementById('chat-messages-container');
  const typingIndicator = document.getElementById('chat-typing-indicator');
  const chipsContainer = document.getElementById('chat-chips-container');
  const inputForm = document.getElementById('chat-input-form');
  const userInput = document.getElementById('chat-user-input');

  if (!triggerBtn || !chatPanel || !inputForm) return;

  const STORAGE_KEY = 'fureverChatHistory';
  let chatHistory = [];

  const DEFAULT_WELCOME = {
    sender: 'bot',
    text: "Hello! I'm your **FurEver Assistant** 🐾\nAsk me about nutrition, grooming guides, training tips, symptom triage, products, or 24/7 emergency contacts!",
    chips: ['Feeding tips', 'Find a product', 'Emergency contacts', 'Grooming help']
  };

  function loadHistory() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        chatHistory = JSON.parse(saved);
      }
    } catch (e) {
      chatHistory = [];
    }

    if (chatHistory.length === 0) {
      chatHistory = [DEFAULT_WELCOME];
    }
    renderAllMessages();
  }

  function saveHistory() {
    try {
      const trimmed = chatHistory.slice(-40);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {}
  }

  function renderAllMessages() {
    messagesContainer.innerHTML = '';
    chatHistory.forEach(msg => appendMessageUI(msg, false));
    scrollToBottom();
    const lastBot = [...chatHistory].reverse().find(m => m.sender === 'bot');
    renderChips(lastBot?.chips || ['Feeding tips', 'Find a product', 'Emergency contacts', 'Grooming help']);
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }

  function renderChips(chips) {
    chipsContainer.innerHTML = '';
    if (!chips || chips.length === 0) {
      chipsContainer.classList.add('hidden');
      return;
    }
    chipsContainer.classList.remove('hidden');
    chips.forEach(chipText => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'px-3 py-1 bg-slate-100 hover:bg-oceanteal hover:text-white text-slate-600 rounded-full text-[11px] font-bold transition-all shrink-0 border border-slate-200 shadow-sm';
      btn.textContent = chipText;
      btn.addEventListener('click', () => {
        handleUserSend(chipText);
      });
      chipsContainer.appendChild(btn);
    });
  }

  function formatMessageText(text) {
    if (!text) return '';
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<b class="font-bold text-slate-900">$1</b>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
    return formatted;
  }

  function appendMessageUI(msg, animate = true) {
    const wrapper = document.createElement('div');
    wrapper.className = `flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} gap-1.5`;

    const bubble = document.createElement('div');
    if (msg.sender === 'user') {
      bubble.className = 'bg-gradient-to-r from-softcoral to-oceanteal text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-xs sm:text-sm shadow-md max-w-[85%] font-medium leading-relaxed';
      bubble.textContent = msg.text;
    } else {
      bubble.className = 'bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm p-3.5 text-xs sm:text-sm shadow-sm max-w-[90%] leading-relaxed space-y-2';
      bubble.innerHTML = formatMessageText(msg.text);

      if (msg.products && msg.products.length > 0) {
        const prodGrid = document.createElement('div');
        prodGrid.className = 'mt-2.5 space-y-2 pt-2 border-t border-slate-100';
        msg.products.forEach(p => {
          const pCard = document.createElement('div');
          pCard.className = 'p-2 rounded-xl bg-creambg/50 border border-slate-200/60 flex items-center justify-between gap-2.5';
          pCard.innerHTML = `
            <div class="flex items-center gap-2">
              <img src="${p.img}" alt="${p.name}" class="w-10 h-10 object-cover rounded-lg bg-white p-0.5 border border-slate-100 shrink-0"/>
              <div>
                <p class="font-bold text-slate-800 text-[11px] leading-tight line-clamp-1">${p.name}</p>
                <p class="text-[10px] font-extrabold text-softcoral">$${p.price.toFixed(2)}</p>
              </div>
            </div>
            <button class="chat-jump-btn px-2.5 py-1 bg-oceanteal text-white text-[10px] font-bold rounded-lg hover:bg-oceanteal/90 transition-all shrink-0" data-tab="products">
              View 🛍️
            </button>
          `;
          prodGrid.appendChild(pCard);
        });
        bubble.appendChild(prodGrid);
      }

      if (msg.emergencyData && msg.emergencyData.length > 0) {
        const emerBox = document.createElement('div');
        emerBox.className = 'mt-2 space-y-1.5 pt-2 border-t border-red-100 bg-red-50/50 p-2.5 rounded-xl border';
        msg.emergencyData.slice(0, 2).forEach(c => {
          const item = document.createElement('div');
          item.className = 'flex items-center justify-between text-[11px]';
          item.innerHTML = `
            <div>
              <span class="font-black text-slate-800 block">${c.name}</span>
              <span class="text-[9px] text-slate-400 font-bold">${c.role}</span>
            </div>
            <a href="tel:${c.phone.replace(/[^0-9]/g, '')}" class="font-black text-red-600 bg-white px-2 py-0.5 rounded-md border border-red-200 hover:bg-red-600 hover:text-white transition-colors">${c.phone}</a>
          `;
          emerBox.appendChild(item);
        });
        bubble.appendChild(emerBox);
      }

      if (msg.action) {
        const actBtn = document.createElement('button');
        actBtn.type = 'button';
        actBtn.className = 'w-full mt-2 py-2 px-3 bg-gradient-to-r from-softcoral to-oceanteal text-white text-xs font-bold rounded-xl shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5';
        actBtn.textContent = msg.action.text;
        actBtn.addEventListener('click', () => {
          if (msg.action.isCart) {
            if (typeof window.furEverOpenCart === 'function') {
              window.furEverOpenCart();
            } else {
              const openCartLink = document.getElementById('view-cart-link') || document.getElementById('header-cart-btn');
              if (openCartLink) openCartLink.click();
            }
            toggleChat(false);
          } else if (msg.action.tab) {
            switchAppTab(msg.action.tab, msg.action.subtab);
            toggleChat(false);
          }
        });
        bubble.appendChild(actBtn);
      }
    }

    wrapper.appendChild(bubble);

    wrapper.querySelectorAll('.chat-jump-btn').forEach(b => {
      b.addEventListener('click', () => {
        const tab = b.dataset.tab;
        if (tab) {
          switchAppTab(tab);
          toggleChat(false);
        }
      });
    });

    messagesContainer.appendChild(wrapper);
    if (animate) scrollToBottom();
  }

  function switchAppTab(tabName, subtabName) {
    const targetNav = document.querySelector(`.nav-item[data-tab="${tabName}"]`) || document.querySelector(`.footer-nav-link[data-tab="${tabName}"]`);
    if (targetNav) {
      targetNav.click();
    }
    if (subtabName) {
      setTimeout(() => {
        const targetSub = document.querySelector(`.sub-tab[data-sub="${subtabName}"]`);
        if (targetSub) targetSub.click();
      }, 150);
    }
  }

  async function handleUserSend(rawText) {
    const text = (rawText || userInput.value || '').trim();
    if (!text) return;

    userInput.value = '';
    userInput.focus();

    const userMsg = { sender: 'user', text };
    chatHistory.push(userMsg);
    appendMessageUI(userMsg, true);
    saveHistory();

    typingIndicator.classList.remove('hidden');
    scrollToBottom();

    let botResponse;
    try {
      if (window.FurEverChatEngine && typeof window.FurEverChatEngine.processUserMessage === 'function') {
        botResponse = await window.FurEverChatEngine.processUserMessage(text);
      } else {
        botResponse = {
          text: "I'm always here to help with your pet's feeding, training, health, and supplies!",
          chips: ['Feeding tips', 'Find a product', 'Emergency contacts']
        };
      }
    } catch (err) {
      botResponse = {
        text: "I'm here to assist with pet care guides, product recommendations, and emergency help!",
        chips: ['Feeding tips', 'Find a product', 'Emergency contacts']
      };
    }

    setTimeout(() => {
      typingIndicator.classList.add('hidden');
      const botMsg = {
        sender: 'bot',
        text: botResponse.text,
        products: botResponse.products,
        emergencyData: botResponse.emergencyData,
        action: botResponse.action,
        chips: botResponse.chips
      };
      chatHistory.push(botMsg);
      appendMessageUI(botMsg, true);
      renderChips(botResponse.chips);
      saveHistory();
    }, 450);
  }

  function toggleChat(forceOpen) {
    const isOpen = typeof forceOpen === 'boolean' ? forceOpen : !chatPanel.classList.contains('open');
    if (isOpen) {
      chatPanel.classList.add('open');
      chatPanel.setAttribute('aria-hidden', 'false');
      triggerBtn.classList.remove('chat-idle-pulse');
      setTimeout(() => userInput.focus(), 150);
      scrollToBottom();
    } else {
      chatPanel.classList.remove('open');
      chatPanel.setAttribute('aria-hidden', 'true');
      triggerBtn.classList.add('chat-idle-pulse');
    }
  }

  triggerBtn.addEventListener('click', () => toggleChat());
  closeBtn.addEventListener('click', () => toggleChat(false));

  clearBtn.addEventListener('click', () => {
    chatHistory = [DEFAULT_WELCOME];
    saveHistory();
    renderAllMessages();
  });

  inputForm.addEventListener('submit', e => {
    e.preventDefault();
    handleUserSend();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && chatPanel.classList.contains('open')) {
      toggleChat(false);
    }
  });

  loadHistory();
});
