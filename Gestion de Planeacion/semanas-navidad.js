/* Ambientación local de propuesta. No cambia contratos ni datos del producto. */
(() => {
  const active =
    new URLSearchParams(location.search).get("season") === "christmas";
  const header = document.querySelector(".header");
  if (!header) return;
  const tools = document.createElement("div");
  tools.className = "season-preview-controls";
  const comparison = document.createElement("a");
  const url = new URL(location.href);
  if (active) url.searchParams.delete("season");
  else url.searchParams.set("season", "christmas");
  comparison.href = url.href;
  comparison.className = "season-compare";
  comparison.textContent = active ? "Vista habitual" : "Probar Navidad";
  tools.append(comparison);
  header.querySelector(".header-right")?.prepend(tools);
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "semanas-navidad.css?v=20261104-1";
  document.head.append(css);
  if (!active) return;
  document.documentElement.dataset.season = "christmas";
  const interactionAnimations = new Set();
  const buttonAnimations = new WeakMap();
  const pause = document.createElement("button");
  pause.type = "button";
  pause.className = "season-motion";
  pause.textContent = "Pausar adornos";
  pause.setAttribute("aria-label", "Pausar adornos");
  pause.setAttribute("aria-pressed", "false");
  pause.addEventListener("click", () => {
    const paused = document.documentElement.dataset.seasonPaused !== "true";
    document.documentElement.dataset.seasonPaused = String(paused);
    pause.setAttribute("aria-pressed", String(paused));
    interactionAnimations.forEach((animation) =>
      paused ? animation.pause() : animation.play(),
    );
    pause.textContent = paused ? "Animar adornos" : "Pausar adornos";
    pause.setAttribute("aria-label", pause.textContent);
  });
  tools.append(pause);
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  function syncMotion() {
    pause.disabled = motion.matches;
    if (motion.matches)
      interactionAnimations.forEach((animation) => animation.cancel());
    pause.title = motion.matches
      ? "Movimiento reducido del sistema activo"
      : "";
  }
  motion.addEventListener("change", syncMotion);
  syncMotion();

  let instance = 0;
  const pine = (x, y, angle, scale = 1) => {
    let needles = "";
    for (let step = 0; step < 10; step += 1) {
      const px = step * 4.4;
      const length = 6 + Math.sin((step / 10) * Math.PI) * 10;
      const color = ["#205b43", "#2e7656", "#48926a"][step % 3];
      needles += `<path d="M${px + 2} 1Q${px - length * 0.6} -3 ${px - length * 0.56} ${-length}Q${px + 1} -6 ${px + 2} 1Z" fill="${color}"/><path d="M${px + 2} -1Q${px - length * 0.6} 3 ${px - length * 0.5} ${length * 0.85}Q${px + 1} 6 ${px + 2} -1Z" fill="${step % 2 ? "#307454" : "#194c38"}"/>`;
    }
    return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"><path d="M-5 0H45" stroke="#71603d" stroke-width="1.8" stroke-linecap="round"/>${needles}<path d="M0 0H43" stroke="#90aa68" stroke-opacity=".5" stroke-width=".7"/></g>`;
  };
  function actionDecoration(id) {
    const box = document.createElement("span");
    box.className = "season-decoration season-action";
    box.setAttribute("aria-hidden", "true");
    box.dataset.seasonAttachment = "rim";
    const leaf = (transform) =>
      `<g transform="${transform}"><path d="M0 0C6-3 5-10 11-9C13-15 17-10 21-15L33-17L29-7C23-8 28-2 21-2C20 4 14 0 12 6C8 3 3 5 0 0Z" fill="url(#${id}-leaf)" stroke="#154630" stroke-width=".7"/><path d="M1 0Q18-4 31-15M10-3l0-5M18-7l2-4M12-4l5 3" stroke="#99b87b" stroke-opacity=".7" stroke-width=".7" fill="none"/></g>`;
    const bell = (transform) =>
      `<g transform="${transform}"><ellipse cy="-2" rx="2.7" ry="3.4" fill="none" stroke="#a9792f" stroke-width="1.7"/><path d="M-3 0H3V4H-3Z" fill="#bd8d3e"/><path d="M-10 20C-8 15-7 12-7 8C-7-2 7-2 7 8C7 12 8 15 10 20Z" fill="url(#${id}-brass)" stroke="#8b5b23" stroke-width=".8"/><path d="M-5 5Q-8 12-8 17" fill="none" stroke="#fff3b5" stroke-width="1.8" stroke-linecap="round"/><path d="M4 5Q7 12 7 17" fill="none" stroke="#ad752a" stroke-width="1.2"/><path d="M-8 15Q0 18 8 15" stroke="#9d6c28" stroke-width=".65" fill="none"/><path d="M-9 17Q0 20 9 17" stroke="#ffe29a" stroke-width=".8" fill="none"/><ellipse cy="20" rx="10.2" ry="3.1" fill="#73501e" stroke="#c79a4c" stroke-width="1"/><ellipse cy="19.5" rx="8.5" ry="1.6" fill="#a87b30"/><g class="season-bell-clapper"><path d="M0 17v7" stroke="#73501e" stroke-width="1.3"/><circle cy="24" r="2.8" fill="url(#${id}-brass)" stroke="#926227" stroke-width=".6"/></g><path d="M-8 21Q0 24 8 21" stroke="#f9d280" stroke-width=".8" fill="none"/></g>`;
    box.innerHTML = `<svg class="season-rim-cord" viewBox="0 0 1000 14" preserveAspectRatio="none"><path d="M2 3Q500 13 998 3" stroke="#153f32" stroke-opacity=".18" stroke-width="5" fill="none"/><path d="M2 1Q500 11 998 1" stroke="#31694c" stroke-width="3" fill="none"/><path d="M2 .4Q500 10.4 998 .4" stroke="#80a464" stroke-width=".65" fill="none"/></svg>
    <svg class="season-rim-foliage" viewBox="0 0 66 52"><defs><linearGradient id="${id}-leaf" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5b986a"/><stop offset=".5" stop-color="#286249"/><stop offset="1" stop-color="#123e30"/></linearGradient><linearGradient id="${id}-ribbon"><stop stop-color="#7c2034"/><stop offset=".3" stop-color="#dc5c66"/><stop offset=".55" stop-color="#ad2b43"/><stop offset=".8" stop-color="#e06b72"/><stop offset="1" stop-color="#8d2238"/></linearGradient></defs><path d="M18 25q-6-12 1-12q6 0 4 7" fill="none" stroke="#9e7840" stroke-width="1.4"/>${leaf("translate(24 25) rotate(-10)")}${leaf("translate(26 24) rotate(-65) scale(.8)")}${leaf("translate(27 25) rotate(28) scale(.8)")}${pine(26, 24, 185, 0.56)}<path d="M17 24L8 46l8-4 5 5 5-23" fill="url(#${id}-ribbon)" stroke="#8d263b" stroke-width=".6"/><path d="M21 25L31 44l1-8 7 2-11-17" fill="url(#${id}-ribbon)" stroke="#8d263b" stroke-width=".6"/><path d="M20 23C-7 3 2 36 21 25C51 5 45 38 22 26Z" fill="url(#${id}-ribbon)" stroke="#8a2238" stroke-width=".7"/><path d="M17 22Q6 12 7 22M26 23Q38 15 38 23" fill="none" stroke="#f4a4a5" stroke-width=".7"/><path d="M18 21Q23 18 26 22L25 28Q21 30 18 26Z" fill="#b83a50" stroke="#8a2238" stroke-width=".6"/><path d="M20 21v6" stroke="#e9868d" stroke-width="1"/></svg>
    <svg class="season-rim-bells" viewBox="0 0 50 68"><defs><linearGradient id="${id}-brass"><stop stop-color="#98702b"/><stop offset=".2" stop-color="#f2ca72"/><stop offset=".4" stop-color="#fff1b2"/><stop offset=".6" stop-color="#d7a44d"/><stop offset=".82" stop-color="#aa742d"/><stop offset="1" stop-color="#efd083"/></linearGradient></defs><path d="M13 13q-6-12 1-12q6 0 4 7" fill="none" stroke="#9e7840" stroke-width="1.5"/><path d="M13 11q6-5 10 1" stroke="#427252" stroke-width="3" fill="none"/><g class="season-bell-rig"><path d="M15 8Q23 11 24 23M15 8Q36 12 35 32" stroke="#ae8b4c" stroke-width="1.2" fill="none"/><path d="M17 10Q26 7 28 17" stroke="#c74453" stroke-width="2.5" fill="none"/>${bell("translate(24 23) rotate(-17) scale(.68)")}${bell("translate(35 33) rotate(12) scale(.85)")}</g></svg>`;
    return box;
  }
  function ringBells(button) {
    if (
      motion.matches ||
      document.documentElement.dataset.seasonPaused === "true"
    )
      return;
    const rig = button.querySelector(".season-bell-rig");
    if (!rig) return;
    const targets = [rig, ...rig.querySelectorAll(".season-bell-clapper")];
    const initial = targets.map((target) => getComputedStyle(target).transform);
    buttonAnimations.get(button)?.forEach((animation) => animation.cancel());
    const animations = targets.map((target, i) => {
      const sign = i ? -0.65 : 1;
      const frames = [
        { transform: initial[i] },
        ...[
          [19, 0.14],
          [-15, 0.32],
          [10, 0.5],
          [-6, 0.68],
          [3, 0.84],
          [0, 1],
        ].map(([angle, offset]) => ({
          transform: `rotate(${angle * sign}deg)`,
          offset,
        })),
      ];
      const animation = target.animate(frames, {
        duration: i ? 1510 : 1600,
        delay: i ? 70 : 0,
        easing: "ease-in-out",
      });
      interactionAnimations.add(animation);
      const remove = () => interactionAnimations.delete(animation);
      animation.addEventListener("finish", remove, { once: true });
      animation.addEventListener("cancel", remove, { once: true });
      return animation;
    });
    buttonAnimations.set(button, animations);
  }

  const swingAnimations = new WeakMap();
  function swayOrnament(target, amplitude, restAngle = 0) {
    if (
      !target ||
      motion.matches ||
      document.documentElement.dataset.seasonPaused === "true"
    )
      return;
    const computedTransform = getComputedStyle(target).transform;
    const initial =
      computedTransform === "none"
        ? `rotate(${restAngle}deg)`
        : computedTransform;
    swingAnimations.get(target)?.cancel();
    const frames = [
      { transform: initial },
      ...[
        [1, 0.15],
        [-0.7, 0.34],
        [0.43, 0.54],
        [-0.2, 0.73],
        [0.06, 0.89],
        [0, 1],
      ].map(([factor, offset]) => ({
        transform: `rotate(${restAngle + amplitude * factor}deg)`,
        offset,
      })),
    ];
    const animation = target.animate(frames, {
      duration: 1700,
      easing: "ease-in-out",
    });
    swingAnimations.set(target, animation);
    interactionAnimations.add(animation);
    const remove = () => interactionAnimations.delete(animation);
    animation.addEventListener("finish", remove, { once: true });
    animation.addEventListener("cancel", remove, { once: true });
  }
  function attachOrnamentReaction(host, target, amplitude, restAngle = 0) {
    host.addEventListener("pointerenter", () =>
      swayOrnament(target, amplitude, restAngle),
    );
    host.addEventListener("focusin", (event) => {
      if (!host.contains(event.relatedTarget))
        swayOrnament(target, amplitude, restAngle);
    });
  }
  function sprig() {
    return `${pine(58, 19, 190, 0.95)}${pine(54, 17, 220, 0.82)}${pine(56, 18, 165, 0.8)}${pine(58, 18, -20, 0.86)}${pine(60, 18, -48, 0.7)}<g fill="#be3045" stroke="#8e2333" stroke-width=".6"><circle cx="56" cy="17" r="3.7"/><circle cx="62" cy="20" r="3.2"/><circle cx="56" cy="24" r="3"/></g><g fill="#f6a0a2"><circle cx="55" cy="16" r="1"/><circle cx="61" cy="19" r=".8"/></g>`;
  }
  function lightRhythm(index) {
    const duration = [8.7, 11.6, 9.8, 14.2, 12.7, 10.5, 15.3][index % 7];
    const phase = -((index * 1.97) % duration);
    return `--light-cycle:${duration}s;--light-phase:${phase.toFixed(2)}s`;
  }
  function ornament(kind) {
    instance += 1;
    const id = `season-${instance}`;
    let art;
    let viewBox;
    if (kind === "garland") {
      viewBox = "0 0 1000 100";
      const swags = [
        { from: 0, to: 235, depth: 42 },
        { from: 235, to: 510, depth: 64 },
        { from: 510, to: 780, depth: 46 },
        { from: 780, to: 1000, depth: 58 },
      ];
      const anchors = [0, 235, 510, 780, 1000];
      const foliage = anchors
        .map(
          (x) =>
            `<g transform="translate(${x - 32} -6) scale(.55)">${sprig()}</g>`,
        )
        .join("");
      const wire = swags
        .map(
          (section) =>
            `M${section.from} 4Q${(section.from + section.to) / 2} ${4 + 2 * section.depth} ${section.to} 4`,
        )
        .join("");
      const scatteredFoliage = swags
        .map((section, i) => {
          const t = [0.5, 0.36, 0.64, 0.5][i];
          const x = section.from + (section.to - section.from) * t;
          const y = 4 + 4 * section.depth * t * (1 - t);
          const angle =
            (Math.atan2(
              4 * section.depth * (1 - 2 * t),
              section.to - section.from,
            ) *
              180) /
            Math.PI;
          return `<g class="season-scattered-leaf" transform="translate(${x} ${y}) rotate(${angle})">${pine(-8, 0, 0, 0.38)}</g>`;
        })
        .join("");
      const bulbs = swags
        .map((section, sectionIndex) =>
          Array.from({ length: 6 }, (_, j) => {
            const t = (j + 1) / 7;
            const x = section.from + (section.to - section.from) * t;
            const y = 4 + 4 * section.depth * t * (1 - t);
            const i = sectionIndex * 6 + j;
            return `<g class="season-light ${i % 3 !== 0 ? "season-menu-light" : ""}" style="--light-order:${i * 28}ms;${lightRhythm(i)}"><path d="M${x} ${y}v9" stroke="#5e7158" stroke-width="1.1"/><circle class="season-bulb-glow" cx="${x}" cy="${y + 17}" r="12" fill="url(#${id}-halo)"/><rect x="${x - 2.5}" y="${y + 8}" width="5" height="4" rx="1" fill="#9d8d59"/><ellipse class="season-bulb" cx="${x}" cy="${y + 17}" rx="3.5" ry="6" fill="#efc86d"/><path class="season-bulb-shine" d="M${x - 1} ${y + 14}v4" stroke="#fff4cd" stroke-width="1.3" stroke-linecap="round"/></g>`;
          }).join(""),
        )
        .join("");
      art = `<path d="${wire}" stroke="#32664c" stroke-width="1.8" fill="none"/>${foliage}${scatteredFoliage}${bulbs}`;
    } else if (kind === "mobile-garland") {
      viewBox = "0 0 120 40";
      art = `<path d="M2 2Q60 32 118 2" stroke="#32664c" stroke-width="1.5"/>${[20, 45, 75, 100].map((x, i) => `<g class="season-light ${i % 2 ? "season-menu-light" : ""}" style="--light-order:${i * 80}ms;${lightRhythm(i + 3)}"><path d="M${x} ${x < 30 || x > 90 ? 10 : 16}v7" stroke="#6b7356"/><circle class="season-bulb-glow" cx="${x}" cy="${x < 30 || x > 90 ? 23 : 29}" r="9" fill="url(#${id}-halo)"/><ellipse class="season-bulb" cx="${x}" cy="${x < 30 || x > 90 ? 23 : 29}" rx="3.5" ry="5" fill="#efc86d"/></g>`).join("")}`;
    } else if (kind === "action") {
      return actionDecoration(id);
    } else if (kind === "candy") {
      viewBox = "0 0 40 86";
      art = `<g class="season-candy-pendant"><defs><mask id="${id}-cane" maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="86"><path d="M11 75V27C11 9 33 9 33 27v6" fill="none" stroke="white" stroke-width="8" stroke-linecap="round"/></mask></defs><path d="M11 75V27C11 9 33 9 33 27v6" stroke="#d2dce3" stroke-width="10" stroke-linecap="round"/><path d="M11 75V27C11 9 33 9 33 27v6" stroke="#fffdf5" stroke-width="8" stroke-linecap="round"/><g mask="url(#${id}-cane)">${[4, 17, 30, 43, 56, 69, 82].map((y) => `<path d="M0 ${y}l42-18" stroke="#c53850" stroke-width="6"/>`).join("")}</g><path d="M8.5 29v39" stroke="white" stroke-width="1.2" stroke-linecap="round"/><path d="M12 32C-5 20-4 43 12 34C28 21 30 44 12 34l-4 13 6-3 5 3-3-13" fill="#b82e46" stroke="#8e243b" stroke-width=".6"/><circle cx="13" cy="33" r="3" fill="#df6070"/></g>`;
    } else if (kind === "star") {
      viewBox = "0 0 60 64";
      art = `<path d="M43-2q-7 0-5 7l5 4" stroke="#a88548" stroke-width="1.3" fill="none"/><path d="M39 1q2-2 4 0" stroke="#f8dd99" stroke-width=".7"/><g class="season-card-rig"><path d="M43 9v9" stroke="#a88548" stroke-width=".9"/><g transform="translate(20 17) scale(.65)"><path d="M35 1v16" stroke="#ac8c4a"/><g class="season-card-pendant"><path d="m35 15 5.5 11.5 12.7 1.8-9.2 9 2.2 12.7L35 44l-11.2 6 2.2-12.7-9.2-9 12.7-1.8Z" fill="url(#${id}-gold)" stroke="#bd9549" stroke-width=".8"/><path d="M35 15v19L29.5 26.5Z" fill="#fff0b8"/><path d="M53.2 28.3 35 34l8.8 3.3Z" fill="#ffdc83"/><path d="m46.2 50.7-11.2-16.7V44Z" fill="#ae7e32"/><path d="M23.8 50.7 35 34l-9 3.3Z" fill="#e8bc63"/><path d="m16.8 28.3 18.2 5.7-5.5-7.5Z" fill="#b88b3d"/><path d="m35 18 4.7 10 10.6 1.5-7.8 7.6 1.8 10.7-9.3-5-9.3 5 1.8-10.7-7.8-7.6 10.6-1.5Z" stroke="#ffe6a4" stroke-width=".5" fill="none"/><path d="M35 12C17-3 18 22 35 13C52-3 54 22 35 13" fill="#bb314a" stroke="#94273c" stroke-width=".7"/><ellipse cx="35" cy="13" rx="3" ry="3.6" fill="#db5868"/></g></g></g>`;
    } else if (kind === "corner") {
      viewBox = "0 0 60 64";
      art = `<path d="M44-2q-7 0-5 7l5 4" fill="none" stroke="#a88548" stroke-width="1.3"/><path d="M40 1q2-2 4 0" stroke="#f8dd99" stroke-width=".7"/><g transform="translate(20 -4) scale(.4)">${sprig()}</g><g class="season-card-rig"><path d="M44 9v14M49 10q7 6 7 25" stroke="#ae8a49" stroke-width=".9"/><rect x="41.5" y="21" width="5" height="4" rx=".8" fill="#a4803f"/><circle cx="44" cy="31" r="7" fill="url(#${id}-gold)" stroke="#b48a42" stroke-width=".6"/><path d="M40 27q-3 3-1 6" stroke="#fff3bc" stroke-width="1.2" stroke-linecap="round"/><path d="M39 34q5 4 10-1" stroke="#b88d43" stroke-width=".6"/><rect x="54" y="34" width="4" height="3" rx=".6" fill="#a4803f"/><circle cx="56" cy="41" r="4.5" fill="url(#${id}-red)" stroke="#9f2c40" stroke-width=".6"/><path d="M54 39q-1 1-1 3" stroke="#f7b9af" stroke-width=".8"/></g>`;
    } else {
      viewBox = "0 0 116 38";
      art = sprig();
    }
    const box = document.createElement("span");
    box.className = `season-decoration season-${kind}`;
    box.setAttribute("aria-hidden", "true");
    box.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="${kind === "garland" || kind === "action" ? "none" : "xMidYMid meet"}" fill="none" focusable="false"><defs><radialGradient id="${id}-halo"><stop stop-color="#ffdc83" stop-opacity=".55"/><stop offset="1" stop-color="#ffdc83" stop-opacity="0"/></radialGradient><radialGradient id="${id}-red" cx=".3" cy=".25" r=".8"><stop stop-color="#e15b66"/><stop offset=".65" stop-color="#ba3045"/><stop offset="1" stop-color="#8c2035"/></radialGradient><radialGradient id="${id}-gold" cx=".3" cy=".25" r=".8"><stop stop-color="#ffe7a1"/><stop offset=".6" stop-color="#d7ad55"/><stop offset="1" stop-color="#a67b36"/></radialGradient></defs>${art}</svg>`;
    return box;
  }
  header.append(ornament("garland"));
  header.append(ornament("mobile-garland"));
  document.querySelectorAll(".week-indicator").forEach((card, i) => {
    const decoration = ornament(i === 0 ? "corner" : "star");
    card.append(decoration);
    attachOrnamentReaction(
      card,
      decoration.querySelector(".season-card-rig"),
      i === 0 ? 7 : 9,
    );
  });
  const tableCard = document.querySelector(".page > .card");
  tableCard?.classList.add("season-table-host");
  if (tableCard) {
    const candy = ornament("candy");
    tableCard.append(candy);
    const insertion = document.createElement("span");
    insertion.className = "season-insertion";
    insertion.setAttribute("aria-hidden", "true");
    insertion.innerHTML =
      '<svg viewBox="0 0 18 8" fill="none" focusable="false"><ellipse cx="6" cy="4" rx="5.6" ry="1.8" fill="var(--color-text)" opacity=".22"/><path d="M0 4Q6 7 12 4H18V8H0Z" fill="var(--color-surface)"/><path d="M0 4Q6 7 12 4" stroke="var(--color-border)" stroke-width=".6"/></svg>';
    tableCard.append(insertion);
    attachOrnamentReaction(
      tableCard,
      candy.querySelector(".season-candy-pendant"),
      5,
      -24,
    );
  }
  function decorateActions() {
    document.querySelectorAll(".page-header .btn-primary").forEach((button) => {
      if (button.querySelector(".season-action")) return;
      button.classList.add("season-action-host");
      button.append(ornament("action"));
      button.addEventListener("pointerenter", () => ringBells(button));
      button.addEventListener("focus", () => ringBells(button));
    });
  }
  decorateActions();
  // Los adapters pueden montar los botones después de cargar esta propuesta.
  const actionsObserver = new MutationObserver(decorateActions);
  actionsObserver.observe(document.querySelector(".page"), {
    childList: true,
    subtree: true,
  });
  const root = document.documentElement;
  const mobileMenu = matchMedia("(max-width: 900px)");
  function syncMenuLights() {
    root.dataset.seasonMenu = (
      mobileMenu.matches
        ? root.dataset.sidebarOverlay === "open"
        : root.dataset.sidebarState === "expanded"
    )
      ? "open"
      : "closed";
  }
  const menuObserver = new MutationObserver(syncMenuLights);
  menuObserver.observe(root, {
    attributes: true,
    attributeFilter: ["data-sidebar-state", "data-sidebar-overlay"],
  });
  const sidebar = document.querySelector(".sidebar");
  if (sidebar)
    menuObserver.observe(sidebar, {
      attributes: true,
      attributeFilter: ["class"],
    });
  syncMenuLights();
  mobileMenu.addEventListener("change", syncMenuLights);
  const right = header.querySelector(".header-right");
  const headerObserver = new ResizeObserver((entries) => {
    const width = entries[0].target.getBoundingClientRect().width;
    header.style.setProperty("--season-tools-width", `${width}px`);
  });
  if (right) headerObserver.observe(right);
  const tableHeaderObserver = new ResizeObserver((entries) => {
    tableCard.style.setProperty(
      "--season-card-head-height",
      `${entries[0].target.getBoundingClientRect().height}px`,
    );
  });
  const tableHeader = tableCard?.querySelector(".card-header");
  if (tableHeader) tableHeaderObserver.observe(tableHeader);
  // Control local de revisión, ausente en la propuesta habitual y en producto.
  if (new URLSearchParams(location.search).get("review") === "candy") {
    const target = tableCard?.querySelector(".season-candy-pendant");
    swayOrnament(target, 5, -24);
    const reviewAnimation = target && swingAnimations.get(target);
    const field = document.createElement("input");
    field.type = "number";
    field.min = "0";
    field.max = "102";
    field.value = "0";
    field.setAttribute("aria-label", "Cuadro del bastón");
    field.style.width = "64px";
    field.disabled = !reviewAnimation;
    const label = document.createElement("label");
    label.className = "season-frame-review";
    label.textContent = "Cuadro ";
    label.append(field, " / 102");
    tools.append(label);
    const renderFrame = () => {
      if (!reviewAnimation) return;
      reviewAnimation.pause();
      reviewAnimation.currentTime =
        (Math.min(102, Math.max(0, Number(field.value) || 0)) * 1000) / 60;
    };
    field.addEventListener("input", renderFrame);
    renderFrame();
  }
  window.addEventListener(
    "pagehide",
    () => {
      interactionAnimations.forEach((animation) => animation.cancel());
      actionsObserver.disconnect();
      menuObserver.disconnect();
      headerObserver.disconnect();
      tableHeaderObserver.disconnect();
      motion.removeEventListener("change", syncMotion);
      mobileMenu.removeEventListener("change", syncMenuLights);
    },
    { once: true },
  );
})();
