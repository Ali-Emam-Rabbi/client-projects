const money = (value) => `\u09F3${Number(value).toLocaleString("en-BD")}`;
const CART_KEY = "sasthoSebaCart";
const LEGACY_CART_KEY = "mauaCart";

const icons = {
  cart: `
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="8" cy="21" r="1"></circle>
      <circle cx="19" cy="21" r="1"></circle>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L22 7H5.12"></path>
    </svg>
  `,
  menu: `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
  `,
  plus: `
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M5 12h14M12 5v14"></path>
    </svg>
  `
};

function getCart() {
  const currentCart = localStorage.getItem(CART_KEY);

  if (currentCart) {
    return JSON.parse(currentCart);
  }

  const legacyCart = localStorage.getItem(LEGACY_CART_KEY);

  if (legacyCart) {
    localStorage.setItem(CART_KEY, legacyCart);
    localStorage.removeItem(LEGACY_CART_KEY);
    return JSON.parse(legacyCart);
  }

  return [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      qty
    });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart`, "success");
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count;
  });
}

function showToast(message, type = "success") {
  const wrap =
    document.querySelector(".toast-wrap") ||
    document.body.appendChild(
      Object.assign(document.createElement("div"), { className: "toast-wrap" })
    );

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  wrap.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

async function loadProducts() {
  const response = await fetch("data/products.json");

  if (!response.ok) {
    throw new Error("Unable to load products");
  }

  return response.json();
}

function fallbackImageUrl(name = "Medicine") {
  const text = encodeURIComponent(name).replace(/%20/g, "+");
  return `https://placehold.co/600x420/e8f5e9/2e7d32?text=${text}`;
}

function categoryPalette(category = "") {
  const map = {
    Tablets: ["#ecfdf5", "#0f766e", "#0d9488"],
    Syrups: ["#eef2ff", "#1d4ed8", "#2563eb"],
    Vitamins: ["#fff7ed", "#c2410c", "#f59e0b"],
    "Baby Care": ["#eff6ff", "#1d4ed8", "#60a5fa"],
    "First Aid": ["#fef2f2", "#b91c1c", "#ef4444"],
    Devices: ["#f5f3ff", "#5b21b6", "#7c3aed"],
    "Personal Care": ["#fdf2f8", "#be185d", "#ec4899"]
  };

  return map[category] || ["#eff6ff", "#1e3a8a", "#3b82f6"];
}

function categoryArtwork(category = "") {
  if (category === "Tablets") {
    return `
      <rect x="90" y="118" width="120" height="120" rx="60" fill="#ffffff"></rect>
      <rect x="210" y="118" width="120" height="120" rx="60" fill="#d1fae5"></rect>
      <path d="M150 118v120" stroke="#0f766e" stroke-width="12" stroke-linecap="round"></path>
      <path d="M90 178h120" stroke="#0f766e" stroke-width="12" stroke-linecap="round"></path>
    `;
  }

  if (category === "Syrups") {
    return `
      <rect x="140" y="72" width="140" height="40" rx="14" fill="#1d4ed8"></rect>
      <rect x="126" y="104" width="168" height="190" rx="34" fill="#ffffff"></rect>
      <rect x="150" y="156" width="120" height="96" rx="18" fill="#dbeafe"></rect>
      <path d="M184 204h52" stroke="#2563eb" stroke-width="12" stroke-linecap="round"></path>
      <path d="M210 178v52" stroke="#2563eb" stroke-width="12" stroke-linecap="round"></path>
    `;
  }

  if (category === "Vitamins") {
    return `
      <rect x="138" y="78" width="144" height="210" rx="34" fill="#ffffff"></rect>
      <rect x="164" y="52" width="92" height="34" rx="12" fill="#f59e0b"></rect>
      <rect x="164" y="138" width="92" height="86" rx="18" fill="#ffedd5"></rect>
      <text x="187" y="198" font-size="58" font-weight="700" fill="#c2410c">V</text>
    `;
  }

  if (category === "Baby Care") {
    return `
      <circle cx="210" cy="126" r="48" fill="#ffffff"></circle>
      <circle cx="192" cy="118" r="8" fill="#1d4ed8"></circle>
      <circle cx="228" cy="118" r="8" fill="#1d4ed8"></circle>
      <path d="M190 144c14 14 26 14 40 0" stroke="#60a5fa" stroke-width="8" stroke-linecap="round"></path>
      <path d="M146 108c16-28 122-28 128 0" stroke="#93c5fd" stroke-width="18" stroke-linecap="round"></path>
    `;
  }

  if (category === "First Aid") {
    return `
      <rect x="110" y="98" width="200" height="140" rx="28" fill="#ffffff"></rect>
      <path d="M210 128v80" stroke="#ef4444" stroke-width="20" stroke-linecap="round"></path>
      <path d="M170 168h80" stroke="#ef4444" stroke-width="20" stroke-linecap="round"></path>
    `;
  }

  if (category === "Devices") {
    return `
      <rect x="108" y="94" width="204" height="144" rx="26" fill="#ffffff"></rect>
      <rect x="142" y="126" width="136" height="60" rx="16" fill="#ede9fe"></rect>
      <path d="M154 156h24l12-18 20 34 14-16h28" stroke="#7c3aed" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"></path>
    `;
  }

  return `
    <rect x="110" y="98" width="200" height="140" rx="28" fill="#ffffff"></rect>
    <circle cx="170" cy="168" r="24" fill="#ec4899"></circle>
    <circle cx="250" cy="168" r="24" fill="#f9a8d4"></circle>
    <path d="M170 132v72" stroke="#ffffff" stroke-width="10" stroke-linecap="round"></path>
    <path d="M134 168h72" stroke="#ffffff" stroke-width="10" stroke-linecap="round"></path>
  `;
}

function generatedProductImage(name = "Medicine", category = "") {
  const [bg, ink, accent] = categoryPalette(category);
  const title = String(name)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420">
      <rect width="600" height="420" rx="28" fill="${bg}"></rect>
      <circle cx="510" cy="80" r="54" fill="${accent}" opacity="0.18"></circle>
      <circle cx="92" cy="344" r="40" fill="${accent}" opacity="0.14"></circle>
      ${categoryArtwork(category)}
      <rect x="46" y="300" width="508" height="80" rx="20" fill="rgba(255,255,255,0.9)"></rect>
      <text x="300" y="348" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700" fill="${ink}">
        ${title}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function normalizeImageUrl(image, name, category) {
  if (!image) {
    return generatedProductImage(name, category);
  }

  if (String(image).includes("placehold.co")) {
    return generatedProductImage(name, category);
  }

  return image;
}

function imageAttrs(image, name, category = "") {
  const safeName = String(name).replace(/"/g, "&quot;");
  const normalizedImage = normalizeImageUrl(image, name, category).replace(/"/g, "&quot;");
  const fallback = fallbackImageUrl(name).replace(/"/g, "&quot;");

  return `
    src="${normalizedImage}"
    alt="${safeName}"
    loading="lazy"
    decoding="async"
    referrerpolicy="no-referrer"
    onerror="this.onerror=null;this.src='${fallback}';"
  `;
}

function productCard(product) {
  return `
    <article class="product-card">
      <a class="product-media" href="product.html?id=${product.id}" aria-label="View ${product.name}">
        <img ${imageAttrs(product.image, product.name, product.category)}>
      </a>
      <div class="product-body">
        <span class="badge">${product.category}</span>
        <a class="product-title" href="product.html?id=${product.id}">${product.name}</a>
        <div class="meta">${product.description}</div>
        <div class="rating">&#9733; ${product.rating.toFixed(1)}</div>
        <div class="product-actions">
          <strong class="price">${money(product.price)}</strong>
          <button
            class="icon-btn"
            data-add="${product.id}"
            title="Add to cart"
            aria-label="Add ${product.name} to cart"
          >
            ${icons.plus}
          </button>
        </div>
      </div>
    </article>
  `;
}

function bindAddButtons(products) {
  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = products.find((item) => item.id === Number(button.dataset.add));

      if (product) {
        addToCart(product);
      }
    });
  });
}

function initSharedUI() {
  document.querySelectorAll("[data-icon='cart']").forEach((el) => {
    el.innerHTML = icons.cart;
  });

  document.querySelectorAll("[data-icon='menu']").forEach((el) => {
    el.innerHTML = icons.menu;
  });

  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav] a").forEach((link) => {
    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });

  updateCartCount();
}

document.addEventListener("DOMContentLoaded", initSharedUI);
