const ORDERS_KEY = "sasthoSebaOrders";

function orderTotals(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal > 0 ? 60 : 0;
  const total = subtotal + delivery;

  return { subtotal, delivery, total };
}

function renderCart() {
  const cart = getCart();
  const list = document.querySelector("[data-cart-list]");
  const { subtotal, delivery, total } = orderTotals(cart);
  const checkoutButton = document.querySelector("[data-checkout-form] button[type='submit']");
  const success = document.querySelector("[data-order-success]");

  if (!cart.length) {
    list.innerHTML = '<div class="empty">Your cart is empty. Add medicines from the shop to begin.</div>';
    if (success) {
      success.textContent = "";
    }
  } else {
    list.innerHTML = cart.map((item) => `
      <div class="cart-item">
        <img ${imageAttrs(item.image, item.name, item.category)}>
        <div>
          <strong>${item.name}</strong>
          <div class="meta">${money(item.price)} each</div>
          <div class="qty-control" style="margin-top:8px;">
            <button data-dec="${item.id}" aria-label="Decrease ${item.name}">-</button>
            <input value="${item.qty}" readonly aria-label="${item.name} quantity">
            <button data-inc="${item.id}" aria-label="Increase ${item.name}">+</button>
          </div>
        </div>
        <div class="cart-line-actions">
          <strong class="price">${money(item.price * item.qty)}</strong>
          <button class="btn danger" data-remove="${item.id}" style="margin-top:8px;">Remove</button>
        </div>
      </div>
    `).join("");
  }

  document.querySelector("[data-subtotal]").textContent = money(subtotal);
  document.querySelector("[data-delivery]").textContent = money(delivery);
  document.querySelector("[data-total]").textContent = money(total);

  if (checkoutButton) {
    checkoutButton.disabled = cart.length === 0;
    checkoutButton.style.opacity = cart.length === 0 ? "0.6" : "1";
    checkoutButton.style.cursor = cart.length === 0 ? "not-allowed" : "pointer";
  }

  document.querySelectorAll("[data-inc]").forEach((btn) => {
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.inc), 1));
  });

  document.querySelectorAll("[data-dec]").forEach((btn) => {
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.dec), -1));
  });

  document.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => removeItem(Number(btn.dataset.remove)));
  });
}

function changeQty(id, delta) {
  const cart = getCart().map((item) => (
    item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
  ));

  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  saveCart(getCart().filter((item) => item.id !== id));
  showToast("Item removed from cart", "success");
  renderCart();
}

function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const cart = getCart();
  const error = form.querySelector("[data-checkout-error]");
  const success = form.querySelector("[data-order-success]");
  const fullName = form.fullName.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const address = form.address.value.trim();

  error.textContent = "";
  success.textContent = "";

  if (!cart.length) {
    error.textContent = "Your cart is empty.";
    return;
  }

  if (!fullName || !phone || !address) {
    error.textContent = "Full Name, Phone Number, and Address are required.";
    return;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error.textContent = "Please enter a valid email address.";
    return;
  }

  const { subtotal, delivery, total } = orderTotals(cart);
  const order = {
    orderId: `SS-${Date.now()}`,
    createdAt: new Date().toISOString(),
    customer: {
      fullName,
      email,
      phone,
      address
    },
    items: cart,
    totals: {
      subtotal,
      delivery,
      total
    }
  };

  saveOrder(order);
  saveCart([]);
  form.reset();
  renderCart();
  success.textContent = "Order placed successfully.";
  showToast("Order placed successfully", "success");
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("[data-cart-list]")) {
    renderCart();
  }

  const checkoutForm = document.querySelector("[data-checkout-form]");

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  }
});
