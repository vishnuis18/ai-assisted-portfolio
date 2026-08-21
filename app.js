/* ==========================================================================
   Vishnu I S - Interactive Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initCart();
  initPortfolioFilter();
  initFAQAccordion();
  initTestimonialSlider();
  initContactModal();
  initEmailCopy();
  initMobileMenu();
});

/* --------------------------------------------------------------------------
   1. Live Real-time Clock
   -------------------------------------------------------------------------- */
function initClock() {
  const clockElement = document.getElementById('live-clock');
  if (!clockElement) return;

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // convert 0 to 12
    const formattedHours = String(hours).padStart(2, '0');

    clockElement.textContent = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   2. Slide-out Cart Drawer & State
   -------------------------------------------------------------------------- */
let cartItems = [
  { id: 1, title: 'UI/UX Design System Pro', price: 49.00, qty: 1, img: 'https://cdn.prod.website-files.com/6a66846f0cadf499c1e9f1f6/6a7944fad6588f0a2938f9b5_688b597b7eec039af97525bc_Project%20Image%2003.avif' }
];

function initCart() {
  const cartBtn = document.getElementById('cart-trigger');
  const cartDrawer = document.getElementById('cart-drawer-overlay');
  const closeCartBtn = document.getElementById('close-cart');
  const cartBody = document.getElementById('cart-items-body');
  const cartCountBadges = document.querySelectorAll('.cart-count');
  const subtotalElement = document.getElementById('cart-subtotal');

  if (cartBtn && cartDrawer) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cartDrawer.classList.add('open');
    });

    closeCartBtn?.addEventListener('click', () => {
      cartDrawer.classList.remove('open');
    });

    cartDrawer.addEventListener('click', (e) => {
      if (e.target === cartDrawer) {
        cartDrawer.classList.remove('open');
      }
    });
  }

  window.addToCart = function(title, price, img) {
    const existing = cartItems.find(item => item.title === title);
    if (existing) {
      existing.qty += 1;
    } else {
      cartItems.push({ id: Date.now(), title, price, qty: 1, img });
    }
    renderCart();
    cartDrawer?.classList.add('open');
    showToast(`Added "${title}" to cart!`);
  };

  window.removeFromCart = function(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    renderCart();
  };

  window.updateQty = function(id, delta) {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        removeFromCart(id);
        return;
      }
    }
    renderCart();
  };

  function renderCart() {
    if (!cartBody) return;
    
    const totalCount = cartItems.reduce((acc, i) => acc + i.qty, 0);
    const subtotal = cartItems.reduce((acc, i) => acc + (i.price * i.qty), 0);

    cartCountBadges.forEach(badge => badge.textContent = totalCount);
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)} USD`;

    if (cartItems.length === 0) {
      cartBody.innerHTML = `
        <div style="text-align: center; color: var(--text-secondary); padding: 40px 0;">
          <p>Your cart is empty.</p>
        </div>
      `;
      return;
    }

    cartBody.innerHTML = cartItems.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.title}" class="cart-item-img" />
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)} USD</div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button onclick="updateQty(${item.id}, -1)" style="color: var(--accent-yellow); font-weight: 700;">-</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${item.id}, 1)" style="color: var(--accent-yellow); font-weight: 700;">+</button>
          <button onclick="removeFromCart(${item.id})" style="color: var(--accent-coral); margin-left: 8px;">✕</button>
        </div>
      </div>
    `).join('');
  }

  renderCart();
}

/* --------------------------------------------------------------------------
   3. Portfolio Filtering Logic
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. FAQ Accordion Toggle
   -------------------------------------------------------------------------- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Testimonials Slider
   -------------------------------------------------------------------------- */
function initTestimonialSlider() {
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  if (cards.length === 0) return;

  let currentIndex = 0;

  function showSlide(index) {
    cards.forEach((card, idx) => {
      card.classList.toggle('active', idx === index);
    });
  }

  prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    showSlide(currentIndex);
  });

  nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length;
    showSlide(currentIndex);
  });

  // Auto-play slider every 6 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % cards.length;
    showSlide(currentIndex);
  }, 6000);
}

/* --------------------------------------------------------------------------
   6. Contact Modal
   -------------------------------------------------------------------------- */
function initContactModal() {
  const modal = document.getElementById('contact-modal');
  const openBtns = document.querySelectorAll('.trigger-contact');
  const closeBtn = document.getElementById('close-modal');
  const form = document.getElementById('modal-contact-form');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal?.classList.add('open');
    });
  });

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('open');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    modal?.classList.remove('open');
    showToast('Thank you! Your message has been received.');
    form.reset();
  });
}

/* --------------------------------------------------------------------------
   7. Email Copy Tooltip & Toast
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const emailBtn = document.getElementById('copy-email-btn');
  if (!emailBtn) return;

  emailBtn.addEventListener('click', () => {
    const email = 'vishnuis@design.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Copied "vishnuis@design.com" to clipboard! 🚀');
    }).catch(() => {
      showToast('Email: vishnuis@design.com');
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* --------------------------------------------------------------------------
   8. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  toggleBtn?.addEventListener('click', () => {
    if (navMenu.style.display === 'flex') {
      navMenu.style.display = 'none';
    } else {
      navMenu.style.display = 'flex';
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '80px';
      navMenu.style.left = '0';
      navMenu.style.width = '100%';
      navMenu.style.background = 'var(--bg-card)';
      navMenu.style.padding = '24px';
      navMenu.style.borderBottom = '1px solid var(--surface-border)';
    }
  });
}
