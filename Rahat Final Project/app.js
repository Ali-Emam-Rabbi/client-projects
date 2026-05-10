const founderImage = "assets/founder.jpg";
const currency = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

const pexelsImage = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

const products = [
  {
    id: "paracetamol-relief",
    name: "Paracetamol Relief Tablets",
    category: "Pain Relief",
    price: 95,
    rating: 4.8,
    added: 18,
    image: pexelsImage(11361813),
    description: "Fast everyday support for headaches, fever, and general discomfort with a travel-friendly pack."
  },
  {
    id: "ibuprofen-care",
    name: "Ibuprofen Care Capsules",
    category: "Pain Relief",
    price: 160,
    rating: 4.7,
    added: 17,
    image: pexelsImage(15525818),
    description: "A practical anti-inflammatory option designed for short-term muscle aches and body pain support."
  },
  {
    id: "vitamin-c-boost",
    name: "Vitamin C Boost Tablets",
    category: "Immunity",
    price: 320,
    rating: 4.9,
    added: 16,
    image: pexelsImage(7468582),
    description: "Daily vitamin C tablets to support immune wellness with an easy once-a-day routine."
  },
  {
    id: "zinc-daily",
    name: "Zinc Daily Support",
    category: "Immunity",
    price: 280,
    rating: 4.6,
    added: 15,
    image: pexelsImage(13013778),
    description: "Simple zinc supplementation for people who want steady day-to-day nutritional support."
  },
  {
    id: "infrared-thermometer",
    name: "Infrared Thermometer",
    category: "Diagnostics",
    price: 1450,
    rating: 4.8,
    added: 14,
    image: pexelsImage(7722669),
    description: "Quick, non-contact temperature checks for families and caregivers with a clean digital readout."
  },
  {
    id: "digital-blood-pressure-monitor",
    name: "Digital Blood Pressure Monitor",
    category: "Diagnostics",
    price: 2490,
    rating: 4.9,
    added: 13,
    image: pexelsImage(12203710),
    description: "Home-use monitoring with a clear display, compact cuff design, and dependable daily tracking."
  },
  {
    id: "pulse-oximeter-pro",
    name: "Pulse Oximeter Pro",
    category: "Diagnostics",
    price: 1290,
    rating: 4.7,
    added: 12,
    image: pexelsImage(8376321),
    description: "Portable fingertip oxygen and pulse measurement for quick wellness checks at home or on the move."
  },
  {
    id: "antiseptic-hand-sanitizer",
    name: "Antiseptic Hand Sanitizer",
    category: "Hygiene",
    price: 190,
    rating: 4.5,
    added: 11,
    image: pexelsImage(3999527),
    description: "A compact sanitizer bottle suited for office bags, travel kits, and everyday hygiene use."
  },
  {
    id: "surgical-mask-pack",
    name: "Surgical Mask Pack",
    category: "Hygiene",
    price: 240,
    rating: 4.6,
    added: 10,
    image: pexelsImage(5040585),
    description: "Comfortable multi-use mask pack for errands, clinics, and daily public-facing environments."
  },
  {
    id: "latex-gloves-box",
    name: "Latex Gloves Box",
    category: "Hygiene",
    price: 360,
    rating: 4.5,
    added: 9,
    image: pexelsImage(13704353),
    description: "Protective disposable gloves for household cleaning, wellness handling, and general safety needs."
  },
  {
    id: "disinfectant-wipes",
    name: "Disinfectant Wipes",
    category: "Hygiene",
    price: 220,
    rating: 4.4,
    added: 8,
    image: pexelsImage(8891443),
    description: "Quick surface-cleaning wipes that help keep desks, counters, and daily-use items refreshed."
  },
  {
    id: "first-aid-kit",
    name: "Compact First Aid Kit",
    category: "First Aid",
    price: 890,
    rating: 4.8,
    added: 7,
    image: pexelsImage(11894049),
    description: "A compact emergency kit with key daily essentials for home, office drawers, or travel."
  },
  {
    id: "elastic-bandage-roll",
    name: "Elastic Bandage Roll",
    category: "First Aid",
    price: 110,
    rating: 4.3,
    added: 6,
    image: pexelsImage(5149759),
    description: "Stretchable support for minor sprains, wraps, and convenient inclusion in any emergency kit."
  },
  {
    id: "adhesive-bandage-strips",
    name: "Adhesive Bandage Strips",
    category: "First Aid",
    price: 75,
    rating: 4.4,
    added: 5,
    image: pexelsImage(5125690),
    description: "Everyday wound-cover strips for minor cuts and scrapes with breathable comfort."
  },
  {
    id: "omega-3-softgels",
    name: "Omega-3 Softgels",
    category: "Wellness",
    price: 540,
    rating: 4.8,
    added: 4,
    image: pexelsImage(13787566),
    description: "Fish oil softgels for a balanced wellness routine with easy-to-swallow daily support."
  },
  {
    id: "multivitamin-complex",
    name: "Multivitamin Complex",
    category: "Wellness",
    price: 620,
    rating: 4.9,
    added: 3,
    image: pexelsImage(7468581),
    description: "A broad-spectrum vitamin formula for adults looking for all-round nutritional support."
  },
  {
    id: "hydration-electrolyte-mix",
    name: "Hydration Electrolyte Mix",
    category: "Wellness",
    price: 180,
    rating: 4.5,
    added: 2,
    image: pexelsImage(15038477),
    description: "Portable hydration support for warm days, long commutes, and active recovery routines."
  },
  {
    id: "sleep-support-gummies",
    name: "Sleep Support Gummies",
    category: "Wellness",
    price: 460,
    rating: 4.6,
    added: 1,
    image: pexelsImage(13779114),
    description: "A gentle nighttime support option for building a calming evening ritual."
  }
];

const state = {
  filters: {
    search: "",
    category: "All",
    maxPrice: Math.max(...products.map((product) => product.price)),
    sort: "newest"
  },
  authMode: "login"
};

const app = document.getElementById("app");
const cartCount = document.getElementById("cartCount");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem("zr-pharmacy-cart")) || [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem("zr-pharmacy-cart", JSON.stringify(cart));
  updateCartCount();
};

const getCartDetailed = () => {
  const cart = loadCart();
  return cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      if (!product) return null;
      return { ...product, quantity: item.quantity };
    })
    .filter(Boolean);
};

const totals = (cartItems) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 0 ? 80 : 0;
  return {
    subtotal,
    delivery,
    total: subtotal + delivery
  };
};

const updateCartCount = () => {
  const count = loadCart().reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = String(count);
};

const stars = (rating) => {
  const filled = Math.round(rating);
  return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
};

const uniqueCategories = ["All", ...new Set(products.map((product) => product.category))];

const findProduct = (id) => products.find((product) => product.id === id);

const routeInfo = () => {
  const hash = window.location.hash || "#/home";
  const cleaned = hash.replace(/^#\//, "");
  const [page = "home", slug = ""] = cleaned.split("/");
  return { page, slug };
};

const goTo = (hash) => {
  window.location.hash = hash;
};

const addToCart = (productId) => {
  const cart = loadCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart(cart);
  window.alert("Item added to cart.");
};

const updateQuantity = (productId, nextQuantity) => {
  const cart = loadCart();
  const updated = cart
    .map((item) => item.id === productId ? { ...item, quantity: nextQuantity } : item)
    .filter((item) => item.quantity > 0);
  saveCart(updated);
  render();
};

const removeFromCart = (productId) => {
  const next = loadCart().filter((item) => item.id !== productId);
  saveCart(next);
  render();
};

const filteredProducts = () => {
  const { search, category, maxPrice, sort } = state.filters;
  const matching = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    const matchesPrice = product.price <= Number(maxPrice);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sorted = [...matching];
  if (sort === "low-high") sorted.sort((a, b) => a.price - b.price);
  if (sort === "high-low") sorted.sort((a, b) => b.price - a.price);
  if (sort === "newest") sorted.sort((a, b) => b.added - a.added);
  return sorted;
};

const navTemplate = (activePage) => {
  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    const page = href?.replace("#/", "");
    link.classList.toggle("active", page === activePage);
  });
};

const productCard = (product) => `
  <article class="grid-card product-card">
    <div class="product-media">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
    </div>
    <div class="badge-row">
      <span class="badge">${product.category}</span>
      <span class="badge"><span class="rating">${stars(product.rating)}</span> ${product.rating}</span>
    </div>
    <div class="product-copy">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
    </div>
    <div class="product-footer">
      <div>
        <div class="price">${currency.format(product.price)}</div>
      </div>
      <div class="product-actions">
        <button class="icon-button" data-view-product="${product.id}" aria-label="View ${product.name}">
          <i class="fa-solid fa-eye"></i>
        </button>
        <button class="primary-button" data-add-cart="${product.id}">Add to Cart</button>
      </div>
    </div>
  </article>
`;

const renderHome = () => {
  const featured = products.slice(0, 6);
  return `
    <section class="page">
      <section class="hero">
        <div class="hero-copy">
          <span class="eyebrow"><i class="fa-solid fa-shield-heart"></i> Pharmacy e-commerce with a modern care-first experience</span>
          <h1>Health essentials shaped for daily confidence.</h1>
          <p>
            ZR Pharmacy blends clean design, trusted product browsing, and a smooth checkout journey so customers can shop
            wellness, diagnostics, hygiene, and first aid in one place.
          </p>
          <div class="hero-actions">
            <button class="primary-button" data-route="#/shop">Explore the Shop</button>
            <button class="secondary-button" data-route="#/about">Meet the Founder</button>
          </div>
          <div class="hero-stats">
            <div class="stat-card">
              <strong>18</strong>
              <span>Curated products</span>
            </div>
            <div class="stat-card">
              <strong>6</strong>
              <span>Core health categories</span>
            </div>
            <div class="stat-card">
              <strong>100%</strong>
              <span>Responsive layout</span>
            </div>
          </div>
        </div>

        <aside class="hero-panel">
          <div class="mini-banner">
            <div class="mini-banner-content">
              <h3>Clear care, fast checkout</h3>
              <p>Find your essentials, review the cart, and submit orders in a clean and reliable flow.</p>
            </div>
          </div>
          <div class="hero-highlights">
            <div class="hero-highlight">
              <i class="fa-solid fa-prescription-bottle-medical"></i>
              <div>
                <h3 class="card-title">Curated wellness collection</h3>
                <p>Pharmacy-style categories organized around daily needs instead of clutter.</p>
              </div>
            </div>
            <div class="hero-highlight">
              <i class="fa-solid fa-heart-pulse"></i>
              <div>
                <h3 class="card-title">Smooth customer journey</h3>
                <p>Search, filter, sort, add to cart, and check out without friction or broken steps.</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section>
        <div class="section-title">
          <div>
            <span class="eyebrow">Why ZR Pharmacy</span>
            <h2>Designed for trust, speed, and clarity</h2>
          </div>
        </div>
        <div class="feature-grid">
          <article class="grid-card">
            <i class="fa-solid fa-capsules"></i>
            <h3 class="card-title">Focused pharmacy catalog</h3>
            <p class="muted">Each product card includes pricing in BDT, category, description, rating, and a live image.</p>
          </article>
          <article class="grid-card">
            <i class="fa-solid fa-filter-circle-dollar"></i>
            <h3 class="card-title">Flexible shop controls</h3>
            <p class="muted">Visitors can narrow products through search, category filters, sort order, and max price slider.</p>
          </article>
          <article class="grid-card">
            <i class="fa-solid fa-truck-medical"></i>
            <h3 class="card-title">Reliable order flow</h3>
            <p class="muted">A persistent cart and a working checkout form make the storefront feel complete and practical.</p>
          </article>
        </div>
      </section>

      <section>
        <div class="section-title">
          <div>
            <span class="eyebrow">Shop Categories</span>
            <h2>Browse care by purpose</h2>
          </div>
          <button class="secondary-button" data-route="#/shop">Open full catalog</button>
        </div>
        <div class="category-grid">
          <article class="category-card" style="background-image:url('${pexelsImage(15525832)}')">
            <div class="category-copy"><h3>Pain Relief</h3><p>Quick daily support</p></div>
          </article>
          <article class="category-card" style="background-image:url('${pexelsImage(33122263)}')">
            <div class="category-copy"><h3>Diagnostics</h3><p>Monitor with confidence</p></div>
          </article>
          <article class="category-card" style="background-image:url('${pexelsImage(8891460)}')">
            <div class="category-copy"><h3>Hygiene</h3><p>Clean everyday essentials</p></div>
          </article>
          <article class="category-card" style="background-image:url('${pexelsImage(11894049)}')">
            <div class="category-copy"><h3>First Aid</h3><p>Prepared for the unexpected</p></div>
          </article>
        </div>
      </section>

      <section>
        <div class="section-title">
          <div>
            <span class="eyebrow">Featured Products</span>
            <h2>Top picks from the storefront</h2>
          </div>
        </div>
        <div class="product-grid">
          ${featured.map(productCard).join("")}
        </div>
      </section>
    </section>
  `;
};

const renderShop = () => {
  const list = filteredProducts();
  return `
    <section class="page">
      <div class="section-title">
        <div>
          <span class="eyebrow">Shop</span>
          <h1>Browse pharmacy essentials</h1>
          <p>Search by product name, narrow by category, set a max budget, or sort the catalog your way.</p>
        </div>
      </div>
      <section class="shop-layout">
        <aside class="panel">
          <div class="filter-group">
            <label for="searchInput">Search products</label>
            <input id="searchInput" type="search" placeholder="Search by product name" value="${state.filters.search}">
          </div>

          <div class="filter-group">
            <label>Categories</label>
            <div class="chips">
              ${uniqueCategories.map((category) => `
                <button class="chip ${state.filters.category === category ? "active" : ""}" data-category="${category}">
                  ${category}
                </button>
              `).join("")}
            </div>
          </div>

          <div class="filter-group">
            <label for="priceRange">Max price</label>
            <div class="range-row">
              <span>&#2547; 0</span>
              <strong>${currency.format(state.filters.maxPrice)}</strong>
            </div>
            <input id="priceRange" type="range" min="75" max="2490" step="5" value="${state.filters.maxPrice}">
          </div>

          <div class="filter-group">
            <label for="sortSelect">Sort by</label>
            <select id="sortSelect">
              <option value="newest" ${state.filters.sort === "newest" ? "selected" : ""}>Newest</option>
              <option value="low-high" ${state.filters.sort === "low-high" ? "selected" : ""}>Price: Low to High</option>
              <option value="high-low" ${state.filters.sort === "high-low" ? "selected" : ""}>Price: High to Low</option>
            </select>
          </div>

          <button class="secondary-button" id="clearFilters">Reset filters</button>
        </aside>

        <div class="panel">
          <div class="result-bar">
            <div>
              <h3 class="card-title">${list.length} product${list.length === 1 ? "" : "s"} found</h3>
              <p class="muted">Every item includes a unique image URL and live product details.</p>
            </div>
            <button class="ghost-button" data-route="#/cart">View Cart</button>
          </div>
          <div class="product-grid">
            ${list.map(productCard).join("") || `
              <div class="empty-state">
                <h3>No products matched those filters.</h3>
                <p>Try widening the price range or clearing the search terms.</p>
              </div>
            `}
          </div>
        </div>
      </section>
    </section>
  `;
};

const renderProductDetails = (slug) => {
  const product = findProduct(slug);
  if (!product) {
    return `
      <section class="page">
        <div class="empty-state">
          <h2>Product not found</h2>
          <p>The product you are looking for does not exist in the catalog.</p>
          <button class="primary-button" data-route="#/shop">Back to Shop</button>
        </div>
      </section>
    `;
  }

  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);

  return `
    <section class="page">
      <div class="section-title">
        <div>
          <span class="eyebrow">${product.category}</span>
          <h1>${product.name}</h1>
        </div>
        <button class="secondary-button" data-route="#/shop">Back to Shop</button>
      </div>

      <section class="product-detail">
        <div class="detail-media">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="detail-copy">
          <div class="badge-row">
            <span class="badge">${product.category}</span>
            <span class="badge"><span class="rating">${stars(product.rating)}</span> ${product.rating}</span>
          </div>
          <div class="price">${currency.format(product.price)}</div>
          <p class="product-description">${product.description}</p>
          <div class="summary-stats">
            <div class="summary-stat">
              <i class="fa-solid fa-shield-virus"></i>
              <h3 class="card-title">Quality-focused selection</h3>
              <p class="muted">Listed for a polished storefront experience with clear pricing and categorization.</p>
            </div>
            <div class="summary-stat">
              <i class="fa-solid fa-bag-shopping"></i>
              <h3 class="card-title">Ready for checkout</h3>
              <p class="muted">Add it to the cart and continue to a complete checkout form with order submission.</p>
            </div>
          </div>
          <div class="detail-actions">
            <button class="primary-button" data-add-cart="${product.id}">Add to Cart</button>
            <button class="secondary-button" data-route="#/checkout">Go to Checkout</button>
          </div>
        </div>
      </section>

      <section>
        <div class="section-title">
          <div>
            <span class="eyebrow">You may also like</span>
            <h2>More in ${product.category}</h2>
          </div>
        </div>
        <div class="product-grid">
          ${related.map(productCard).join("")}
        </div>
      </section>
    </section>
  `;
};

const renderCart = () => {
  const cartItems = getCartDetailed();
  const summary = totals(cartItems);

  if (!cartItems.length) {
    return `
      <section class="page">
        <div class="empty-state">
          <h1>Your cart is empty</h1>
          <p>Browse the catalog and add products to start a new order.</p>
          <button class="primary-button" data-route="#/shop">Start Shopping</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="page">
      <div class="section-title">
        <div>
          <span class="eyebrow">Cart</span>
          <h1>Review your selected products</h1>
        </div>
      </div>

      <section class="cart-layout">
        <div class="cart-items">
          <div class="cart-stack">
            ${cartItems.map((item) => `
              <article class="cart-item">
                <div class="cart-item-media">
                  <img src="${item.image}" alt="${item.name}">
                </div>
                <div>
                  <h3 class="card-title">${item.name}</h3>
                  <p>${item.category}</p>
                  <div class="price">${currency.format(item.price)}</div>
                </div>
                <div class="cart-item-actions">
                  <button class="qty-button" data-quantity="${item.id}|${item.quantity - 1}" aria-label="Decrease quantity">-</button>
                  <strong>${item.quantity}</strong>
                  <button class="qty-button" data-quantity="${item.id}|${item.quantity + 1}" aria-label="Increase quantity">+</button>
                  <button class="secondary-button" data-remove-cart="${item.id}">Remove</button>
                </div>
              </article>
            `).join("")}
          </div>
        </div>

        <aside class="summary-card">
          <h3>Order Summary</h3>
          <div class="cart-summary-line">
            <span>Subtotal</span>
            <strong>${currency.format(summary.subtotal)}</strong>
          </div>
          <div class="cart-summary-line">
            <span>Delivery</span>
            <strong>${currency.format(summary.delivery)}</strong>
          </div>
          <div class="cart-summary-line summary-total">
            <span>Total</span>
            <strong>${currency.format(summary.total)}</strong>
          </div>
          <button class="primary-button" data-route="#/checkout">Proceed to Checkout</button>
          <button class="secondary-button" data-route="#/shop">Continue Shopping</button>
        </aside>
      </section>
    </section>
  `;
};

const renderCheckout = () => {
  const cartItems = getCartDetailed();
  const summary = totals(cartItems);

  if (!cartItems.length) {
    return `
      <section class="page">
        <div class="empty-state">
          <h1>No items ready for checkout</h1>
          <p>Add products to the cart first so the order form has something to submit.</p>
          <button class="primary-button" data-route="#/shop">Go to Shop</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="page">
      <div class="section-title">
        <div>
          <span class="eyebrow">Checkout</span>
          <h1>Complete your order</h1>
          <p>Fill in your delivery details to submit the order successfully.</p>
        </div>
      </div>

      <section class="checkout-layout">
        <form class="checkout-form" id="checkoutForm">
          <div>
            <label for="customerName">Full Name</label>
            <input id="customerName" name="fullName" type="text" placeholder="Enter your full name" required>
          </div>
          <div>
            <label for="customerPhone">Phone Number</label>
            <input id="customerPhone" name="phone" type="tel" placeholder="Enter your phone number" required>
          </div>
          <div>
            <label for="customerAddress">Address</label>
            <textarea id="customerAddress" name="address" placeholder="Enter your full delivery address" required></textarea>
          </div>
          <button class="primary-button" type="submit">Submit Order</button>
        </form>

        <aside class="summary-card">
          <h3>Checkout Summary</h3>
          ${cartItems.map((item) => `
            <div class="cart-summary-line">
              <span>${item.name} x ${item.quantity}</span>
              <strong>${currency.format(item.price * item.quantity)}</strong>
            </div>
          `).join("")}
          <div class="cart-summary-line">
            <span>Delivery</span>
            <strong>${currency.format(summary.delivery)}</strong>
          </div>
          <div class="cart-summary-line summary-total">
            <span>Total</span>
            <strong>${currency.format(summary.total)}</strong>
          </div>
        </aside>
      </section>
    </section>
  `;
};

const renderAbout = () => `
  <section class="page">
    <div class="section-title">
      <div>
        <span class="eyebrow">About ZR Pharmacy</span>
        <h1>Built around dependable care and a clear customer journey</h1>
        <p>ZR Pharmacy presents a clean medical storefront identity with a modern interface, practical navigation, and a care-first brand voice.</p>
      </div>
    </div>

    <section class="about-grid">
      <article class="founder-panel">
        <div class="founder-visual">
          <img src="${founderImage}" alt="Founder S M Rahat Serazee">
        </div>
        <div class="founder-copy">
          <span class="eyebrow">Founder</span>
          <h2>S M Rahat Serazee</h2>
          <p>
            S M Rahat Serazee leads the vision for ZR Pharmacy with a focus on creating a professional digital experience
            that feels trustworthy, easy to navigate, and accessible across mobile and desktop devices.
          </p>
          <div class="summary-stats">
            <div class="summary-stat">
              <i class="fa-solid fa-location-dot"></i>
              <h3 class="card-title">Based in</h3>
              <p class="muted">Meherpur, Dhaka, Bangladesh</p>
            </div>
            <div class="summary-stat">
              <i class="fa-solid fa-envelope"></i>
              <h3 class="card-title">Contact</h3>
              <p class="muted">smrahat0211@gmail.com</p>
            </div>
          </div>
        </div>
      </article>

      <aside class="summary-card">
        <h3>What makes this storefront stand out</h3>
        <p>A glassmorphism-inspired pharmacy theme, bold layout rhythm, and a working e-commerce flow from browsing to order submission.</p>
        <div class="info-row">
          <i class="fa-solid fa-check"></i>
          <span>Unique logo and branded medical color palette</span>
        </div>
        <div class="info-row">
          <i class="fa-solid fa-check"></i>
          <span>Dedicated pages for shop, cart, checkout, contact, and authentication</span>
        </div>
        <div class="info-row">
          <i class="fa-solid fa-check"></i>
          <span>Search, filter, price slider, sort controls, and persistent cart storage</span>
        </div>
      </aside>
    </section>
  </section>
`;

const renderContact = () => `
  <section class="page">
    <div class="section-title">
      <div>
        <span class="eyebrow">Contact</span>
        <h1>Connect with ZR Pharmacy</h1>
        <p>Reach out for partnership, storefront inquiries, or product-related communication.</p>
      </div>
    </div>

    <section class="contact-grid">
      <div class="contact-card">
        <h3>Contact Details</h3>
        <div class="contact-row">
          <i class="fa-solid fa-envelope"></i>
          <div>
            <strong>Email</strong>
            <p>smrahat0211@gmail.com</p>
          </div>
        </div>
        <div class="contact-row">
          <i class="fa-solid fa-location-dot"></i>
          <div>
            <strong>Address</strong>
            <p>Meherpur, Dhaka, Bangladesh</p>
          </div>
        </div>
        <div class="contact-row">
          <i class="fa-solid fa-share-nodes"></i>
          <div>
            <strong>Social Media</strong>
            <div class="social-links">
              <a href="https://www.linkedin.com/in/s-m-rahat-serazee-6a191623b/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <i class="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="https://www.facebook.com/S.M.Rahat.Serazee/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i class="fa-brands fa-facebook-f"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="contact-card">
        <h3>Send a message</h3>
        <form class="contact-form" id="contactForm">
          <input type="text" name="name" placeholder="Your name" required>
          <input type="email" name="email" placeholder="Your email" required>
          <textarea name="message" placeholder="Write your message" required></textarea>
          <button class="primary-button" type="submit">Send Message</button>
        </form>
      </div>
    </section>
  </section>
`;

const renderAuth = () => `
  <section class="page">
    <div class="section-title">
      <div>
        <span class="eyebrow">Access</span>
        <h1>Simple login and signup interface</h1>
        <p>This section provides a clean front-end authentication layout without backend integration.</p>
      </div>
    </div>

    <section class="auth-grid">
      <div class="auth-panel">
        <div class="auth-tabs">
          <button class="${state.authMode === "login" ? "active" : ""}" data-auth-mode="login">Login</button>
          <button class="${state.authMode === "signup" ? "active" : ""}" data-auth-mode="signup">Signup</button>
        </div>
        <form class="auth-form" id="authForm">
          ${state.authMode === "signup" ? '<input type="text" name="name" placeholder="Full name" required>' : ""}
          <input type="email" name="email" placeholder="Email address" required>
          <input type="password" name="password" placeholder="Password" required>
          ${state.authMode === "signup" ? '<input type="password" name="confirmPassword" placeholder="Confirm password" required>' : ""}
          <button class="primary-button" type="submit">${state.authMode === "login" ? "Login" : "Create Account"}</button>
        </form>
      </div>

      <aside class="summary-card">
        <h3>${state.authMode === "login" ? "Welcome back" : "Create your account"}</h3>
        <p>${state.authMode === "login"
          ? "Use the clean login form layout to represent account access for returning customers."
          : "Use the signup layout to represent new customer onboarding in a polished front-end flow."}</p>
        <div class="info-row">
          <i class="fa-solid fa-user-shield"></i>
          <span>Front-end only demo interface</span>
        </div>
        <div class="info-row">
          <i class="fa-solid fa-mobile-screen-button"></i>
          <span>Optimized for desktop and mobile breakpoints</span>
        </div>
      </aside>
    </section>
  </section>
`;

const renderSuccess = (reference) => `
  <section class="page">
    <div class="success-panel">
      <span class="eyebrow">Order Submitted</span>
      <h1>Your order has been placed successfully</h1>
      <p>Reference: <strong>${reference}</strong></p>
      <p>ZR Pharmacy has captured the customer details and cleared the cart for the next order.</p>
      <div class="hero-actions">
        <button class="primary-button" data-route="#/shop">Continue Shopping</button>
        <button class="secondary-button" data-route="#/home">Back to Home</button>
      </div>
    </div>
  </section>
`;

const renderPage = () => {
  const { page, slug } = routeInfo();
  navTemplate(page);

  if (page === "home") return renderHome();
  if (page === "shop") return renderShop();
  if (page === "product") return renderProductDetails(slug);
  if (page === "cart") return renderCart();
  if (page === "checkout") return renderCheckout();
  if (page === "about") return renderAbout();
  if (page === "contact") return renderContact();
  if (page === "auth") return renderAuth();
  if (page === "success") return renderSuccess(slug || "ZR-ORDER");
  return renderHome();
};

const bindCommonEvents = () => {
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => goTo(button.dataset.route));
  });

  document.querySelectorAll("[data-view-product]").forEach((button) => {
    button.addEventListener("click", () => goTo(`#/product/${button.dataset.viewProduct}`));
  });

  document.querySelectorAll("[data-add-cart]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.addCart));
  });

  document.querySelectorAll("[data-remove-cart]").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.removeCart));
  });

  document.querySelectorAll("[data-quantity]").forEach((button) => {
    button.addEventListener("click", () => {
      const [id, quantity] = button.dataset.quantity.split("|");
      updateQuantity(id, Number(quantity));
    });
  });
};

const bindShopEvents = () => {
  const searchInput = document.getElementById("searchInput");
  const priceRange = document.getElementById("priceRange");
  const sortSelect = document.getElementById("sortSelect");
  const clearFilters = document.getElementById("clearFilters");

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      state.filters.search = event.target.value;
      render();
    });
  }

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters.category = button.dataset.category;
      render();
    });
  });

  if (priceRange) {
    priceRange.addEventListener("input", (event) => {
      state.filters.maxPrice = Number(event.target.value);
      render();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      state.filters.sort = event.target.value;
      render();
    });
  }

  if (clearFilters) {
    clearFilters.addEventListener("click", () => {
      state.filters = {
        search: "",
        category: "All",
        maxPrice: Math.max(...products.map((product) => product.price)),
        sort: "newest"
      };
      render();
    });
  }
};

const bindForms = () => {
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(checkoutForm);
      const fullName = String(formData.get("fullName") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const address = String(formData.get("address") || "").trim();

      if (!fullName || !phone || !address) {
        window.alert("Please complete all checkout fields.");
        return;
      }

      const reference = `ZR-${Date.now().toString().slice(-6)}`;
      localStorage.setItem(
        "zr-pharmacy-last-order",
        JSON.stringify({
          reference,
          fullName,
          phone,
          address,
          items: getCartDetailed()
        })
      );
      saveCart([]);
      goTo(`#/success/${reference}`);
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      window.alert("Your message has been captured successfully.");
      contactForm.reset();
    });
  }

  const authForm = document.getElementById("authForm");
  if (authForm) {
    authForm.addEventListener("submit", (event) => {
      event.preventDefault();
      window.alert(state.authMode === "login" ? "Login UI submitted." : "Signup UI submitted.");
      authForm.reset();
    });
  }

  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.authMode = button.dataset.authMode;
      render();
    });
  });
};

const render = () => {
  app.innerHTML = renderPage();
  bindCommonEvents();
  bindShopEvents();
  bindForms();
  siteNav.classList.remove("open");
  updateCartCount();
};

menuToggle.addEventListener("click", () => {
  siteNav.classList.toggle("open");
});

document.getElementById("searchShortcut").addEventListener("click", () => {
  goTo("#/shop");
});

window.addEventListener("hashchange", render);
window.addEventListener("load", () => {
  if (!window.location.hash) {
    goTo("#/home");
  } else {
    render();
  }
});
