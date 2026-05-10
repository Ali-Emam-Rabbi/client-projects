const CART_KEY = "bookhub-cart";
const USERS_KEY = "bookhub-users";
const SESSION_KEY = "bookhub-session";

export function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("cart:updated"));
}

export function addToCart(bookId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === bookId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: bookId, quantity });
  }
  saveCart(cart);
}

export function updateCartItem(bookId, quantity) {
  const cart = getCart()
    .map((item) => (item.id === bookId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);
  saveCart(cart);
}

export function removeCartItem(bookId) {
  saveCart(getCart().filter((item) => item.id !== bookId));
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

export function signupUser(payload) {
  const users = getUsers();
  const exists = users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase());
  if (exists) {
    return { ok: false, message: "This email is already registered." };
  }

  users.push(payload);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(SESSION_KEY, JSON.stringify({ name: payload.name, email: payload.email }));
  window.dispatchEvent(new CustomEvent("auth:updated"));
  return { ok: true, message: "Account created successfully." };
}

export function loginUser(email, password) {
  const user = getUsers().find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
  );

  if (!user) {
    return { ok: false, message: "Invalid email or password." };
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
  window.dispatchEvent(new CustomEvent("auth:updated"));
  return { ok: true, message: `Welcome back, ${user.name}.` };
}

export function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent("auth:updated"));
}
