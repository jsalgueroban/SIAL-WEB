const SIAL = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const farmCoordinates = {
    "FIN-AC01": "10.965,-74.801",
    "FIN-BP07": "10.615,-74.924"
  };

  function applyShell(activeKey) {
    const referenceViews = ["referencias", "clases"];
    const moduleId = referenceViews.includes(activeKey) ? "referencias" : "fincas";
    if (window.SIALCore?.initShell) {
      window.SIALCore.initShell({ area: "gestion", module: moduleId, view: activeKey || "fincas" });
      return;
    }
    window.SIALCore?.initThemeToggle?.();
    const nav = qs("[data-nav]");
    if (!nav) return;
    const items = moduleId === "referencias" ? [
      ["referencias", "gestion-referencias.html", "Gestion de referencias"],
      ["clases", "gestion-clases-referencia.html", "Clases de referencias"]
    ] : [
      ["fincas", "gestion-fincas.html", "Gestion de fincas"],
      ["sectores", "gestion-sectores.html", "Gestion de sectores"],
      ["grupos", "gestion-grupos.html", "Gestion de grupos"]
    ];
    nav.innerHTML = items.map(([key, href, label]) =>
      `<a class="nav-link ${key === activeKey ? "active" : ""}" href="${href}"><svg class="icon" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg><span>${label}</span></a>`
    ).join("");
  }

  function initThemeToggle() {
    const toggle = qs("[data-theme-toggle]");
    if (!toggle || toggle.dataset.themeReady === "true") return;
    toggle.dataset.themeReady = "true";
    const storedTheme = localStorage.getItem("sial-theme");
    const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (systemDark ? "dark" : "light");

    const setTheme = (theme) => {
      const normalizedTheme = theme === "dark" ? "dark" : "light";
      document.documentElement.dataset.theme = normalizedTheme;
      localStorage.setItem("sial-theme", normalizedTheme);
      const isDark = normalizedTheme === "dark";
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
      toggle.setAttribute("title", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    };

    setTheme(initialTheme);
    toggle.addEventListener("click", () => {
      setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    });
  }

  function setFieldState(input, note, error, successText) {
    if (!input || !note) return;
    input.classList.toggle("is-error", Boolean(error));
    input.setAttribute("aria-invalid", error ? "true" : "false");
    note.classList.toggle("error", Boolean(error));
    note.classList.toggle("success", !error && Boolean(successText));
    note.textContent = error || successText || note.dataset.base || note.textContent;
  }

  function parseCoordinates(value) {
    const match = String(value || "").trim().match(/^(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/);
    if (!match) return null;
    const lat = Number(match[1]);
    const lng = Number(match[2]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (lat < -4.5 || lat > 13.5 || lng < -82 || lng > -66) return null;
    return { lat, lng };
  }

  function positionGeoMarker(component, coordinates) {
    const marker = qs("[data-geo-marker]", component);
    const label = qs("[data-geo-map-label]", component);
    const latNode = qs("[data-geo-lat]", component);
    const lngNode = qs("[data-geo-lng]", component);
    const refNode = qs("[data-geo-ref]", component);
    if (!marker || !label) return;
    if (!coordinates) {
      marker.classList.remove("show");
      label.textContent = "Sin coordenadas";
      if (latNode) latNode.textContent = "-";
      if (lngNode) lngNode.textContent = "-";
      if (refNode) refNode.textContent = "Ingresa coordenadas validas.";
      return;
    }
    const minLat = -4.5;
    const maxLat = 13.5;
    const minLng = -82;
    const maxLng = -66;
    const x = Math.max(4, Math.min(96, ((coordinates.lng - minLng) / (maxLng - minLng)) * 100));
    const y = Math.max(4, Math.min(96, ((maxLat - coordinates.lat) / (maxLat - minLat)) * 100));
    marker.style.setProperty("--geo-x", `${x}%`);
    marker.style.setProperty("--geo-y", `${y}%`);
    marker.classList.add("show");
    label.textContent = "Finca ubicada";
    if (latNode) latNode.textContent = coordinates.lat.toFixed(6);
    if (lngNode) lngNode.textContent = coordinates.lng.toFixed(6);
    if (refNode) refNode.textContent = "Marcador calculado sobre mapa operativo de referencia.";
  }

  function initGeoMap() {
    const component = qs("[data-geo-component]");
    if (!component) return;
    const input = qs("[data-geo-input]", component);
    const locateButton = qs("[data-geo-locate]", component);
    const note = input ? qs(`#${input.getAttribute("aria-describedby")}`) : null;
    if (note && !note.dataset.base) note.dataset.base = note.textContent;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("codigo");
    if (input && code && farmCoordinates[code] && !input.value) {
      input.value = farmCoordinates[code];
    }
    const update = () => {
      if (!input) return;
      const rawValue = input.value.trim();
      if (!rawValue) {
        positionGeoMarker(component, null);
        setFieldState(input, note, "", "");
        return;
      }
      const coordinates = parseCoordinates(rawValue);
      if (!coordinates) {
        positionGeoMarker(component, null);
        setFieldState(input, note, "Ingresa coordenadas validas dentro de Colombia. Ejemplo: 10.965, -74.801.", "");
        return;
      }
      positionGeoMarker(component, coordinates);
      setFieldState(input, note, "", "Coordenadas validas. El marcador se actualizo en el mapa.");
    };
    input?.addEventListener("input", update);
    locateButton?.addEventListener("click", update);
    update();
  }

  function initTableFilters(config) {
    if (window.SIALCore?.initTableFilters) {
      window.SIALCore.initTableFilters(config);
      return;
    }
    const rows = qsa(config.rowSelector);
    const search = qs(config.search);
    const status = qs(config.status);
    const context = qs(config.context);
    const empty = qs(config.empty);
    const count = qs(config.count);

    function filterRows() {
      const term = (search?.value || "").trim().toLowerCase();
      const state = status?.value || "all";
      const ctx = context?.value || "all";
      let visible = 0;
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const stateOk = state === "all" || row.dataset.status === state;
        const ctxOk = ctx === "all" || row.dataset.context === ctx;
        const show = (!term || text.includes(term)) && stateOk && ctxOk;
        row.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });
      if (empty) empty.classList.toggle("show", visible === 0);
      if (count) count.textContent = `${visible} registros visibles`;
    }
    [search, status, context].filter(Boolean).forEach((control) => {
      control.addEventListener(control.tagName === "INPUT" ? "input" : "change", filterRows);
    });
    filterRows();
  }

  function initDrawer() {
    const drawer = qs("#detailDrawer");
    const backdrop = qs("#detailBackdrop");
    if (!drawer || !backdrop) return;
    const close = () => {
      drawer.classList.remove("show");
      backdrop.classList.remove("show");
    };
    qsa("[data-open-detail]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const row = event.target.closest("tr");
        if (!row) return;
        qsa("[data-detail-target]").forEach((node) => {
          const key = node.dataset.detailTarget;
          node.textContent = row.dataset[key] || "-";
        });
        const geoComponent = qs("[data-geo-component]", drawer);
        if (geoComponent) positionGeoMarker(geoComponent, parseCoordinates(row.dataset.geo || ""));
        const licenses = qs("#detailLicenses");
        if (licenses) {
          licenses.innerHTML = (row.dataset.licenses || "").split(";").filter(Boolean).map((item) => {
            const [title, meta] = item.split("|");
            return `<div class="license-item"><strong>${title || "-"}</strong><div class="muted">${meta || ""}</div></div>`;
          }).join("");
        }
        const audit = qs("#detailAudit");
        if (audit) {
          audit.innerHTML = (row.dataset.audit || "").split(";").filter(Boolean).map((item) => {
            const [title, meta] = item.split("|");
            return `<div class="audit-item"><strong>${title || "-"}</strong><div class="muted">${meta || ""}</div></div>`;
          }).join("");
        }
        drawer.classList.add("show");
        backdrop.classList.add("show");
        qs("#closeDetail")?.focus();
      });
    });
    qs("#closeDetail")?.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function initDriverForm() {
    const form = qs("#driverForm");
    if (!form) return;
    const ok = qs("#formOk");
    const fields = {
      company: [qs("#company"), qs("#companyNote"), v => v ? "" : "Selecciona la empresa del conductor."],
      firstName: [qs("#firstName"), qs("#firstNameNote"), v => v.trim().length >= 2 ? "" : "Los nombres son obligatorios."],
      lastName: [qs("#lastName"), qs("#lastNameNote"), v => v.trim().length >= 2 ? "" : "Los apellidos son obligatorios."],
      idType: [qs("#idType"), qs("#idTypeNote"), v => v ? "" : "Selecciona el tipo de identificacion."],
      idNumber: [qs("#idNumber"), qs("#idNumberNote"), v => /^[0-9]{6,15}$/.test(v.trim()) ? "" : "Ingresa entre 6 y 15 digitos."],
      phone: [qs("#phone"), qs("#phoneNote"), v => /^[0-9]{10}$/.test(v.trim()) ? "" : "El celular debe tener 10 digitos."],
      email: [qs("#email"), qs("#emailNote"), v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Ingresa un correo electronico valido."],
      licenseNumber: [qs("#licenseNumber"), qs("#licenseNumberNote"), v => v.trim().length >= 5 ? "" : "El numero de licencia es obligatorio."],
      arlCompany: [qs("#arlCompany"), qs("#arlCompanyNote"), v => v ? "" : "Selecciona la empresa ARL."],
      arlStart: [qs("#arlStart"), qs("#arlStartNote"), v => v ? "" : "La fecha de inicio ARL es obligatoria."],
      arlEnd: [qs("#arlEnd"), qs("#arlEndNote"), v => {
        const start = qs("#arlStart").value;
        if (!v) return "La fecha de fin ARL es obligatoria.";
        if (start && v < start) return "La fecha de fin no puede ser anterior al inicio.";
        return "";
      }]
    };
    ["firstName", "lastName"].forEach((id) => {
      qs(`#${id}`)?.addEventListener("input", (event) => {
        event.target.value = event.target.value.toUpperCase();
      });
    });
    function validateLicenses() {
      const note = qs("#licenseAssignmentNote");
      const checked = qsa('input[name="licenseCategory"]:checked');
      if (!checked.length) {
        note.classList.add("error");
        note.textContent = "Debes asignar al menos una categoria de licencia activa.";
        return false;
      }
      const missing = checked.some((item) => !qs(`#exp${item.value}`).value);
      if (missing) {
        note.classList.add("error");
        note.textContent = "Cada categoria activa debe tener fecha de vencimiento.";
        return false;
      }
      note.classList.remove("error");
      note.classList.add("success");
      note.textContent = "Categorias activas listas para registrar la relacion conductor-licencia.";
      return true;
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      Object.values(fields).forEach(([input, note, rule]) => {
        if (!note.dataset.base) note.dataset.base = note.textContent;
        const error = rule(input.value);
        setFieldState(input, note, error, "Dato validado.");
        if (error) fail = true;
      });
      if (!validateLicenses()) fail = true;
      ok?.classList.toggle("is-hidden", fail);
      if (fail) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        const field = firstInvalid?.closest('[data-sial-form-control]');
        (field?.querySelector('.sial-library-field input, .sial-library-field select') || firstInvalid)?.focus();
      }
      if (!fail) window.scrollTo({ top: 0, behavior: "smooth" });
    });
    form.addEventListener("reset", () => {
      setTimeout(() => {
        qsa(".is-error", form).forEach((node) => node.classList.remove("is-error"));
        qsa(".field-note", form).forEach((note) => {
          note.classList.remove("error", "success");
          if (note.dataset.base) note.textContent = note.dataset.base;
        });
        ok?.classList.add("is-hidden");
      }, 0);
    });
  }

  function initLicenseForm() {
    const form = qs("#licenseForm");
    if (!form) return;
    const ok = qs("#formOk");
    const existing = ["C2", "C3", "B1"];
    const fields = {
      licenseCode: [qs("#licenseCode"), qs("#licenseCodeNote"), v => {
        const code = v.trim().toUpperCase();
        if (!/^[A-Z0-9]{1,6}$/.test(code)) return "El codigo es obligatorio, alfanumerico y en mayusculas.";
        if (existing.includes(code)) return "El codigo de licencia ya existe.";
        return "";
      }],
      description: [qs("#description"), qs("#descriptionNote"), v => v.trim().length >= 4 ? "" : "La descripcion es obligatoria."]
    };
    qs("#licenseCode")?.addEventListener("input", (event) => {
      event.target.value = event.target.value.toUpperCase();
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      Object.values(fields).forEach(([input, note, rule]) => {
        if (!note.dataset.base) note.dataset.base = note.textContent;
        const error = rule(input.value);
        setFieldState(input, note, error, "Dato validado.");
        if (error) fail = true;
      });
      ok?.classList.toggle("is-hidden", fail);
    });
  }

  function initRelationForm() {
    const form = qs("#relationForm");
    if (!form) return;
    const ok = qs("#formOk");
    const existing = new Set(["CD-00124|C2", "CD-00124|C3", "CD-00141|C3"]);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      const conductor = qs("#driverCodeSelect");
      const license = qs("#licenseCodeSelect");
      const expiration = qs("#expirationDate");
      const fields = [
        [conductor, qs("#driverCodeNote"), v => v ? "" : "Selecciona un conductor activo."],
        [license, qs("#licenseCodeNote"), v => v ? "" : "Selecciona una categoria activa."],
        [expiration, qs("#expirationDateNote"), v => v ? "" : "La fecha de vencimiento es obligatoria."]
      ];
      fields.forEach(([input, note, rule]) => {
        if (!note.dataset.base) note.dataset.base = note.textContent;
        const error = rule(input.value);
        setFieldState(input, note, error, "Dato validado.");
        if (error) fail = true;
      });
      const key = `${conductor.value}|${license.value}`;
      const relationNote = qs("#relationRuleNote");
      if (!fail && existing.has(key)) {
        relationNote.classList.add("error");
        relationNote.textContent = "La relacion conductor + licencia ya existe y es llave primaria.";
        fail = true;
      } else {
        relationNote.classList.remove("error");
        relationNote.textContent = "La combinacion conductor + licencia debe ser unica.";
      }
      ok?.classList.toggle("is-hidden", fail);
    });
  }

  function initGenericForm(formSelector = "[data-generic-form]") {
    const form = qs(formSelector);
    if (!form) return;
    const ok = qs("#formOk");
    qsa("[data-uppercase]", form).forEach((input) => {
      input.addEventListener("input", (event) => {
        event.target.value = event.target.value.toUpperCase();
      });
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      qsa("[data-required]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        if (note && !note.dataset.base) note.dataset.base = note.textContent;
        const empty = !String(input.value || "").trim();
        setFieldState(input, note, empty ? "Este campo es obligatorio." : "", "Dato validado.");
        if (empty) fail = true;
      });
      qsa("[data-unique-list]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        const values = input.dataset.uniqueList.split("|").map((v) => v.trim().toUpperCase());
        const duplicate = input.value && values.includes(input.value.trim().toUpperCase()) && input.value.trim().toUpperCase() !== (input.dataset.originalValue || "");
        if (duplicate) {
          setFieldState(input, note, "El valor ya existe en la tabla maestra.", "");
          fail = true;
        }
      });
      qsa("[data-less-than]", form).forEach((min) => {
        const max = qs(`#${min.dataset.lessThan}`);
        const note = qs(`#${min.getAttribute("aria-describedby")}`);
        if (min.value && max?.value && Number(min.value) > Number(max.value)) {
          setFieldState(min, note, "El minimo no puede ser mayor que el maximo.", "");
          fail = true;
        }
      });
      qsa("[data-geo-input]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        if (input.value.trim() && !parseCoordinates(input.value)) {
          setFieldState(input, note, "Ingresa coordenadas validas antes de guardar.", "");
          fail = true;
        }
      });
      ok?.classList.toggle("is-hidden", fail);
      if (fail) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        const field = firstInvalid?.closest('[data-sial-form-control]');
        (field?.querySelector('.sial-library-field input, .sial-library-field select') || firstInvalid)?.focus();
      }
      if (!fail) window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initEmbeddedForm(config = {}) {
    const panel = qs(config.panel || "[data-inline-form-panel]");
    const openButton = qs(config.openButton || "[data-open-inline-form]");
    const cancelButton = qs(config.cancelButton || "[data-cancel-inline-form]");
    const title = qs(config.title || "[data-inline-form-title]");
    const form = panel?.querySelector("form");
    if (!panel || !openButton) return;

    const open = (mode = "new", row = null) => {
      if (config.prefillName) {
        const input = form?.querySelector("[data-unique-list]");
        if (input) {
          input.value = mode === "edit" ? (row?.dataset.name || "") : "";
          input.dataset.originalValue = input.value.trim().toUpperCase();
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
        qs("#formOk")?.classList.add("is-hidden");
      }
      panel.classList.remove("is-hidden");
      openButton.setAttribute("aria-expanded", "true");
      if (title) title.textContent = mode === "edit" ? config.editTitle || "Editar registro" : config.newTitle || "Nuevo registro";
      (panel.querySelector(".sial-library-field input, .sial-library-field select") || panel.querySelector("input:not([readonly]), select, textarea"))?.focus();
    };
    const close = () => {
      panel.classList.add("is-hidden");
      openButton.setAttribute("aria-expanded", "false");
      form?.reset();
      (openButton.previousElementSibling?.matches(".sial-library-button")
        ? openButton.previousElementSibling.querySelector("button")
        : openButton)?.focus();
    };

    openButton.addEventListener("click", () => open("new"));
    cancelButton?.addEventListener("click", close);
    qsa(config.editButtons || "[data-edit-inline]").forEach((button) => {
      button.addEventListener("click", () => open("edit", button.closest("tr")));
    });
  }

  return { applyShell, initTableFilters, initDrawer, initDriverForm, initLicenseForm, initRelationForm, initGenericForm, initEmbeddedForm, initGeoMap };
})();
