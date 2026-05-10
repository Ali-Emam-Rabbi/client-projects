document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector("[data-featured]");
  if (!grid) return;
  grid.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
  try {
    const products = await loadProducts();
    const featured = products.sort((a, b) => b.rating - a.rating).slice(0, 8);
    grid.innerHTML = featured.map(productCard).join("");
    bindAddButtons(products);
  } catch (error) {
    grid.innerHTML = '<div class="empty">Products could not be loaded right now.</div>';
  }
});
