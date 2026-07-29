const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const progressBar = document.querySelector(".scroll-progress span");
const toast = document.querySelector(".toast");
const copyEmailButton = document.querySelector(".copy-email");
const year = document.querySelector("#year");
const printButton = document.querySelector(".print-page");

function readSavedTheme() {
  try {
    return window.localStorage.getItem("rami-theme");
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem("rami-theme", theme);
  } catch {
    // The design still works when storage is unavailable, such as a local preview.
  }
}

const savedTheme = readSavedTheme();
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
  saveTheme(theme);
}

setTheme(initialTheme);

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navLinks.classList.toggle("open", !expanded);
  document.body.classList.toggle("nav-open", !expanded);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
    document.body.classList.remove("nav-open");
  });
});

function closeNavigation() {
  navToggle.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("open");
  document.body.classList.remove("nav-open");
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 1120) closeNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
    navToggle.focus();
  }
});

function updateProgress() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const sections = [...document.querySelectorAll("main section[id]")];
const navItems = [...document.querySelectorAll(".nav-links a")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navItems.forEach((link) => {
      const active = link.getAttribute("href") === `#${visible.target.id}`;
      link.classList.toggle("active", active);
    });
  },
  { rootMargin: "-30% 0px -58% 0px", threshold: [0.05, 0.2, 0.5] }
);

sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll(".skill-filter").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".skill-filter").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    document.querySelectorAll("#skills-cloud [data-category]").forEach((skill) => {
      const shouldShow = filter === "all" || skill.dataset.category === filter;
      skill.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

copyEmailButton.addEventListener("click", async () => {
  const email = copyEmailButton.dataset.email;

  try {
    await navigator.clipboard.writeText(email);
    showToast("Email copied");
  } catch {
    const input = document.createElement("input");
    input.value = email;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
    showToast("Email copied");
  }
});

printButton.addEventListener("click", () => window.print());
year.textContent = new Date().getFullYear();
