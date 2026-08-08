/* Content Factory — редактор календаря, медиа, ссылки, API */
(function () {
  const STORAGE_POSTS = "cf_posts_v2";
  const STORAGE_API = "cf_api_v2";

  const statusRu = {
    ready: "готово",
    review: "на проверке",
    approved: "одобрено",
    draft: "черновик",
    queued: "в очереди",
    publishing: "публикуется",
    published: "опубликовано"
  };
  const slotRu = {
    peak_morning: "утро",
    peak_midday: "день",
    peak_evening: "вечер"
  };
  const platformRu = { ig: "Instagram", vk: "VK", yt: "YouTube", tt: "TikTok" };

  const defaultPosts = [
    {
      id: "CF-001",
      day: 1,
      title: "Хуки монтажа",
      platforms: ["ig", "vk", "yt", "tt"],
      status: "ready",
      slot: "peak_morning",
      utm: "cf_hooks_aug",
      caption: "Смонтируй так — и охваты вырастут 🔥",
      description: "Короткий ролик про 3 ошибки монтажа. CTA — «гайд» в комментариях.",
      link: "https://example.com/lead-magnet",
      mediaType: "",
      mediaName: "",
      mediaData: ""
    },
    {
      id: "CF-002",
      day: 2,
      title: "Хук 3 сек",
      platforms: ["ig", "vk"],
      status: "review",
      slot: "peak_evening",
      utm: "cf_hooks_aug",
      caption: "Хук за 3 секунды — формула. Пиши «гайд».",
      description: "Формула хука для Reels/клипов.",
      link: "https://example.com/hook",
      mediaType: "",
      mediaName: "",
      mediaData: ""
    },
    {
      id: "CF-003",
      day: 3,
      title: "Длинный гайд",
      platforms: ["yt"],
      status: "approved",
      slot: "peak_midday",
      utm: "cf_guides",
      caption: "Полный гайд по автопостингу 2026",
      description: "Разбор Make + API Instagram, VK, YouTube, TikTok.",
      link: "https://example.com/guide",
      mediaType: "",
      mediaName: "",
      mediaData: ""
    },
    {
      id: "CF-004",
      day: 4,
      title: "1→4 площадки",
      platforms: ["ig", "tt"],
      status: "draft",
      slot: "peak_morning",
      utm: "cf_tips",
      caption: "Один ролик — четыре площадки",
      description: "Как адаптировать один ролик под все сети.",
      link: "",
      mediaType: "",
      mediaName: "",
      mediaData: ""
    }
  ];

  const defaultApi = {
    instagram: { enabled: true, baseUrl: "https://graph.facebook.com/v21.0", userId: "", accessToken: "", note: "instagram_content_publish" },
    vk: { enabled: true, baseUrl: "https://api.vk.com/method", groupId: "", accessToken: "", apiVersion: "5.199", note: "wall, video" },
    youtube: { enabled: true, baseUrl: "https://www.googleapis.com/youtube/v3", clientId: "", clientSecret: "", refreshToken: "", note: "youtube.upload" },
    tiktok: { enabled: true, baseUrl: "https://open.tiktokapis.com", clientKey: "", clientSecret: "", accessToken: "", refreshToken: "", note: "video.publish + App Audit" }
  };

  let posts = loadPosts();
  let apiConfig = loadApi();
  let editingId = null;
  let selectedDay = 1;

  function loadPosts() {
    try {
      const raw = localStorage.getItem(STORAGE_POSTS);
      if (!raw) return structuredClone(defaultPosts);
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length ? parsed : structuredClone(defaultPosts);
    } catch {
      return structuredClone(defaultPosts);
    }
  }

  function loadApi() {
    try {
      const raw = localStorage.getItem(STORAGE_API);
      if (!raw) return structuredClone(defaultApi);
      const parsed = JSON.parse(raw);
      const base = structuredClone(defaultApi);
      Object.keys(base).forEach((k) => {
        base[k] = { ...base[k], ...(parsed[k] || {}) };
      });
      return base;
    } catch {
      return structuredClone(defaultApi);
    }
  }

  function savePosts() {
    // mediaData can be large — keep in localStorage with try/catch
    try {
      localStorage.setItem(STORAGE_POSTS, JSON.stringify(posts));
    } catch (e) {
      toast("Не хватило места для медиа в браузере. Сохранены метаданные без тяжёлых файлов.");
      const light = posts.map((p) => ({ ...p, mediaData: p.mediaData && p.mediaData.length > 200000 ? "" : p.mediaData }));
      localStorage.setItem(STORAGE_POSTS, JSON.stringify(light));
    }
  }

  function saveApi() {
    localStorage.setItem(STORAGE_API, JSON.stringify(apiConfig));
  }

  window.enterApp = function (view) {
    document.getElementById("landing").classList.add("off");
    document.getElementById("app").classList.add("on");
    showView(view || "calendar");
    refreshAll();
  };

  window.exitApp = function () {
    document.getElementById("app").classList.remove("on");
    document.getElementById("landing").classList.remove("off");
    window.scrollTo(0, 0);
  };

  function showView(name) {
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("on", v.id === "view-" + name));
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
    if (name === "api") renderApiForm();
  }

  document.querySelectorAll(".nav-btn").forEach((b) =>
    b.addEventListener("click", () => showView(b.dataset.view))
  );

  window.toast = function (msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.style.opacity = "1";
    el.style.transform = "none";
    clearTimeout(window.__t);
    window.__t = setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
    }, 2200);
  };

  function nextId() {
    const nums = posts.map((p) => parseInt(String(p.id).replace(/\D/g, ""), 10)).filter(Boolean);
    const n = (nums.length ? Math.max(...nums) : 0) + 1;
    return "CF-" + String(n).padStart(3, "0");
  }

  function updateKpis() {
    const week = posts.length;
    const ready = posts.filter((p) => p.status === "ready").length;
    const review = posts.filter((p) => p.status === "review").length;
    const plats = new Set(posts.flatMap((p) => p.platforms)).size;
    const set = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.textContent = v;
    };
    set("kpiWeek", week);
    set("kpiReady", ready);
    set("kpiReview", review);
    set("kpiPlats", plats || 4);
  }

  function renderCalendar() {
    const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const grid = document.getElementById("calGrid");
    if (!grid) return;
    grid.innerHTML = days.map((d) => `<div class="cal-head">${d}</div>`).join("");
    for (let i = 1; i <= 7; i++) {
      const cellPosts = posts.filter((p) => Number(p.day) === i);
      const pills = cellPosts
        .map(
          (p) => `<div class="post-pill ${p.platforms[0] || "ig"}" data-id="${p.id}">
          ${p.id} · ${escapeHtml(p.title)}
          <span class="edit-hint">нажмите, чтобы редактировать</span>
        </div>`
        )
        .join("");
      grid.innerHTML += `<div class="cal-cell" data-day="${i}">
        <strong>${i + 7} авг</strong>
        ${pills}
        <div class="add-day">+ добавить на этот день</div>
      </div>`;
    }
  }

  function renderQueue() {
    const tb = document.querySelector("#queueTable tbody");
    if (!tb) return;
    tb.innerHTML = posts
      .map((p) => {
        const st =
          p.status === "ready"
            ? "badge"
            : p.status === "review"
              ? "badge warn"
              : p.status === "draft"
                ? "badge mute"
                : "badge";
        const slotLabel = slotRu[p.slot] || p.slot;
        const platforms = (p.platforms || []).map((x) => platformRu[x] || x).join(", ");
        return `<tr>
          <td><strong>${p.id}</strong><br /><span style="color:var(--mute);font-size:0.8rem">${escapeHtml(p.title)}</span></td>
          <td>${slotLabel}</td>
          <td>${platforms}</td>
          <td><span class="${st}">${statusRu[p.status] || p.status}</span></td>
          <td>${escapeHtml(p.utm || "—")}</td>
          <td style="display:flex;gap:0.35rem;flex-wrap:wrap">
            <button class="sm ghost" type="button" data-edit="${p.id}">Изменить</button>
            <button class="sm ghost" type="button" data-pub="${p.id}">В очередь</button>
          </td>
        </tr>`;
      })
      .join("");
  }

  function renderApprovals() {
    const box = document.getElementById("approvalList");
    if (!box) return;
    const list = posts.filter((p) => p.status === "review" || p.status === "approved");
    if (!list.length) {
      box.innerHTML = `<div class="list-row"><div><h3>Нет постов на согласовании</h3><p>Добавьте пост со статусом «на проверке».</p></div></div>`;
      return;
    }
    box.innerHTML = list
      .map(
        (p) => `<div class="list-row">
        <div>
          <h3>${p.id} · ${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.caption || "")}</p>
        </div>
        <div style="display:flex;gap:0.4rem">
          <button class="sm" type="button" data-approve="${p.id}">Одобрить</button>
          <button class="sm ghost" type="button" data-reject="${p.id}">Отклонить</button>
          <button class="sm ghost" type="button" data-edit="${p.id}">Изменить</button>
        </div>
      </div>`
      )
      .join("");
  }

  function renderMediaLib() {
    const box = document.getElementById("mediaLib");
    if (!box) return;
    const withMedia = posts.filter((p) => p.mediaName || p.mediaData);
    if (!withMedia.length) {
      box.innerHTML = `<div class="list-row"><div><h3>Медиа пока нет</h3><p>Добавьте фото или видео через редактор календаря.</p></div></div>`;
      return;
    }
    box.innerHTML = withMedia
      .map(
        (p) => `<div class="list-row">
        <div>
          <h3>${escapeHtml(p.mediaName || "медиа")}</h3>
          <p>${p.mediaType || "файл"} · пост ${p.id} · ${escapeHtml(p.title)}</p>
        </div>
        <button class="sm ghost" type="button" data-edit="${p.id}">Открыть</button>
      </div>`
      )
      .join("");
  }

  function renderPreview(post) {
    const cap = document.getElementById("previewCap");
    const phone = document.querySelector(".preview-phone");
    if (!cap || !phone) return;
    const text = post
      ? `${escapeHtml(post.caption || post.title)}${post.link ? `<br/><span style="opacity:.85;text-decoration:underline">${escapeHtml(post.link)}</span>` : ""}<br/><span style="opacity:.7">#contentfactory</span>`
      : "Выберите пост в календаре";
    cap.innerHTML = text;

    phone.querySelectorAll(".media-bg, .media-bg-vid").forEach((n) => n.remove());
    if (post && post.mediaData) {
      if ((post.mediaType || "").startsWith("video")) {
        const v = document.createElement("video");
        v.className = "media-bg-vid";
        v.src = post.mediaData;
        v.muted = true;
        v.loop = true;
        v.autoplay = true;
        v.playsInline = true;
        phone.insertBefore(v, phone.firstChild);
      } else if ((post.mediaType || "").startsWith("image") || post.mediaData.startsWith("data:image")) {
        const d = document.createElement("div");
        d.className = "media-bg";
        d.style.backgroundImage = `url(${post.mediaData})`;
        phone.insertBefore(d, phone.firstChild);
      }
    }

    const chips = document.getElementById("previewChips");
    if (chips && post) {
      chips.innerHTML = (post.platforms || [])
        .map((p) => `<span class="chip on">${platformRu[p] || p}</span>`)
        .join("") || '<span class="chip">нет площадок</span>';
    }
  }

  function refreshAll() {
    renderCalendar();
    renderQueue();
    renderApprovals();
    renderMediaLib();
    updateKpis();
    const first = posts[0];
    if (first) renderPreview(first);
  }

  function openEditor(post, day) {
    editingId = post ? post.id : null;
    selectedDay = post ? Number(post.day) : day || selectedDay || 1;
    document.getElementById("modalTitle").textContent = post ? `Редактировать ${post.id}` : "Новый пост в календарь";
    document.getElementById("fTitle").value = post?.title || "";
    document.getElementById("fCaption").value = post?.caption || "";
    document.getElementById("fDescription").value = post?.description || "";
    document.getElementById("fLink").value = post?.link || "";
    document.getElementById("fUtm").value = post?.utm || "";
    document.getElementById("fDay").value = String(selectedDay);
    document.getElementById("fSlot").value = post?.slot || "peak_morning";
    document.getElementById("fStatus").value = post?.status || "draft";
    document.getElementById("fMediaUrl").value = "";
    document.getElementById("fMediaMeta").textContent = post?.mediaName
      ? `Файл: ${post.mediaName}`
      : "Файл не выбран — можно загрузить или вставить URL";

    document.querySelectorAll("#platToggles input").forEach((inp) => {
      inp.checked = post ? (post.platforms || []).includes(inp.value) : inp.value === "ig" || inp.value === "vk";
      inp.closest("label").classList.toggle("on", inp.checked);
    });

    const preview = document.getElementById("mediaPreview");
    preview.classList.remove("on");
    preview.innerHTML = "";
    if (post?.mediaData) {
      showMediaPreview(post.mediaData, post.mediaType);
    }

    document.getElementById("btnDelete").style.display = post ? "inline-flex" : "none";
    document.getElementById("editorModal").classList.add("on");
  }

  function closeEditor() {
    document.getElementById("editorModal").classList.remove("on");
    editingId = null;
  }

  function showMediaPreview(dataUrl, type) {
    const preview = document.getElementById("mediaPreview");
    preview.innerHTML = "";
    preview.classList.add("on");
    if ((type || "").startsWith("video") || (dataUrl || "").startsWith("data:video")) {
      const v = document.createElement("video");
      v.src = dataUrl;
      v.controls = true;
      preview.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = dataUrl;
      img.alt = "Превью";
      preview.appendChild(img);
    }
  }

  function collectPlatforms() {
    return [...document.querySelectorAll("#platToggles input:checked")].map((i) => i.value);
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFiles(files) {
    const file = files && files[0];
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast("Нужны фото или видео");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      toast("Для демо в браузере — до 12 МБ. Для продакшена используйте Drive/URL.");
      return;
    }
    const data = await readFileAsDataUrl(file);
    document.getElementById("fMediaMeta").dataset.data = data;
    document.getElementById("fMediaMeta").dataset.type = file.type;
    document.getElementById("fMediaMeta").dataset.name = file.name;
    document.getElementById("fMediaMeta").textContent = `Файл: ${file.name} (${Math.round(file.size / 1024)} КБ)`;
    showMediaPreview(data, file.type);
    toast("Медиа добавлено");
  }

  function saveFromForm() {
    const title = document.getElementById("fTitle").value.trim();
    if (!title) {
      toast("Укажите название");
      return;
    }
    const platforms = collectPlatforms();
    if (!platforms.length) {
      toast("Выберите хотя бы одну площадку");
      return;
    }

    const meta = document.getElementById("fMediaMeta");
    const mediaUrl = document.getElementById("fMediaUrl").value.trim();
    let mediaData = meta.dataset.data || "";
    let mediaType = meta.dataset.type || "";
    let mediaName = meta.dataset.name || "";

    if (mediaUrl && !mediaData) {
      mediaData = mediaUrl;
      mediaType = /\.(mp4|mov|webm)(\?|$)/i.test(mediaUrl) ? "video/mp4" : "image/jpeg";
      mediaName = mediaUrl.split("/").pop() || "remote-media";
    }

    const existing = editingId ? posts.find((p) => p.id === editingId) : null;
    const payload = {
      id: existing?.id || nextId(),
      day: Number(document.getElementById("fDay").value) || 1,
      title,
      caption: document.getElementById("fCaption").value.trim(),
      description: document.getElementById("fDescription").value.trim(),
      link: document.getElementById("fLink").value.trim(),
      utm: document.getElementById("fUtm").value.trim(),
      slot: document.getElementById("fSlot").value,
      status: document.getElementById("fStatus").value,
      platforms,
      mediaType: mediaType || existing?.mediaType || "",
      mediaName: mediaName || existing?.mediaName || "",
      mediaData: mediaData || existing?.mediaData || ""
    };

    if (existing) {
      posts = posts.map((p) => (p.id === existing.id ? payload : p));
      toast("Пост обновлён");
    } else {
      posts.push(payload);
      toast("Пост добавлен в календарь");
    }
    savePosts();
    closeEditor();
    refreshAll();
    renderPreview(payload);
  }

  function deleteCurrent() {
    if (!editingId) return;
    if (!confirm("Удалить этот пост из календаря?")) return;
    posts = posts.filter((p) => p.id !== editingId);
    savePosts();
    closeEditor();
    refreshAll();
    toast("Пост удалён");
  }

  function renderApiForm() {
    const box = document.getElementById("apiGrid");
    if (!box) return;
    const cards = [
      { key: "instagram", title: "Instagram Graph API", fields: [
        ["userId", "IG User ID"],
        ["accessToken", "Access Token"],
        ["baseUrl", "Base URL"]
      ]},
      { key: "vk", title: "VK API", fields: [
        ["groupId", "ID сообщества"],
        ["accessToken", "Access Token"],
        ["apiVersion", "Версия API"],
        ["baseUrl", "Base URL"]
      ]},
      { key: "youtube", title: "YouTube Data API", fields: [
        ["clientId", "Client ID"],
        ["clientSecret", "Client Secret"],
        ["refreshToken", "Refresh Token"],
        ["baseUrl", "Base URL"]
      ]},
      { key: "tiktok", title: "TikTok Content Posting API", fields: [
        ["clientKey", "Client Key"],
        ["clientSecret", "Client Secret"],
        ["accessToken", "Access Token"],
        ["refreshToken", "Refresh Token"],
        ["baseUrl", "Base URL"]
      ]}
    ];

    box.innerHTML = cards
      .map((c) => {
        const cfg = apiConfig[c.key] || {};
        const connected = Object.values(cfg).some((v, i) => typeof v === "string" && v.length > 8 && !["baseUrl", "apiVersion", "note"].includes(Object.keys(cfg)[i]));
        const ok = !!(cfg.accessToken || cfg.refreshToken || (cfg.clientId && cfg.clientSecret) || (cfg.clientKey && cfg.clientSecret));
        return `<article class="api-card" data-api="${c.key}">
          <h3>${c.title}</h3>
          <div class="status-line ${ok ? "ok" : "bad"}">${ok ? "● ключи заполнены (локально)" : "○ ключи не заданы"} · ${escapeHtml(cfg.note || "")}</div>
          <label style="display:flex;align-items:center;gap:0.45rem;margin-bottom:0.7rem;color:var(--mute);font-size:0.85rem">
            <input type="checkbox" data-field="enabled" ${cfg.enabled ? "checked" : ""}/> Включить площадку
          </label>
          <div class="form-grid">
            ${c.fields
              .map(
                ([field, label]) => `<label>${label}
              <input data-field="${field}" value="${escapeAttr(cfg[field] || "")}" ${/token|secret/i.test(field) ? 'type="password"' : 'type="text"'} placeholder="${label}"/>
            </label>`
              )
              .join("")}
          </div>
        </article>`;
      })
      .join("");
  }

  function collectApiFromForm() {
    document.querySelectorAll("#apiGrid .api-card").forEach((card) => {
      const key = card.dataset.api;
      apiConfig[key] = apiConfig[key] || {};
      card.querySelectorAll("[data-field]").forEach((el) => {
        const field = el.dataset.field;
        apiConfig[key][field] = el.type === "checkbox" ? el.checked : el.value.trim();
      });
    });
  }

  function exportMakeVars() {
    collectApiFromForm();
    saveApi();
    const ig = apiConfig.instagram || {};
    const vk = apiConfig.vk || {};
    const tt = apiConfig.tiktok || {};
    const text = [
      "# Переменные для Make Content Factory",
      `ig_user_id=${ig.userId || ""}`,
      `ig_access_token=${ig.accessToken || ""}`,
      `vk_group_id=${vk.groupId || ""}`,
      `vk_access_token=${vk.accessToken || ""}`,
      `tt_client_key=${tt.clientKey || ""}`,
      `tt_client_secret=${tt.clientSecret || ""}`,
      `tt_access_token=${tt.accessToken || ""}`
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "make-variables.env";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Файл переменных для Make скачан");
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  // Events
  document.getElementById("calGrid")?.addEventListener("click", (e) => {
    const pill = e.target.closest(".post-pill");
    if (pill) {
      const post = posts.find((p) => p.id === pill.dataset.id);
      if (post) {
        renderPreview(post);
        openEditor(post);
      }
      return;
    }
    const cell = e.target.closest(".cal-cell");
    if (cell) {
      selectedDay = Number(cell.dataset.day) || 1;
      openEditor(null, selectedDay);
    }
  });

  document.getElementById("btnAddPost")?.addEventListener("click", () => openEditor(null, selectedDay));
  document.getElementById("btnCloseModal")?.addEventListener("click", closeEditor);
  document.getElementById("editorModal")?.addEventListener("click", (e) => {
    if (e.target.id === "editorModal") closeEditor();
  });
  document.getElementById("btnSavePost")?.addEventListener("click", saveFromForm);
  document.getElementById("btnDelete")?.addEventListener("click", deleteCurrent);

  const drop = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  drop?.addEventListener("click", () => fileInput.click());
  fileInput?.addEventListener("change", (e) => handleFiles(e.target.files));
  ["dragenter", "dragover"].forEach((ev) =>
    drop?.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.add("drag");
    })
  );
  ["dragleave", "drop"].forEach((ev) =>
    drop?.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.remove("drag");
      if (ev === "drop") handleFiles(e.dataTransfer.files);
    })
  );

  document.getElementById("btnLoadUrl")?.addEventListener("click", () => {
    const url = document.getElementById("fMediaUrl").value.trim();
    if (!url) {
      toast("Вставьте ссылку на фото или видео");
      return;
    }
    const type = /\.(mp4|mov|webm)(\?|$)/i.test(url) ? "video/mp4" : "image/jpeg";
    document.getElementById("fMediaMeta").dataset.data = url;
    document.getElementById("fMediaMeta").dataset.type = type;
    document.getElementById("fMediaMeta").dataset.name = url.split("/").pop() || "url-media";
    document.getElementById("fMediaMeta").textContent = `URL: ${url}`;
    showMediaPreview(url, type);
    toast("Ссылка на медиа подключена");
  });

  document.querySelector("#platToggles")?.addEventListener("change", (e) => {
    const label = e.target.closest("label");
    if (label) label.classList.toggle("on", e.target.checked);
  });

  document.getElementById("queueTable")?.addEventListener("click", (e) => {
    const edit = e.target.closest("[data-edit]");
    if (edit) {
      const post = posts.find((p) => p.id === edit.dataset.edit);
      if (post) openEditor(post);
      return;
    }
    const pub = e.target.closest("[data-pub]");
    if (pub) {
      posts = posts.map((p) => (p.id === pub.dataset.pub ? { ...p, status: "ready" } : p));
      savePosts();
      refreshAll();
      toast("Статус: готово к публикации");
    }
  });

  document.getElementById("approvalList")?.addEventListener("click", (e) => {
    const approve = e.target.closest("[data-approve]");
    const reject = e.target.closest("[data-reject]");
    const edit = e.target.closest("[data-edit]");
    if (approve) {
      posts = posts.map((p) => (p.id === approve.dataset.approve ? { ...p, status: "ready" } : p));
      savePosts();
      refreshAll();
      toast("Одобрено → готово");
    } else if (reject) {
      posts = posts.map((p) => (p.id === reject.dataset.reject ? { ...p, status: "draft" } : p));
      savePosts();
      refreshAll();
      toast("Возвращено в черновик");
    } else if (edit) {
      const post = posts.find((p) => p.id === edit.dataset.edit);
      if (post) openEditor(post);
    }
  });

  document.getElementById("mediaLib")?.addEventListener("click", (e) => {
    const edit = e.target.closest("[data-edit]");
    if (edit) {
      const post = posts.find((p) => p.id === edit.dataset.edit);
      if (post) openEditor(post);
    }
  });

  document.getElementById("btnSaveApi")?.addEventListener("click", () => {
    collectApiFromForm();
    saveApi();
    toast("API-ключи сохранены локально в браузере");
    renderApiForm();
  });
  document.getElementById("btnExportApi")?.addEventListener("click", exportMakeVars);
  document.getElementById("btnResetDemo")?.addEventListener("click", () => {
    if (!confirm("Сбросить календарь к демо-данным?")) return;
    posts = structuredClone(defaultPosts);
    savePosts();
    refreshAll();
    toast("Демо-данные восстановлены");
  });

  // AI studio (unchanged behaviour)
  document.getElementById("aiRun")?.addEventListener("click", () => {
    const src = document.getElementById("aiSource").value.trim();
    const tone = document.getElementById("aiTone").value;
    const cta = document.getElementById("aiCta").value.trim() || "гайд";
    document.getElementById("outIg").value = `${src} ${tone === "дерзкий эксперт" ? "🔥" : ""}\nПиши «${cta}» в комменты — пришлю файл.`;
    document.getElementById("outVk").value = `${src}\n\nСохраняй, чтобы не потерять. Подробности — по слову «${cta}» в комментариях.`;
    document.getElementById("outTt").value = `${src.split(".")[0]}. #fyp #контент\n«${cta}» в комменты 👇`;
    document.getElementById("outYt").value = `${src}\n\nТаймкоды и шаблон Make — в описании. #Shorts`;
    toast("Тексты адаптированы под 4 площадки");
  });

  if (location.hash === "#app" || new URLSearchParams(location.search).get("app") === "1") {
    window.enterApp("calendar");
  }
})();
