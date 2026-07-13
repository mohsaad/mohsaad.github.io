(function () {
  const storageKey = "theme";
  const savedTheme = localStorage.getItem(storageKey);
  let dark = savedTheme
    ? savedTheme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;

  function ensureButton() {
    let button = document.getElementById("theme-btn");
    if (button) return button;

    button = document.createElement("button");
    button.id = "theme-btn";
    button.className = "theme-toggle";
    button.type = "button";
    document.body.prepend(button);
    return button;
  }

  function applyTheme() {
    document.body.classList.toggle("dark", dark);
    const button = ensureButton();
    button.textContent = dark ? "☀️ Light" : "🌙 Dark";
    button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }

  window.toggleTheme = function () {
    dark = !dark;
    localStorage.setItem(storageKey, dark ? "dark" : "light");
    applyTheme();
  };

  document.addEventListener("DOMContentLoaded", function () {
    const button = ensureButton();
    button.addEventListener("click", window.toggleTheme);
    applyTheme();
  });
}());
