import React, { useEffect, useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";

const roots = new WeakMap();
const normalized = (value) => String(value || "").trim().toLowerCase();
const iconPaths = {
  referencias: <><path d="M5 4h14v16H5z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
  fincas: <><path d="M4 20V9l8-5 8 5v11"/><path d="M8 20v-7h8v7"/></>,
  transporte: <><path d="M3 7h11v10H3zM14 11h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
  empresas: <><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/></>,
  usuarios: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></>,
  planeacion: <><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M16 3v4M8 3v4M4 11h16"/></>,
  materiales: <><path d="m21 8-9-5-9 5 9 5 9-5ZM3 8v8l9 5 9-5V8M12 13v8"/></>,
  puerto: <><path d="M4 20h16M7 20V9l5-4 5 4v11M9 13h6"/></>,
  seguridad: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></>
};

function destination(module, view, registry) {
  const href = view.href;
  if (!href || href.startsWith("#") || /^https?:\/\//i.test(href)) return href || "#";
  const segments = location.pathname.split(/[\\/]+/).map((part) => decodeURIComponent(part));
  const currentFolder = segments.at(-2) || "";
  const folder = view.folder || module.folder || view.localFolder || module.localFolder;
  return !folder || normalized(folder) === normalized(currentFolder)
    ? href
    : `../${encodeURI(folder)}/${href}`;
}

function Navigation({ config, registry, nav }) {
  const areaId = config.area || "gestion";
  const group = registry[areaId];
  const activeModuleId = config.module || group?.modules?.[0]?.id;
  const activeViewId = config.view || group?.modules?.find((item) => item.id === activeModuleId)?.views?.[0]?.id;
  const [expanded, setExpanded] = useState(() => Object.fromEntries((group?.modules || []).map((module) => {
    const key = `sial-nav-views:${areaId}:${module.id}`;
    const saved = localStorage.getItem(key);
    return [module.id, saved ? saved === "expanded" : module.id === activeModuleId];
  })));

  useLayoutEffect(() => {
    const caption = nav.closest(".sidebar")?.querySelector(".menu-caption");
    if (caption && group) caption.textContent = group.label;
    const measure = () => nav.querySelectorAll(".nav-tree-list").forEach((list) => {
      const rows = [...list.children];
      const frame = list.parentElement;
      const reach = (row) => row ? Math.max(row.offsetTop + (row.querySelector("a")?.offsetHeight || 0) / 2 - 9, 0) : 0;
      frame?.style.setProperty("--trunk-end", `${reach(rows.at(-1))}px`);
      frame?.style.setProperty("--trunk-accent", `${reach(list.querySelector("li[data-path='true']"))}px`);
    });
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    nav.querySelectorAll(".nav-tree-list").forEach((list) => observer?.observe(list));
    return () => observer?.disconnect();
  }, [expanded, group, nav]);

  if (!group) return null;
  return group.modules.map((module) => {
    const activeModule = module.id === activeModuleId;
    const open = expanded[module.id];
    const sublistId = `nav-${areaId}-${module.id}-views`;
    const storageKey = `sial-nav-views:${areaId}:${module.id}`;
    return <div className={`nav-module${activeModule ? " is-active" : ""}`} key={module.id}>
      <div className="nav-module-head">
        <a className={`nav-link nav-module-link${activeModule ? " active" : ""}`}
          href={destination(module, module.views[0], registry)} title={module.label}>
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{iconPaths[module.icon] || <path d="M5 12h14m-7-7 7 7-7 7" />}</svg>
          <span className="nav-text">{module.label}</span>
        </a>
        <button className="nav-module-toggle" type="button" aria-controls={sublistId}
          aria-expanded={Boolean(open)} aria-label={`${open ? "Contraer" : "Expandir"} ${module.label}`}
          title={`${open ? "Contraer" : "Expandir"} ${module.label}`}
          onClick={() => {
            setExpanded((state) => ({ ...state, [module.id]: !state[module.id] }));
            localStorage.setItem(storageKey, open ? "collapsed" : "expanded");
          }}>
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
        </button>
      </div>
      <div className="nav-tree-fold" id={sublistId} data-open={String(Boolean(open))}
        aria-label={`Vistas de ${module.label}`} aria-hidden={!open} inert={!open}>
        <div className="nav-tree-frame">
          <span className="nav-tree-trunk" aria-hidden="true" />
          <span className="nav-tree-trunk-accent" aria-hidden="true" />
          <ul className="nav-tree-list">
            {module.views.map((view, index) => {
              const active = activeModule && view.id === activeViewId;
              return <li className={`nav-tree-item${active ? " is-active" : ""}`} data-path={String(active)}
                style={{ "--tree-delay": `${index * 28 + 60}ms` }} key={view.id}>
                <span className="nav-tree-curve" aria-hidden="true" />
                <span className="nav-tree-curve-accent" aria-hidden="true" />
                <span className="nav-tree-marker" aria-hidden="true" />
                <a className={`nav-tree-link${active ? " active" : ""}`}
                  href={destination(module, view, registry)} aria-current={active ? "page" : undefined}>
                  <span>{view.label}</span>
                </a>
              </li>;
            })}
          </ul>
        </div>
      </div>
    </div>;
  });
}

function Shell({ nav, config, registry, headerLeft, themeRoot, sidebar }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sial-sidebar-state-v2") !== "expanded");
  const [overlay, setOverlay] = useState(false);
  const [small, setSmall] = useState(() => matchMedia("(max-width: 900px)").matches);
  const [theme, setTheme] = useState(() => localStorage.getItem("sial-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.documentElement.dataset.sidebarState = collapsed ? "collapsed" : "expanded";
    localStorage.setItem("sial-sidebar-state-v2", collapsed ? "collapsed" : "expanded");
  }, [collapsed]);
  useEffect(() => {
    document.documentElement.dataset.sidebarOverlay = overlay ? "open" : "closed";
    const backdrop = document.querySelector("[data-sidebar-backdrop]");
    if (backdrop) backdrop.hidden = !overlay;
  }, [overlay]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("sial-theme", theme);
  }, [theme]);
  useEffect(() => {
    const media = matchMedia("(max-width: 900px)");
    const update = () => { setSmall(media.matches); if (!media.matches) setOverlay(false); };
    media.addEventListener("change", update);
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOverlay(false);
        headerLeft?.querySelector("[data-sidebar-toggle]")?.focus();
      }
    };
    const onBackdrop = (event) => { if (event.target.closest("[data-sidebar-backdrop]")) setOverlay(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onBackdrop);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onBackdrop);
    };
  }, [headerLeft]);
  useEffect(() => {
    if (!sidebar) return;
    const onClick = (event) => {
      const link = event.target.closest("a.nav-tree-link, a.nav-module-link");
      if (small && link) setOverlay(false);
      if (!small && collapsed && link) {
        event.preventDefault();
        setCollapsed(false);
      }
    };
    sidebar.addEventListener("click", onClick, true);
    return () => sidebar.removeEventListener("click", onClick, true);
  }, [sidebar, small, collapsed]);

  const toggleLabel = small ? overlay ? "Cerrar menú" : "Abrir menú" : collapsed ? "Expandir menú" : "Contraer menú";
  return <>
    <Navigation nav={nav} config={config} registry={registry} />
    {headerLeft && createPortal(<>
      <button className="icon-btn" type="button" data-sidebar-toggle aria-label={toggleLabel}
        aria-expanded={small ? overlay : !collapsed} title={toggleLabel}
        onClick={() => {
          if (small) {
            setOverlay(!overlay);
            if (!overlay) requestAnimationFrame(() => sidebar?.querySelector("a, button")?.focus());
          } else setCollapsed(!collapsed);
        }}>
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      <label className="search">
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input aria-label="Búsqueda principal" placeholder="Buscar..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
    </>, headerLeft)}
    {themeRoot && createPortal(<button className="icon-btn theme-toggle" type="button" data-theme-toggle
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={theme === "dark"} title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <svg className="icon theme-icon theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
      <svg className="icon theme-icon theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
    </button>, themeRoot)}
  </>;
}

export function mountShell(nav, config, registry) {
  if (roots.has(nav)) return;
  const root = createRoot(nav);
  roots.set(nav, root);
  nav.dataset.sialShellMounted = "true";
  nav.classList.add("sidebar-nav");
  nav.setAttribute("aria-label", `${registry[config.area || "gestion"]?.label || "Gestión"}: módulos y vistas`);
  const shell = nav.closest(".app-shell");
  const headerLeft = shell?.querySelector(".header-left");
  if (headerLeft) headerLeft.replaceChildren();
  const themeButton = shell?.querySelector(".header-right [data-theme-toggle]");
  const themeRoot = themeButton && document.createElement("span");
  if (themeRoot) themeButton.replaceWith(themeRoot);
  let backdrop = document.querySelector("[data-sidebar-backdrop]");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    backdrop.dataset.sidebarBackdrop = "true";
    backdrop.hidden = true;
    document.body.appendChild(backdrop);
  }
  root.render(<Shell nav={nav} config={config} registry={registry} headerLeft={headerLeft}
    themeRoot={themeRoot} sidebar={shell?.querySelector(".sidebar")} />);
}
