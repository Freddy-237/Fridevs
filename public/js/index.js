// ===============================
// HEADER ANIMATION + MENU MOBILE
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  const header = document.querySelector("header");
  const mobileMenuBtn = document.querySelector("#mobile-menu-btn");
  const mobileMenu = document.querySelector("#mobile-menu");

  // ---- Animation au scroll (shrink + background visible) ----
  window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
          header.classList.add("header-scrolled");
      } else {
          header.classList.remove("header-scrolled");
      }
  });


  // ---- Toggle Menu Mobile ----
  mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      mobileMenu.classList.toggle("opacity-0");
      mobileMenu.classList.toggle("opacity-100");
      const isOpen = !mobileMenu.classList.contains("hidden");
      mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
      mobileMenuBtn.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  });


  // ---- Animation fade-in des liens ----
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link, index) => {
      link.style.animationDelay = `${index * 0.1}s`;
      link.classList.add("fade-in-nav");
  });

});
