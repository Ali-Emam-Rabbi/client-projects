const state = {
  products: [],
  cart: loadCart(),
  filters: {
    search: "",
    category: "All",
    maxPrice: 50000,
    sort: "newest"
  },
  authMode: "login"
};

const app = document.getElementById("app");
const cartCount = document.getElementById("cartCount");
const toastContainer = document.getElementById("toastContainer");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("hashchange", renderRoute);
window.addEventListener("DOMContentLoaded", initializeApp);

async function initializeApp() {
  showLoading("Loading the collection...");

  try {
    const response = await fetch("products.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Could not load product catalog.");
    }

    state.products = await response.json();
    const highestPrice = Math.max(...state.products.map((item) => item.price));
    state.filters.maxPrice = highestPrice;
    updateCartCount();
    renderRoute();
  } catch (error) {
    renderError(error.message);
    showToast(error.message, "error");
  }
}

function renderRoute() {
  if (!state.products.length) {
    return;
  }

  const hash = window.location.hash || "#home";
  const [route, param] = hash.replace("#", "").split("/");
  setActiveNav(route);

  switch (route) {
    case "home":
      renderHome();
      break;
    case "shop":
      renderShop();
      break;
    case "product":
      renderProductDetails(param);
      break;
    case "cart":
      renderCart();
      break;
    case "about":
      renderAbout();
      break;
    case "contact":
      renderContact();
      break;
    case "auth":
      renderAuth();
      break;
    default:
      window.location.hash = "#home";
  }
}

function renderHome() {
  const featured = getSortedProducts(state.products, "newest").slice(0, 4);
  const spotlight = state.products.find((item) => item.category === "Wedding") || state.products[0];
  const portraitHighlight = state.products.find((item) => item.category === "Portrait") || state.products[1];
  const stories = [
    {
      title: "Wedding atmosphere with cinematic softness",
      text: "Emotion-first imagery for ceremonies, portraits, and all the small in-between frames.",
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Portrait sessions shaped like editorials",
      text: "Clean direction, composed light, and a more magazine-inspired visual rhythm.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Digital art packs for walls, screens, and brands",
      text: "Curated downloadable collections with strong color, texture, and print-ready quality.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  app.innerHTML = `
    <section class="page">
      <div class="hero-layout">
        <article class="hero-card">
          <div class="hero-copy">
            <span class="eyebrow">Photography E-commerce Experience</span>
            <h1>Visual stories built to be booked, collected, and remembered.</h1>
            <p>
              Limon Photography pairs premium shoot booking with curated digital image products.
              The experience feels closer to a modern gallery than a standard storefront.
            </p>
            <div class="hero-actions">
              <a class="cta-card primary" href="#shop">
                <span class="cta-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M4 6.2A2.2 2.2 0 0 1 6.2 4h11.6A2.2 2.2 0 0 1 20 6.2v11.6A2.2 2.2 0 0 1 17.8 20H6.2A2.2 2.2 0 0 1 4 17.8V6.2Zm2 0v11.6c0 .1.1.2.2.2h11.6c.1 0 .2-.1.2-.2V6.2c0-.1-.1-.2-.2-.2H6.2c-.1 0-.2.1-.2.2Zm2.5 8.4h7v1.8h-7v-1.8Zm0-3.6h7v1.8h-7V11Zm0-3.6h4.2v1.8H8.5V7.4Z"></path></svg>
                </span>
                <span>
                  <strong>Explore Collection</strong>
                  <small>Browse services and digital photo packs</small>
                </span>
              </a>
              <a class="cta-card secondary" href="#contact">
                <span class="cta-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 3.5a7.5 7.5 0 0 1 7.5 7.5c0 5.1-6.2 9.2-7.1 9.8a.8.8 0 0 1-.8 0c-.9-.6-7.1-4.7-7.1-9.8A7.5 7.5 0 0 1 12 3.5Zm0 2A5.5 5.5 0 0 0 6.5 11c0 3.2 3.6 6.2 5.5 7.5 1.9-1.3 5.5-4.3 5.5-7.5A5.5 5.5 0 0 0 12 5.5Zm0 2.2a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6Z"></path></svg>
                </span>
                <span>
                  <strong>Book Session</strong>
                  <small>Start a tailored inquiry with your preferred style</small>
                </span>
              </a>
            </div>
          </div>
        </article>

        <div class="hero-side">
          <article class="feature-card stats">
            <span class="eyebrow">Why clients book here</span>
            <div class="stats-grid">
              <article>
                <strong>14</strong>
                <span>Photography products and services</span>
              </article>
              <article>
                <strong>7</strong>
                <span>Creative categories from wedding to nature</span>
              </article>
              <article>
                <strong>Local</strong>
                <span>BDT pricing with direct booking flow</span>
              </article>
              <article>
                <strong>Fast</strong>
                <span>Cart, filters, search, and instant browsing</span>
              </article>
            </div>
          </article>

          <article class="feature-card image-tile">
            <div class="feature-copy">
              <span class="eyebrow">Featured frame</span>
              <h3>${spotlight.title}</h3>
              <p>${spotlight.description}</p>
              <a class="ghost-btn" href="#product/${spotlight.id}">View Details</a>
            </div>
          </article>
        </div>
      </div>

      <section class="page">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Curated Collection</span>
            <h2>Gallery-led browsing with room to breathe.</h2>
          </div>
          <div class="section-actions">
            <a class="ghost-btn" href="#shop">Open full shop</a>
          </div>
        </div>

        <div class="curated-grid">
          <a class="curated-tile large" href="#product/${featured[0].id}">
            <img src="${featured[0].image}" alt="${featured[0].title}">
            <div class="tile-overlay">
              <div class="micro-meta">
                <span class="category-pill">${featured[0].category}</span>
                <span>&#2547;${formatPrice(featured[0].price)}</span>
              </div>
              <h3>${featured[0].title}</h3>
              <p>${featured[0].description}</p>
            </div>
          </a>
          <div class="curated-stack">
            ${featured.slice(1).map((item) => `
              <a class="curated-tile" href="#product/${item.id}">
                <img src="${item.image}" alt="${item.title}">
                <div class="tile-overlay">
                  <span class="category-pill">${item.category}</span>
                  <h3>${item.title}</h3>
                </div>
              </a>
            `).join("")}
          </div>
        </div>
      </section>

      <section class="page">
        <div class="section-heading">
          <div>
            <span class="eyebrow">Signature Directions</span>
            <h2>Less catalog, more atmosphere.</h2>
            <p>Every section is organized around photographic mood, not just product mechanics.</p>
          </div>
        </div>
        <div class="story-grid">
          ${stories.map((story) => `
            <article class="story-card">
              <img src="${story.image}" alt="${story.title}">
              <div class="story-copy">
                <h3>${story.title}</h3>
                <p>${story.text}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="panel booking-band">
        <div class="booking-band-copy">
          <span class="eyebrow">Designed For Real Clients</span>
          <h2>Move from inspiration to booking without leaving the visual mood behind.</h2>
          <p>Explore cinematic packages, compare pricing, then send a focused inquiry when the right session clicks.</p>
        </div>
        <div class="booking-band-cards">
          <article>
            <span class="category-pill">${spotlight.category}</span>
            <h3>${spotlight.title}</h3>
            <p>Best for couples who want a full narrative across ceremony, portraits, and atmosphere.</p>
          </article>
          <article>
            <span class="category-pill">${portraitHighlight.category}</span>
            <h3>${portraitHighlight.title}</h3>
            <p>Perfect for personal branding, solo editorials, and elegant portrait storytelling.</p>
          </article>
        </div>
      </section>
    </section>
  `;
}

function renderShop() {
  const categories = ["All", ...new Set(state.products.map((item) => item.category))];
  const filtered = getFilteredProducts();

  app.innerHTML = `
    <section class="page">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Gallery / Shop</span>
          <h2>Book services and collect digital visuals.</h2>
          <p>Search by title, narrow by category, shape by price, and sort the collection your way.</p>
        </div>
      </div>

      <section class="panel filters-panel">
        <div class="filter-grid">
          <div class="filter-control">
            <label for="searchInput">Search</label>
            <input
              id="searchInput"
              class="filter-input"
              type="search"
              value="${escapeHtml(state.filters.search)}"
              placeholder="Search by service or package name"
            >
          </div>

          <div class="filter-control">
            <label for="categorySelect">Category</label>
            <select id="categorySelect" class="sort-select">
              ${categories.map((category) => `
                <option value="${category}" ${state.filters.category === category ? "selected" : ""}>${category}</option>
              `).join("")}
            </select>
          </div>

          <div class="filter-control price-range">
            <label for="priceRange">Maximum Price</label>
            <input
              id="priceRange"
              class="filter-input"
              type="range"
              min="2000"
              max="${Math.max(...state.products.map((item) => item.price))}"
              step="500"
              value="${state.filters.maxPrice}"
            >
            <span class="price-output">Up to &#2547;${formatPrice(state.filters.maxPrice)}</span>
          </div>

          <div class="filter-control">
            <label for="sortSelect">Sort By</label>
            <select id="sortSelect" class="sort-select">
              <option value="newest" ${state.filters.sort === "newest" ? "selected" : ""}>Newest</option>
              <option value="low-high" ${state.filters.sort === "low-high" ? "selected" : ""}>Price: Low to High</option>
              <option value="high-low" ${state.filters.sort === "high-low" ? "selected" : ""}>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div class="result-bar">
          <div class="chip-row">
            ${categories.map((category) => `
              <button class="chip ${state.filters.category === category ? "active" : ""}" data-chip-category="${category}">
                ${category}
              </button>
            `).join("")}
          </div>
          <span class="muted">${filtered.length} result${filtered.length === 1 ? "" : "s"}</span>
        </div>
      </section>

      <section id="shopGrid">
        ${renderProductGrid(filtered)}
      </section>
    </section>
  `;

  bindShopEvents();
}

function renderProductGrid(products) {
  if (!products.length) {
    return `
      <div class="empty-state">
        <h3>No matching photography items</h3>
        <p>Try another search, category, or a higher price range.</p>
      </div>
    `;
  }

  return `
    <div class="product-grid">
      ${products.map((item) => `
        <article class="product-card">
          <a class="product-image" href="#product/${item.id}" aria-label="View ${item.title}">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
          </a>
          <div class="product-copy">
            <div class="product-meta">
              <span class="category-pill">${item.category}</span>
              <div class="price-tag">
                <span>Starting at</span>
                <strong>&#2547;${formatPrice(item.price)}</strong>
              </div>
            </div>
            <div>
              <h3>${item.title}</h3>
              <p>${item.description}</p>
            </div>
            <div class="card-actions">
              <a class="ghost-btn" href="#product/${item.id}">Details</a>
              <button class="btn add-to-cart-btn" data-product-id="${item.id}">Add to Cart</button>
            </div>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderProductDetails(productId) {
  const product = state.products.find((item) => item.id === productId);

  if (!product) {
    app.innerHTML = `
      <section class="page">
        <div class="error-state">
          <h2>That frame is missing</h2>
          <p>The requested photography item could not be found.</p>
          <a class="btn" href="#shop">Return to Shop</a>
        </div>
      </section>
    `;
    return;
  }

  app.innerHTML = `
    <section class="page">
      <div class="detail-grid">
        <article class="detail-card detail-media">
          <img src="${product.image}" alt="${product.title}">
        </article>

        <article class="detail-card detail-copy">
          <div>
            <span class="eyebrow">${product.category}</span>
            <h2>${product.title}</h2>
            <p>${product.description}</p>
          </div>

          <div class="metrics-grid">
            <article>
              <span class="muted">Price</span>
              <strong>&#2547;${formatPrice(product.price)}</strong>
            </article>
            <article>
              <span class="muted">Type</span>
              <strong>${product.category}</strong>
            </article>
            <article>
              <span class="muted">Added</span>
              <strong>${formatDate(product.createdAt)}</strong>
            </article>
          </div>

          <div>
            <h3>What's included</h3>
            <ul class="detail-list">
              ${product.details.map((detail) => `<li>${detail}</li>`).join("")}
            </ul>
          </div>

          <div class="detail-actions">
            <button class="btn" id="detailAddToCart" data-product-id="${product.id}">Add to Cart</button>
            <a class="ghost-btn" href="#contact">Book / Ask First</a>
            <a class="ghost-btn" href="#shop">Back to Gallery</a>
          </div>
        </article>
      </div>
    </section>
  `;

  document.getElementById("detailAddToCart").addEventListener("click", () => addToCart(product.id));
}

function renderCart() {
  const cartItems = state.cart
    .map((entry) => {
      const product = state.products.find((item) => item.id === entry.id);
      return product ? { ...product, quantity: entry.quantity } : null;
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceFee = cartItems.length ? 350 : 0;
  const total = subtotal + serviceFee;

  app.innerHTML = `
    <section class="page">
      <div class="section-heading">
        <div>
          <span class="eyebrow">Cart</span>
          <h2>Your selected sessions and digital products.</h2>
          <p>Everything is stored in localStorage, so the cart stays with you on this device.</p>
        </div>
      </div>

      <div class="cart-grid">
        <section class="cart-card">
          ${cartItems.length ? `
            <div class="cart-list">
              ${cartItems.map((item) => `
                <article class="cart-item">
                  <div class="cart-item-media">
                    <img src="${item.image}" alt="${item.title}">
                  </div>
                  <div class="cart-item-copy">
                    <div class="cart-item-meta">
                      <div>
                        <span class="category-pill">${item.category}</span>
                        <h3>${item.title}</h3>
                      </div>
                      <strong>&#2547;${formatPrice(item.price)}</strong>
                    </div>
                    <p>${item.description}</p>
                    <div class="qty-row">
                      <button class="qty-btn" data-action="decrease" data-product-id="${item.id}">-</button>
                      <span class="qty-value">${item.quantity}</span>
                      <button class="qty-btn" data-action="increase" data-product-id="${item.id}">+</button>
                      <button class="ghost-btn" data-action="remove" data-product-id="${item.id}">Remove</button>
                    </div>
                  </div>
                </article>
              `).join("")}
            </div>
          ` : `
            <div class="empty-state">
              <h3>Your cart is empty</h3>
              <p>Add photography services or digital collections from the gallery.</p>
              <a class="btn" href="#shop">Go to Gallery / Shop</a>
            </div>
          `}
        </section>

        <aside class="cart-card">
          <h3>Order Summary</h3>
          <div class="cart-summary">
            <div class="summary-row">
              <span>Items</span>
              <strong>${cartItems.reduce((sum, item) => sum + item.quantity, 0)}</strong>
            </div>
            <div class="summary-row">
              <span>Subtotal</span>
              <strong>&#2547;${formatPrice(subtotal)}</strong>
            </div>
            <div class="summary-row">
              <span>Service fee</span>
              <strong>&#2547;${formatPrice(serviceFee)}</strong>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <strong>&#2547;${formatPrice(total)}</strong>
            </div>
          </div>
          <div class="cart-actions">
            <button class="btn" id="checkoutBtn" ${cartItems.length ? "" : "disabled"}>Proceed to Checkout</button>
            <button class="ghost-btn" id="clearCartBtn" ${cartItems.length ? "" : "disabled"}>Clear Cart</button>
          </div>
          <p class="form-help">Frontend demo checkout only. Use the contact page to complete a real booking request.</p>
        </aside>
      </div>
    </section>
  `;

  app.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", handleCartAction);
  });

  const clearCartBtn = document.getElementById("clearCartBtn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      showToast("Demo checkout ready. Use Contact for booking confirmation.", "success");
    });
  }
}

function renderAbout() {
  app.innerHTML = `
    <section class="page">
      <div class="about-grid">
        <section class="about-intro panel">
          <span class="eyebrow">About Limon Photography</span>
          <h1>Photography presented with the pace of a gallery and the utility of a shop.</h1>
          <p>
            Limon Photography is built for people who want more than a booking form. The studio
            focuses on thoughtful visual storytelling across weddings, portraits, events, family
            sessions, commercial imagery, and curated digital collections.
          </p>
          <p>
            The website is designed to feel immersive and editorial, so visitors can move from
            discovery to details to cart without losing the visual character of the brand.
          </p>

          <div class="timeline">
            <article>
              <h3>What we do</h3>
              <p>Photography services, downloadable image products, and styled galleries for modern personal and brand storytelling.</p>
            </article>
            <article>
              <h3>How we work</h3>
              <p>Planning first, direction on shoot day, polished edits after, and a clean digital handoff for clients.</p>
            </article>
            <article>
              <h3>What clients get</h3>
              <p>A premium experience with BDT pricing, transparent package details, and a calm visual journey from first visit to booking.</p>
            </article>
          </div>
        </section>

        <aside class="founder-card">
          <div class="founder-media">
            <img src="Images/Founder%20Limon.jpg" alt="Founder Limon portrait">
          </div>
          <div class="founder-copy">
            <span class="eyebrow">Founder</span>
            <h3>Limon</h3>
            <p>
              The founder portrait is now integrated directly into the About section to give the
              studio a more personal, credible presence.
            </p>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderContact() {
  app.innerHTML = `
    <section class="page">
      <div class="contact-grid">
        <section class="contact-copy panel contact-content">
          <span class="eyebrow">Contact</span>
          <h2>Let's talk about your next session.</h2>
          <p>
            Reach out for pricing questions, availability, custom shoots, or bulk digital licensing.
            The form below is validated on the frontend for a clean inquiry experience.
          </p>

          <ul class="contact-list">
            <li><strong>Email:</strong> <a href="mailto:mdlimon48219325@gmail.com">mdlimon48219325@gmail.com</a></li>
            <li><strong>Phone:</strong> <a href="tel:01748219324">01748219324</a></li>
            <li><strong>Facebook:</strong> <a href="https://www.facebook.com/share/1ENfLvW643/" target="_blank" rel="noreferrer">Open profile</a></li>
            <li><strong>Instagram:</strong> <a href="https://www.instagram.com/md.limon542?igsh=MTd1dTJzZmFjdW5xeA==" target="_blank" rel="noreferrer">Open profile</a></li>
          </ul>
        </section>

        <section class="contact-card">
          <form id="contactForm" novalidate>
            <div class="field-row">
              <input class="form-input" type="text" id="contactName" placeholder="Your name">
              <input class="form-input" type="email" id="contactEmail" placeholder="Email address">
            </div>
            <div class="field-row">
              <input class="form-input" type="tel" id="contactPhone" placeholder="Phone number">
              <input class="form-input" type="text" id="contactSubject" placeholder="Subject">
            </div>
            <textarea class="form-input" id="contactMessage" placeholder="Tell us about your photography need"></textarea>
            <button class="btn" type="submit">Send Inquiry</button>
            <p class="form-help">Frontend demo form only. Submission is validated and acknowledged with a toast message.</p>
          </form>
        </section>
      </div>
    </section>
  `;

  document.getElementById("contactForm").addEventListener("submit", handleContactSubmit);
}

function renderAuth() {
  app.innerHTML = `
    <section class="page">
      <div class="auth-layout">
        <section class="auth-content auth-card">
          <span class="eyebrow">Member Access</span>
          <h2>Save favorites, revisit packages, and keep your booking flow simple.</h2>
          <p>
            This frontend-only login and signup area is styled to fit the rest of the photography
            experience rather than feeling like a separate admin screen.
          </p>
          <ul class="auth-benefits">
            <li>Save preferred sessions for later</li>
            <li>Track digital collections before purchase</li>
            <li>Return to your curated visual shortlist</li>
          </ul>
        </section>

        <section class="auth-card">
          <div class="auth-tabs">
            <button class="${state.authMode === "login" ? "active" : ""}" data-auth-mode="login">Login</button>
            <button class="${state.authMode === "signup" ? "active" : ""}" data-auth-mode="signup">Signup</button>
          </div>

          <div class="auth-forms">
            ${state.authMode === "login" ? `
              <form id="loginForm" class="auth-form" novalidate>
                <input class="form-input" type="email" id="loginEmail" placeholder="Email address">
                <input class="form-input" type="password" id="loginPassword" placeholder="Password">
                <button class="btn" type="submit">Login</button>
              </form>
            ` : `
              <form id="signupForm" class="auth-form" novalidate>
                <div class="field-row">
                  <input class="form-input" type="text" id="signupName" placeholder="Full name">
                  <input class="form-input" type="email" id="signupEmail" placeholder="Email address">
                </div>
                <div class="field-row">
                  <input class="form-input" type="password" id="signupPassword" placeholder="Password">
                  <input class="form-input" type="password" id="signupConfirm" placeholder="Confirm password">
                </div>
                <button class="btn" type="submit">Create Account</button>
              </form>
            `}
          </div>
          <p class="form-help">Demo only. Validation works, but no backend authentication is connected.</p>
        </section>
      </div>
    </section>
  `;

  app.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.authMode = button.dataset.authMode;
      renderAuth();
    });
  });

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignupSubmit);
  }
}

function bindShopEvents() {
  document.getElementById("searchInput").addEventListener("input", (event) => {
    state.filters.search = event.target.value.trim();
    refreshShopGrid();
  });

  document.getElementById("categorySelect").addEventListener("change", (event) => {
    state.filters.category = event.target.value;
    renderShop();
  });

  document.getElementById("priceRange").addEventListener("input", (event) => {
    state.filters.maxPrice = Number(event.target.value);
    renderShop();
  });

  document.getElementById("sortSelect").addEventListener("change", (event) => {
    state.filters.sort = event.target.value;
    refreshShopGrid();
  });

  document.querySelectorAll("[data-chip-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.category = button.dataset.chipCategory;
      renderShop();
    });
  });

  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.productId));
  });
}

function refreshShopGrid() {
  const shopGrid = document.getElementById("shopGrid");
  if (!shopGrid) {
    return;
  }

  shopGrid.innerHTML = renderProductGrid(getFilteredProducts());
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.productId));
  });

  const resultCounter = document.querySelector(".result-bar .muted");
  if (resultCounter) {
    const count = getFilteredProducts().length;
    resultCounter.textContent = `${count} result${count === 1 ? "" : "s"}`;
  }
}

function getFilteredProducts() {
  const { search, category, maxPrice, sort } = state.filters;
  const filtered = state.products.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || item.category === category;
    const matchesPrice = item.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return getSortedProducts(filtered, sort);
}

function getSortedProducts(products, sort) {
  const sorted = [...products];

  if (sort === "low-high") {
    return sorted.sort((a, b) => a.price - b.price);
  }

  if (sort === "high-low") {
    return sorted.sort((a, b) => b.price - a.price);
  }

  return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function addToCart(productId) {
  const existing = state.cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ id: productId, quantity: 1 });
  }

  persistCart();
  updateCartCount();
  showToast("Added to cart.", "success");
}

function handleCartAction(event) {
  const { productId, action } = event.currentTarget.dataset;
  const cartItem = state.cart.find((item) => item.id === productId);

  if (!cartItem) {
    return;
  }

  if (action === "increase") {
    cartItem.quantity += 1;
    showToast("Quantity updated.", "success");
  }

  if (action === "decrease") {
    cartItem.quantity -= 1;
    if (cartItem.quantity <= 0) {
      state.cart = state.cart.filter((item) => item.id !== productId);
      showToast("Item removed from cart.", "success");
    }
  }

  if (action === "remove") {
    state.cart = state.cart.filter((item) => item.id !== productId);
    showToast("Item removed from cart.", "success");
  }

  persistCart();
  updateCartCount();
  renderCart();
}

function clearCart() {
  state.cart = [];
  persistCart();
  updateCartCount();
  renderCart();
  showToast("Cart cleared.", "success");
}

function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  const subject = document.getElementById("contactSubject").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !email || !phone || !subject || !message) {
    showToast("Please complete all contact form fields.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showToast("Please enter a valid email address.", "error");
    return;
  }

  if (phone.length < 8) {
    showToast("Please enter a valid phone number.", "error");
    return;
  }

  event.target.reset();
  showToast("Inquiry submitted successfully.", "success");
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    showToast("Please enter email and password.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showToast("Please provide a valid login email.", "error");
    return;
  }

  showToast("Login successful in demo mode.", "success");
  event.target.reset();
}

function handleSignupSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const confirm = document.getElementById("signupConfirm").value.trim();

  if (!name || !email || !password || !confirm) {
    showToast("Please complete the signup form.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showToast("Please provide a valid signup email.", "error");
    return;
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters.", "error");
    return;
  }

  if (password !== confirm) {
    showToast("Passwords do not match.", "error");
    return;
  }

  showToast("Account created in demo mode.", "success");
  event.target.reset();
}

function updateCartCount() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = String(count);
}

function loadCart() {
  try {
    const stored = localStorage.getItem("limon-photography-cart");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

function persistCart() {
  localStorage.setItem("limon-photography-cart", JSON.stringify(state.cart));
}

function showLoading(message) {
  app.innerHTML = `
    <section class="page-loader">
      <div class="loader-ring"></div>
      <p>${message}</p>
    </section>
  `;
}

function renderError(message) {
  app.innerHTML = `
    <section class="page">
      <div class="error-state">
        <h2>Something went wrong</h2>
        <p>${message}</p>
      </div>
    </section>
  `;
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2600);
}

function setActiveNav(route) {
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isActive = href === `#${route}` || (route === "product" && href === "#shop");
    link.classList.toggle("active", isActive);
  });
}

function formatPrice(amount) {
  return Number(amount).toLocaleString("en-BD");
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
