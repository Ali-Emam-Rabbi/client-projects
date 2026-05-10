let allProducts = [];
let shopInitialized = false;

function uniqueProducts(products) {
  const seen = new Set();

  return products.filter((product) => {
    if (!product || seen.has(product.id)) {
      return false;
    }

    seen.add(product.id);
    return true;
  });
}

function applyFilters() {
  const query = document.querySelector("#search").value.trim().toLowerCase();
  const category = document.querySelector("#category").value;
  const sort = document.querySelector("#sort").value;
  const max = Number(document.querySelector("#price").value);
  document.querySelector("[data-price-label]").textContent = money(max);

  let products = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(query);
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory && product.price <= max;
  });

  if (sort === "price-low") products.sort((a, b) => a.price - b.price);
  if (sort === "price-high") products.sort((a, b) => b.price - a.price);
  if (sort === "newest") products.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sort === "rating") products.sort((a, b) => b.rating - a.rating);

  const grid = document.querySelector("[data-products]");
  document.querySelector("[data-count]").textContent = `${products.length} products found`;
  grid.innerHTML = "";
  grid.innerHTML = products.length
    ? products.map(productCard).join("")
    : '<div class="empty">No products match your filters.</div>';
  bindAddButtons(allProducts);
}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector("[data-products]");
  if (!grid || shopInitialized) return;

  shopInitialized = true;
  grid.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';

  try {
    allProducts = uniqueProducts(await loadProducts());
    const categories = ["All", ...new Set(allProducts.map(product => product.category))];
    document.querySelector("#category").innerHTML = categories.map(cat => `<option>${cat}</option>`).join("");
    const maxPrice = Math.max(...allProducts.map(product => product.price));
    const price = document.querySelector("#price");

    price.max = maxPrice;
    price.value = maxPrice;

    document.querySelectorAll("#search,#category,#sort,#price").forEach((el) => {
      el.addEventListener("input", applyFilters);
    });

    applyFilters();
  } catch (error) {
    grid.innerHTML = '<div class="empty">Products could not be loaded right now.</div>';
  }
});
