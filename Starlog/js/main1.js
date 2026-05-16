const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");

const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("menuOverlay");

menuBtn.addEventListener("click", () => {
  sideMenu.classList.add("active");
  overlay.classList.add("active");
});

closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

function closeMenu() {
  sideMenu.classList.remove("active");
  overlay.classList.remove("active");
}