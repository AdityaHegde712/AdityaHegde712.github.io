/* =============================================
   Aditya Hegde — Portfolio
   Interactivity & Animations
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initNavigation();
  initNavScrollEffect();
  initActiveNavTracking();
});

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ---------- Mobile Navigation ---------- */
function initNavigation() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  const overlay = document.getElementById("nav-overlay");

  if (!toggle || !links) return;

  function openMenu() {
    links.classList.add("nav__links--open");
    if (overlay) overlay.classList.add("nav__overlay--visible");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    links.classList.remove("nav__links--open");
    if (overlay) overlay.classList.remove("nav__overlay--visible");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.contains("nav__links--open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  /* Close menu when a nav link is clicked */
  const navAnchors = links.querySelectorAll(".nav__link");
  navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", closeMenu);
  });

  /* Close menu on Escape key */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ---------- Nav Background on Scroll ---------- */
function initNavScrollEffect() {
  const nav = document.getElementById("main-nav");
  if (!nav) return;

  let ticking = false;

  function updateNav() {
    if (window.scrollY > 50) {
      nav.style.borderBottomColor = "rgba(255, 255, 255, 0.08)";
      nav.style.background = "rgba(7, 7, 13, 0.95)";
    } else {
      nav.style.borderBottomColor = "";
      nav.style.background = "";
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    },
    { passive: true },
  );
}

/* ---------- Active Nav Link Tracking ---------- */
function initActiveNavTracking() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.remove("nav__link--active");
            if (link.getAttribute("href") === "#" + sectionId) {
              link.classList.add("nav__link--active");
            }
          });
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "-72px 0px -50% 0px",
    },
  );

  sections.forEach((section) => observer.observe(section));
}
