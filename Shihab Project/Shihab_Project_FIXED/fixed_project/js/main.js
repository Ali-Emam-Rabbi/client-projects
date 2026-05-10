import {
  addToCart,
  getCart,
  getCartCount,
  getSession,
  loginUser,
  logoutUser,
  removeCartItem,
  saveCart,
  signupUser,
  updateCartItem
} from "./store.js";
import { findBook, filterAndSortBooks, formatPrice, getBooks, getCategories } from "./books.js";

const page = document.body.dataset.page;
const prefix = window.location.pathname.includes("/pages/") ? "../" : "";

const facebookIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.4-.1-2.7-.1-2.6 0-4.4 1.6-4.4 4.5V10H7v3h2.9v8h3.6Z"></path>
  </svg>
`;
const fallbackBookImage =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80";

function pageLink(slug) {
  return `${prefix}pages/${slug}`.replace("pages/pages", "pages");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderHeader() {
  const session = getSession();
  const navItems = [
    { href: `${prefix}index.html`, label: "Home", key: "home" },
    { href: pageLink("shop.html"), label: "Shop", key: "shop" },
    { href: pageLink("about.html"), label: "About", key: "about" },
    { href: pageLink("contact.html"), label: "Contact", key: "contact" },
    { href: pageLink("auth.html"), label: session ? "Account" : "Login / Signup", key: "auth" }
  ];

  const navIcons = {
    home: "fa-solid fa-house",
    shop: "fa-solid fa-book-open",
    about: "fa-solid fa-circle-info",
    contact: "fa-solid fa-envelope",
    auth: session ? "fa-solid fa-user-check" : "fa-solid fa-right-to-bracket"
  };

  const normalizedHome = page === "home";
  const nav = navItems
    .map((item) => {
      const active = normalizedHome ? item.key === "home" : item.key === page;
      return `<a class="${active ? "active" : ""}" href="${item.href}"><i class="${navIcons[item.key]}"></i> ${item.label}</a>`;
    })
    .join("");

  const header = `
    <header class="site-header">
      <div class="container nav-shell">
        <a class="brand" href="${prefix}index.html">
          <img src="${prefix}assets/images/logo.jpg" alt="BookHub logo">
          <div>
            <strong>BookHub</strong>
            <span>Your Gateway to Worlds</span>
          </div>
        </a>

        <button class="nav-toggle" type="button" aria-label="Toggle navigation">
          <span></span>
          <span></span>
        </button>

        <nav class="site-nav">
          ${nav}
        </nav>

        <div class="nav-actions">
          <button class="session-pill ${session ? "" : "hidden"}" id="logout-button" type="button">
            ${session ? `<i class="fa-solid fa-user"></i> Hi, ${escapeHtml(session.name.split(" ")[0])} | Logout` : ""}
          </button>
          <a class="cart-pill" href="${pageLink("cart.html")}">
            <i class="fa-solid fa-cart-shopping"></i>
            <span>Cart</span>
            <strong id="cart-count">${getCartCount()}</strong>
          </a>
        </div>
      </div>
    </header>
  `;

  document.getElementById("site-header").innerHTML = header;

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  navToggle?.addEventListener("click", () => siteNav?.classList.toggle("open"));
  document.getElementById("logout-button")?.addEventListener("click", () => {
    logoutUser();
    showToast("Signed out successfully.", "success");
    renderHeader();
  });
}

function renderFooter() {
  document.getElementById("site-footer").innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-col">
          <div class="footer-brand">
            <img src="${prefix}assets/images/logo.jpg" alt="BookHub logo">
            <div>
              <strong>BookHub</strong>
              <span>Your Gateway to Worlds</span>
            </div>
          </div>
          <p class="footer-desc">Modern online bookstore with the atmosphere of a curated library shelf.</p>
        </div>

        <div class="footer-col">
          <h3>Contact</h3>
          <div class="footer-contact-item">
            <i class="fa-solid fa-phone"></i>
            <a href="tel:01823148841">01823148841</a>
          </div>
          <div class="footer-contact-item">
            <i class="fa-solid fa-envelope"></i>
            <a href="mailto:mushfikur32@gmail.com">mushfikur32@gmail.com</a>
          </div>
          <div class="footer-contact-item">
            <i class="fa-solid fa-location-dot"></i>
            <span>Bangladesh</span>
          </div>
        </div>

        <div class="footer-col">
          <h3>Follow Us</h3>
          <a class="footer-social" href="https://www.facebook.com/mushfikur.rahman.376695" target="_blank" rel="noreferrer" aria-label="Facebook">
            <i class="fa-brands fa-facebook-f"></i>
            <span>Facebook</span>
          </a>
        </div>
      </div>
    </footer>
  `;
}

function updateCartBadge() {
  const count = document.getElementById("cart-count");
  if (count) count.textContent = String(getCartCount());
}

function showToast(message, variant = "success") {
  const root = document.getElementById("toast-root");
  if (!root) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${variant}`;
  toast.textContent = message;
  root.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 220);
  }, 2600);
}

function createBookCard(book, compact = false) {
  const detailsHref = `${pageLink("book-details.html")}?id=${book.id}`;
  return `
    <article class="book-card ${compact ? "book-card-compact" : ""}">
      <a class="book-cover-link" href="${detailsHref}">
        <img class="catalog-image" src="${book.image}" alt="${escapeHtml(book.title)} cover" loading="lazy">
      </a>
      <div class="book-card-body">
        <span class="book-tag">${book.category}</span>
        <a class="book-title-link" href="${detailsHref}">
          <h3>${book.title}</h3>
        </a>
        <p class="book-author">${book.author}</p>
        <div class="book-meta">
          <strong>${formatPrice(book.price)}</strong>
          <button class="btn btn-card" type="button" data-add-cart="${book.id}"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

function bindAddToCart(root, books) {
  root.querySelectorAll("[data-add-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const book = findBook(books, button.dataset.addCart);
      addToCart(button.dataset.addCart, 1);
      updateCartBadge();
      showToast(`${book.title} added to cart.`, "success");
    });
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal:not(.revealed)");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  items.forEach((item) => observer.observe(item));
}

function applyImageFallbacks() {
  document.querySelectorAll(".catalog-image").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        if (!image.dataset.fallbackApplied) {
          image.dataset.fallbackApplied = "true";
          image.src = fallbackBookImage;
        }
      },
      { once: true }
    );
  });
}

function renderHome(books) {
  const featured = books.filter((book) => book.featured).slice(0, 8);
  const latest = [...books].sort((a, b) => b.publishedYear - a.publishedYear).slice(0, 5);

  document.getElementById("featured-books").innerHTML = featured.map((book) => createBookCard(book)).join("");
  bindAddToCart(document.getElementById("featured-books"), books);

  const categories = getCategories(books).map((category) => ({
    name: category,
    total: books.filter((book) => book.category === category).length
  }));

  document.getElementById("category-highlights").innerHTML = categories
    .map(
      (category, index) => `
        <a class="category-card reveal" href="pages/shop.html?category=${encodeURIComponent(category.name)}">
          <span>0${index + 1}</span>
          <h3>${category.name}</h3>
          <p>${category.total} books on this shelf</p>
        </a>
      `
    )
    .join("");

  document.getElementById("new-arrivals").innerHTML = latest
    .map(
      (book) => `
        <article class="mini-book-card">
          <img class="catalog-image" src="${book.image}" alt="${escapeHtml(book.title)} cover" loading="lazy">
          <div>
            <span>${book.category}</span>
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <strong>${formatPrice(book.price)}</strong>
          </div>
        </article>
      `
    )
    .join("");
  applyImageFallbacks();
  setupReveal();
}

function renderShop(books) {
  const params = new URLSearchParams(window.location.search);
  const state = {
    query: "",
    category: params.get("category") || "all",
    maxPrice: 2000,
    sort: params.get("sort") || "newest"
  };

  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");
  const priceFilter = document.getElementById("price-filter");
  const sortFilter = document.getElementById("sort-filter");
  const priceValue = document.getElementById("price-value");
  const resultsLabel = document.getElementById("results-label");
  const shopGrid = document.getElementById("shop-grid");
  const empty = document.getElementById("shop-empty");

  categoryFilter.innerHTML = [`<option value="all">All categories</option>`]
    .concat(getCategories(books).map((category) => `<option value="${category}">${category}</option>`))
    .join("");

  categoryFilter.value = state.category;
  sortFilter.value = state.sort;
  priceValue.textContent = formatPrice(state.maxPrice);

  const syncQuery = () => {
    const query = new URLSearchParams();
    if (state.category !== "all") query.set("category", state.category);
    if (state.sort !== "newest") query.set("sort", state.sort);
    const next = query.toString();
    history.replaceState(null, "", `${window.location.pathname}${next ? `?${next}` : ""}`);
  };

  const paint = () => {
    const items = filterAndSortBooks(books, state);
    resultsLabel.textContent = `${items.length} books found`;
    priceValue.textContent = formatPrice(state.maxPrice);
    shopGrid.innerHTML = items.map((book) => createBookCard(book)).join("");
    empty.classList.toggle("hidden", items.length !== 0);
    bindAddToCart(shopGrid, books);
    applyImageFallbacks();
    syncQuery();
  };

  searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    paint();
  });

  categoryFilter.addEventListener("change", (event) => {
    state.category = event.target.value;
    paint();
  });

  priceFilter.addEventListener("input", (event) => {
    state.maxPrice = Number(event.target.value);
    paint();
  });

  sortFilter.addEventListener("change", (event) => {
    state.sort = event.target.value;
    paint();
  });

  document.getElementById("clear-filters").addEventListener("click", () => {
    state.query = "";
    state.category = "all";
    state.maxPrice = 2000;
    state.sort = "newest";
    searchInput.value = "";
    categoryFilter.value = "all";
    priceFilter.value = "2000";
    sortFilter.value = "newest";
    paint();
  });

  paint();
}

function renderDetails(books) {
  const id = new URLSearchParams(window.location.search).get("id");
  const target = document.getElementById("details-view");
  const missing = document.getElementById("details-missing");
  const book = findBook(books, id);

  if (!book) {
    target.classList.add("hidden");
    missing.classList.remove("hidden");
    return;
  }

  target.innerHTML = `
    <div class="details-cover">
      <img class="catalog-image" src="${book.image}" alt="${escapeHtml(book.title)} cover">
    </div>
    <div class="details-copy">
      <span class="book-tag">${book.category}</span>
      <h2>${book.title}</h2>
      <p class="details-author">by ${book.author}</p>
      <strong class="details-price">${formatPrice(book.price)}</strong>
      <p class="details-description">${book.description}</p>
      <div class="details-meta">
        <div>
          <span>Published</span>
          <strong>${book.publishedYear}</strong>
        </div>
        <div>
          <span>Category</span>
          <strong>${book.category}</strong>
        </div>
      </div>
      <div class="details-actions">
        <button class="btn btn-primary" type="button" data-add-cart="${book.id}"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
        <a class="btn btn-secondary" href="shop.html"><i class="fa-solid fa-arrow-left"></i> Back to Shop</a>
      </div>
    </div>
  `;

  bindAddToCart(target, books);
  applyImageFallbacks();
}

function renderCart(books) {
  const cartItems = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");
  const cart = getCart();
  const checkoutModal = document.getElementById("checkout-modal");
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutFeedback = document.getElementById("checkout-feedback");

  const hideCheckout = () => {
    checkoutModal?.classList.add("hidden");
    checkoutModal?.setAttribute("aria-hidden", "true");
    if (checkoutFeedback) checkoutFeedback.textContent = "";
  };

  const showCheckout = () => {
    checkoutModal?.classList.remove("hidden");
    checkoutModal?.setAttribute("aria-hidden", "false");
  };

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-state reveal">
        <h2>Your cart is empty</h2>
        <p>Add a few titles and your reading cart will appear here.</p>
        <a class="btn btn-primary" href="shop.html">Start Browsing</a>
      </div>
    `;
    summary.innerHTML = `
      <h2>Order summary</h2>
      <p>Subtotal</p>
      <strong>${formatPrice(0)}</strong>
    `;
    hideCheckout();
    return;
  }

  const enriched = cart
    .map((item) => ({ ...item, book: findBook(books, item.id) }))
    .filter((item) => item.book);

  const subtotal = enriched.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  cartItems.innerHTML = enriched
    .map(
      (item) => `
        <article class="cart-item reveal">
          <img class="catalog-image" src="${item.book.image}" alt="${escapeHtml(item.book.title)} cover">
          <div class="cart-item-copy">
            <span class="book-tag">${item.book.category}</span>
            <h2>${item.book.title}</h2>
            <p>${item.book.author}</p>
            <strong>${formatPrice(item.book.price)}</strong>
          </div>
          <div class="qty-controls">
            <button type="button" data-qty="${item.book.id}" data-step="-1">-</button>
            <span>${item.quantity}</span>
            <button type="button" data-qty="${item.book.id}" data-step="1">+</button>
          </div>
          <button class="remove-link" type="button" data-remove="${item.book.id}">Remove</button>
        </article>
      `
    )
    .join("");

  summary.innerHTML = `
    <h2>Order summary</h2>
    <div class="summary-row">
      <span>Items</span>
      <strong>${enriched.reduce((sum, item) => sum + item.quantity, 0)}</strong>
    </div>
    <div class="summary-row">
      <span>Subtotal</span>
      <strong>${formatPrice(subtotal)}</strong>
    </div>
    <div class="summary-row">
      <span>Delivery</span>
      <strong>${formatPrice(subtotal > 0 ? 120 : 0)}</strong>
    </div>
    <div class="summary-row total">
      <span>Total</span>
      <strong>${formatPrice(subtotal > 0 ? subtotal + 120 : 0)}</strong>
    </div>
    <button class="btn btn-primary" type="button" id="checkout-btn"><i class="fa-solid fa-credit-card"></i> Proceed to Checkout</button>
    <p class="form-note">Frontend demo only. Cart data is stored in your browser.</p>
  `;

  cartItems.querySelectorAll("[data-qty]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = cart.find((entry) => entry.id === button.dataset.qty);
      const nextQty = (item?.quantity || 0) + Number(button.dataset.step);
      updateCartItem(button.dataset.qty, nextQty);
      updateCartBadge();
      renderCart(books);
    });
  });

  cartItems.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      removeCartItem(button.dataset.remove);
      updateCartBadge();
      showToast("Book removed from cart.", "error");
      renderCart(books);
    });
  });

  document.getElementById("checkout-btn")?.addEventListener("click", () => {
    showCheckout();
  });

  checkoutModal?.querySelectorAll("[data-checkout-close]").forEach((element) => {
    element.onclick = hideCheckout;
  });

  if (checkoutForm) {
    checkoutForm.onsubmit = (event) => {
      event.preventDefault();

      if (!checkoutForm.checkValidity()) {
        if (checkoutFeedback) {
          checkoutFeedback.textContent = "Please complete your name, phone number, and address.";
        }
        showToast("Please fill out the checkout form correctly.", "error");
        checkoutForm.reportValidity();
        return;
      }

      const formData = new FormData(checkoutForm);
      const customerName = String(formData.get("fullName")).trim();

      saveCart([]);
      checkoutForm.reset();
      hideCheckout();
      updateCartBadge();
      renderCart(books);
      showToast(`Order placed successfully for ${customerName}.`, "success");
    };
  }

  if (checkoutModal && !checkoutModal.dataset.escapeBound) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !checkoutModal.classList.contains("hidden")) {
        hideCheckout();
      }
    });
    checkoutModal.dataset.escapeBound = "true";
  }
  applyImageFallbacks();
  setupReveal();
}

function renderAuth() {
  const tabs = document.querySelectorAll("[data-auth-tab]");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const status = document.getElementById("auth-status");

  const switchTab = (name) => {
    tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.authTab === name));
    loginForm.classList.toggle("hidden", name !== "login");
    signupForm.classList.toggle("hidden", name !== "signup");
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => switchTab(tab.dataset.authTab)));

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(loginForm);
    const result = loginUser(String(form.get("email")), String(form.get("password")));
    status.textContent = result.message;
    showToast(result.message, result.ok ? "success" : "error");
    if (result.ok) renderHeader();
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(signupForm);
    const result = signupUser({
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: String(form.get("password"))
    });
    status.textContent = result.message;
    showToast(result.message, result.ok ? "success" : "error");
    if (result.ok) {
      signupForm.reset();
      switchTab("login");
      renderHeader();
    }
  });
}

function renderContact() {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("contact-feedback");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      feedback.textContent = "Please complete all fields with a valid email address.";
      showToast("Please fill out the contact form correctly.", "error");
      return;
    }

    form.reset();
    feedback.textContent = "Message validated successfully. This demo does not send emails.";
    showToast("Message validated successfully.", "success");
  });
}

function setFooterIcons() {
  document.querySelectorAll(".icon-facebook").forEach((icon) => {
    icon.innerHTML = facebookIcon;
  });
}

async function init() {
  renderHeader();
  renderFooter();
  setFooterIcons();
  setupReveal();

  window.addEventListener("cart:updated", updateCartBadge);
  window.addEventListener("auth:updated", renderHeader);

  const dataPages = new Set(["home", "shop", "details", "cart"]);
  const books = dataPages.has(page) ? await getBooks() : [];

  if (page === "home") renderHome(books);
  if (page === "shop") renderShop(books);
  if (page === "details") renderDetails(books);
  if (page === "cart") renderCart(books);
  if (page === "auth") renderAuth();
  if (page === "contact") renderContact();
  applyImageFallbacks();
  setupReveal();
}

init().catch((error) => {
  showToast(error.message, "error");
  const container = document.querySelector("main .container");
  if (container) {
    container.innerHTML += `
      <section class="empty-state">
        <h2>Something went wrong</h2>
        <p>${escapeHtml(error.message)}</p>
      </section>
    `;
  }
});
