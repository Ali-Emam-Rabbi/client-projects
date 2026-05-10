document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = form.querySelector("[name='name']").value.trim();
    const email = form.querySelector("[name='email']").value.trim();
    const message = form.querySelector("[name='message']").value.trim();
    const error = form.querySelector("[data-error]");
    if (name.length < 2) {
      error.textContent = "Please enter your name.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error.textContent = "Please enter a valid email address.";
      return;
    }
    if (message.length < 10) {
      error.textContent = "Message should be at least 10 characters.";
      return;
    }
    error.textContent = "";
    showToast("Message validated successfully. Backend connection can be added later.", "success");
    form.reset();
  });
});
