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
  });


  // ---- Animation fade-in des liens ----
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link, index) => {
      link.style.animationDelay = `${index * 0.1}s`;
      link.classList.add("fade-in-nav");
  });

});
