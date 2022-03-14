// create constants for the button
const btn = document.querySelector(".mobile-menu-button");
const sidebar = document.querySelector(".sidebar");

// event listener for the click
btn.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
});