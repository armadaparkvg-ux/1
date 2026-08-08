(() => {
  const drop = document.querySelector("[data-dropzone]");
  if (drop) {
    const input = drop.querySelector('input[type="file"]');
    const nameEl = drop.querySelector("[data-filename]");
    const setName = () => {
      if (nameEl && input?.files?.[0]) {
        nameEl.textContent = input.files[0].name;
      }
    };
    input?.addEventListener("change", setName);
    ["dragenter", "dragover"].forEach((ev) => {
      drop.addEventListener(ev, (e) => {
        e.preventDefault();
        drop.classList.add("dragover");
      });
    });
    ["dragleave", "drop"].forEach((ev) => {
      drop.addEventListener(ev, (e) => {
        e.preventDefault();
        drop.classList.remove("dragover");
      });
    });
    drop.addEventListener("drop", (e) => {
      if (!input || !e.dataTransfer?.files?.length) return;
      input.files = e.dataTransfer.files;
      setName();
    });
  }

  const form = document.querySelector("[data-publish-form]");
  if (form) {
    form.addEventListener("submit", () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Публикуем…";
      }
    });
  }

  const params = new URLSearchParams(location.search);
  if (params.get("just") === "1") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = "Задачи созданы — смотрите статусы ниже";
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => toast.classList.remove("show"), 3200);
  }
})();
