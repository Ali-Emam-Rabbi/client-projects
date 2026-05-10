document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-google]").forEach(button => {
    button.addEventListener("click", () => showToast("Continue with Google is coming soon", "error"));
  });

  const form = document.querySelector("[data-auth-form]");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const email = form.querySelector("[name='email']").value.trim();
    const password = form.querySelector("[name='password']").value;
    const confirm = form.querySelector("[name='confirm']");
    const error = form.querySelector("[data-error]");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error.textContent = "Please enter a valid email address.";
      return;
    }
    if (password.length < 6) {
      error.textContent = "Password must be at least 6 characters.";
      return;
    }
    if (confirm && confirm.value !== password) {
      error.textContent = "Passwords do not match.";
      return;
    }
    error.textContent = "";
    showToast(form.dataset.mode === "signup" ? "Signup validation successful" : "Login validation successful", "success");
    form.reset();
  });
});
