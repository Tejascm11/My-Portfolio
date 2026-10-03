/* =========================================================
   TEJAS CM PORTFOLIO — SINGLE RESPONSIVE SCRIPT
========================================================= */

/* =========================================================
   CURSOR GLOW
========================================================= */
const glow = document.querySelector(".cursor-glow");

if (glow && window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("pointermove", (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }, { passive: true });
}

/* =========================================================
   SCROLL REVEAL
========================================================= */
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("show"));
}

/* =========================================================
   PROJECT 3D HOVER
========================================================= */
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    if (window.matchMedia("(hover:none), (max-width:800px)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 5;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 5;

    card.style.transform = `perspective(900px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

/* =========================================================
   DARK / LIGHT THEME
========================================================= */
const themeToggle = document.getElementById("themeToggle");
let isDark = true;

function applyTheme(dark) {
  isDark = dark;
  document.body.classList.toggle("dark", dark);
  document.body.classList.toggle("light", !dark);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.setAttribute(
      "aria-label",
      dark ? "Switch to light mode" : "Switch to dark mode"
    );
  }
}

const savedTheme = localStorage.getItem("portfolio-theme");
applyTheme(savedTheme !== "light");

themeToggle?.addEventListener("click", () => {
  applyTheme(!isDark);
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
});

/* =========================================================
   RANDOM DIAGONAL COMPUTER-SCIENCE BACKGROUND

   The words live INSIDE the hero and are a background layer.
   They never participate in document flow, so resizing the
   browser cannot push them into the navbar or content.
========================================================= */
const keywordContainer = document.querySelector(".cs-keywords");
const keywords = [...document.querySelectorAll(".cs-keywords span")];
const keywordObjects = [];
let keywordAnimationStarted = false;

function randomDirection(speedMin = 0.18, speedMax = 0.55) {
  return (speedMin + Math.random() * (speedMax - speedMin)) *
    (Math.random() < 0.5 ? -1 : 1);
}

function setupKeywords(reset = true) {
  if (!keywordContainer || !keywords.length) return;

  const width = keywordContainer.clientWidth;
  const height = keywordContainer.clientHeight;

  if (reset || keywordObjects.length !== keywords.length) {
    keywordObjects.length = 0;

    keywords.forEach((element) => {
      const maxX = Math.max(0, width - element.offsetWidth);
      const maxY = Math.max(0, height - element.offsetHeight);

      const item = {
        element,
        x: Math.random() * maxX,
        y: Math.random() * maxY,
        dx: randomDirection(),
        dy: randomDirection(),
        rotation: (Math.random() - 0.5) * 8
      };

      keywordObjects.push(item);
      element.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.rotation}deg)`;
    });
    return;
  }

  keywordObjects.forEach((item) => {
    const maxX = Math.max(0, width - item.element.offsetWidth);
    const maxY = Math.max(0, height - item.element.offsetHeight);
    item.x = Math.min(Math.max(item.x, 0), maxX);
    item.y = Math.min(Math.max(item.y, 0), maxY);
  });
}

function animateKeywords() {
  if (!keywordContainer || !keywordObjects.length) return;

  const width = keywordContainer.clientWidth;
  const height = keywordContainer.clientHeight;

  keywordObjects.forEach((item) => {
    const maxX = Math.max(0, width - item.element.offsetWidth);
    const maxY = Math.max(0, height - item.element.offsetHeight);

    item.x += item.dx;
    item.y += item.dy;

    if (item.x <= 0 || item.x >= maxX) {
      item.dx *= -1;
      item.x = Math.min(Math.max(item.x, 0), maxX);
    }

    if (item.y <= 0 || item.y >= maxY) {
      item.dy *= -1;
      item.y = Math.min(Math.max(item.y, 0), maxY);
    }

    item.element.style.transform =
      `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.rotation}deg)`;
  });

  requestAnimationFrame(animateKeywords);
}

function startKeywordAnimation() {
  if (!keywordContainer || !keywords.length || keywordAnimationStarted) return;
  keywordAnimationStarted = true;
  setupKeywords(true);
  animateKeywords();
}

window.addEventListener("load", startKeywordAnimation);

/* ResizeObserver makes the same animation adapt to any browser size. */
if (keywordContainer && "ResizeObserver" in window) {
  const resizeObserver = new ResizeObserver(() => setupKeywords(false));
  resizeObserver.observe(keywordContainer);
} else {
  window.addEventListener("resize", () => setupKeywords(false), { passive: true });
}

/* =========================================================
   PAGE READY
========================================================= */
document.documentElement.classList.add("js-ready");
