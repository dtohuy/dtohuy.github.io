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
      "projects.external": "外部網站，於新分頁開啟",
      "projects.search": "搜尋作品、標籤…",
      "projects.all": "全部",
      "projects.category": "分類",
      "projects.tags": "標籤",
      "projects.total": "共 {total} 件",
      "projects.count": "{n} / {total} 件",
      "projects.empty": "沒有符合條件的作品。",
      "projects.clear": "清除篩選",
      "projects.moreTags": "更多標籤",
      "projects.lessTags": "收合",
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
      "projects.external": "外部网站，在新标签页打开",
      "projects.search": "搜索作品、标签…",
      "projects.all": "全部",
      "projects.category": "分类",
      "projects.tags": "标签",
      "projects.total": "共 {total} 件",
      "projects.count": "{n} / {total} 件",
      "projects.empty": "没有符合条件的作品。",
      "projects.clear": "清除筛选",
      "projects.moreTags": "更多标签",
      "projects.lessTags": "收起",
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
      "projects.external": "External site, opens in a new tab",
      "projects.search": "Search work, tags…",
      "projects.all": "All",
      "projects.category": "Category",
      "projects.tags": "Tags",
      "projects.total": "{total} projects",
      "projects.count": "{n} of {total}",
      "projects.empty": "Nothing matches these filters.",
      "projects.clear": "Clear filters",
      "projects.moreTags": "More tags",
      "projects.lessTags": "Fewer",
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
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder)); });
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

  /* ---------- Projects: search, category & tag filters ---------- */
  const TAG_LIMIT = 12; // tag chips shown before the "more" toggle
  const projectTools = document.getElementById("projectTools");
  const projectSearch = document.getElementById("projectSearch");
  const categoryChips = document.getElementById("categoryChips");
  const tagChips = document.getElementById("tagChips");
  const projectCount = document.getElementById("projectCount");
  const projectClear = document.getElementById("projectClear");
  const projectGrid = document.getElementById("projectGrid");

  // Filter state lives in the URL (?q=&cat=&tag=) so a filtered view can be shared
  const urlParams = new URLSearchParams(location.search);
  const filter = {
    q: urlParams.get("q") ?? "",
    cat: urlParams.get("cat") ?? "",
    tags: new Set(urlParams.getAll("tag")),
  };
  let tagsExpanded = false;
  let categoryOrder = []; // category ids in categories.json order

  const norm = (s) => String(s).normalize("NFKC").toLowerCase();
  // Every language variant of a field, so a query matches whichever script it is typed in
  const variants = (v) => (v && typeof v === "object") ? Object.values(v) : (v ? [v] : []);
  // Language-independent identity of a tag (tags may be a string or an i18n object)
  const tagKey = (tag) => (tag && typeof tag === "object")
    ? (tag.en ?? tag["zh-Hant"] ?? tag["zh-Hans"] ?? "")
    : String(tag ?? "");
  // Host of a work hosted on another site ("" for anything under this site's own domain)
  const SITE_HOSTS = ["dtohuy.github.io", location.hostname];
  const externalHost = (url) => {
    if (!/^https?:\/\//i.test(url ?? "")) return "";
    try {
      const host = new URL(url).hostname;
      return SITE_HOSTS.includes(host) ? "" : host.replace(/^www\./, "");
    } catch (e) { return ""; }
  };
  const fill = (key, vars) => t(key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

  function prepareProjects(raw, categories) {
    const labels = new Map((Array.isArray(categories) ? categories : []).map((c) => [c.id, c.label]));
    categoryOrder = [...labels.keys()];
    return raw.map((p) => {
      const tags = (Array.isArray(p.tags) ? p.tags : []).filter(tagKey);
      return {
        ...p,
        tags,
        tagKeys: tags.map(tagKey),
        categoryLabel: labels.get(p.category) ?? p.category,
        url: p.url || (p.id ? `projects/${p.id}/` : ""),
        externalHost: externalHost(p.url),
        haystack: norm([p.id, p.title, p.meta, p.description, labels.get(p.category), externalHost(p.url), ...tags]
          .flatMap(variants).join("\n")),
      };
    }).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      || String(b.date ?? "").localeCompare(String(a.date ?? "")));
  }

  function filteredProjects(projects) {
    const terms = norm(filter.q).split(/\s+/).filter(Boolean);
    return projects.filter((p) => (!filter.cat || p.category === filter.cat)
      && [...filter.tags].every((key) => p.tagKeys.includes(key))
      && terms.every((term) => p.haystack.includes(term)));
  }

  const chip = (attr, key, label, count) => `
    <button type="button" class="chip" ${attr}="${escapeAttr(key)}" aria-pressed="false">${escapeHtml(label)}${
      count == null ? "" : `<span class="chip-count">${count}</span>`}</button>`;

  function renderFilters(projects) {
    if (!projectTools || !Array.isArray(projects)) return;
    projectTools.hidden = false;

    const cats = new Map();
    const tags = new Map();
    projects.forEach((p) => {
      if (p.category) {
        const c = cats.get(p.category) ?? { label: p.categoryLabel, count: 0 };
        c.count += 1;
        cats.set(p.category, c);
      }
      p.tags.forEach((tag) => {
        const entry = tags.get(tagKey(tag)) ?? { tag, count: 0 };
        entry.count += 1;
        tags.set(tagKey(tag), entry);
      });
    });

    // Drop filters from the URL that no longer match any data
    if (!cats.has(filter.cat)) filter.cat = "";
    filter.tags.forEach((key) => { if (!tags.has(key)) filter.tags.delete(key); });

    categoryChips.hidden = cats.size < 2;
    categoryChips.innerHTML = chip("data-cat", "", t("projects.all"), projects.length)
      + [...new Set([...categoryOrder, ...cats.keys()])].filter((id) => cats.has(id))
        .map((id) => chip("data-cat", id, pick(cats.get(id).label), cats.get(id).count)).join("");

    const sortedTags = [...tags].sort((a, b) => b[1].count - a[1].count
      || pick(a[1].tag).localeCompare(pick(b[1].tag)));
    tagChips.hidden = sortedTags.length === 0;
    tagChips.classList.toggle("collapsed", !tagsExpanded);
    tagChips.innerHTML = sortedTags.map(([key, e]) => chip("data-tag", key, pick(e.tag))).join("")
      + (sortedTags.length > TAG_LIMIT
        ? `<button type="button" class="link-button" id="tagMore" aria-expanded="${tagsExpanded}">${
            escapeHtml(t(tagsExpanded ? "projects.lessTags" : "projects.moreTags"))}</button>`
        : "");
  }

  function renderProjects(projects) {
    if (!projectGrid || !Array.isArray(projects)) return;
    const shown = filteredProjects(projects);
    const active = Boolean(filter.q.trim() || filter.cat || filter.tags.size);

    projectGrid.innerHTML = shown.length ? shown.map((p) => {
      const meta = [pick(p.categoryLabel), pick(p.meta), String(p.date ?? "").slice(0, 7)].filter(Boolean);
      return `
      <article class="project-card">
        <h3>${escapeHtml(pick(p.title))}</h3>
        ${meta.length ? `<div class="project-meta">${escapeHtml(meta.join(" · "))}</div>` : ""}
        <p>${escapeHtml(pick(p.description))}</p>
        ${p.tags.length ? `
          <div class="project-tags">
            ${p.tags.map((tag) => `<button type="button" class="tag" data-tag="${escapeAttr(tagKey(tag))}" aria-pressed="${filter.tags.has(tagKey(tag))}">${escapeHtml(pick(tag))}</button>`).join("")}
          </div>` : ""}
        ${p.url ? (p.externalHost
          ? `<a class="project-link" href="${escapeAttr(p.url)}" target="_blank" rel="noopener noreferrer" title="${escapeAttr(t("projects.external"))}">${escapeHtml(t("projects.view"))} &nearr; <span class="project-host">${escapeHtml(p.externalHost)}</span></a>`
          : `<a class="project-link" href="${escapeAttr(p.url)}" target="_blank" rel="noopener">${escapeHtml(t("projects.view"))} &rarr;</a>`) : ""}
      </article>`;
    }).join("") : `<p class="project-empty">${escapeHtml(t("projects.empty"))}</p>`;

    if (projectCount) {
      projectCount.textContent = active
        ? fill("projects.count", { n: shown.length, total: projects.length })
        : fill("projects.total", { total: projects.length });
    }
    if (projectClear) projectClear.hidden = !active;
    categoryChips?.querySelectorAll("[data-cat]").forEach((el) => {
      el.setAttribute("aria-pressed", String(el.dataset.cat === filter.cat));
    });
    tagChips?.querySelectorAll("[data-tag]").forEach((el) => {
      el.setAttribute("aria-pressed", String(filter.tags.has(el.dataset.tag)));
    });
  }

  function syncUrl() {
    const params = new URLSearchParams(location.search);
    ["q", "cat", "tag"].forEach((key) => params.delete(key));
    if (filter.q.trim()) params.set("q", filter.q.trim());
    if (filter.cat) params.set("cat", filter.cat);
    filter.tags.forEach((key) => params.append("tag", key));
    const qs = params.toString();
    history.replaceState(null, "", location.pathname + (qs ? `?${qs}` : "") + location.hash);
  }

  function applyFilter() {
    renderProjects(data.projects);
    syncUrl();
  }

  function toggleTag(key) {
    if (!filter.tags.delete(key)) filter.tags.add(key);
    applyFilter();
  }

  let searchTimer;
  projectSearch?.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      filter.q = projectSearch.value;
      applyFilter();
    }, 80);
  });

  categoryChips?.addEventListener("click", (e) => {
    const el = e.target.closest("[data-cat]");
    if (!el) return;
    filter.cat = el.dataset.cat;
    applyFilter();
  });

  tagChips?.addEventListener("click", (e) => {
    if (e.target.closest("#tagMore")) {
      tagsExpanded = !tagsExpanded;
      renderFilters(data.projects);
      renderProjects(data.projects);
      document.getElementById("tagMore")?.focus();
      return;
    }
    const el = e.target.closest("[data-tag]");
    if (el) toggleTag(el.dataset.tag);
  });

  projectGrid?.addEventListener("click", (e) => {
    const el = e.target.closest("[data-tag]");
    if (el) toggleTag(el.dataset.tag);
  });

  projectClear?.addEventListener("click", () => {
    filter.q = "";
    filter.cat = "";
    filter.tags.clear();
    if (projectSearch) projectSearch.value = "";
    applyFilter();
    projectSearch?.focus();
  });

  // "/" jumps to the search box from anywhere on the page
  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey || !projectSearch || projectTools?.hidden) return;
    if (e.target.closest?.("input, textarea, select, [contenteditable]")) return;
    e.preventDefault();
    projectSearch.focus();
  });

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
    renderFilters(data.projects);
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
    const [projects, categories, skills] = await Promise.all([
      loadData("assets/data/projects.json"),
      loadData("assets/data/categories.json"),
      loadData("assets/data/skills.json"),
    ]);
    data = { projects: Array.isArray(projects) ? prepareProjects(projects, categories) : null, skills };
    if (projectSearch) projectSearch.value = filter.q;
    const linkedToFilter = Boolean(filter.q || filter.cat || filter.tags.size);
    renderAll();
    // A shared filter link should land on the results, not the hero
    if (linkedToFilter && !location.hash) document.getElementById("projects")?.scrollIntoView();
  })();
})();
