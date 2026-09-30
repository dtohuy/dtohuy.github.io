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

  /* ---------- i18n ---------- */
  const LANGS = ["zh-Hant", "zh-Hans", "en"];
  const LANG_KEY = "site-lang";
  const I18N = {
    "zh-Hant": {
      "meta.title": "Kiya Hsieh — 數據架構師",
      "meta.desc": "Kiya Hsieh 的個人主頁與作品集：數據架構、大數據平台與 AI 自動化。",
      "nav.menu": "打開選單",
      "nav.about": "關於",
      "nav.projects": "作品",
      "nav.skills": "技能",
      "nav.contact": "聯絡",
      "theme": "切換深/淺色",
      "hero.eyebrow": "你好，我是",
      "hero.tagline": "數據架構師 · 大數據平台 · AI 自動化",
      "hero.viewWork": "查看作品",
      "hero.contact": "聯絡我",
      "about.title": "關於我",
      "about.text": "數據架構師，專注於大數據平台、即時分析與 AI 自動化。這裡整理我公開的開源作品與小工具；想了解完整經歷，歡迎到 LinkedIn 找我。",
      "projects.title": "作品 / 專案",
      "projects.view": "查看",
      "skills.title": "技能",
      "contact.title": "聯絡",
      "contact.text": "歡迎透過 LinkedIn 聯絡我。",
      "footer": "以純 HTML/CSS/JS 打造，託管於 GitHub Pages。",
      "hero.name": "Kiya Hsieh",
    },
    "zh-Hans": {
      "meta.title": "Kiya Hsieh — 数据架构师",
      "meta.desc": "Kiya Hsieh 的个人主页与作品集：数据架构、大数据平台与 AI 自动化。",
      "nav.menu": "打开菜单",
      "nav.about": "关于",
      "nav.projects": "作品",
      "nav.skills": "技能",
      "nav.contact": "联系",
      "theme": "切换深/浅色",
      "hero.eyebrow": "你好，我是",
      "hero.tagline": "数据架构师 · 大数据平台 · AI 自动化",
      "hero.viewWork": "查看作品",
      "hero.contact": "联系我",
      "about.title": "关于我",
      "about.text": "数据架构师，专注于大数据平台、实时分析与 AI 自动化。这里整理我公开的开源作品与小工具；想了解完整经历，欢迎到 LinkedIn 找我。",
      "projects.title": "作品 / 项目",
      "projects.view": "查看",
      "skills.title": "技能",
      "contact.title": "联系",
      "contact.text": "欢迎通过 LinkedIn 联系我。",
      "footer": "以纯 HTML/CSS/JS 构建，托管于 GitHub Pages。",
      "hero.name": "Kiya Hsieh",
    },
    "en": {
      "meta.title": "Kiya Hsieh — Data Architect",
      "meta.desc": "Portfolio of Kiya Hsieh: data architecture, big data platforms and AI automation.",
      "nav.menu": "Open menu",
      "nav.about": "About",
      "nav.projects": "Work",
      "nav.skills": "Skills",
      "nav.contact": "Contact",
      "theme": "Toggle dark/light",
      "hero.eyebrow": "Hi, I'm",
      "hero.tagline": "Data Architect · Big Data Platforms · AI Automation",
      "hero.viewWork": "View work",
      "hero.contact": "Get in touch",
      "about.title": "About",
      "about.text": "Data architect focused on big data platforms, real-time analytics and AI automation. This page collects my open-source work and small tools — for my full background, find me on LinkedIn.",
      "projects.title": "Work / Projects",
      "projects.view": "View",
      "skills.title": "Skills",
      "contact.title": "Contact",
      "contact.text": "The best way to reach me is on LinkedIn.",
      "footer": "Built with plain HTML/CSS/JS, hosted on GitHub Pages.",
      "hero.name": "Kiya Hsieh",
    },
  };

  function detectLang() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (LANGS.includes(saved)) return saved;
    } catch (e) { /* ignore */ }
    const nav = (navigator.language || "").toLowerCase();
    if (nav.startsWith("zh")) {
      return /^zh-(cn|sg|hans)/.test(nav) ? "zh-Hans" : "zh-Hant";
    }
    return "en";
  }

  let lang = detectLang();
  const t = (key) => I18N[lang][key] ?? I18N["zh-Hant"][key] ?? key;
  // JSON fields may be a plain string or {"zh-Hant": ..., "zh-Hans": ..., "en": ...}
  const pick = (v) => (v && typeof v === "object")
    ? (v[lang] ?? v["zh-Hant"] ?? v["zh-Hans"] ?? v.en ?? "")
    : (v ?? "");

  function applyStaticText() {
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.desc"));
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => { el.setAttribute("title", t(el.dataset.i18nTitle)); });
  }

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
    grid.innerHTML = projects.map((p) => {
      const tags = Array.isArray(p.tags) ? p.tags.map(pick).filter(Boolean) : [];
      return `
      <article class="project-card">
        <h3>${escapeHtml(pick(p.title))}</h3>
        ${p.meta ? `<div class="project-meta">${escapeHtml(pick(p.meta))}</div>` : ""}
        <p>${escapeHtml(pick(p.description))}</p>
        ${tags.length ? `
          <div class="project-tags">
            ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>` : ""}
        ${p.url ? `<a class="project-link" href="${escapeAttr(p.url)}" target="_blank" rel="noopener">${escapeHtml(t("projects.view"))} &rarr;</a>` : ""}
      </article>`;
    }).join("");
  }

  function renderSkills(skills) {
    const grid = document.getElementById("skillsGrid");
    if (!grid || !Array.isArray(skills)) return;
    grid.innerHTML = skills.map((s) => (s && Array.isArray(s.items))
      ? `<div class="skill-group">
          <h3>${escapeHtml(pick(s.group))}</h3>
          <div class="skill-chips">${s.items.map((i) => `<span>${escapeHtml(pick(i))}</span>`).join("")}</div>
        </div>`
      : `<div class="skill-item">${escapeHtml(pick(s))}</div>`
    ).join("");
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

  let data = { projects: null, skills: null };

  function renderAll() {
    applyStaticText();
    renderProjects(data.projects);
    renderSkills(data.skills);
  }

  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    langSelect.value = lang;
    langSelect.addEventListener("change", () => {
      if (!LANGS.includes(langSelect.value)) return;
      lang = langSelect.value;
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
      renderAll();
    });
  }

  applyStaticText();

  (async () => {
    const [projects, skills] = await Promise.all([
      loadData("assets/data/projects.json"),
      loadData("assets/data/skills.json"),
    ]);
    data = { projects, skills };
    renderAll();
  })();
})();
