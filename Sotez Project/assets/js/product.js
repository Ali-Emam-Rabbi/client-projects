document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.querySelector("[data-product-detail]");

  if (!mount) {
    return;
  }

  try {
    const products = await loadProducts();
    const idParam = new URLSearchParams(window.location.search).get("id");
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      mount.innerHTML = '<div class="empty">Product not found.</div>';
      return;
    }

    const product = products.find((item) => item.id === id);

    if (!product) {
      mount.innerHTML = '<div class="empty">Product not found.</div>';
      return;
    }

    document.title = `${product.name} | Sastho seba`;
    mount.innerHTML = `
      <div class="details-media">
        <img ${imageAttrs(product.image, product.name, product.category)}>
      </div>
      <div class="details-info">
        <span class="badge">${product.category}</span>
        <h1>${product.name}</h1>
        <p class="lead">${product.description}</p>
        <p class="rating">&#9733; ${product.rating.toFixed(1)} customer rating</p>
        <p class="price">${money(product.price)}</p>
        <div class="field">
          <label for="qty">Quantity</label>
          <div class="qty-control">
            <button type="button" data-minus aria-label="Decrease quantity">-</button>
            <input id="qty" value="1" min="1" max="20" inputmode="numeric">
            <button type="button" data-plus aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="btn" type="button" data-detail-add>Add to cart</button>
        <div class="placeholder-box" style="margin-top:18px;">Placeholder: prescription notes, dosage warning, stock details, or delivery policy can be added here later.</div>
      </div>
    `;

    const qtyInput = document.querySelector("#qty");

    document.querySelector("[data-minus]").addEventListener("click", () => {
      qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
    });

    document.querySelector("[data-plus]").addEventListener("click", () => {
      qtyInput.value = Math.min(20, Number(qtyInput.value) + 1);
    });

    document.querySelector("[data-detail-add]").addEventListener("click", () => {
      addToCart(product, Math.max(1, Number(qtyInput.value) || 1));
    });
  } catch (error) {
    mount.innerHTML = '<div class="empty">Product details could not be loaded.</div>';
  }
});
