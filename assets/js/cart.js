/* ==========================================================================
   WhiskerWash — Cart Engine (cart.js)
   Persists cart via localStorage["ww_cart"].
   Injects the cart icon into the header and the drawer into the body.
   Works across all pages — loaded globally by main.js.
   ========================================================================== */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Constants & Helpers
  // --------------------------------------------------------------------------
  const STORAGE_KEY = 'ww_cart';

  /** Read cart array from localStorage */
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  /** Write cart array to localStorage */
  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  /** Total item count (sum of quantities) */
  function totalCount(cart) {
    return cart.reduce((acc, item) => acc + item.qty, 0);
  }

  /** Total price */
  function totalPrice(cart) {
    return cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  }

  /** Format price as "$0.00" */
  function fmt(num) {
    return '$' + parseFloat(num).toFixed(2);
  }

  // --------------------------------------------------------------------------
  // 2. Inject CSS (once)
  // --------------------------------------------------------------------------
  function injectCSS() {
    if (document.getElementById('ww-cart-css')) return;

    // Detect base path (are we in a sub-folder like /products/ or /services/?)
    const isSubDir =
      window.location.pathname.includes('/products/') ||
      window.location.pathname.includes('/services/') ||
      window.location.pathname.includes('/blog/');

    const base = isSubDir ? '../' : '';

    const link = document.createElement('link');
    link.id   = 'ww-cart-css';
    link.rel  = 'stylesheet';
    link.href = base + 'assets/css/cart.css';
    document.head.appendChild(link);
  }

  // --------------------------------------------------------------------------
  // 3. Build & inject DOM (drawer + overlay + header icon)
  // --------------------------------------------------------------------------
  function injectCartDOM() {
    if (document.getElementById('ww-cart-drawer')) return;

    // — Overlay —
    const overlay = document.createElement('div');
    overlay.className   = 'ww_cart_overlay';
    overlay.id          = 'ww-cart-overlay';
    overlay.style.opacity = '0';           // Hide before CSS loads
    overlay.style.pointerEvents = 'none';  // Prevent interaction before CSS loads
    overlay.setAttribute('aria-hidden', 'true');
    overlay.addEventListener('click', closeDrawer);
    document.body.appendChild(overlay);

    // — Drawer —
    const drawer = document.createElement('div');
    drawer.className    = 'ww_cart_drawer';
    drawer.id           = 'ww-cart-drawer';
    drawer.style.transform = 'translateX(100%)';  // Hide immediately before CSS loads
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Shopping cart');
    drawer.innerHTML = `
      <div class="ww_cart_header">
        <div>
          <h2>🐾 Your Cart</h2>
          <p class="ww_cart_header_meta" id="ww-cart-count-label">0 items</p>
        </div>
        <button class="ww_cart_close_btn" id="ww-cart-close" aria-label="Close cart">✕</button>
      </div>
      <div class="ww_cart_body" id="ww-cart-body"></div>
      <div class="ww_cart_footer" id="ww-cart-footer" style="display:none">
        <div class="ww_cart_subtotal_row">
          <p class="ww_cart_subtotal_label">Subtotal</p>
          <p class="ww_cart_subtotal_value" id="ww-cart-subtotal">$0.00</p>
        </div>
        <button class="ww_cart_checkout_btn" id="ww-cart-checkout">
          Checkout ↗
        </button>
        <button class="ww_cart_clear_btn" id="ww-cart-clear">
          Clear cart
        </button>
      </div>
    `;
    document.body.appendChild(drawer);

    // Wire close / clear / checkout
    document.getElementById('ww-cart-close').addEventListener('click', closeDrawer);
    document.getElementById('ww-cart-clear').addEventListener('click', () => {
      saveCart([]);
      renderCartBody();
      updateBadge();
    });
    document.getElementById('ww-cart-checkout').addEventListener('click', () => {
      alert('🐾 Checkout coming soon! For now, contact us to place your order.');
    });

    // — Header cart icon button —
    injectHeaderButton();
  }

  /** Insert the cart icon button next to the dark-mode toggle in the header */
  function injectHeaderButton() {
    if (document.getElementById('ww-cart-icon-btn')) return;

    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return; // header not on this page

    const btn = document.createElement('button');
    btn.className   = 'ww_cart_btn';
    btn.id          = 'ww-cart-icon-btn';
    btn.setAttribute('aria-label', 'Open cart');
    btn.innerHTML   = `<img src="assets/images/shopping-cart.svg"><span class="ww_cart_badge" id="ww-cart-badge"></span>`;
    btn.addEventListener('click', openDrawer);

    // Insert right before the theme toggle
    themeToggle.parentNode.insertBefore(btn, themeToggle);
  }

  // --------------------------------------------------------------------------
  // 4. Render cart body
  // --------------------------------------------------------------------------
  function renderCartBody() {
    const cart       = getCart();
    const body       = document.getElementById('ww-cart-body');
    const footer     = document.getElementById('ww-cart-footer');
    const countLabel = document.getElementById('ww-cart-count-label');
    const subtotal   = document.getElementById('ww-cart-subtotal');

    if (!body) return;

    const count = totalCount(cart);

    if (countLabel) {
      countLabel.textContent = count === 1 ? '1 item' : `${count} items`;
    }

    if (cart.length === 0) {
      if (footer) footer.style.display = 'none';
      body.innerHTML = `
        <div class="ww_cart_empty">
          <div class="ww_cart_empty_icon">🐾</div>
          <h3>Your cart is empty!</h3>
          <p>Add some premium pet products to get started.</p>
          <a href="our-products.html" class="ww_cart_shop_btn">Shop Products ↗</a>
        </div>`;
      return;
    }

    if (footer) footer.style.display = 'flex';
    if (subtotal) subtotal.textContent = fmt(totalPrice(cart));

    body.innerHTML = cart.map(item => `
      <div class="ww_cart_item" data-id="${item.id}">
        <img
          class="ww_cart_item_img"
          src="${item.image}"
          alt="${item.name}"
          onerror="this.style.background='#fde8c0';this.style.objectFit='contain';">
        <div class="ww_cart_item_info">
          <p class="ww_cart_item_name">${item.name}</p>
          <p class="ww_cart_item_price">${fmt(item.price)}</p>
          <div class="ww_cart_qty_row">
            <button class="ww_qty_btn" data-action="dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="ww_cart_qty_count">${item.qty}</span>
            <button class="ww_qty_btn" data-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="ww_cart_remove_btn" data-id="${item.id}" aria-label="Remove ${item.name}">×</button>
      </div>
    `).join('');

    // Delegate events on the body
    body.querySelectorAll('.ww_qty_btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id     = e.currentTarget.dataset.id;
        const action = e.currentTarget.dataset.action;
        changeQty(id, action === 'inc' ? 1 : -1);
      });
    });

    body.querySelectorAll('.ww_cart_remove_btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        removeFromCart(e.currentTarget.dataset.id);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Cart mutations
  // --------------------------------------------------------------------------

  /**
   * Add a product to the cart (or increment its quantity).
   * @param {string} id    - Unique product ID (e.g. "dog-biscuit")
   * @param {string} name  - Display name
   * @param {number} price - Numeric price
   * @param {string} image - Image src path
   */
  function addToCart(id, name, price, image) {
    const cart    = getCart();
    const existing = cart.find(i => i.id === id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price: parseFloat(price), image, qty: 1 });
    }

    saveCart(cart);
    renderCartBody();
    updateBadge(true);
    openDrawer();
  }

  function removeFromCart(id) {
    const cart = getCart().filter(i => i.id !== id);
    saveCart(cart);
    renderCartBody();
    updateBadge();
  }

  function changeQty(id, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
    renderCartBody();
    updateBadge();
  }

  // --------------------------------------------------------------------------
  // 6. Badge
  // --------------------------------------------------------------------------
  function updateBadge(animate = false) {
    const badge = document.getElementById('ww-cart-badge');
    if (!badge) return;

    const count = totalCount(getCart());
    badge.textContent = count > 99 ? '99+' : String(count);

    if (count > 0) {
      badge.classList.add('visible');
      if (animate) {
        badge.classList.remove('pop');
        // Trigger reflow so the animation re-fires
        void badge.offsetWidth;
        badge.classList.add('pop');
      }
    } else {
      badge.classList.remove('visible', 'pop');
    }
  }

  // --------------------------------------------------------------------------
  // 7. Drawer open / close
  // --------------------------------------------------------------------------
  function openDrawer() {
    const drawer  = document.getElementById('ww-cart-drawer');
    const overlay = document.getElementById('ww-cart-overlay');
    if (!drawer || !overlay) return;

    renderCartBody();
    drawer.style.transform = '';         // Clear inline style so CSS classes control position
    overlay.style.opacity = '';           // Clear inline safety styles
    overlay.style.pointerEvents = '';
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.removeAttribute('aria-hidden');

    // Compensate for scrollbar disappearing to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollbarWidth + 'px';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('ww-cart-open');
  }

  function closeDrawer() {
    const drawer  = document.getElementById('ww-cart-drawer');
    const overlay = document.getElementById('ww-cart-overlay');
    if (!drawer || !overlay) return;

    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.classList.remove('ww-cart-open');
  }

  // --------------------------------------------------------------------------
  // 8. Wire up existing "Add to Cart" buttons on product detail pages
  // --------------------------------------------------------------------------
  function wireAddToCartButtons() {
    document.querySelectorAll('.add_to_cart[data-id]').forEach(btn => {
      btn.addEventListener('click', function () {
        const { id, name, price, image } = this.dataset;
        addToCart(id, name, price, image);

        // Visual feedback on the button
        const original = this.innerHTML;
        this.classList.add('ww_added');
        this.innerHTML = '✓ Added!';
        setTimeout(() => {
          this.classList.remove('ww_added');
          this.innerHTML = original;
        }, 1600);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. Wire up product cards on listing pages (our-products / homepage)
  //    Uses data-* attributes on the card's <a> wrapper or the card itself.
  // --------------------------------------------------------------------------
  function wireProductCards() {
    document.querySelectorAll('.product_card[data-id]').forEach(card => {
      // Skip cards that are wrapped in an <a> — clicking navigates anyway
      if (card.closest('a') && !card.dataset.cartOnly) return;

      card.addEventListener('click', function (e) {
        e.preventDefault();
        const { id, name, price, image } = this.dataset;
        addToCart(id, name, price, image);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9b. Wire up "Add to Cart" buttons on product listing cards
  //     These sit inside <a>-wrapped cards, so we stop propagation.
  // --------------------------------------------------------------------------
  function wireCardAtcButtons() {
    document.querySelectorAll('.ww_card_atc_btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();  // Prevent <a> navigation

        const card = this.closest('.ww_card_wrap[data-id]');
        if (!card) return;

        const { id, name, price, image } = card.dataset;
        addToCart(id, name, price, image);

        // Visual feedback on the button
        const original = this.innerHTML;
        this.classList.add('ww_added');
        this.innerHTML = '✓ Added!';
        setTimeout(() => {
          this.classList.remove('ww_added');
          this.innerHTML = original;
        }, 1600);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. Keyboard accessibility: close drawer on Escape
  // --------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // --------------------------------------------------------------------------
  // 11. Init
  // --------------------------------------------------------------------------
  function init() {
    injectCSS();
    injectCartDOM();
    updateBadge();
    wireAddToCartButtons();
    wireProductCards();
    wireCardAtcButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose public API so individual pages can call addToCart() directly
  window.WWCart = { addToCart, removeFromCart, openDrawer, closeDrawer, getCart };

})();
