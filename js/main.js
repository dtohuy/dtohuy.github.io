(() => {
  "use strict";

  /* ---------- Theme toggle (persists via localStorage) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "site-theme";

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) applyTheme(saved);
  } catch (e) {
    /* localStorage unavailable (private mode, etc.) — fall back to system theme */
  }

  themeToggle?.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Render projects & skills from JSON data ---------- */
  async function loadData(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`${path}: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("Could not load", path, err);
      return null;
    }
  }

  function renderProjects(projects) {
    const grid = document.getElementById("projectGrid");
    if (!grid || !Array.isArray(projects)) return;
    grid.innerHTML = projects.map((p) => `
      <article class="project-card">
        <h3>${escapeHtml(p.title || "")}</h3>
        <p>${escapeHtml(p.description || "")}</p>
        ${Array.isArray(p.tags) && p.tags.length ? `
          <div class="project-tags">
            ${p.tags.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}
          </div>` : ""}
        ${p.url ? `<a class="project-link" href="${escapeAttr(p.url)}" target="_blank" rel="noopener">查看 &rarr;</a>` : ""}
      </article>
    `).join("");
  }

  function renderSkills(skills) {
    const grid = document.getElementById("skillsGrid");
    if (!grid || !Array.isArray(skills)) return;
    grid.innerHTML = skills.map((s) => `<div class="skill-item">${escapeHtml(s)}</div>`).join("");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }

  (async () => {
    const [projects, skills] = await Promise.all([
      loadData("assets/data/projects.json"),
      loadData("assets/data/skills.json"),
    ]);
    renderProjects(projects);
    renderSkills(skills);
  })();
})();
