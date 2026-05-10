// =============================================
//   LuxeAura — E-Commerce JavaScript
//   Clean, beginner-friendly, well-commented
// =============================================

// ===== PRODUCT DATA =====
// Add, remove, or edit products here easily
const products = [
  {
    id: 1,
    name: "Minimal Leather Watch",
    category: "fashion",
    price: 500,
    badge: "Bestseller",
    // Use real image URLs or replace with your own images
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
  },
  {
    id: 2,
    name: "Premium Wireless Earbuds",
    category: "tech",
    price: 2299,
    badge: "New",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80"
  },
  {
    id: 3,
    name: "Luxury Silk Scarf",
    category: "fashion",
    price: 1299,
    badge: null,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80"
  },
  {
    id: 4,
    name: "Aromatic Candle Set",
    category: "lifestyle",
    price: 899,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&q=80"
  },
  {
    id: 5,
    name: "Smart Desk Lamp",
    category: "tech",
    price: 1799,
    badge: "New",
    image: "https://www.smarteshopbd.com/wp-content/uploads/2024/05/Baseus-Smart-Eye-Series-Rechargeable-Folding-Reading-Desk-Lamp7.webp"
  },
  {
    id: 6,
    name: "Handcrafted Leather Wallet",
    category: "fashion",
    price: 1150,
    badge: null,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80"
  },
  {
    id: 7,
    name: "Ceramic Coffee Mug",
    category: "lifestyle",
    price: 649,
    badge: null,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80"
  },
  {
    id: 8,
    name: "Portable Phone Stand",
    category: "tech",
    price: 799,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80"
  }
];

// ===== STATE VARIABLES =====
let cart = [];               // Shopping cart array
let activeCategory = "all"; // Current category filter
let maxPrice = 5000;         // Current max price filter

// ===== DOM ELEMENTS =====
const productsGrid    = document.getElementById("productsGrid");
const cartSidebar     = document.getElementById("cartSidebar");
const cartOverlay     = document.getElementById("cartOverlay");
const cartBtn         = document.getElementById("cartBtn");
const closeCartBtn    = document.getElementById("closeCart");
const cartItemsEl     = document.getElementById("cartItems");
const cartCountEl     = document.getElementById("cartCount");
const cartTotalEl     = document.getElementById("cartTotal");
const categoryFilter  = document.getElementById("categoryFilter");
const priceFilter     = document.getElementById("priceFilter");
const priceLabelEl    = document.getElementById("priceLabel");
const toastEl         = document.getElementById("toast");
const toastMsgEl      = document.getElementById("toastMsg");
const navbar          = document.getElementById("navbar");
const hamburger       = document.getElementById("hamburger");

// ===== RENDER PRODUCTS =====
// This function displays products based on active filters
function renderProducts() {
  // Filter products based on category and price
  const filtered = products.filter(p => {
    const matchCategory = activeCategory === "all" || p.category === activeCategory;
    const matchPrice    = p.price <= maxPrice;
    return matchCategory && matchPrice;
  });

  // Clear the grid before re-rendering
  productsGrid.innerHTML = "";

  // Show a message if no products match
  if (filtered.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-products">
        <i class="fas fa-search"></i>
        <p>No products found. Try adjusting your filters.</p>
      </div>`;
    return;
  }

  // Create a card for each product
  filtered.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${index * 0.07}s`;

    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x400/1a1a2e/c9a96e?text=Product'"/>
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <button class="product-wishlist" title="Add to Wishlist">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-bottom">
          <span class="product-price">৳${product.price.toLocaleString()}</span>
          <button class="add-cart-btn" data-id="${product.id}">
            Add to Bag
          </button>
        </div>
      </div>
    `;

    // Wishlist toggle
    const wishlistBtn = card.querySelector(".product-wishlist");
    wishlistBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const icon = wishlistBtn.querySelector("i");
      icon.style.color = icon.style.color === "rgb(231, 76, 60)" ? "" : "#e74c3c";
    });

    // Add to cart
    const addBtn = card.querySelector(".add-cart-btn");
    addBtn.addEventListener("click", () => addToCart(product.id));

    productsGrid.appendChild(card);
  });
}

// ===== CART FUNCTIONS =====

// Add item to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.qty += 1; // If already in cart, increase qty
  } else {
    cart.push({ ...product, qty: 1 }); // Add new item
  }

  updateCartUI();
  showToast(`"${product.name}" added to bag!`);
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

// Change item quantity
function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    updateCartUI();
  }
}

// Update cart display
function updateCartUI() {
  // Count total items
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = totalItems;

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotalEl.textContent = `৳${totalPrice.toLocaleString()}`;

  // Render cart items
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>Your bag is empty</p>
      </div>`;
    return;
  }

  cartItemsEl.innerHTML = "";
  cart.forEach(item => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/60x60/1a1a2e/c9a96e?text=?'"/>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">৳${(item.price * item.qty).toLocaleString()}</p>
        <div class="cart-item-qty">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
        </div>
      </div>
      <button class="remove-item" data-id="${item.id}" title="Remove">
        <i class="fas fa-times"></i>
      </button>
    `;
    cartItemsEl.appendChild(el);
  });

  // Attach qty and remove button events
  cartItemsEl.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id    = parseInt(btn.dataset.id);
      const delta = parseInt(btn.dataset.delta);
      changeQty(id, delta);
    });
  });
  cartItemsEl.querySelectorAll(".remove-item").forEach(btn => {
    btn.addEventListener("click", () => {
      removeFromCart(parseInt(btn.dataset.id));
    });
  });
}

// Open / close cart
function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// ===== TOAST NOTIFICATION =====
let toastTimeout;
function showToast(message) {
  toastMsgEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toastEl.classList.remove("show"), 3000);
}

// ===== FILTERS =====

// Category filter
categoryFilter.addEventListener("click", (e) => {
  if (!e.target.matches(".chip")) return;
  activeCategory = e.target.dataset.category;

  // Update active chip
  categoryFilter.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  e.target.classList.add("active");

  renderProducts();
});

// Price range filter
priceFilter.addEventListener("input", () => {
  maxPrice = parseInt(priceFilter.value);
  priceLabelEl.textContent = `৳${maxPrice.toLocaleString()}`;
  renderProducts();
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ===== MOBILE MENU =====
let mobileMenuEl = null;
function createMobileMenu() {
  if (mobileMenuEl) return;
  mobileMenuEl = document.createElement("div");
  mobileMenuEl.className = "mobile-menu";
  mobileMenuEl.innerHTML = `
    <a href="#home"     onclick="closeMobileMenu()">Home</a>
    <a href="#products" onclick="closeMobileMenu()">Products</a>
    <a href="#about"    onclick="closeMobileMenu()">About</a>
    <a href="#contact"  onclick="closeMobileMenu()">Contact</a>
  `;
  document.body.appendChild(mobileMenuEl);
}
function openMobileMenu() {
  createMobileMenu();
  mobileMenuEl.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeMobileMenu() {
  if (mobileMenuEl) {
    mobileMenuEl.classList.remove("open");
    document.body.style.overflow = "";
  }
}

let menuOpen = false;
hamburger.addEventListener("click", () => {
  menuOpen = !menuOpen;
  if (menuOpen) {
    openMobileMenu();
  } else {
    closeMobileMenu();
  }
});

// ===== EVENT LISTENERS =====
cartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Checkout button (placeholder)
document.querySelector(".checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your bag is empty!");
    return;
  }
  showToast("Checkout coming soon! Thank you 🙏");
});

// ===== SMOOTH SCROLL for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ===== INIT =====
renderProducts();
updateCartUI();

console.log("✅ LuxeAura loaded successfully! Edit products[] array to customize.");
