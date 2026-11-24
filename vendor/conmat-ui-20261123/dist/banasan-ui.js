"use client";
import { Fragment as e, jsx as t, jsxs as n } from "react/jsx-runtime";
import { Children as r, cloneElement as i, createContext as a, createElement as o, isValidElement as s, useCallback as c, useContext as l, useEffect as u, useId as d, useLayoutEffect as f, useMemo as p, useReducer as m, useRef as h, useState as g } from "react";
import { createPortal as _ } from "react-dom";
import { ArrowRight as v, Bell as y, Brightness as b, Building as x, Calendar as S, CalendarCheck as C, Check as w, City as T, Clock as E, Community as D, Copy as O, DeliveryTruck as k, EditPencil as A, Eye as j, EyeClosed as M, Farm as N, FilterList as P, GitBranch as F, GraphUp as I, HalfMoon as L, InfoCircle as ee, Lock as R, MapPinPlus as te, Menu as z, NavArrowDown as ne, NavArrowLeft as B, NavArrowRight as re, Page as V, PageEdit as ie, PageSearch as ae, Plus as H, Position as oe, SeaWaves as U, Search as se, SettingsProfiles as ce, SunLight as le, ViewColumns3 as ue, ViewGrid as W, WarningTriangle as G, WarningTriangleSolid as K, Xmark as q, XmarkCircle as de } from "iconoir-react";
//#region src/components/Buttons/button.ts
function fe(e) {
	switch (e) {
		case "base": return "bg-transparent border !border-solid !border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:bg-[var(--color-hover-surface)]";
		case "outlined": return "bg-[var(--color-surface)] text-[var(--color-primary-500)] !border-solid !border-[var(--color-primary-500)] hover:border-[var(--color-primary-600)] hover:text-[var(--color-primary-600)] hover:bg-[var(--color-hover-surface)]";
		case "ghost": return "bg-transparent border-transparent shadow-none hover:bg-[var(--color-hover-surface)]";
		case "filled": return "bg-[var(--color-primary-500)] text-[var(--color-on-primary)] active:bg-[var(--color-primary-700)] hover:bg-[var(--color-primary-600)]";
		default: return "bg-[var(--color-primary-500)] text-[var(--color-on-primary)] active:bg-[var(--color-primary-700)] hover:bg-[var(--color-primary-600)]";
	}
}
//#endregion
//#region src/components/Buttons/Button/button.tsx
function J(n) {
	let { children: r, className: i, disabled: a, onClick: o, onSubmit: s, type: c, variant: l, ...u } = n;
	return /* @__PURE__ */ t(e, { children: /* @__PURE__ */ t("button", {
		...u,
		type: c,
		className: `bui-button bui-icon-animate-on-hover min-h-[44px] relative inline-flex items-center justify-center gap-[10px] px-[18px] border border-transparent rounded-[var(--radius-control)] font-medium cursor-pointer transition-[background-color,border-color,color,opacity,transform] duration-[var(--motion-duration-fast)] ease-in-out active:scale-110 motion-reduce:transform-none ${fe(l)} ${i ?? ""}`,
		onClick: (e) => {
			o && o(e);
		},
		onSubmit: (e) => {
			s && s(e);
		},
		disabled: a,
		children: r
	}) });
}
//#endregion
//#region src/components/Buttons/IconButton/icon_button.tsx
function Y(n) {
	let { children: r, className: i, disabled: a, onClick: o, onSubmit: c, type: l, variant: u = "base", ...d } = n;
	if (!s(r)) throw Error("IconButton requiere un elemento válido. No se acepta texto plano");
	if (!(["svg", "img"].includes(r.type) || typeof r.type == "function")) throw Error("Solo se permiten <svg> o <img>");
	return /* @__PURE__ */ t(e, { children: /* @__PURE__ */ t("button", {
		...d,
		type: l,
		className: `bui-icon-button bui-icon-animate-on-hover w-[36px] min-w-[32px] max-w-[36px] h-[36px] min-h-[32px] max-h-[36px] border border-transparent aspect-square flex items-center justify-center rounded-[var(--radius-control)] transition-[background-color,border-color,color,opacity,transform] duration-[var(--motion-duration-fast)] ease-in-out active:scale-110 motion-reduce:transform-none ${fe(u)} ${i ?? ""}`,
		onClick: (e) => {
			o && o(e);
		},
		onSubmit: (e) => {
			c && c(e);
		},
		disabled: a,
		children: /* @__PURE__ */ t("span", {
			className: "bui-icon-button__icon",
			children: r
		})
	}) });
}
//#endregion
//#region src/components/Chips/chip_utils.ts
var pe = {
	default: "bui-chip-default",
	primary: "bui-chip-default bui-chip-primary",
	info: "bui-chip-info",
	success: "bui-chip-active bui-chip-success",
	active: "bui-chip-active",
	warning: "bui-chip-warning",
	error: "bui-chip-inactive bui-chip-error",
	inactive: "bui-chip-inactive"
};
function me(e, t) {
	return e ?? t ?? "default";
}
function he(e = "filled", t, n) {
	let r = me(n, t), i = [pe[r]];
	return e === "outlined" ? i.push("bui-chip-outlined", "bui-chip-filter") : r === "default" || r === "primary" ? i.push("bui-chip-label") : i.push("bui-chip-status"), i.join(" ");
}
//#endregion
//#region src/components/Chips/chip.tsx
function X(e) {
	let { children: n, className: r, color: i, preset: a, tone: o, variant: s, style: c, ...l } = e, u = i ? {
		...c,
		"--bui-chip-bg": i
	} : c;
	return /* @__PURE__ */ t("span", {
		className: `bui-base-chip ${he(s, a, o)} ${r ?? ""}`.trim(),
		style: u,
		...l,
		children: n
	});
}
//#endregion
//#region src/components/Chips/ribbon.tsx
function ge(e, t) {
	return `${e} ${e}-${t.toLocaleLowerCase()}`;
}
function _e({ code: e, children: n, className: r, ...i }) {
	return /* @__PURE__ */ t("span", {
		...i,
		className: `${ge("ribbon-code", e)} ${r ?? ""}`.trim(),
		children: n ?? e
	});
}
function ve({ code: e, children: n, className: r, ...i }) {
	return /* @__PURE__ */ t("span", {
		...i,
		className: `${ge("ribbon-label", e)} ${r ?? ""}`.trim(),
		children: n ?? e
	});
}
//#endregion
//#region src/components/Inputs/input.ts
var ye = "h-[44px] px-[12px] w-full min-w-0 border border-[var(--color-border)] rounded-[var(--radius-control)] bg-[var(--color-field-bg)] text-[var(--color-text)] read-only:bg-[var(--color-field-readonly-bg)] read-only:text-[var(--color-text-2)] disabled:bg-[var(--color-field-readonly-bg)] disabled:text-[var(--color-text-2)] hover:border-[var(--color-text-3)] focus:outline-none focus:border-[var(--color-focus-ring)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-focus-ring)_24%,transparent)] placeholder:text-[var(--color-text-3)]", be = "h-[44px] px-[12px] w-full min-w-0 border border-[var(--color-border)] rounded-[var(--radius-control)] bg-[var(--color-field-bg)] text-[var(--color-text)] disabled:bg-[var(--color-field-readonly-bg)] disabled:text-[var(--color-text-2)] hover:border-[var(--color-text-3)] focus:outline-none focus:border-[var(--color-focus-ring)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-focus-ring)_24%,transparent)] placeholder:text-[var(--color-text-3)]", xe = "!border-[var(--color-error-main)] !bg-[var(--color-field-error-bg)] !border-[var(--color-error-main)] ring-4 !ring-[color-mix(in_srgb,var(--color-error-main)_22%,transparent)]", Se = "bg-transparent border-transparent", Ce = "bg-transparent", we = "w-[18px] aspect-square fill-none stroke-2 stroke-current", Te = "inline-flex items-center gap-[8px] text-[var(--color-text-2)] text-[13px]", Ee = "w-[18px] h-[18px] accent-[var(--color-primary-500)] bg-[transparent] border border-solid border-[var(--color-text-2)] rounded-[2px]";
//#endregion
//#region src/components/Inputs/input_icons.tsx
function De({ className: e }) {
	return /* @__PURE__ */ t("svg", {
		className: `${we} ${e ?? ""}`,
		viewBox: "0 0 24 24",
		children: /* @__PURE__ */ t("polyline", { points: "20 6 9 17 4 12" })
	});
}
function Oe({ className: r }) {
	return /* @__PURE__ */ t(e, { children: /* @__PURE__ */ n("svg", {
		className: `${we} w-[16px] ${r ?? ""}`,
		viewBox: "0 0 24 24",
		children: [/* @__PURE__ */ t("path", { d: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" }), /* @__PURE__ */ t("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		})]
	}) });
}
//#endregion
//#region src/components/common/use_synced_value.ts
function ke(e, t) {
	return typeof t == "function" ? t(e) : t;
}
function Z({ value: e, defaultValue: t, isEqual: n = Object.is }) {
	let [r, i] = m(ke, t);
	return u(() => {
		e === void 0 || n(r, e) || i(e);
	}, [
		r,
		n,
		e
	]), [r, i];
}
//#endregion
//#region src/components/Inputs/TextInput/text_input.tsx
var Ae = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
function je(e) {
	let [r, i] = g(!1), [a, o] = g({ hasError: !1 }), [s, c] = Z({
		value: e.value,
		defaultValue: e.defaultValue ?? e.value ?? ""
	}), l = e.validate?.status ? {
		hasError: !0,
		message: e.validate.message
	} : a, u = () => {
		e.required === !0 && s === "" ? o({
			hasError: !0,
			message: "El campo es requerido"
		}) : e.validationRegex && !e.validationRegex.test(s) ? o({
			hasError: !0,
			message: e.validationMessage ?? "El valor ingresado no es valido"
		}) : e.type === "email" && s !== "" && !Ae.test(s) && o({
			hasError: !0,
			message: "El e-mail no es valido"
		});
	};
	return /* @__PURE__ */ n("div", {
		className: "flex flex-col w-full gap-[8px]",
		children: [
			e.label && /* @__PURE__ */ n("label", {
				htmlFor: e.id,
				className: "text-[13px] font-semibold text-[var(--color-text)] self-start",
				children: [e.label, e.required === !0 && /* @__PURE__ */ t("span", {
					className: "text-[var(--color-error-main)]",
					children: " *"
				})]
			}),
			/* @__PURE__ */ n("div", {
				className: "relative",
				children: [/* @__PURE__ */ t("input", {
					className: `${ye}${l.hasError ? ` ${xe}` : ""} ${e.variant === "outlined" ? Ce : e.variant === "ghost" ? Se : ""} ${e.className ?? ""}`,
					id: e.id,
					name: e.name,
					placeholder: e.placeholder,
					minLength: e.minLength,
					maxLength: e.maxLength,
					value: s,
					readOnly: e.readonly,
					disabled: e.disabled,
					onChange: (t) => {
						t.preventDefault();
						let n = t.target.value;
						c(n), e.onChange?.(n);
					},
					type: e.type === "password" ? r ? "text" : "password" : e.type ?? "text",
					onBlur: (t) => {
						t.preventDefault(), u(), e.onBlur?.();
					},
					onFocus: (t) => {
						t.preventDefault(), o({ hasError: !1 }), e.onFocus?.();
					}
				}), e.type === "password" && /* @__PURE__ */ t("button", {
					type: "button",
					onClick: (e) => {
						e.preventDefault(), i((e) => !e);
					},
					className: "cursor-pointer absolute top-0 bottom-0 right-0 mr-[14px] text-[var(--color-text-2)]",
					children: /* @__PURE__ */ t(Oe, {})
				})]
			}),
			e.helperText && /* @__PURE__ */ t("span", {
				className: "self-start m-0 text-[var(--color-text-3)] text-[12px] leading-[1.45]",
				children: e.helperText
			}),
			l.hasError && /* @__PURE__ */ t("span", {
				className: "self-start mt-[-2px] text-[var(--color-error-main)] text-[12px] leading-[1.45]",
				children: l.message
			})
		]
	});
}
//#endregion
//#region src/components/Inputs/NumberInput/number_input.tsx
function Me(e) {
	let [r, i] = g({ hasError: !1 }), [a, o] = Z({
		value: e.value,
		defaultValue: e.defaultValue ?? e.value
	}), s = e.validate?.status ? {
		hasError: !0,
		message: e.validate.message
	} : r, c = () => {
		e.required === !0 && a == null && i({
			hasError: !0,
			message: "El campo es requerido"
		});
	};
	return /* @__PURE__ */ n("div", {
		className: "flex flex-col w-full gap-[8px]",
		children: [
			e.label && /* @__PURE__ */ n("label", {
				htmlFor: e.id,
				className: "text-[13px] font-semibold text-[var(--color-text)] self-start",
				children: [e.label, e.required === !0 && /* @__PURE__ */ t("span", {
					className: "text-[var(--color-error-main)]",
					children: " *"
				})]
			}),
			/* @__PURE__ */ t("div", {
				className: "relative",
				children: /* @__PURE__ */ t("input", {
					className: `${ye}${s.hasError ? ` ${xe}` : ""} ${e.variant === "outlined" ? Ce : e.variant === "ghost" ? Se : ""} ${e.className ?? ""}`,
					id: e.id,
					name: e.name,
					placeholder: e.placeholder,
					required: e.required,
					min: e.min,
					max: e.max,
					step: e.step,
					value: a ?? "",
					readOnly: e.readonly,
					disabled: e.disabled,
					onChange: (t) => {
						t.preventDefault();
						let n = t.target.value === "" ? void 0 : Number(t.target.value);
						o(n), e.onChange?.(n);
					},
					type: "number",
					onBlur: (t) => {
						t.preventDefault(), c(), e.onBlur?.();
					},
					onFocus: (t) => {
						t.preventDefault(), i({ hasError: !1 }), e.onFocus?.();
					}
				})
			}),
			e.helperText && /* @__PURE__ */ t("span", {
				className: "self-start m-0 text-[var(--color-text-3)] text-[12px] leading-[1.45]",
				children: e.helperText
			}),
			s.hasError && /* @__PURE__ */ t("span", {
				className: "self-start mt-[-2px] text-[var(--color-error-main)] text-[12px] leading-[1.45]",
				children: s.message
			})
		]
	});
}
//#endregion
//#region src/components/Icons/broom_glyph.tsx
function Ne(e) {
	return /* @__PURE__ */ t("svg", {
		...e,
		viewBox: "0 0 576 512",
		fill: "currentColor",
		stroke: "none",
		children: /* @__PURE__ */ t("path", { d: "M566.6 54.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192-34.7-34.7c-4.2-4.2-10-6.6-16-6.6c-12.5 0-22.6 10.1-22.6 22.6l0 29.1L364.3 320l29.1 0c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16l-34.7-34.7 192-192zM341.1 353.4L222.6 234.9c-42.7-3.7-85.2 11.7-115.8 42.3l-8 8C76.5 307.5 64 337.7 64 369.2c0 6.8 7.1 11.2 13.2 8.2l51.1-25.5c5-2.5 9.5 4.1 5.4 7.9L7.3 473.4C2.7 477.6 0 483.6 0 489.9C0 502.1 9.9 512 22.1 512l173.3 0c38.8 0 75.9-15.4 103.4-42.8c30.6-30.6 45.9-73.1 42.3-115.8z" })
	});
}
//#endregion
//#region src/components/Icons/sliders_glyph.tsx
function Pe(e) {
	return /* @__PURE__ */ n("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		...e,
		children: [
			/* @__PURE__ */ t("path", { d: "M3 5h3m4 0h11M3 12h11m4 0h3M3 19h5m4 0h9" }),
			/* @__PURE__ */ t("circle", {
				cx: "8",
				cy: "5",
				r: "2"
			}),
			/* @__PURE__ */ t("circle", {
				cx: "16",
				cy: "12",
				r: "2"
			}),
			/* @__PURE__ */ t("circle", {
				cx: "10",
				cy: "19",
				r: "2"
			})
		]
	});
}
//#endregion
//#region src/components/Icons/icon_registry.ts
var Fe = {
	broom: { icon: Ne },
	"arrow-right": { icon: v },
	calendar: { icon: S },
	"calendar-variant": { icon: C },
	"chart-line": { icon: I },
	check: { icon: w },
	"chevron-down": { icon: ne },
	"chevron-left": { icon: B },
	"chevron-right": { icon: re },
	clock: { icon: E },
	close: { icon: q },
	"close-2": { icon: q },
	columns: { icon: ue },
	company: { icon: x },
	"company-2": { icon: T },
	"cover-chevron-left": { icon: B },
	"cover-chevron-right": { icon: re },
	crosshair: { icon: oe },
	"crosshair-plus": { icon: te },
	"document-file": { icon: V },
	"document-list": { icon: ae },
	"document-list-2": { icon: ie },
	edit: { icon: A },
	equals: { icon: ce },
	farm: { icon: N },
	"flow-branches": { icon: F },
	"icon-021": { icon: b },
	"icon-022": { icon: z },
	"icon-024": { icon: de },
	"icon-025": { icon: j },
	"icon-026": { icon: b },
	"icon-032": { icon: z },
	"icon-033": { icon: O },
	"icon-035": { icon: ne },
	"icon-036": { icon: G },
	"icon-037": { icon: R },
	"icon-038": { icon: v },
	"icon-042": { icon: I },
	"icon-043": { icon: G },
	"icon-046": { icon: v },
	"icon-054": { icon: F },
	"indicator-balance": { icon: ce },
	"indicator-line": { icon: I },
	"info-circle": { icon: ee },
	layout: { icon: W },
	lock: { icon: R },
	menu: { icon: z },
	"menu-2": { icon: z },
	"menu-3": { icon: z },
	"menu-short": { icon: P },
	moon: { icon: L },
	"moon-2": { icon: L },
	notification: { icon: y },
	plus: { icon: H },
	port: { icon: U },
	search: { icon: se },
	sliders: { icon: Pe },
	"sliders-vertical": { icon: ce },
	"status-error-circle": { icon: de },
	sun: { icon: le },
	"sun-compact": { icon: le },
	truck: { icon: k },
	users: { icon: D },
	"users-2": { icon: D },
	view: { icon: j },
	"view-2": { icon: M },
	"warning-triangle": { icon: G },
	"warning-triangle-solid": { icon: K }
}, Ie = Object.keys(Fe), Le = {
	broom: "adjust",
	"arrow-right": "point-right",
	calendar: "schedule",
	"calendar-variant": "schedule",
	"chart-line": "chart-rise",
	check: "confirm",
	"chevron-down": "point-down",
	"chevron-left": "point-left",
	"chevron-right": "point-right",
	clock: "clock",
	close: "dismiss",
	"close-2": "dismiss",
	columns: "layout",
	company: "place",
	"company-2": "place",
	"cover-chevron-left": "point-left",
	"cover-chevron-right": "point-right",
	crosshair: "target",
	"crosshair-plus": "add",
	"document-file": "document",
	"document-list": "document",
	"document-list-2": "document",
	edit: "write",
	equals: "adjust",
	farm: "place",
	"flow-branches": "route",
	"icon-021": "target",
	"icon-022": "menu",
	"icon-024": "dismiss",
	"icon-025": "reveal",
	"icon-026": "target",
	"icon-032": "menu",
	"icon-033": "document",
	"icon-035": "point-down",
	"icon-036": "alert",
	"icon-037": "lock",
	"icon-038": "point-right",
	"icon-042": "chart-rise",
	"icon-043": "alert",
	"icon-046": "point-right",
	"icon-054": "route",
	"indicator-balance": "adjust",
	"indicator-line": "chart-rise",
	"info-circle": "info",
	layout: "layout",
	lock: "lock",
	menu: "menu",
	"menu-2": "menu",
	"menu-3": "menu",
	"menu-short": "menu",
	moon: "moon",
	"moon-2": "moon",
	notification: "ring",
	plus: "add",
	port: "place",
	search: "search",
	sliders: "adjust",
	"sliders-vertical": "adjust",
	"status-error-circle": "dismiss",
	sun: "sun",
	"sun-compact": "sun",
	truck: "drive",
	users: "group",
	"users-2": "group",
	view: "reveal",
	"view-2": "reveal",
	"warning-triangle": "alert",
	"warning-triangle-solid": "alert"
};
function Re({ name: e, size: n = 20, title: r, className: i, color: a, style: o, animation: s = "default", animate: c = !1, animateOnHover: l = !1, animateOnTap: d = !1, animateOnView: f = !1, animateOnViewMargin: p = "0px", animateOnViewOnce: m = !0, loop: _ = !1, delay: v = 0, ...y }) {
	let b = h(null), [x, S] = g(!1), C = Fe[e]?.icon ?? Fe.layout.icon, w = [
		"bui-sial-icon",
		`bui-sial-icon--${s === "default" ? Le[e] ?? "layout" : s}`,
		(c || f && (x || typeof IntersectionObserver > "u")) && "bui-sial-icon--animate",
		l && "bui-sial-icon--animate-hover",
		d && "bui-sial-icon--animate-tap",
		_ && "bui-sial-icon--loop",
		i
	].filter(Boolean).join(" "), T = !r && !y["aria-label"] && !y["aria-labelledby"], E = {
		...a ? { color: a } : {},
		"--bui-icon-delay": `${Math.max(0, v)}ms`,
		...o
	};
	return u(() => {
		if (!f) return;
		let e = b.current;
		if (!e || typeof IntersectionObserver > "u") return;
		let t = new IntersectionObserver(([e]) => {
			S(e.isIntersecting), e.isIntersecting && m && t.disconnect();
		}, { rootMargin: p });
		return t.observe(e), () => t.disconnect();
	}, [
		f,
		p,
		m
	]), /* @__PURE__ */ t(C, {
		...y,
		ref: b,
		className: w,
		width: n,
		height: n,
		strokeWidth: y.strokeWidth ?? 1.8,
		role: r ? "img" : y.role,
		"aria-hidden": T ? !0 : y["aria-hidden"],
		"aria-label": r ?? y["aria-label"],
		"aria-labelledby": r ? void 0 : y["aria-labelledby"],
		style: E
	});
}
//#endregion
//#region src/components/Icons/create_sial_icon.ts
function Q(e) {
	let t = (t) => o(Re, {
		...t,
		name: e
	});
	return t.displayName = `SialIcon(${e})`, t;
}
//#endregion
//#region src/components/Icons/sial_christmas_hat.tsx
function ze({ id: r }) {
	return /* @__PURE__ */ t(e, { children: /* @__PURE__ */ n("defs", { children: [/* @__PURE__ */ n("linearGradient", {
		id: `${r}-cloth`,
		x1: "0",
		y1: "0",
		x2: "1",
		y2: "1",
		children: [
			/* @__PURE__ */ t("stop", { stopColor: "#F76265" }),
			/* @__PURE__ */ t("stop", {
				offset: ".4",
				stopColor: "#DA3044"
			}),
			/* @__PURE__ */ t("stop", {
				offset: "1",
				stopColor: "#A71F38"
			})
		]
	}), /* @__PURE__ */ n("linearGradient", {
		id: `${r}-fur`,
		x1: "0",
		y1: "0",
		x2: "0",
		y2: "1",
		children: [
			/* @__PURE__ */ t("stop", { stopColor: "#FFFFFF" }),
			/* @__PURE__ */ t("stop", {
				offset: ".65",
				stopColor: "#EFF7FA"
			}),
			/* @__PURE__ */ t("stop", {
				offset: "1",
				stopColor: "#C9DFEA"
			})
		]
	})] }) });
}
function Be({ id: r }) {
	return /* @__PURE__ */ n(e, { children: [/* @__PURE__ */ t("g", {
		id: `${r}-hat-back`,
		transform: "translate(300 -220) scale(1.85) rotate(-8 150 270)",
		children: /* @__PURE__ */ t("g", {
			className: "bui-sial-christmas-crown",
			children: /* @__PURE__ */ n("g", {
				transform: "translate(0 94.5) scale(1 .65)",
				children: [
					/* @__PURE__ */ t("path", {
						fill: "#A71F38",
						d: "M220 175 Q285 191 322 290 L232 290Z"
					}),
					/* @__PURE__ */ t("path", {
						className: "body",
						fill: `url(#${r}-cloth)`,
						d: "M-15 278 C-22 207 40 110 119 63 C163 28 213 35 249 62 C301 100 330 168 346 232 C359 283 361 327 352 369 L319 373 C327 317 304 251 266 213 C252 200 240 192 228 185 C247 218 267 248 281 279 Q151 299 18 278Z"
					}),
					/* @__PURE__ */ t("path", {
						fill: "#FF8585",
						opacity: ".32",
						d: "M31 264 C50 176 83 101 132 69 Q174 44 208 59 C139 69 100 144 77 222 L69 278Z"
					}),
					/* @__PURE__ */ t("path", {
						fill: "#971D31",
						opacity: ".65",
						d: "M215 110 C212 150 223 179 247 214 L281 279 L242 283 C233 236 209 205 204 171 Q201 137 215 110Z"
					}),
					/* @__PURE__ */ t("path", {
						fill: "#AA2032",
						opacity: ".5",
						d: "M263 88 C316 155 346 277 335 370 L352 369 C365 306 351 233 330 183 C311 139 289 107 263 88Z"
					}),
					/* @__PURE__ */ t("path", {
						d: "M97 239 Q102 205 119 180 M141 268 Q145 240 157 224",
						fill: "none",
						stroke: "#FF9391",
						strokeWidth: "4",
						strokeLinecap: "round",
						opacity: ".4"
					}),
					/* @__PURE__ */ t("path", {
						d: "M271 225 Q304 268 310 311",
						fill: "none",
						stroke: "#9F2034",
						strokeWidth: "5",
						opacity: ".45",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ n("g", {
						className: "pom",
						transform: "translate(0 -205.15) scale(1 1.53846)",
						children: [
							/* @__PURE__ */ t("path", {
								fill: `url(#${r}-fur)`,
								stroke: "#D3E0E4",
								strokeWidth: "2",
								d: "M322 351 Q333 341 345 349 Q361 346 368 361 Q382 369 375 384 Q376 401 361 406 Q346 419 331 409 Q314 411 309 396 Q296 385 304 370 Q305 355 322 351Z"
							}),
							/* @__PURE__ */ t("path", {
								fill: "#B9CED7",
								opacity: ".55",
								d: "M309 389 Q340 414 370 383 Q370 407 348 410 Q321 416 309 389Z"
							}),
							/* @__PURE__ */ t("path", {
								d: "M317 370 Q326 357 339 358",
								fill: "none",
								stroke: "white",
								strokeWidth: "7",
								strokeLinecap: "round"
							}),
							/* @__PURE__ */ t("path", {
								d: "m321 386 4 4m21-19 4 3m10 19-5 4",
								stroke: "#FFF",
								strokeWidth: "3",
								strokeLinecap: "round"
							})
						]
					})
				]
			})
		})
	}), /* @__PURE__ */ t("path", {
		fill: "#ADC4D0",
		d: "M300 270 Q266 233 304 214 L339 233 L325 281Z M863 201 Q909 178 902 226 L875 257Z"
	})] });
}
function Ve({ id: r }) {
	return /* @__PURE__ */ t(e, { children: /* @__PURE__ */ n("g", {
		id: `${r}-hat-front`,
		children: [
			/* @__PURE__ */ t("path", {
				fill: "#123B58",
				opacity: ".18",
				clipPath: `url(#${r}-head-clip)`,
				d: "M300 250 Q560 340 887 225 L887 251 Q559 367 300 280Z"
			}),
			/* @__PURE__ */ t("path", {
				fill: `url(#${r}-fur)`,
				stroke: "#C2D6E0",
				strokeWidth: "2",
				d: "M300 222 C367 252 435 276 538 267 C668 257 755 204 870 191 Q893 188 892 213 L888 242 C786 250 679 306 544 317 C442 325 360 297 305 274 Q289 269 288 250 Q286 232 300 222Z"
			}),
			/* @__PURE__ */ t("path", {
				fill: "none",
				stroke: "#FFF",
				strokeWidth: "9",
				strokeLinecap: "round",
				d: "M308 234 C390 268 452 288 540 278 C671 268 760 215 874 204"
			}),
			/* @__PURE__ */ t("path", {
				fill: "none",
				stroke: "#B8CFDB",
				strokeWidth: "4",
				strokeLinecap: "round",
				d: "M307 263 Q419 319 544 305 C681 294 784 242 875 233"
			})
		]
	}) });
}
//#endregion
//#region src/components/Icons/sial_new_year_hat.tsx
function He({ id: e }) {
	return /* @__PURE__ */ n("defs", { children: [
		/* @__PURE__ */ n("linearGradient", {
			id: `${e}-party-blue`,
			x1: "0",
			y1: "0",
			x2: "1",
			y2: ".7",
			children: [
				/* @__PURE__ */ t("stop", { stopColor: "#245C86" }),
				/* @__PURE__ */ t("stop", {
					offset: ".5",
					stopColor: "#123A62"
				}),
				/* @__PURE__ */ t("stop", {
					offset: "1",
					stopColor: "#08233F"
				})
			]
		}),
		/* @__PURE__ */ n("linearGradient", {
			id: `${e}-party-gold`,
			x1: "0",
			y1: "0",
			x2: "0",
			y2: "1",
			children: [
				/* @__PURE__ */ t("stop", { stopColor: "#FFF0AC" }),
				/* @__PURE__ */ t("stop", {
					offset: ".48",
					stopColor: "#EDC45C"
				}),
				/* @__PURE__ */ t("stop", {
					offset: "1",
					stopColor: "#AF7E27"
				})
			]
		}),
		/* @__PURE__ */ t("clipPath", {
			id: `${e}-party-cone`,
			children: /* @__PURE__ */ t("path", { d: "M294 248 L600 -120 Q608 -130 616 -117 L887 225 Q605 338 294 248Z" })
		})
	] });
}
function Ue({ id: r }) {
	return /* @__PURE__ */ n(e, { children: [/* @__PURE__ */ n("g", {
		className: "bui-sial-new-year-crown",
		children: [
			/* @__PURE__ */ t("path", {
				fill: `url(#${r}-party-blue)`,
				stroke: "#D4AC50",
				strokeWidth: "4",
				d: "M294 248 L600 -120 Q608 -130 616 -117 L887 225 Q605 338 294 248Z"
			}),
			/* @__PURE__ */ n("g", {
				clipPath: `url(#${r}-party-cone)`,
				children: [
					/* @__PURE__ */ t("path", {
						d: "M315 169 Q551 211 798 101 M399 54 Q560 96 725 9 M489 -52 Q574 -17 659 -67",
						fill: "none",
						stroke: `url(#${r}-party-gold)`,
						strokeWidth: "26"
					}),
					/* @__PURE__ */ t("path", {
						d: "M320 249 L603 -119 L447 274Z",
						fill: "#76B6E0",
						opacity: ".12"
					}),
					/* @__PURE__ */ t("path", {
						d: "M682 161 l8 18 20 3 -15 14 3 20 -17 -10 -18 9 4 -20 -14 -14 20 -2Z M481 157 l5 12 14 2 -10 9 2 14 -12 -7 -12 6 3 -13 -10 -10 14 -1Z",
						fill: "#F8DB82"
					}),
					/* @__PURE__ */ t("circle", {
						cx: "571",
						cy: "24",
						r: "6",
						fill: "#FFF0AC"
					}),
					/* @__PURE__ */ t("circle", {
						cx: "735",
						cy: "235",
						r: "6",
						fill: "#FFF0AC"
					})
				]
			}),
			/* @__PURE__ */ t("path", {
				className: "bui-sial-new-year-star",
				fill: `url(#${r}-party-gold)`,
				stroke: "#FFF0AC",
				strokeWidth: "2",
				d: "M607 -159 l12 25 28 4 -20 20 5 28 -25 -14 -25 14 5 -28 -20 -20 28 -4Z"
			})
		]
	}), /* @__PURE__ */ t("path", {
		fill: "#936C2D",
		d: "M300 270 Q266 233 304 214 L339 233 L325 281Z M863 201 Q909 178 902 226 L875 257Z"
	})] });
}
function We({ id: e }) {
	return /* @__PURE__ */ n("g", { children: [
		/* @__PURE__ */ t("path", {
			fill: "#123B58",
			opacity: ".18",
			clipPath: `url(#${e}-head-clip)`,
			d: "M300 250 Q560 340 887 225 L887 251 Q559 367 300 280Z"
		}),
		/* @__PURE__ */ t("path", {
			fill: `url(#${e}-party-gold)`,
			stroke: "#B98B36",
			strokeWidth: "2",
			d: "M300 222 C367 252 435 276 538 267 C668 257 755 204 870 191 Q893 188 892 213 L888 242 C786 250 679 306 544 317 C442 325 360 297 305 274 Q289 269 288 250 Q286 232 300 222Z"
		}),
		/* @__PURE__ */ t("path", {
			fill: "none",
			stroke: "#FFF0AC",
			strokeWidth: "7",
			strokeLinecap: "round",
			d: "M308 234 C390 268 452 288 540 278 C671 268 760 215 874 204"
		}),
		/* @__PURE__ */ t("path", {
			fill: "none",
			stroke: "#A87A2C",
			strokeWidth: "3",
			strokeLinecap: "round",
			d: "M307 263 Q419 319 544 305 C681 294 784 242 875 233"
		})
	] });
}
//#endregion
//#region src/components/Icons/sial_isotype.tsx
function Ge({ size: e = 24, variant: r = "default", motion: i = "none", title: a, className: o, ...s }) {
	let c = r === "christmas", l = r === "new-year", u = c || l, f = d().replace(/:/g, ""), p = `${f}-sial-title`, m = `${f}-sial-blue`, h = `${f}-sial-clip`, g = !a && !s["aria-label"] && !s["aria-labelledby"];
	return /* @__PURE__ */ n("svg", {
		...s,
		className: o,
		viewBox: "120 120 800 800",
		"data-sial-variant": r,
		"data-sial-motion": i,
		width: e,
		height: e,
		role: a ? "img" : s.role,
		"aria-hidden": g ? !0 : s["aria-hidden"],
		"aria-labelledby": a ? p : s["aria-labelledby"],
		children: [
			a && /* @__PURE__ */ t("title", {
				id: p,
				children: a
			}),
			/* @__PURE__ */ n("defs", { children: [/* @__PURE__ */ n("linearGradient", {
				id: m,
				x1: "138",
				x2: "820",
				y1: "138",
				y2: "820",
				gradientUnits: "userSpaceOnUse",
				children: [/* @__PURE__ */ t("stop", { stopColor: "#005CA8" }), /* @__PURE__ */ t("stop", {
					offset: "1",
					stopColor: "#004B91"
				})]
			}), /* @__PURE__ */ t("clipPath", {
				id: h,
				children: /* @__PURE__ */ t("path", { d: "M162 884V524c0-205 166-371 371-371h318c10 0 18 8 18 18v318c0 205-166 371-371 371H186c-13 0-24 11-24 24z" })
			})] }),
			u && /* @__PURE__ */ t("defs", { children: /* @__PURE__ */ t("clipPath", {
				id: `${f}-head-clip`,
				children: /* @__PURE__ */ t("path", { d: "M0 240 L300 240 C390 280 456 304 541 290 C680 280 772 226 890 216 L1200 216 L1200 1200 H0Z" })
			}) }),
			c && /* @__PURE__ */ t(ze, { id: f }),
			l && /* @__PURE__ */ t(He, { id: f }),
			c && /* @__PURE__ */ t(Be, { id: f }),
			l && /* @__PURE__ */ t(Ue, { id: f }),
			/* @__PURE__ */ t("g", {
				clipPath: u ? `url(#${f}-head-clip)` : void 0,
				children: /* @__PURE__ */ n("g", {
					transform: "matrix(1.0047868,0,0,1.0054432,-4.5532335,-4.6105913)",
					clipPath: `url(#${h})`,
					children: [
						/* @__PURE__ */ t("g", {
							"data-sial-part": "base",
							children: /* @__PURE__ */ t("path", {
								fill: `url(#${m})`,
								d: "M162 884V524c0-205 166-371 371-371h318c10 0 18 8 18 18v318c0 205-166.00526 369.53091-371 371l-300.16867 2.15115C184.83166 862.24431 162 871 162 884Z"
							})
						}),
						/* @__PURE__ */ n("g", {
							"data-sial-part": "curve",
							children: [/* @__PURE__ */ t("path", {
								fill: "#FECC00",
								d: "M486 866c20-76 58-127 118-160 52-28 100-21 144-66 45-46 78-102 112-130l9 359z"
							}), /* @__PURE__ */ t("path", {
								fill: "none",
								stroke: "#FFFFFF",
								strokeWidth: "28",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M486 866c20-76 58-127 118-160 52-28 100-21 144-66 38.3738-39.22655 86.82535-101.21056 121.34584-135.9772 5.96083-6.00334 14.19522-26.2532 19.20169-30.37617"
							})]
						}),
						/* @__PURE__ */ n("g", {
							"data-sial-part": "circuit",
							children: [
								/* @__PURE__ */ t("path", {
									fill: "none",
									stroke: "#FFFFFF",
									strokeWidth: "48",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									d: "M236.2147 874.49295c-1.7872-198.09923 41.98343-409.2361 108.57033-469.76284 58.03464-52.75283 173.38951-69.80776 251.74794-98.7305"
								}),
								/* @__PURE__ */ t("path", {
									fill: "none",
									stroke: "#FFFFFF",
									strokeWidth: "46",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									d: "M353.55754 851.73274c-7.59431-99.70678-17.56539-303.09726 70.23418-326.48582 6.92159-1.84381 72.42887 4.19778 56.53364-54.68669-7.42581-27.50917 21.26119-69.30566 93.28945-25.1792"
								}),
								/* @__PURE__ */ t("path", {
									fill: "none",
									stroke: "#FFFFFF",
									strokeWidth: "46",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									d: "M393.02302 854.95947C347.8748 626.09941 407.06401 683.2609 540.63964 590.43593M202.25116 858.80959C225.13026 633.62681 246.66352 476.54342 351.09623 398.0727"
								}),
								/* @__PURE__ */ t("circle", {
									cx: "653.09302",
									cy: "294.87479",
									r: "62",
									fill: "#FFFFFF"
								}),
								/* @__PURE__ */ t("circle", {
									cx: "651.57184",
									cy: "294.87479",
									r: "30",
									fill: "#005CA8"
								}),
								/* @__PURE__ */ t("circle", {
									cx: "606.69666",
									cy: "459.33185",
									r: "57",
									fill: "#FFFFFF"
								}),
								/* @__PURE__ */ t("circle", {
									cx: "605.51227",
									cy: "460.69028",
									r: "27",
									fill: "#005CA8"
								}),
								/* @__PURE__ */ t("circle", {
									cx: "566.45343",
									cy: "587.20923",
									r: "57",
									fill: "#FFFFFF"
								}),
								/* @__PURE__ */ t("circle", {
									cx: "568.60461",
									cy: "588.28479",
									r: "27",
									fill: "#005CA8"
								})
							]
						})
					]
				})
			}),
			c && /* @__PURE__ */ t(Ve, { id: f }),
			l && /* @__PURE__ */ t(We, { id: f })
		]
	});
}
//#endregion
//#region src/components/Icons/named-icons.ts
var Ke = Q("broom"), qe = Q("arrow-right"), Je = Q("calendar"), Ye = Q("calendar-variant"), Xe = Q("chart-line"), Ze = Q("check"), Qe = Q("chevron-down"), $e = Q("chevron-left"), et = Q("chevron-right"), tt = Q("clock"), nt = Q("close"), rt = Q("close-2"), it = Q("columns"), at = Q("company"), ot = Q("company-2"), st = Q("cover-chevron-left"), ct = Q("cover-chevron-right"), lt = Q("crosshair"), ut = Q("crosshair-plus"), dt = Q("document-file"), ft = Q("document-list"), pt = Q("document-list-2"), mt = Q("edit"), ht = Q("equals"), gt = Q("farm"), _t = Q("flow-branches"), vt = Q("icon-021"), yt = Q("icon-022"), bt = Q("icon-024"), xt = Q("icon-025"), St = Q("icon-026"), Ct = Q("icon-032"), wt = Q("icon-033"), Tt = Q("icon-035"), Et = Q("icon-036"), Dt = Q("icon-037"), Ot = Q("icon-038"), kt = Q("icon-042"), At = Q("icon-043"), jt = Q("icon-046"), Mt = Q("icon-054"), Nt = Q("indicator-balance"), Pt = Q("indicator-line"), Ft = Q("info-circle"), It = Q("layout"), Lt = Q("lock"), Rt = Q("menu"), zt = Q("menu-2"), Bt = Q("menu-3"), Vt = Q("menu-short"), Ht = Q("moon"), Ut = Q("moon-2"), Wt = Q("notification"), Gt = Q("plus"), Kt = Q("port"), qt = Q("search"), Jt = Q("sliders"), Yt = Q("sliders-vertical"), Xt = Q("status-error-circle"), Zt = Q("sun"), Qt = Q("sun-compact"), $t = Q("truck"), en = Q("users"), tn = Q("users-2"), nn = Q("view"), rn = Q("view-2"), an = Q("warning-triangle"), on = Q("warning-triangle-solid"), sn = Q("arrow-right"), cn = Q("close"), ln = Q("calendar-variant"), un = 6, dn = 8, fn = 240;
function pn(e, t, n) {
	return e && t > n;
}
function mn(e, { preferredHeight: t, reservedHeight: n, maxListHeight: r = 264, minWidth: i = fn }) {
	let a = e.getBoundingClientRect(), o = window.innerHeight - a.bottom - un - dn, s = a.top - un - dn, c = o < t && s > o, l = c ? s : o, u = window.innerWidth - dn * 2, d = Math.min(Math.max(a.width, i), u);
	return {
		left: Math.min(Math.max(a.left, dn), window.innerWidth - d - dn),
		width: d,
		maxListHeight: Math.max(80, Math.min(r, l - n)),
		...c ? { bottom: window.innerHeight - a.top + un } : { top: a.bottom + un }
	};
}
//#endregion
//#region src/components/Inputs/SelectInput/select_input.tsx
function hn(e, t, n) {
	if (!e.length) return -1;
	for (let r = 1; r <= e.length; r += 1) {
		let i = (t + n * r + e.length) % e.length;
		if (!e[i]?.disabled) return i;
	}
	return -1;
}
function gn(e) {
	let r = d(), i = e.id ?? r, a = `${i}-label`, o = `${i}-listbox`, s = `${i}-helper`, l = `${i}-error`, f = h(null), m = h(null), v = h(null), [y, b] = g(!1), [x, S] = g(-1), [C, w] = g(null), [T, E] = g({ hasError: !1 }), D = e.onBlur, [O, k] = Z({
		value: e.value,
		defaultValue: e.defaultValue ?? e.value ?? ""
	}), A = e.validate?.status ?? T.hasError, j = e.validate?.message ?? T.message, M = p(() => e.options.findIndex((e) => Object.is(e.value, O)), [e.options, O]), N = M >= 0 ? e.options[M] : void 0, P = [e.helperText ? s : void 0, j ? l : void 0].filter(Boolean).join(" "), F = c(() => {
		f.current && w(mn(f.current, {
			preferredHeight: 300,
			reservedHeight: 20
		}));
	}, []), I = c(() => e.required && (O === "" || O == null) ? (E({
		hasError: !0,
		message: "El campo es requerido"
	}), !1) : (E({ hasError: !1 }), !0), [e.required, O]), L = c((e = !0) => {
		b(!1), w(null), S(-1), e && I(), D?.();
	}, [D, I]), ee = c((t = 1) => {
		if (e.disabled) return;
		F();
		let n = t === 1 ? -1 : 0;
		S(M >= 0 && !e.options[M]?.disabled ? M : hn(e.options, n, t)), E({ hasError: !1 }), b(!0), e.onFocus?.();
	}, [
		F,
		e,
		M
	]), R = c((t) => {
		t.disabled || (k(t.value), e.onChange?.(t.value), b(!1), w(null), S(-1), E({ hasError: !1 }), e.onBlur?.(), requestAnimationFrame(() => f.current?.focus()));
	}, [e, k]);
	u(() => {
		if (!y) return;
		let e = () => F();
		return window.addEventListener("resize", e), window.addEventListener("scroll", e, !0), () => {
			window.removeEventListener("resize", e), window.removeEventListener("scroll", e, !0);
		};
	}, [y, F]), u(() => {
		if (!y) return;
		let e = (e) => {
			let t = e.target;
			m.current?.contains(t) || v.current?.contains(t) || L();
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [L, y]);
	let te = (t) => {
		if (!e.disabled) {
			if (!y) {
				[
					"ArrowDown",
					"ArrowUp",
					"Enter",
					" "
				].includes(t.key) && (t.preventDefault(), ee(t.key === "ArrowUp" ? -1 : 1));
				return;
			}
			if (t.key === "Escape") {
				t.preventDefault(), L(!1), f.current?.focus();
				return;
			}
			if (t.key === "Tab") {
				L();
				return;
			}
			if (t.key === "ArrowDown" || t.key === "ArrowUp") {
				t.preventDefault(), S((n) => hn(e.options, n, t.key === "ArrowDown" ? 1 : -1));
				return;
			}
			if (t.key === "Home" || t.key === "End") {
				t.preventDefault();
				let n = t.key === "Home" ? -1 : 0;
				S(hn(e.options, n, t.key === "Home" ? 1 : -1));
				return;
			}
			if (t.key === "Enter" || t.key === " ") {
				t.preventDefault();
				let n = e.options[x] ?? N;
				n && R(n);
			}
		}
	}, z = y && C ? _(/* @__PURE__ */ t("div", {
		ref: v,
		className: "fixed z-[1000] overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[6px] shadow-[var(--shadow-overlay)]",
		style: {
			left: C.left,
			width: C.width,
			...C.top === void 0 ? { bottom: C.bottom } : { top: C.top }
		},
		children: /* @__PURE__ */ t("div", {
			id: o,
			role: "listbox",
			"aria-activedescendant": x >= 0 ? `${i}-option-${x}` : void 0,
			className: "grid gap-[3px] overflow-y-auto [overscroll-behavior:contain] [scrollbar-gutter:stable]",
			style: { maxHeight: C.maxListHeight },
			children: e.options.map((e, r) => {
				let a = Object.is(e.value, O), o = x === r;
				return /* @__PURE__ */ n("button", {
					id: `${i}-option-${r}`,
					type: "button",
					role: "option",
					"aria-selected": a,
					disabled: e.disabled,
					onMouseEnter: () => S(r),
					onClick: () => R(e),
					className: `grid min-h-[38px] grid-cols-[minmax(0,1fr)_18px] items-center gap-[8px] rounded-[calc(var(--radius-control)-2px)] px-[10px] py-[8px] text-left text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${a ? "bg-[var(--color-primary-500)] text-[var(--color-on-primary)]" : `text-[var(--color-text)] hover:bg-[var(--color-hover-surface)] ${o ? "bg-[var(--color-hover-surface)] ring-2 ring-inset ring-[var(--color-focus-ring)]" : ""}`}`,
					children: [/* @__PURE__ */ n("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ t("span", {
							className: "block truncate font-semibold leading-[1.35]",
							children: e.label
						}), e.description && /* @__PURE__ */ t("span", {
							className: `mt-[2px] block truncate text-[12px] leading-[1.35] ${a ? "text-[color:var(--color-on-primary)]/85" : "text-[var(--color-text-secondary)]"}`,
							children: e.description
						})]
					}), a && /* @__PURE__ */ t(Ze, {
						size: 16,
						"aria-hidden": "true"
					})]
				}, `${String(e.value)}-${r}`);
			})
		})
	}), document.body) : null;
	return /* @__PURE__ */ n("div", {
		className: `relative flex w-full flex-col gap-[8px] ${e.containerClassName ?? ""}`,
		ref: m,
		children: [
			e.label && /* @__PURE__ */ n("span", {
				id: a,
				className: "text-[13px] font-semibold text-[var(--color-text)] self-start",
				children: [e.label, e.required && /* @__PURE__ */ t("span", {
					className: "ml-[2px] text-[var(--color-danger-500)]",
					children: "*"
				})]
			}),
			e.name && /* @__PURE__ */ t("input", {
				type: "hidden",
				name: e.name,
				value: O === "" ? "" : String(O)
			}),
			/* @__PURE__ */ n("button", {
				ref: f,
				id: i,
				type: "button",
				disabled: e.disabled,
				"aria-haspopup": "listbox",
				"aria-expanded": y,
				"aria-controls": y ? o : void 0,
				"aria-activedescendant": y && x >= 0 ? `${i}-option-${x}` : void 0,
				"aria-labelledby": e.label ? a : void 0,
				"aria-label": e.label ? void 0 : N?.label ?? e.placeholder ?? "Seleccionar opción",
				"aria-describedby": P || void 0,
				"aria-invalid": A || void 0,
				onClick: () => y ? L(!1) : ee(),
				onKeyDown: te,
				className: `${be} ${A ? xe : ""} ${e.variant === "outlined" ? Ce : ""} ${e.variant === "ghost" ? Se : ""} inline-flex !flex-none items-center justify-between gap-[10px] text-left ${e.className ?? ""}`,
				children: [/* @__PURE__ */ t("span", {
					className: `min-w-0 truncate ${N ? "text-[var(--color-text)]" : "text-[var(--color-text-secondary)]"}`,
					children: N?.label ?? e.placeholder ?? "Seleccionar"
				}), /* @__PURE__ */ t(Qe, {
					size: 18,
					"aria-hidden": "true",
					className: `shrink-0 text-[var(--color-text-secondary)] transition-transform ${y ? "rotate-180" : ""}`
				})]
			}),
			e.helperText && !A && /* @__PURE__ */ t("span", {
				id: s,
				className: "self-start m-0 text-[var(--color-text-3)] text-[12px] leading-[1.45]",
				children: e.helperText
			}),
			j && /* @__PURE__ */ t("span", {
				id: l,
				className: "self-start mt-[-2px] text-[var(--color-error-main)] text-[12px] leading-[1.45]",
				children: j
			}),
			z
		]
	});
}
//#endregion
//#region src/components/Inputs/SearchSelectInput/search_select_input.tsx
var _n = 10;
function vn(e, t) {
	let n = t.trim().toLocaleLowerCase();
	return n === "" ? !0 : `${e.label} ${e.description ?? ""}`.toLocaleLowerCase().includes(n);
}
function yn(e) {
	let { debounceMs: r, disabled: i, filterOption: a, loadOptions: o, onBlur: s, onChange: l, onFocus: f, onSearch: m, options: v, selectedOption: y } = e, b = d(), x = `${b}-listbox`, S = h(null), C = h(null), w = h(null), T = h(null), [E, D] = g(!1), [O, k] = g(null), [A, j] = g(""), [M, N] = g(1), [P, F] = g(-1), [I, L] = g([]), [ee, R] = g(0), [te, z] = g(!1), [ne, B] = g(!1), [re, V] = g({ hasError: !1 }), [ie, ae] = Z({
		value: e.value,
		defaultValue: e.defaultValue ?? e.value
	}), H = typeof o == "function", oe = p(() => v ?? [], [v]), U = e.pageSize && e.pageSize > 0 ? e.pageSize : _n, se = e.validate?.status ? {
		hasError: !0,
		message: e.validate.message
	} : re, ce = p(() => H ? [] : oe.filter((e) => (a ?? vn)(e, A)), [
		a,
		H,
		oe,
		A
	]), le = ce.length, ue = H ? ee : le, W = Math.max(1, Math.ceil(ue / U)), G = Math.min(M, W), K = H ? I : ce, q = te && K.length === 0, de = !q && !ne && pn(H, ue, U), fe = p(() => [
		y,
		...I,
		...oe
	].filter(Boolean), [
		oe,
		I,
		y
	]).find((e) => Object.is(e.value, ie)), J = [
		be,
		"inline-flex items-center justify-between gap-[10px] text-left",
		se.hasError ? xe : "",
		e.variant === "outlined" ? Ce : "",
		e.variant === "ghost" ? Se : "",
		e.className ?? ""
	].filter(Boolean).join(" "), Y = c(() => {
		e.required === !0 && (ie == null || ie === "") && V({
			hasError: !0,
			message: "El campo es requerido"
		});
	}, [e.required, ie]), pe = c(() => {
		i || (k(S.current ? mn(S.current, {
			preferredHeight: 390,
			reservedHeight: 110
		}) : null), D(!0), F(-1), H && I.length === 0 && (z(!0), B(!1)), V({ hasError: !1 }), f?.());
	}, [
		i,
		H,
		f,
		I.length
	]), me = c(() => {
		D(!1), k(null), Y(), s?.();
	}, [s, Y]), he = c((e) => {
		e.disabled || (ae(e.value), l?.(e.value), V({ hasError: !1 }), D(!1), k(null), j(""), N(1), F(-1));
	}, [l, ae]), X = (e) => {
		j(e), N(1), F(-1), H && (z(!0), B(!1)), m?.(e);
	};
	return u(() => {
		E && window.setTimeout(() => T.current?.focus(), 0);
	}, [E]), u(() => {
		if (!E) return;
		let e = () => {
			S.current && k(mn(S.current, {
				preferredHeight: 390,
				reservedHeight: 110
			}));
		};
		return window.addEventListener("resize", e), window.addEventListener("scroll", e, !0), () => {
			window.removeEventListener("resize", e), window.removeEventListener("scroll", e, !0);
		};
	}, [E]), u(() => {
		if (!E || !H || !o) return;
		let e = !1, t = window.setTimeout(() => {
			B(!1), o({
				query: A,
				page: G,
				pageSize: U
			}).then((t) => {
				e || (L(t.options), R(t.total));
			}).catch(() => {
				e || (L([]), R(0), B(!0));
			}).finally(() => {
				e || z(!1);
			});
		}, r ?? 250);
		return () => {
			e = !0, window.clearTimeout(t);
		};
	}, [
		G,
		r,
		H,
		o,
		E,
		U,
		A
	]), u(() => {
		if (!E) return;
		let e = (e) => {
			let t = e.target;
			!C.current?.contains(t) && !w.current?.contains(t) && me();
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [E, me]), /* @__PURE__ */ n("div", {
		ref: C,
		className: "relative flex w-full flex-col gap-[8px]",
		onKeyDown: (e) => {
			if (e.key === "Escape") {
				me();
				return;
			}
			if (!E) {
				(e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") && (e.preventDefault(), pe());
				return;
			}
			switch (e.key) {
				case "ArrowDown":
					e.preventDefault(), F((e) => e < K.length - 1 ? e + 1 : e);
					break;
				case "ArrowUp":
					e.preventDefault(), F((e) => e > 0 ? e - 1 : e);
					break;
				case "Enter":
					e.preventDefault(), P >= 0 && P < K.length && he(K[P]);
					break;
			}
		},
		children: [
			e.label && /* @__PURE__ */ n("label", {
				htmlFor: e.id ?? b,
				className: "text-[13px] font-semibold text-[var(--color-text)] self-start",
				children: [e.label, e.required === !0 && /* @__PURE__ */ t("span", {
					className: "text-[var(--color-error-main)]",
					children: " *"
				})]
			}),
			/* @__PURE__ */ n("button", {
				ref: S,
				id: e.id ?? b,
				name: e.name,
				type: "button",
				className: J,
				disabled: e.disabled,
				"aria-haspopup": "listbox",
				"aria-expanded": E,
				"aria-controls": x,
				onClick: () => E ? me() : pe(),
				onBlur: () => {
					E || Y();
				},
				children: [/* @__PURE__ */ t("span", {
					className: fe ? "truncate" : "truncate text-[var(--color-text-3)]",
					children: fe?.label ?? e.placeholder ?? "Seleccionar"
				}), /* @__PURE__ */ t(Qe, {
					size: 18,
					className: `shrink-0 transition-transform ${E ? "rotate-180" : ""}`
				})]
			}),
			E && O && typeof document < "u" && _(/* @__PURE__ */ n("div", {
				ref: w,
				className: "fixed z-[1000] overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[10px] shadow-[var(--shadow-overlay)]",
				style: {
					left: O.left,
					width: O.width,
					top: O.top,
					bottom: O.bottom
				},
				children: [
					/* @__PURE__ */ t("div", {
						"aria-live": "polite",
						"aria-atomic": "true",
						className: "sr-only",
						children: te ? e.loadingText ?? "Cargando resultados" : `${ue} resultados disponibles`
					}),
					/* @__PURE__ */ n("div", {
						className: "relative mb-[8px]",
						children: [/* @__PURE__ */ t(qt, {
							size: 16,
							className: "pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2 text-[var(--color-text-3)]"
						}), /* @__PURE__ */ t("input", {
							ref: T,
							autoComplete: "off",
							className: "h-[38px] w-full rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-field-bg)] px-[34px] text-[13px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-3)] focus:border-[var(--color-focus-ring)]",
							placeholder: e.searchPlaceholder ?? "Buscar",
							value: A,
							onChange: (e) => X(e.target.value)
						})]
					}),
					/* @__PURE__ */ t("div", {
						id: x,
						role: "listbox",
						"aria-label": e.label,
						className: "overflow-y-auto [overscroll-behavior:contain] [scrollbar-gutter:stable]",
						style: { maxHeight: O.maxListHeight },
						children: q ? /* @__PURE__ */ t("div", {
							className: "px-[10px] py-[14px] text-[13px] text-[var(--color-text-3)]",
							children: e.loadingText ?? "Cargando resultados"
						}) : ne ? /* @__PURE__ */ t("div", {
							className: "px-[10px] py-[14px] text-[13px] text-[var(--color-text-3)]",
							children: e.errorText ?? "No fue posible cargar resultados"
						}) : K.length === 0 ? /* @__PURE__ */ t("div", {
							className: "px-[10px] py-[14px] text-[13px] text-[var(--color-text-3)]",
							children: e.emptyText ?? "Sin resultados"
						}) : /* @__PURE__ */ t("div", {
							className: "grid gap-[6px]",
							children: K.map((e, r) => {
								let i = Object.is(e.value, ie), a = P === r;
								return /* @__PURE__ */ n("button", {
									type: "button",
									role: "option",
									"aria-selected": i,
									disabled: e.disabled,
									className: `rounded-[var(--radius-control)] px-[10px] py-[9px] text-left text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${i ? "bg-[var(--color-primary-500)] text-[var(--color-on-primary)]" : "text-[var(--color-text)] hover:bg-[var(--color-hover-surface)]"} ${a && !i ? "bg-[var(--color-hover-surface)] ring-2 ring-[var(--color-focus-ring)] ring-inset" : ""}`,
									onClick: () => he(e),
									onMouseEnter: () => F(r),
									children: [/* @__PURE__ */ t("span", {
										className: "block font-semibold leading-[1.35]",
										children: e.label
									}), e.description && /* @__PURE__ */ t("span", {
										className: `mt-[2px] block text-[12px] leading-[1.35] ${i ? "text-[color-mix(in_srgb,var(--color-on-primary)_80%,transparent)]" : "text-[var(--color-text-2)]"}`,
										children: e.description
									})]
								}, `${e.label}-${String(e.value)}`);
							})
						})
					}),
					de && /* @__PURE__ */ t("div", {
						className: "mt-[10px] border-t border-[var(--color-border-subtle)] pt-[10px] text-[12px] text-[var(--color-text-2)]",
						children: /* @__PURE__ */ n("div", {
							className: "grid grid-cols-[auto_1fr_auto] items-center gap-[8px]",
							children: [
								/* @__PURE__ */ t("button", {
									type: "button",
									className: "h-[32px] rounded-[var(--radius-control)] border border-[var(--color-border)] px-[10px] font-semibold text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[var(--color-hover-surface)]",
									disabled: G <= 1,
									onClick: () => {
										N((e) => Math.max(1, e - 1)), F(-1), H && (z(!0), B(!1));
									},
									children: "Anterior"
								}),
								/* @__PURE__ */ n("span", {
									className: "text-center font-semibold text-[var(--color-text)]",
									"aria-label": `Pagina ${G} de ${W}`,
									children: [
										G,
										" / ",
										W
									]
								}),
								/* @__PURE__ */ t("button", {
									type: "button",
									className: "h-[32px] rounded-[var(--radius-control)] border border-[var(--color-border)] px-[10px] font-semibold text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[var(--color-hover-surface)]",
									disabled: G >= W,
									onClick: () => {
										N((e) => Math.min(W, e + 1)), F(-1), H && (z(!0), B(!1));
									},
									children: "Siguiente"
								})
							]
						})
					})
				]
			}), document.body),
			e.helperText && /* @__PURE__ */ t("span", {
				className: "self-start m-0 text-[var(--color-text-3)] text-[12px] leading-[1.45]",
				children: e.helperText
			}),
			se.hasError && /* @__PURE__ */ t("span", {
				className: "self-start mt-[-2px] text-[var(--color-error-main)] text-[12px] leading-[1.45]",
				children: se.message
			})
		]
	});
}
//#endregion
//#region src/components/Inputs/MultiSearchSelectInput/multi_search_select_input.tsx
var bn = 10;
function xn(e, t) {
	let n = t.trim().toLocaleLowerCase();
	return n === "" ? !0 : `${e.label} ${e.description ?? ""}`.toLocaleLowerCase().includes(n);
}
function Sn(e, t) {
	return e.length === t.length && e.every((e, n) => Object.is(e, t[n]));
}
function Cn(e, t) {
	return e.some((e) => Object.is(e, t));
}
function wn(e) {
	let { debounceMs: r, disabled: i, filterOption: a, loadOptions: o, onBlur: s, onChange: l, onFocus: f, onSearch: m, options: v, selectedOptions: y } = e, b = d(), x = `${b}-listbox`, S = h(null), C = h(null), w = h(null), T = h(null), [E, D] = g(!1), [O, k] = g(null), [A, j] = g(""), [M, N] = g(1), [P, F] = g(-1), [I, L] = g([]), [ee, R] = g(y ?? []), [te, z] = g(0), [ne, B] = g(!1), [re, V] = g(!1), [ie, ae] = g({ hasError: !1 }), [H, oe] = Z({
		value: e.value,
		defaultValue: e.defaultValue ?? e.value ?? [],
		isEqual: Sn
	}), U = typeof o == "function", se = p(() => v ?? [], [v]), ce = e.pageSize && e.pageSize > 0 ? e.pageSize : bn, le = e.validate?.status ? {
		hasError: !0,
		message: e.validate.message
	} : ie, ue = p(() => U ? [] : se.filter((e) => (a ?? xn)(e, A)), [
		a,
		U,
		se,
		A
	]), W = U ? te : ue.length, G = Math.max(1, Math.ceil(W / ce)), K = Math.min(M, G), q = U ? I : ue, de = ne && q.length === 0, fe = !de && !re && pn(U, W, ce), J = e.maxSelections !== void 0 && H.length >= e.maxSelections, Y = p(() => {
		let e = [];
		return [
			...y ?? [],
			...ee,
			...I,
			...se
		].forEach((t) => {
			e.some((e) => Object.is(e.value, t.value)) || e.push(t);
		}), e;
	}, [
		se,
		ee,
		I,
		y
	]), pe = p(() => H.map((e) => Y.find((t) => Object.is(t.value, e)) ?? {
		value: e,
		label: String(e)
	}), [Y, H]), me = [
		be,
		"inline-flex items-center justify-between gap-[10px] text-left",
		le.hasError ? xe : "",
		e.variant === "outlined" ? Ce : "",
		e.variant === "ghost" ? Se : "",
		e.className ?? ""
	].filter(Boolean).join(" "), he = c(() => {
		e.required === !0 && H.length === 0 && ae({
			hasError: !0,
			message: "El campo es requerido"
		});
	}, [e.required, H.length]), X = c(() => {
		S.current && k(mn(S.current, {
			preferredHeight: 404,
			reservedHeight: 112
		}));
	}, []), ge = c(() => {
		i || (X(), D(!0), F(-1), U && I.length === 0 && (B(!0), V(!1)), ae({ hasError: !1 }), f?.());
	}, [
		i,
		U,
		f,
		I.length,
		X
	]), _e = c(() => {
		D(!1), k(null), he(), s?.();
	}, [s, he]), ve = c((e, t) => {
		t && R((e) => [...e.filter((e) => !Object.is(e.value, t.value)), t]), oe(e), l?.(e), ae({ hasError: !1 });
	}, [l, oe]), ye = c((e) => {
		if (e.disabled) return;
		let t = Cn(H, e.value);
		!t && J || ve(t ? H.filter((t) => !Object.is(t, e.value)) : [...H, e.value], e);
	}, [
		ve,
		J,
		H
	]), we = c((e) => {
		ve(H.filter((t) => !Object.is(t, e.value)));
	}, [ve, H]), Te = (e) => {
		j(e), N(1), F(-1), U && (B(!0), V(!1)), m?.(e);
	};
	return u(() => {
		E && window.setTimeout(() => T.current?.focus(), 0);
	}, [E]), u(() => {
		if (E) return window.addEventListener("resize", X), window.addEventListener("scroll", X, !0), () => {
			window.removeEventListener("resize", X), window.removeEventListener("scroll", X, !0);
		};
	}, [E, X]), u(() => {
		if (!E || !U || !o) return;
		let e = !1, t = window.setTimeout(() => {
			V(!1), o({
				query: A,
				page: K,
				pageSize: ce
			}).then((t) => {
				e || (L(t.options), z(t.total));
			}).catch(() => {
				e || (L([]), z(0), V(!0));
			}).finally(() => {
				e || B(!1);
			});
		}, r ?? 250);
		return () => {
			e = !0, window.clearTimeout(t);
		};
	}, [
		K,
		r,
		U,
		o,
		E,
		ce,
		A
	]), u(() => {
		if (!E) return;
		let e = (e) => {
			let t = e.target;
			!C.current?.contains(t) && !w.current?.contains(t) && _e();
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [_e, E]), /* @__PURE__ */ n("div", {
		ref: C,
		className: e.selectionLayout === "grid" ? "bui-multi-search-select-grid" : "relative flex w-full flex-col gap-[8px]",
		onKeyDown: (e) => {
			if (e.key === "Escape") {
				_e();
				return;
			}
			if (!E) {
				[
					"ArrowDown",
					"ArrowUp",
					"Enter",
					" "
				].includes(e.key) && (e.preventDefault(), ge());
				return;
			}
			e.key === "ArrowDown" && (e.preventDefault(), F((e) => Math.min(e + 1, q.length - 1))), e.key === "ArrowUp" && (e.preventDefault(), F((e) => Math.max(e - 1, 0))), e.key === "Enter" && P >= 0 && q[P] && (e.preventDefault(), ye(q[P]));
		},
		children: [
			/* @__PURE__ */ n("div", {
				className: "relative flex min-w-0 w-full flex-col gap-[8px]",
				children: [
					e.label && /* @__PURE__ */ n("label", {
						htmlFor: e.id ?? b,
						className: "text-[13px] font-semibold text-[var(--color-text)] self-start",
						children: [e.label, e.required === !0 && /* @__PURE__ */ t("span", {
							className: "text-[var(--color-error-main)]",
							children: " *"
						})]
					}),
					/* @__PURE__ */ n("button", {
						ref: S,
						id: e.id ?? b,
						name: e.name,
						type: "button",
						className: me,
						disabled: i,
						"aria-haspopup": "listbox",
						"aria-expanded": E,
						"aria-controls": x,
						onClick: () => E ? _e() : ge(),
						children: [/* @__PURE__ */ t("span", {
							className: H.length > 0 ? "truncate" : "truncate text-[var(--color-text-3)]",
							children: H.length > 0 ? `${H.length} seleccionado${H.length === 1 ? "" : "s"}` : e.placeholder ?? "Seleccionar"
						}), /* @__PURE__ */ t(Qe, {
							size: 18,
							className: `shrink-0 transition-transform ${E ? "rotate-180" : ""}`
						})]
					}),
					e.helperText && /* @__PURE__ */ t("span", {
						className: "self-start m-0 text-[var(--color-text-3)] text-[12px] leading-[1.45]",
						children: e.helperText
					}),
					le.hasError && /* @__PURE__ */ t("span", {
						className: "self-start mt-[-2px] text-[var(--color-error-main)] text-[12px] leading-[1.45]",
						children: le.message
					})
				]
			}),
			/* @__PURE__ */ n("div", {
				className: "bui-multi-search-select-pool",
				"aria-live": "polite",
				children: [/* @__PURE__ */ t("span", {
					className: "bui-multi-search-select-pool-label",
					children: e.selectedLabel ?? "Seleccionados"
				}), pe.length === 0 ? /* @__PURE__ */ t("span", {
					className: "bui-multi-search-select-empty",
					children: e.emptySelectionText ?? "Sin elementos seleccionados."
				}) : /* @__PURE__ */ t("div", {
					className: "bui-multi-search-select-items",
					children: pe.map((e) => /* @__PURE__ */ n("div", {
						className: "bui-multi-search-select-item",
						children: [/* @__PURE__ */ n("span", {
							className: "bui-multi-search-select-item-copy",
							children: [/* @__PURE__ */ t("strong", { children: e.label }), e.description && /* @__PURE__ */ t("small", { children: e.description })]
						}), /* @__PURE__ */ t("button", {
							type: "button",
							className: "bui-multi-search-select-remove",
							disabled: i,
							"aria-label": `Quitar ${e.label}`,
							onClick: () => we(e),
							children: /* @__PURE__ */ t(nt, { size: 18 })
						})]
					}, String(e.value)))
				})]
			}),
			E && O && typeof document < "u" && _(/* @__PURE__ */ n("div", {
				ref: w,
				className: "fixed z-[1000] overflow-hidden rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[10px] shadow-[var(--shadow-overlay)]",
				style: {
					left: O.left,
					width: O.width,
					top: O.top,
					bottom: O.bottom
				},
				children: [
					/* @__PURE__ */ t("div", {
						"aria-live": "polite",
						"aria-atomic": "true",
						className: "sr-only",
						children: ne ? e.loadingText ?? "Cargando resultados" : `${W} resultados disponibles`
					}),
					/* @__PURE__ */ n("div", {
						className: "relative mb-[8px]",
						children: [/* @__PURE__ */ t(qt, {
							size: 16,
							className: "pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2 text-[var(--color-text-3)]"
						}), /* @__PURE__ */ t("input", {
							ref: T,
							autoComplete: "off",
							className: "h-[38px] w-full rounded-[var(--radius-control)] border border-[var(--color-border)] bg-[var(--color-field-bg)] px-[34px] text-[13px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-3)] focus:border-[var(--color-focus-ring)]",
							placeholder: e.searchPlaceholder ?? "Buscar",
							value: A,
							onChange: (e) => Te(e.target.value)
						})]
					}),
					/* @__PURE__ */ t("div", {
						id: x,
						role: "listbox",
						"aria-multiselectable": "true",
						"aria-label": e.label,
						className: "overflow-y-auto [overscroll-behavior:contain] [scrollbar-gutter:stable]",
						style: { maxHeight: O.maxListHeight },
						children: de ? /* @__PURE__ */ t("div", {
							className: "bui-multi-search-select-message",
							children: e.loadingText ?? "Cargando resultados"
						}) : re ? /* @__PURE__ */ t("div", {
							className: "bui-multi-search-select-message",
							children: e.errorText ?? "No fue posible cargar resultados"
						}) : q.length === 0 ? /* @__PURE__ */ t("div", {
							className: "bui-multi-search-select-message",
							children: e.emptyText ?? "Sin resultados"
						}) : /* @__PURE__ */ t("div", {
							className: "grid gap-[6px]",
							children: q.map((e, r) => {
								let i = Cn(H, e.value), a = P === r;
								return /* @__PURE__ */ n("button", {
									type: "button",
									role: "option",
									"aria-selected": i,
									disabled: !!(e.disabled || !i && J),
									className: `bui-multi-search-select-option ${i ? "bui-multi-search-select-option--selected" : ""} ${a && !i ? "bui-multi-search-select-option--focused" : ""}`,
									onClick: () => ye(e),
									onMouseEnter: () => F(r),
									children: [/* @__PURE__ */ t("span", {
										className: "bui-multi-search-select-check",
										"aria-hidden": "true",
										children: i && /* @__PURE__ */ t(Ze, { size: 14 })
									}), /* @__PURE__ */ n("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ t("span", {
											className: "block font-semibold leading-[1.35]",
											children: e.label
										}), e.description && /* @__PURE__ */ t("span", {
											className: "mt-[2px] block text-[12px] leading-[1.35] text-[var(--color-text-2)]",
											children: e.description
										})]
									})]
								}, `${e.label}-${String(e.value)}`);
							})
						})
					}),
					fe && /* @__PURE__ */ n("div", {
						className: "mt-[10px] grid grid-cols-[auto_1fr_auto] items-center gap-[8px] border-t border-[var(--color-border-subtle)] pt-[10px] text-[12px] text-[var(--color-text-2)]",
						children: [
							/* @__PURE__ */ t("button", {
								type: "button",
								className: "bui-multi-search-select-page",
								disabled: K <= 1,
								onClick: () => {
									N((e) => Math.max(1, e - 1)), F(-1);
								},
								children: "Anterior"
							}),
							/* @__PURE__ */ n("span", {
								className: "text-center font-semibold text-[var(--color-text)]",
								"aria-label": `Página ${K} de ${G}`,
								children: [
									K,
									" / ",
									G
								]
							}),
							/* @__PURE__ */ t("button", {
								type: "button",
								className: "bui-multi-search-select-page",
								disabled: K >= G,
								onClick: () => {
									N((e) => Math.min(G, e + 1)), F(-1);
								},
								children: "Siguiente"
							})
						]
					})
				]
			}), document.body)
		]
	});
}
//#endregion
//#region src/components/Inputs/DateInput/date_input.utils.ts
function Tn(e, t) {
	return !!(e && t && e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate());
}
function En(e) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
}
function Dn(e) {
	return e ? `${String(e.getDate()).padStart(2, "0")}/${String(e.getMonth() + 1).padStart(2, "0")}/${e.getFullYear()}` : "Selecciona fecha";
}
function On(e) {
	if (!e) return "";
	let t = String(e.getMonth() + 1).padStart(2, "0"), n = String(e.getDate()).padStart(2, "0");
	return `${e.getFullYear()}-${t}-${n}`;
}
function kn({ viewDate: e, selectedDate: t, today: n, minDate: r, maxDate: i }) {
	let a = (new Date(e.getFullYear(), e.getMonth(), 1).getDay() + 6) % 7, o = new Date(e.getFullYear(), e.getMonth(), 1 - a), s = r ? En(r) : void 0, c = i ? En(i) : void 0;
	return Array.from({ length: 42 }, (r, i) => {
		let a = new Date(o);
		a.setDate(o.getDate() + i);
		let l = En(a);
		return {
			date: a,
			outside: a.getMonth() !== e.getMonth(),
			selected: Tn(a, t),
			today: Tn(a, n),
			disabled: s !== void 0 && l < s || c !== void 0 && l > c
		};
	});
}
function An({ trigger: e, popover: t, viewport: n, gap: r, padding: i }) {
	let a = Math.max(0, n.height - e.bottom - i - r), o = Math.max(0, e.top - i - r), s = t.height > a && o > a ? "top" : "bottom", c = s === "top" ? o : a, l = Math.min(t.height, c), u = s === "top" ? e.top - r - l : e.bottom + r, d = Math.max(i, n.width - i - t.width);
	return {
		left: Math.min(Math.max(e.left, i), d),
		top: Math.max(u, i),
		placement: s,
		maxHeight: c
	};
}
//#endregion
//#region src/components/Inputs/DateInput/date_input.tsx
var jn = [
	"Enero",
	"Febrero",
	"Marzo",
	"Abril",
	"Mayo",
	"Junio",
	"Julio",
	"Agosto",
	"Septiembre",
	"Octubre",
	"Noviembre",
	"Diciembre"
], Mn = [
	"Ene",
	"Feb",
	"Mar",
	"Abr",
	"May",
	"Jun",
	"Jul",
	"Ago",
	"Sep",
	"Oct",
	"Nov",
	"Dic"
], Nn = [
	"L",
	"M",
	"M",
	"J",
	"V",
	"S",
	"D"
], Pn = new Intl.DateTimeFormat("es-CO", { dateStyle: "full" });
function Fn(e, t) {
	return e?.getTime() === t?.getTime();
}
function In(e, t) {
	return !!(e && e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth());
}
function Ln(e, t, n) {
	let r = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime(), i = t ? new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime() : void 0, a = n ? new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime() : void 0;
	return i !== void 0 && r < i || a !== void 0 && r > a;
}
function Rn(e) {
	let { onBlur: r, required: i } = e, a = d(), o = e.id ?? `bui-date-input-${a.replaceAll(":", "")}`, s = `${o}-popover`, [c, l] = g({ hasError: !1 }), [f, m] = Z({
		value: e.value,
		defaultValue: e.defaultValue ?? e.value ?? null,
		isEqual: Fn
	}), [v, y] = g(f), [b, x] = g(f ? new Date(f) : /* @__PURE__ */ new Date()), [S, C] = g("day"), [w, T] = g(!1), [E, D] = g(!1), [O, k] = g("bottom"), [A, j] = g({}), M = h(null), N = h(null), P = e.validate?.status ? {
		hasError: !0,
		message: e.validate.message
	} : c, F = p(() => /* @__PURE__ */ new Date(), []), I = p(() => kn({
		viewDate: b,
		selectedDate: v,
		today: F,
		minDate: e.minDate,
		maxDate: e.maxDate
	}), [
		v,
		e.maxDate,
		e.minDate,
		F,
		b
	]), L = b.getFullYear() - b.getFullYear() % 12;
	u(() => {
		if (!w) return;
		let e = () => {
			let e = M.current?.getBoundingClientRect(), t = N.current?.getBoundingClientRect();
			if (!e || !t) return;
			let n = An({
				trigger: e,
				popover: t,
				viewport: {
					width: window.innerWidth,
					height: window.innerHeight
				},
				gap: 8,
				padding: 12
			});
			j({
				left: n.left,
				maxHeight: n.maxHeight,
				top: n.top,
				width: Math.min(360, window.innerWidth - 24)
			}), k(n.placement), D(!0);
		}, t = window.requestAnimationFrame(e);
		return window.addEventListener("resize", e), window.addEventListener("scroll", e, !0), () => {
			window.cancelAnimationFrame(t), window.removeEventListener("resize", e), window.removeEventListener("scroll", e, !0);
		};
	}, [
		S,
		w,
		b
	]), u(() => {
		if (!w) return;
		let e = (e) => {
			let t = e.target;
			t instanceof Node && (M.current?.contains(t) || N.current?.contains(t) || (T(!1), r?.(), i && !f && l({
				hasError: !0,
				message: "El campo es requerido"
			})));
		}, t = (e) => {
			e.key === "Escape" && (T(!1), M.current?.focus());
		};
		return document.addEventListener("pointerdown", e), document.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e), document.removeEventListener("keydown", t);
		};
	}, [
		r,
		w,
		i,
		f
	]);
	let ee = () => {
		if (e.disabled || e.readonly) return;
		let t = f ? new Date(f) : /* @__PURE__ */ new Date();
		y(f ? new Date(f) : null), x(t), C("day"), l({ hasError: !1 }), D(!1), T(!0), e.onFocus?.();
	}, R = (e) => {
		x((t) => {
			let n = new Date(t);
			return S === "year" ? n.setFullYear(n.getFullYear() + 12 * e) : S === "month" ? n.setFullYear(n.getFullYear() + e) : (n.setDate(1), n.setMonth(n.getMonth() + e)), n;
		});
	}, te = () => {
		if (i && !v) {
			l({
				hasError: !0,
				message: "El campo es requerido"
			});
			return;
		}
		let t = v ? new Date(v) : null;
		m(t), e.onChange?.(t), l({ hasError: !1 }), T(!1), r?.(), window.requestAnimationFrame(() => M.current?.focus());
	}, z = w && typeof document < "u" ? _(/* @__PURE__ */ n("div", {
		"aria-label": `Seleccionar ${e.label?.toLocaleLowerCase() || "fecha"}`,
		"aria-modal": "false",
		className: "bui-date-popover",
		"data-placement": O,
		id: s,
		ref: N,
		role: "dialog",
		style: {
			...A,
			visibility: E ? "visible" : "hidden"
		},
		children: [
			/* @__PURE__ */ n("div", {
				className: "bui-date-head",
				children: [
					/* @__PURE__ */ t("button", {
						"aria-label": "Periodo anterior",
						className: "bui-date-nav-button",
						onClick: () => R(-1),
						type: "button",
						children: /* @__PURE__ */ t($e, {})
					}),
					/* @__PURE__ */ n("div", {
						className: "bui-date-period",
						children: [/* @__PURE__ */ t("button", {
							onClick: () => C((e) => e === "month" ? "day" : "month"),
							type: "button",
							children: S === "year" ? "Años" : S === "month" ? "Meses" : jn[b.getMonth()]
						}), /* @__PURE__ */ t("button", {
							onClick: () => C((e) => e === "year" ? "day" : "year"),
							type: "button",
							children: S === "year" ? `${L} - ${L + 11}` : b.getFullYear()
						})]
					}),
					/* @__PURE__ */ t("button", {
						"aria-label": "Periodo siguiente",
						className: "bui-date-nav-button",
						onClick: () => R(1),
						type: "button",
						children: /* @__PURE__ */ t(et, {})
					})
				]
			}),
			S === "day" && /* @__PURE__ */ t("div", {
				"aria-hidden": "true",
				className: "bui-date-weekdays",
				children: Nn.map((e, n) => /* @__PURE__ */ t("span", { children: e }, `${e}-${n}`))
			}),
			/* @__PURE__ */ n("div", {
				className: `bui-date-grid bui-date-grid--${S}`,
				children: [
					S === "day" && I.map((e) => /* @__PURE__ */ t("button", {
						"aria-label": Pn.format(e.date),
						"aria-pressed": e.selected,
						className: [
							"bui-date-cell",
							e.outside && "is-outside",
							e.selected && "is-selected",
							e.today && "is-today"
						].filter(Boolean).join(" "),
						disabled: e.disabled,
						onClick: () => {
							y(new Date(e.date)), x(new Date(e.date));
						},
						type: "button",
						children: e.date.getDate()
					}, On(e.date))),
					S === "month" && Mn.map((e, n) => {
						let r = new Date(b.getFullYear(), n, 1);
						return /* @__PURE__ */ t("button", {
							"aria-pressed": In(v, r),
							className: `bui-date-cell${In(v, r) ? " is-selected" : ""}`,
							onClick: () => {
								x(r), C("day");
							},
							type: "button",
							children: e
						}, e);
					}),
					S === "year" && Array.from({ length: 12 }, (e, n) => {
						let r = L + n, i = v?.getFullYear() === r;
						return /* @__PURE__ */ t("button", {
							"aria-pressed": i,
							className: `bui-date-cell${i ? " is-selected" : ""}`,
							onClick: () => {
								x(new Date(r, b.getMonth(), 1)), C("month");
							},
							type: "button",
							children: r
						}, r);
					})
				]
			}),
			/* @__PURE__ */ n("div", {
				className: "bui-date-actions",
				children: [
					/* @__PURE__ */ t("button", {
						onClick: () => y(null),
						type: "button",
						children: "Limpiar"
					}),
					/* @__PURE__ */ t("button", {
						disabled: Ln(F, e.minDate, e.maxDate),
						onClick: () => {
							y(new Date(F)), x(new Date(F)), C("day");
						},
						type: "button",
						children: "Hoy"
					}),
					/* @__PURE__ */ t("button", {
						className: "bui-date-apply",
						onClick: te,
						type: "button",
						children: "Aplicar"
					})
				]
			})
		]
	}), document.body) : null;
	return /* @__PURE__ */ n("div", {
		className: "bui-date-input",
		children: [
			e.label && /* @__PURE__ */ n("label", {
				className: "text-[13px] font-semibold text-[var(--color-text)] self-start",
				htmlFor: o,
				children: [e.label, e.required && /* @__PURE__ */ t("span", {
					className: "text-[var(--color-error-main)]",
					children: " *"
				})]
			}),
			/* @__PURE__ */ n("button", {
				"aria-controls": s,
				"aria-expanded": w,
				"aria-haspopup": "dialog",
				"aria-invalid": P.hasError,
				"aria-readonly": e.readonly,
				className: [
					"bui-date-trigger",
					w && "is-open",
					P.hasError && "is-error",
					e.variant === "ghost" && "bui-date-trigger--ghost",
					e.className
				].filter(Boolean).join(" "),
				disabled: e.disabled,
				id: o,
				onClick: () => w ? T(!1) : ee(),
				ref: M,
				type: "button",
				children: [
					/* @__PURE__ */ t(Je, { className: "bui-date-trigger-icon" }),
					/* @__PURE__ */ t("span", {
						className: f ? void 0 : "bui-date-placeholder",
						children: f ? Dn(f) : e.placeholder ?? "Selecciona fecha"
					}),
					/* @__PURE__ */ t(Qe, { className: "bui-date-chevron" })
				]
			}),
			/* @__PURE__ */ t("input", {
				disabled: e.disabled,
				name: e.name,
				readOnly: !0,
				type: "hidden",
				value: On(f)
			}),
			e.helperText && /* @__PURE__ */ t("span", {
				className: "self-start m-0 text-[var(--color-text-3)] text-[12px] leading-[1.45]",
				children: e.helperText
			}),
			P.hasError && /* @__PURE__ */ t("span", {
				className: "self-start mt-[-2px] text-[var(--color-error-main)] text-[12px] leading-[1.45]",
				children: P.message
			}),
			z
		]
	});
}
//#endregion
//#region src/components/Inputs/CheckboxInput/checkbox_input.tsx
function zn(e) {
	let [r, i] = g({ hasError: !1 }), [a, o] = Z({
		value: e.value,
		defaultValue: e.value ?? e.defaultValue ?? !1
	}), s = e.validate?.status ? {
		hasError: !0,
		message: e.validate.message
	} : r, c = () => {
		e.required === !0 && !a && i({
			hasError: !0,
			message: "El campo es requerido"
		});
	}, l = () => {
		if (e.readonly || e.disabled) return;
		let t = !a;
		o(t), i({ hasError: !1 }), e.onChange?.(t);
	}, u = /* @__PURE__ */ t("div", {
		className: `${Ee} ${a ? "!border-transparent text-white bg-[var(--color-primary-500)] border-[var(--color-primary-500)]" : ""} ${s.hasError ? "bui-checkbox-box-error" : ""} ${e.boxClassName ?? ""}`.replace(/\s+/g, " ").trim(),
		children: a && /* @__PURE__ */ t(De, { className: "!w-[16px] stroke-[4]" })
	});
	return /* @__PURE__ */ n("div", {
		className: `flex flex-col gap-[8px]${e.labelPosition === "left" ? " items-end" : ""}`,
		children: [
			/* @__PURE__ */ n("label", {
				className: `${Te}`,
				children: [
					/* @__PURE__ */ t("input", {
						id: e.id,
						name: e.name,
						type: "checkbox",
						className: "sr-only",
						checked: a,
						disabled: e.disabled,
						required: e.required,
						onChange: l,
						onBlur: () => {
							c(), e.onBlur?.();
						},
						onFocus: () => {
							i({ hasError: !1 }), e.onFocus?.();
						}
					}),
					e.labelPosition === "left" && /* @__PURE__ */ t("span", { children: e.label }),
					u,
					e.labelPosition !== "left" && /* @__PURE__ */ t("span", { children: e.label })
				]
			}),
			e.helperText && /* @__PURE__ */ t("span", {
				className: "self-start m-0 text-[var(--color-text-3)] text-[12px] leading-[1.45]",
				children: e.helperText
			}),
			s.hasError && /* @__PURE__ */ t("span", {
				className: "self-start mt-[-2px] text-[var(--color-error-main)] text-[12px] leading-[1.45]",
				children: s.message
			})
		]
	});
}
//#endregion
//#region src/components/Inputs/OtpInput/otp_input.tsx
var Bn = (e, t) => Array.from({ length: t }, (t, n) => e?.[n] ?? ""), Vn = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]);
function Hn(e) {
	let [r, i] = Z({
		value: e.value === void 0 ? void 0 : Bn(e.value, e.digits),
		defaultValue: Bn(e.defaultValue ?? e.value, e.digits),
		isEqual: Vn
	}), [a, o] = g({ hasError: !1 }), s = h([]), c = e.validate?.status ? {
		hasError: !0,
		message: e.validate.message
	} : a;
	u(() => {
		e.value === void 0 && i((t) => {
			let n = Array.from({ length: e.digits }, (e, n) => t[n] ?? "");
			return Vn(t, n) ? t : n;
		});
	}, [
		e.value,
		e.digits,
		i
	]);
	let l = (t) => {
		e.onChange?.(t.join(""));
	}, d = (t, n) => {
		let a = n.replace(/\D/g, "").slice(-1), o = [...r];
		o[t] = a, i(o), l(o), a && t < e.digits - 1 && s.current[t + 1]?.focus();
	}, f = (t, n) => {
		if (n.key === "Backspace" && r[t] === "" && t > 0) {
			let e = [...r];
			e[t - 1] = "", i(e), l(e), s.current[t - 1]?.focus();
		} else n.key === "ArrowLeft" && t > 0 ? s.current[t - 1]?.focus() : n.key === "ArrowRight" && t < e.digits - 1 && s.current[t + 1]?.focus();
	}, p = (t) => {
		t.preventDefault();
		let n = t.clipboardData.getData("text").replace(/\D/g, "").slice(0, e.digits), r = Array.from({ length: e.digits }, (e, t) => n[t] ?? "");
		i(r), l(r), s.current[Math.min(n.length, e.digits - 1)]?.focus();
	}, m = () => {
		e.required && r.join("").length < e.digits && o({
			hasError: !0,
			message: "El código OTP es requerido"
		});
	};
	return /* @__PURE__ */ n("div", {
		className: "flex flex-col w-full gap-[8px]",
		children: [
			e.label && /* @__PURE__ */ n("label", {
				htmlFor: e.id,
				className: "text-[13px] font-semibold text-[var(--color-text)] self-start",
				children: [e.label, e.required === !0 && /* @__PURE__ */ t("span", {
					className: "text-[var(--color-error-main)]",
					children: " *"
				})]
			}),
			/* @__PURE__ */ t("div", {
				className: `grid grid-cols-6 gap-[8px] ${e.className ?? ""}`,
				children: r.map((n, r) => /* @__PURE__ */ t("input", {
					ref: (e) => {
						s.current[r] = e;
					},
					className: `${ye}${c.hasError ? ` ${xe}` : ""} text-center ${e.variant === "outlined" ? Ce : e.variant === "ghost" ? Se : ""} ${e.cellClassName ?? ""}`,
					type: "text",
					inputMode: "numeric",
					maxLength: 1,
					value: n,
					placeholder: e.placeholder,
					disabled: e.disabled,
					readOnly: e.readonly,
					id: r === 0 ? e.id : void 0,
					name: r === 0 ? e.name : void 0,
					onChange: (e) => d(r, e.target.value),
					onKeyDown: (e) => f(r, e),
					onPaste: p,
					onFocus: () => {
						o({ hasError: !1 }), s.current[r]?.select(), e.onFocus?.();
					},
					onBlur: () => {
						m(), e.onBlur?.();
					}
				}, r))
			}),
			e.helperText && /* @__PURE__ */ t("span", {
				className: "self-start m-0 text-[var(--color-text-3)] text-[12px] leading-[1.45]",
				children: e.helperText
			}),
			c.hasError && /* @__PURE__ */ t("span", {
				className: "self-start mt-[-2px] text-[var(--color-error-main)] text-[12px] leading-[1.45]",
				children: c.message
			})
		]
	});
}
//#endregion
//#region src/components/Inputs/RadioCard/radio_card.tsx
function Un(e) {
	let { value: r, title: i, checked: a, defaultChecked: o, description: s, meta: c, statusLabel: l, statusTone: u = "default", name: d, id: f, required: p, disabled: m, className: h, inputClassName: g, onChange: _, onBlur: v, onFocus: y } = e, b = s != null, x = c != null, S = l != null;
	return /* @__PURE__ */ n("label", {
		className: `bui-radio-card ${m ? "bui-radio-card-disabled" : ""} ${h ?? ""}`.trim(),
		"aria-disabled": m,
		children: [/* @__PURE__ */ t("input", {
			id: f,
			name: d,
			type: "radio",
			value: String(r),
			checked: a,
			defaultChecked: a === void 0 ? o : void 0,
			required: p,
			disabled: m,
			className: `bui-radio-card-input ${g ?? ""}`.trim(),
			onBlur: v,
			onFocus: y,
			onChange: (e) => {
				e.target.checked && !m && _?.(r);
			}
		}), /* @__PURE__ */ n("span", {
			className: "bui-radio-card-body",
			children: [/* @__PURE__ */ n("span", {
				className: "bui-radio-card-main",
				children: [/* @__PURE__ */ t("strong", { children: i }), b && /* @__PURE__ */ t("span", { children: s })]
			}), (x || S) && /* @__PURE__ */ n("span", {
				className: "bui-radio-card-meta",
				children: [x && /* @__PURE__ */ t("span", { children: c }), S && /* @__PURE__ */ t(X, {
					className: "bui-radio-card-status",
					tone: u,
					children: l
				})]
			})]
		})]
	});
}
//#endregion
//#region src/components/Notices/notice_icons.tsx
function Wn() {
	return /* @__PURE__ */ n("svg", {
		className: "bui-notice-banana",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ t("path", {
				d: "M18.1 7.1c-.8 3.5-3.4 6-6.8 6.7-2.3.5-4.6.1-6.4-1.1-.5-.3-1 .1-.8.7 1.1 3.2 4.4 5.2 7.9 4.8 4.5-.5 7.7-4.5 7.6-9.2 0-.8-.2-1.4-.5-1.9-.3-.5-.8-.5-1 0Z",
				fill: "var(--bui-notice-banana-fill, #fecc00)",
				stroke: "var(--bui-notice-banana-detail, #a67c00)",
				strokeWidth: ".6",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ t("path", {
				d: "M7.1 15.3c3.9 1.9 8.6-.1 10.3-4",
				fill: "none",
				stroke: "var(--bui-notice-banana-detail, #a67c00)",
				strokeWidth: ".7",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ t("path", {
				d: "m18.5 7 .1-1.4 1 .1M4.5 13.2l-.6-.5",
				fill: "none",
				stroke: "var(--bui-notice-banana-detail, #a67c00)",
				strokeWidth: "1.1",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			})
		]
	});
}
//#endregion
//#region src/components/Notices/notice_utils.ts
function Gn(e) {
	switch (e) {
		case "info": return "bui-notice-card-info";
		case "warning": return "bui-notice-card-warn";
		case "success": return "bui-notice-card-success";
		case "error": return "bui-notice-card-error";
		default: return "bui-notice-card-info";
	}
}
//#endregion
//#region src/components/Notices/notice.tsx
function Kn(...e) {
	return e.filter(Boolean).join(" ");
}
function qn(e) {
	let { variant: r = "info", iconPosition: i = "left", heading: a, className: o, children: s, ...c } = e;
	return /* @__PURE__ */ n("div", {
		...c,
		className: Kn("bui-notice-card", Gn(r), i === "right" && "bui-notice-card--right", o),
		children: [/* @__PURE__ */ t("div", {
			className: "bui-notice-signal",
			"aria-hidden": "true",
			children: /* @__PURE__ */ t("span", {
				className: "bui-notice-signal-node",
				children: /* @__PURE__ */ t(Wn, {})
			})
		}), /* @__PURE__ */ n("div", {
			className: "bui-notice-content",
			children: [a && /* @__PURE__ */ t("div", {
				className: "bui-notice-title",
				children: a
			}), /* @__PURE__ */ t("div", {
				className: "bui-notice-message",
				children: s
			})]
		})]
	});
}
//#endregion
//#region src/components/Toast/toast_icons.tsx
function Jn({ variant: e }) {
	return e === "success" ? /* @__PURE__ */ n("svg", {
		className: "bui-toast-icon",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ t("circle", {
			cx: "12",
			cy: "12",
			r: "9"
		}), /* @__PURE__ */ t("path", { d: "m8 12 2.6 2.6L16.5 9" })]
	}) : e === "warning" ? /* @__PURE__ */ n("svg", {
		className: "bui-toast-icon",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ t("path", { d: "M12 9v4" }),
			/* @__PURE__ */ t("path", { d: "M12 17h.01" }),
			/* @__PURE__ */ t("path", { d: "M10.3 4.3 2.8 17.1A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.9L13.7 4.3a2 2 0 0 0-3.4 0Z" })
		]
	}) : e === "error" ? /* @__PURE__ */ n("svg", {
		className: "bui-toast-icon",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ t("path", { d: "m15 9-6 6" }),
			/* @__PURE__ */ t("path", { d: "m9 9 6 6" }),
			/* @__PURE__ */ t("circle", {
				cx: "12",
				cy: "12",
				r: "9"
			})
		]
	}) : /* @__PURE__ */ n("svg", {
		className: "bui-toast-icon",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ t("path", { d: "M12 16v-4" }),
			/* @__PURE__ */ t("path", { d: "M12 8h.01" }),
			/* @__PURE__ */ t("circle", {
				cx: "12",
				cy: "12",
				r: "9"
			})
		]
	});
}
//#endregion
//#region src/components/Toast/toast.tsx
function Yn(...e) {
	return e.filter(Boolean).join(" ");
}
function Xn(e) {
	return e === "warning" || e === "error" ? "alert" : "status";
}
function Zn(e) {
	let { variant: r = "info", title: i, description: a, icon: o, action: s, visible: c = !0, closable: l = !0, onClose: u, className: d, children: f, ...p } = e;
	return c ? /* @__PURE__ */ n("div", {
		...p,
		className: Yn("bui-toast", `bui-toast-${r}`, d),
		role: p.role ?? Xn(r),
		"aria-live": p["aria-live"] ?? (r === "warning" || r === "error" ? "assertive" : "polite"),
		children: [
			/* @__PURE__ */ t("span", {
				className: "bui-toast-icon-shell",
				"aria-hidden": "true",
				children: o ?? /* @__PURE__ */ t(Jn, { variant: r })
			}),
			/* @__PURE__ */ n("div", {
				className: "bui-toast-body",
				children: [
					/* @__PURE__ */ t("strong", {
						className: "bui-toast-title",
						children: i ?? "Notificación"
					}),
					a && /* @__PURE__ */ t("span", {
						className: "bui-toast-description",
						children: a
					}),
					f
				]
			}),
			(s || l) && /* @__PURE__ */ n("div", {
				className: "bui-toast-actions",
				children: [s, l && /* @__PURE__ */ t("button", {
					className: "bui-toast-close",
					type: "button",
					"aria-label": "Cerrar notificación",
					onClick: u,
					children: /* @__PURE__ */ n("svg", {
						viewBox: "0 0 24 24",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ t("path", { d: "m18 6-12 12" }), /* @__PURE__ */ t("path", { d: "m6 6 12 12" })]
					})
				})]
			})
		]
	}) : null;
}
//#endregion
//#region src/components/Toast/toast_context.ts
var Qn = a(null);
function $n() {
	let e = l(Qn);
	if (!e) throw Error("useToast debe usarse dentro de ToastProvider.");
	return e;
}
//#endregion
//#region src/components/Toast/toast_provider.tsx
function er() {
	return typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function tr({ children: e, placement: r = "bottom-center", duration: i = 2800, maxToasts: a = 4 }) {
	let [o, s] = g([]), l = h(/* @__PURE__ */ new Map()), d = c((e) => {
		let t = l.current.get(e);
		t && (window.clearTimeout(t), l.current.delete(e)), s((t) => t.filter((t) => t.id !== e));
	}, []), f = c(() => {
		l.current.forEach((e) => window.clearTimeout(e)), l.current.clear(), s([]);
	}, []), m = c((e) => {
		let t = e.id ?? er(), n = {
			...e,
			id: t,
			variant: e.variant ?? "info",
			closable: e.closable ?? !0
		}, r = l.current.get(t);
		r && window.clearTimeout(r), s((e) => [...e.filter((e) => e.id !== t), n].slice(-a));
		let o = e.duration ?? i;
		if (o > 0) {
			let e = window.setTimeout(() => d(t), o);
			l.current.set(t, e);
		}
		return t;
	}, [
		d,
		i,
		a
	]), v = c((e) => (t) => m({
		...t,
		variant: e
	}), [m]), y = p(() => ({
		show: m,
		info: v("info"),
		success: v("success"),
		warning: v("warning"),
		error: v("error"),
		dismiss: d,
		clear: f
	}), [
		f,
		d,
		m,
		v
	]);
	u(() => {
		let e = l.current;
		return () => {
			e.forEach((e) => window.clearTimeout(e)), e.clear();
		};
	}, []);
	let b = o.length > 0 && typeof document < "u" ? _(/* @__PURE__ */ t("div", {
		className: `bui-toast-viewport bui-toast-viewport-${r}`,
		children: o.map((e) => /* @__PURE__ */ t(Zn, {
			variant: e.variant,
			title: e.title,
			description: e.description,
			icon: e.icon,
			action: e.action,
			closable: e.closable,
			onClose: () => d(e.id)
		}, e.id))
	}), document.body) : null;
	return /* @__PURE__ */ n(Qn.Provider, {
		value: y,
		children: [e, b]
	});
}
//#endregion
//#region src/components/ViewMotion/view_motion_brand.tsx
function nr() {
	return /* @__PURE__ */ t(Ge, {
		className: "bui-view-motion-brand-mark",
		"aria-hidden": "true"
	});
}
//#endregion
//#region src/components/ViewMotion/view_motion.tsx
function rr(...e) {
	return e.filter(Boolean).join(" ");
}
function ir({ brand: e, cardClassName: r, message: i }) {
	return /* @__PURE__ */ n("div", {
		className: rr("bui-view-motion-card", r),
		children: [
			e !== null && /* @__PURE__ */ t("span", {
				className: "bui-view-motion-brand",
				"aria-hidden": "true",
				children: e
			}),
			/* @__PURE__ */ t("span", {
				className: "bui-view-motion-text",
				children: i
			}),
			/* @__PURE__ */ t("span", {
				className: "bui-view-motion-track",
				"aria-hidden": "true",
				children: /* @__PURE__ */ t("span", {})
			})
		]
	});
}
function ar(e) {
	let { visible: r = !1, message: i = "Cargando vista", delay: a = 320, inline: o = !1, showBar: s = !0, brand: c, className: l, cardClassName: u, barClassName: d, style: f, role: p = "status", "aria-live": m = "polite", ...h } = e, g = o || r, _ = c === void 0 ? /* @__PURE__ */ t(nr, {}) : c, v = {
		...f,
		"--bui-view-motion-overlay-delay": `${Math.max(a, 0)}ms`
	};
	return g ? /* @__PURE__ */ n("div", {
		...h,
		className: rr("bui-view-motion", o ? "bui-view-motion-inline" : "bui-view-motion-fixed", l),
		style: v,
		role: p,
		"aria-live": m,
		children: [s && /* @__PURE__ */ t("span", {
			className: rr("bui-view-motion-bar", d),
			"aria-hidden": "true"
		}), /* @__PURE__ */ t("div", {
			className: "bui-view-motion-overlay",
			children: /* @__PURE__ */ t(ir, {
				brand: _,
				cardClassName: u,
				message: i
			})
		})]
	}) : null;
}
//#endregion
//#region src/components/Spinner/spinner.tsx
function or(...e) {
	return e.filter(Boolean).join(" ");
}
function sr({ visible: e = !0, size: r = "md", label: i, inline: a = !1, className: o, role: s = "status", "aria-label": c, ...l }) {
	if (!e) return null;
	let u = i != null;
	return /* @__PURE__ */ n("div", {
		...l,
		className: or("bui-spinner", `bui-spinner-${r}`, a && "bui-spinner-inline", o),
		role: s,
		"aria-label": u ? void 0 : c ?? "Cargando",
		children: [/* @__PURE__ */ t("span", {
			className: "bui-spinner-ring",
			"aria-hidden": "true"
		}), u && /* @__PURE__ */ t("span", {
			className: "bui-spinner-label",
			children: i
		})]
	});
}
//#endregion
//#region src/components/Skeleton/skeleton.tsx
function cr(...e) {
	return e.filter(Boolean).join(" ");
}
function lr(e) {
	return typeof e == "number" ? `${e}px` : e;
}
function ur(e, t) {
	return Math.max(1, Math.floor(e ?? t));
}
function dr({ visible: e = !0, shape: n = "line", width: r, height: i, lines: a = 1, radius: o, gap: s, lastLineWidth: c = "72%", animation: l = "shimmer", tone: u = "default", className: d, style: f, ...p }) {
	if (!e) return null;
	let m = ur(a, 1), h = {
		...f,
		width: lr(r) ?? f?.width,
		height: lr(i) ?? f?.height,
		borderRadius: lr(o) ?? f?.borderRadius
	}, g = cr("bui-skeleton", `bui-skeleton-${n}`, `bui-skeleton-${u}`, l !== "shimmer" && `bui-skeleton-animation-${l}`, d);
	if (m === 1) return /* @__PURE__ */ t("div", {
		...p,
		className: g,
		style: h,
		"aria-hidden": "true"
	});
	let _ = {
		...f,
		gap: lr(s) ?? f?.gap
	};
	return /* @__PURE__ */ t("div", {
		...p,
		className: cr("bui-skeleton-group", d),
		style: _,
		"aria-hidden": "true",
		children: Array.from({ length: m }, (e, n) => /* @__PURE__ */ t("span", {
			className: cr("bui-skeleton", "bui-skeleton-line", `bui-skeleton-${u}`, l !== "shimmer" && `bui-skeleton-animation-${l}`),
			style: {
				width: n === m - 1 ? lr(c) : lr(r),
				height: lr(i),
				borderRadius: lr(o)
			}
		}, n))
	});
}
//#endregion
//#region src/components/Skeleton/skeleton_presets.tsx
function fr(...e) {
	return e.filter(Boolean).join(" ");
}
function pr(e, t) {
	return Math.max(1, Math.floor(e ?? t));
}
function mr({ lines: e = 3, width: n = "100%", lastLineWidth: r = "64%", ...i }) {
	return /* @__PURE__ */ t(dr, {
		...i,
		shape: "line",
		lines: e,
		width: n,
		lastLineWidth: r
	});
}
function hr({ visible: e = !0, avatar: r = !0, media: i = !1, actions: a = !0, lines: o = 3, animation: s = "shimmer", tone: c = "default", className: l, ...u }) {
	return e ? /* @__PURE__ */ n("div", {
		...u,
		className: fr("bui-skeleton-card", l),
		"aria-hidden": "true",
		children: [
			i && /* @__PURE__ */ t(dr, {
				shape: "block",
				height: 132,
				animation: s,
				tone: c
			}),
			/* @__PURE__ */ n("div", {
				className: "bui-skeleton-card-header",
				children: [r && /* @__PURE__ */ t(dr, {
					shape: "circle",
					width: 44,
					height: 44,
					animation: s,
					tone: c
				}), /* @__PURE__ */ n("div", {
					className: "bui-skeleton-card-title",
					children: [/* @__PURE__ */ t(dr, {
						width: "58%",
						animation: s,
						tone: c
					}), /* @__PURE__ */ t(dr, {
						width: "36%",
						height: 10,
						animation: s,
						tone: c
					})]
				})]
			}),
			/* @__PURE__ */ t(mr, {
				lines: o,
				animation: s,
				tone: c
			}),
			a && /* @__PURE__ */ n("div", {
				className: "bui-skeleton-card-actions",
				children: [/* @__PURE__ */ t(dr, {
					width: 104,
					height: 36,
					radius: 8,
					animation: s,
					tone: c
				}), /* @__PURE__ */ t(dr, {
					width: 84,
					height: 36,
					radius: 8,
					animation: s,
					tone: c
				})]
			})
		]
	}) : null;
}
function gr({ visible: e = !0, rows: r = 5, columns: i = 4, showHeader: a = !0, animation: o = "shimmer", tone: s = "default", className: c, ...l }) {
	if (!e) return null;
	let u = pr(r, 5), d = pr(i, 4);
	return /* @__PURE__ */ n("div", {
		...l,
		className: fr("bui-skeleton-table", c),
		"aria-hidden": "true",
		children: [a && /* @__PURE__ */ t("div", {
			className: "bui-skeleton-table-row bui-skeleton-table-head",
			style: { gridTemplateColumns: `repeat(${d}, minmax(0, 1fr))` },
			children: Array.from({ length: d }, (e, n) => /* @__PURE__ */ t(dr, {
				width: n === d - 1 ? "64%" : "78%",
				height: 12,
				animation: o,
				tone: s
			}, n))
		}), Array.from({ length: u }, (e, n) => /* @__PURE__ */ t("div", {
			className: "bui-skeleton-table-row",
			style: { gridTemplateColumns: `repeat(${d}, minmax(0, 1fr))` },
			children: Array.from({ length: d }, (e, n) => /* @__PURE__ */ t(dr, {
				width: n === d - 1 ? "58%" : "86%",
				height: 14,
				animation: o,
				tone: s
			}, n))
		}, n))]
	});
}
//#endregion
//#region src/components/Tables/table.sort.ts
function _r(e, t) {
	return !e || e.key !== t.key ? {
		key: t.key,
		direction: t.initialDirection ?? "asc"
	} : {
		key: t.key,
		direction: e.direction === "asc" ? "desc" : "asc"
	};
}
function vr(e, t) {
	return !e || e.key !== t ? "none" : e.direction === "asc" ? "ascending" : "descending";
}
//#endregion
//#region src/components/Tables/table_utils.ts
function yr(...e) {
	return e.filter(Boolean).join(" ");
}
function br(e, t) {
	let n = ["bui-table"];
	return e && n.push("bui-table--striped"), t && n.push("bui-table--bordered"), n.join(" ");
}
function xr(e) {
	switch (e) {
		case "center": return "bui-table-align-center";
		case "right": return "bui-table-align-right";
		default: return "bui-table-align-left";
	}
}
//#endregion
//#region src/components/Tables/table.tsx
function Sr({ direction: e }) {
	return /* @__PURE__ */ n("svg", {
		"aria-hidden": "true",
		className: yr("bui-table-sort-icon", e === "ascending" ? "bui-table-sort-icon--asc" : e === "descending" ? "bui-table-sort-icon--desc" : "bui-table-sort-icon--none"),
		viewBox: "0 0 16 16",
		children: [/* @__PURE__ */ t("path", {
			className: "bui-table-sort-icon-up",
			d: "m4.5 6 3.5-3.5L11.5 6"
		}), /* @__PURE__ */ t("path", {
			className: "bui-table-sort-icon-down",
			d: "m4.5 10 3.5 3.5 3.5-3.5"
		})]
	});
}
function Cr({ columns: e, data: r, actions: i, actionsHeader: a = "Acciones", actionsWidth: s, actionsClassName: c, className: l, emptyState: u = "No hay registros disponibles.", loading: d = !1, loadingState: f, striped: p, bordered: m, minWidth: h = "1060px", rowKey: g, rowClassName: _, rowProps: v, sort: y, onSortChange: b, tableClassName: x, tableProps: S, ...C }) {
	let w = !!i, T = r.length === 0, E = d, D = Math.max(e.length + +!!w, 1), { className: O, style: k, ...A } = S ?? {};
	return /* @__PURE__ */ t("div", {
		...C,
		className: yr("bui-table-wrapper", l),
		children: /* @__PURE__ */ n("table", {
			...A,
			className: yr("bui-table", br(p, m), x, O),
			style: {
				...k,
				minWidth: h
			},
			children: [/* @__PURE__ */ t("thead", {
				className: "bui-table-head",
				children: /* @__PURE__ */ n("tr", { children: [e.map((e) => {
					let r = xr(e.align), i = e.sortKey ?? e.key, a = vr(y, i), o = _r(y, {
						key: i,
						initialDirection: e.initialSortDirection
					}), s = e.sortLabel ?? (typeof e.header == "string" ? e.header : e.key), c = o.direction === "asc" ? "ascendente" : "descendente";
					return /* @__PURE__ */ t("th", {
						className: yr("bui-table-th", r, e.headerClassName),
						scope: "col",
						style: e.width ? { width: e.width } : void 0,
						"aria-sort": e.sortable ? a : void 0,
						children: e.sortable ? /* @__PURE__ */ n("button", {
							"aria-label": `Ordenar ${s} ${c}`,
							className: "bui-table-sort-button",
							disabled: d || !b,
							onClick: () => b?.(o),
							type: "button",
							children: [/* @__PURE__ */ t("span", { children: e.header }), /* @__PURE__ */ t(Sr, { direction: a })]
						}) : e.header
					}, e.key);
				}), w && /* @__PURE__ */ t("th", {
					className: "bui-table-th bui-table-align-left",
					scope: "col",
					style: s ? { width: s } : void 0,
					children: a
				})] })
			}), /* @__PURE__ */ t("tbody", { children: E ? /* @__PURE__ */ t("tr", { children: /* @__PURE__ */ t("td", {
				colSpan: D,
				className: "bui-table-td",
				children: /* @__PURE__ */ t("div", {
					className: "bui-table-loading",
					children: f ?? /* @__PURE__ */ t(sr, {
						inline: !0,
						size: "sm",
						label: "Cargando registros"
					})
				})
			}) }) : T ? /* @__PURE__ */ t("tr", { children: /* @__PURE__ */ t("td", {
				colSpan: D,
				className: "bui-table-td",
				children: /* @__PURE__ */ t("div", {
					className: "bui-table-empty",
					children: u
				})
			}) }) : r.map((n, r) => {
				let { className: a, ...s } = v?.(n, r) ?? {}, l = typeof _ == "function" ? _(n, r) : _;
				return /* @__PURE__ */ o("tr", {
					...s,
					key: g ? g(n, r) : r,
					className: yr("bui-table-row", l, a)
				}, e.map((e) => /* @__PURE__ */ t("td", {
					className: yr("bui-table-td", xr(e.align), e.className),
					children: e.render(n, r)
				}, e.key)), w && /* @__PURE__ */ t("td", {
					className: "bui-table-td",
					children: /* @__PURE__ */ t("div", {
						className: yr("bui-table-actions-cell", c),
						children: i(n, r)
					})
				}));
			}) })]
		})
	});
}
//#endregion
//#region src/components/Tables/table.empty.tsx
function wr({ colSpan: e, children: n }) {
	return /* @__PURE__ */ t("tr", { children: /* @__PURE__ */ t("td", {
		colSpan: e,
		className: "bui-table-td",
		children: /* @__PURE__ */ t("div", {
			className: "bui-table-empty",
			children: n ?? "Sin datos disponibles"
		})
	}) });
}
//#endregion
//#region src/components/Tables/table_row_actions.tsx
var Tr = "bui-table-row-actions__icon--active";
function Er({ children: e, className: n, label: r = "Acciones de fila", onAnimationEnd: i, onClick: a, ...o }) {
	let s = (e) => {
		let t = e.target, n = t instanceof Element ? t.closest(".bui-icon-button") : null, r = n?.querySelector(".bui-icon-button__icon"), i = typeof window < "u" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		n && !n.disabled && r && !i && (r.classList.remove(Tr), r.offsetWidth, r.classList.add(Tr)), a?.(e);
	}, c = (e) => {
		let t = e.target;
		t instanceof HTMLElement && t.classList.contains(Tr) && t.classList.remove(Tr), i?.(e);
	};
	return /* @__PURE__ */ t("div", {
		...o,
		role: "group",
		"aria-label": r,
		className: ["bui-table-row-actions", n].filter(Boolean).join(" "),
		onAnimationEnd: c,
		onClick: s,
		children: e
	});
}
//#endregion
//#region src/components/Toolbar/toolbar.tsx
function Dr(...e) {
	return e.filter(Boolean).join(" ");
}
function Or({ children: e, className: n, compact: r = !1, ...i }) {
	return /* @__PURE__ */ t("div", {
		...i,
		className: Dr("bui-toolbar", r && "bui-toolbar-compact", n),
		children: e
	});
}
//#endregion
//#region src/components/Toolbar/filter-toolbar.tsx
function kr({ children: e, active: i, onClear: a, clearLabel: o = "Limpiar filtros", actions: s, primaryCount: c = 4, className: l, ...f }) {
	let p = h(null), m = h(null), [_, v] = g(4), [y, b] = g(!1), x = d(), S = r.toArray(e), C = Math.max(1, Math.min(c, _)), w = Math.max(0, S.length - C);
	u(() => {
		let e = m.current;
		if (!e) return;
		let t = () => {
			let t = e.getBoundingClientRect().width;
			v(t >= 1100 ? 4 : t >= 840 ? 3 : t >= 560 ? 2 : 1);
		};
		t();
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	function T() {
		p.current?.querySelector("input:not(:disabled), button:not(:disabled), select:not(:disabled)")?.focus(), a();
	}
	return /* @__PURE__ */ t("div", {
		ref: m,
		className: "bui-filter-container",
		children: /* @__PURE__ */ n(Or, {
			...f,
			role: f.role ?? "group",
			"aria-label": f["aria-label"] ?? "Filtros",
			className: `bui-filter-toolbar ${l ?? ""}`,
			"data-active": i,
			children: [
				/* @__PURE__ */ t("div", {
					ref: p,
					id: x,
					className: "bui-filter-toolbar__fields",
					"data-field-count": Math.min(S.length, C),
					style: { "--filter-count": Math.min(S.length, C) },
					children: S.map((e, n) => /* @__PURE__ */ t("div", {
						className: "bui-filter-toolbar__field",
						"data-additional": n >= C,
						"data-extra-start": n === C,
						hidden: n >= C && !y,
						children: e
					}, typeof e == "object" && e && "key" in e ? e.key : n))
				}),
				/* @__PURE__ */ n("div", {
					className: "bui-filter-toolbar__actions",
					children: [w > 0 && /* @__PURE__ */ t(Y, {
						type: "button",
						variant: "ghost",
						className: "bui-filter-toolbar__toggle",
						"aria-label": y ? "Menos filtros" : "Más filtros",
						title: y ? "Menos filtros" : "Más filtros",
						"aria-expanded": y,
						"aria-controls": x,
						onClick: () => b(!y),
						children: /* @__PURE__ */ t(Jt, {
							size: 22,
							"aria-hidden": "true"
						})
					}), s]
				}),
				/* @__PURE__ */ t("div", {
					className: "bui-filter-toolbar__reset",
					"aria-hidden": !i,
					inert: !i,
					children: /* @__PURE__ */ t(Y, {
						type: "button",
						variant: "ghost",
						onClick: T,
						tabIndex: i ? 0 : -1,
						"aria-label": o,
						title: o,
						children: /* @__PURE__ */ t(Ke, { size: 22 })
					})
				})
			]
		})
	});
}
//#endregion
//#region src/components/Pagination/pagination_utils.ts
function Ar(e, t) {
	return Number.isFinite(e) ? Math.min(Math.max(Math.trunc(e), 1), t) : 1;
}
function jr(e, t) {
	return e <= 0 || t <= 0 ? 1 : Math.max(1, Math.ceil(e / t));
}
function Mr(e, t, n) {
	if (n <= 0 || t <= 0) return {
		start: 0,
		end: 0
	};
	let r = Ar(e, jr(n, t));
	return {
		start: (r - 1) * t + 1,
		end: Math.min(r * t, n)
	};
}
function Nr(e, t) {
	let n = Ar(e, t);
	if (t <= 5) return Array.from({ length: t }, (e, t) => t + 1);
	let r = Array.from({ length: t }, (e, t) => t + 1).filter((e) => Math.abs(e - n) <= 2 || e === 1 || e === t);
	return r.reduce((e, t, n) => (n > 0 && t - r[n - 1] > 1 && e.push("gap"), e.push(t), e), []);
}
function Pr(e, t) {
	let n = Array.from(new Set([...e ?? [
		10,
		30,
		50
	], t])).filter((e) => Number.isFinite(e) && e > 0).map((e) => Math.trunc(e)).sort((e, t) => e - t);
	return n.length > 0 ? n : [t];
}
//#endregion
//#region src/components/Pagination/pagination.tsx
function Fr(...e) {
	return e.filter(Boolean).join(" ");
}
function Ir({ page: e, pageSize: r, total: i, pageSizeOptions: a, onPageChange: o, onPageSizeChange: s, emptyState: c = "Sin registros disponibles.", label: l = "Paginación de registros", className: u, ...d }) {
	let f = jr(i, r), p = Ar(e, f), { start: m, end: h } = Mr(p, r, i), g = Nr(p, f), _ = Pr(a, r), v = i > 0, y = (e) => {
		let t = Ar(e, f);
		t !== p && o(t);
	};
	return /* @__PURE__ */ n("nav", {
		...d,
		className: Fr("bui-pagination", u),
		"aria-label": l,
		children: [
			/* @__PURE__ */ t("div", {
				className: "bui-pagination-summary",
				"aria-live": "polite",
				children: v ? `Mostrando ${m}-${h} de ${i} registros` : c
			}),
			/* @__PURE__ */ n("label", {
				className: "bui-pagination-size",
				children: [/* @__PURE__ */ t("span", { children: "Registros por página" }), /* @__PURE__ */ t("select", {
					className: "bui-pagination-select",
					value: r,
					onChange: (e) => s?.(Number(e.target.value)),
					"aria-label": "Registros por página",
					disabled: !s || !v,
					children: _.map((e) => /* @__PURE__ */ t("option", {
						value: e,
						children: e
					}, e))
				})]
			}),
			/* @__PURE__ */ n("div", {
				className: "bui-pagination-pages",
				"aria-label": "Cambiar página",
				children: [
					/* @__PURE__ */ t("button", {
						className: "bui-pagination-button",
						type: "button",
						onClick: () => y(p - 1),
						disabled: !v || p <= 1,
						children: "Anterior"
					}),
					g.map((e, n) => e === "gap" ? /* @__PURE__ */ t("span", {
						className: "bui-pagination-gap",
						"aria-hidden": "true",
						children: "..."
					}, `gap-${n}`) : /* @__PURE__ */ t("button", {
						className: Fr("bui-pagination-button", e === p && "bui-pagination-button-active"),
						type: "button",
						onClick: () => y(e),
						"aria-current": e === p ? "page" : void 0,
						disabled: !v,
						children: e
					}, e)),
					/* @__PURE__ */ t("button", {
						className: "bui-pagination-button",
						type: "button",
						onClick: () => y(p + 1),
						disabled: !v || p >= f,
						children: "Siguiente"
					})
				]
			})
		]
	});
}
//#endregion
//#region src/components/Avatar/avatar-const.ts
var Lr = {
	xs: "w-6 h-6 text-[10px]",
	sm: "w-8 h-8 text-xs",
	md: "w-10 h-10 text-sm",
	lg: "w-12 h-12 text-base",
	xl: "w-16 h-16 text-lg",
	"2xl": "w-20 h-20 text-xl"
}, Rr = {
	xs: "w-1.5 h-1.5",
	sm: "w-2 h-2",
	md: "w-2.5 h-2.5",
	lg: "w-3 h-3",
	xl: "w-3.5 h-3.5",
	"2xl": "w-4 h-4"
}, zr = {
	circle: "rounded-full",
	square: "rounded-none",
	rounded: "rounded-xl",
	triangle: "rounded-none [clip-path:polygon(50%_0%,100%_100%,0%_100%)]",
	diamond: "rounded-none [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]",
	hexagon: "rounded-none [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]",
	octagon: "rounded-none [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)]"
}, Br = {
	online: "bg-emerald-500",
	busy: "bg-red-500",
	away: "bg-amber-400",
	offline: "bg-zinc-400",
	none: "hidden"
}, Vr = {
	tight: "-space-x-4",
	normal: "-space-x-3",
	loose: "-space-x-1"
}, Hr = {
	size: "md",
	shape: "circle",
	status: "none",
	maxBadge: 99
};
//#endregion
//#region src/components/Avatar/avatar.utils.ts
function Ur(e) {
	let t = e.trim().split(/\s+/).filter(Boolean);
	return t.length === 0 ? "?" : t.length === 1 ? t[0].charAt(0).toUpperCase() : (t[0].charAt(0) + t[t.length - 1].charAt(0)).toUpperCase();
}
var Wr = [
	"triangle",
	"diamond",
	"hexagon",
	"octagon"
];
function Gr(e) {
	return Wr.includes(e);
}
function Kr(e, t = 99) {
	return e > t ? `${t}+` : String(e);
}
function $(...e) {
	return e.filter(Boolean).join(" ");
}
//#endregion
//#region src/components/Avatar/avatar-badge.tsx
var qr = {
	online: "Online",
	offline: "Offline",
	busy: "Do not disturb",
	away: "Away",
	none: ""
}, Jr = ({ count: e, max: n = 99, dot: r = !1, status: i, className: a }) => i && i !== "none" ? /* @__PURE__ */ t("span", {
	role: "img",
	"aria-label": qr[i],
	className: $("bui-avatar-status", Br[i], a)
}) : r ? /* @__PURE__ */ t("span", {
	"aria-hidden": "true",
	className: $("bui-avatar-dot", a)
}) : typeof e == "number" ? /* @__PURE__ */ t("span", {
	"aria-label": `${e} notifications`,
	className: $("bui-avatar-count", a),
	children: Kr(e, n)
}) : null;
Jr.displayName = "Avatar.Badge";
//#endregion
//#region src/components/Avatar/avatar-menu.tsx
var Yr = ({ items: e, className: n }) => /* @__PURE__ */ t("ul", {
	role: "menu",
	className: $("bui-avatar-submenu", n),
	children: e.map((e) => /* @__PURE__ */ t(Xr, { item: e }, e.id))
}), Xr = ({ item: e }) => {
	let [r, i] = g(!1), a = Array.isArray(e.subItems) && e.subItems.length > 0;
	return /* @__PURE__ */ n("li", {
		role: "none",
		className: "bui-avatar-menu-item-wrap",
		onMouseEnter: () => a && i(!0),
		onMouseLeave: () => i(!1),
		children: [/* @__PURE__ */ n("button", {
			role: "menuitem",
			disabled: e.disabled,
			onClick: e.onClick,
			onKeyDown: (e) => {
				e.key === "ArrowRight" && a && i(!0), e.key === "ArrowLeft" && i(!1);
			},
			"aria-haspopup": a ? "menu" : void 0,
			"aria-expanded": a ? r : void 0,
			className: $("bui-avatar-menu-item", e.danger && "bui-avatar-menu-item-danger"),
			children: [
				e.icon && /* @__PURE__ */ t("span", {
					className: "bui-avatar-menu-icon",
					"aria-hidden": "true",
					children: e.icon
				}),
				/* @__PURE__ */ t("span", {
					className: "bui-avatar-menu-label",
					children: e.label
				}),
				e.shortcut && /* @__PURE__ */ t("kbd", {
					className: "bui-avatar-menu-shortcut",
					children: e.shortcut
				}),
				a && /* @__PURE__ */ t("svg", {
					className: "bui-avatar-menu-arrow",
					viewBox: "0 0 16 16",
					fill: "currentColor",
					"aria-hidden": "true",
					children: /* @__PURE__ */ t("path", { d: "M6 3l5 5-5 5V3z" })
				})
			]
		}), a && r && /* @__PURE__ */ t(Yr, { items: e.subItems })]
	});
}, Zr = ({ items: e, isOpen: n, onClose: r, className: i }) => {
	let a = h(null);
	return u(() => {
		if (!n) return;
		let e = (e) => {
			a.current && !a.current.contains(e.target) && r();
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [n, r]), u(() => {
		if (!n) return;
		let e = (e) => {
			e.key === "Escape" && r();
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [n, r]), n ? /* @__PURE__ */ t("div", {
		ref: a,
		className: "bui-avatar-menu-anchor",
		children: /* @__PURE__ */ t("ul", {
			role: "menu",
			className: $("bui-avatar-menu", i),
			children: e.map((e) => /* @__PURE__ */ t(Xr, { item: e }, e.id))
		})
	}) : null;
};
Zr.displayName = "Avatar.Menu";
//#endregion
//#region src/components/Avatar/avatar.tsx
var Qr = ({ className: e }) => /* @__PURE__ */ t("svg", {
	viewBox: "0 0 24 24",
	fill: "currentColor",
	"aria-hidden": "true",
	className: $("bui-avatar-default-icon", e),
	children: /* @__PURE__ */ t("path", { d: "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4Z" })
}), $r = ({ src: e, alt: r, icon: i, initials: a, size: o = Hr.size, shape: s = Hr.shape, status: l = Hr.status, badge: u, menuItems: d, onClick: f, onKeyDown: p, className: m, innerClassName: h, statusClassName: _, badgeClassName: v, disabled: y = !1, tabIndex: b, style: x }) => {
	let [S, C] = g(!1), [w, T] = g(!1), E = Array.isArray(d) && d.length > 0, D = !!f || E, O = b ?? (D ? 0 : void 0), k = a ?? Ur(r), A = !!e && !S, j = c(() => {
		C(!0);
	}, []), M = c((e) => {
		y || (E && T((e) => !e), f?.(e));
	}, [
		y,
		E,
		f
	]), N = c((e) => {
		y || ((e.key === "Enter" || e.key === " ") && (e.preventDefault(), E && T((e) => !e)), e.key === "Escape" && w && T(!1), p?.(e));
	}, [
		y,
		E,
		w,
		p
	]), P = A ? /* @__PURE__ */ t("img", {
		src: e,
		alt: r,
		onError: j,
		draggable: !1,
		className: $("bui-avatar-media", Gr(s) ? "" : zr[s], h)
	}) : i ? /* @__PURE__ */ t("span", {
		"aria-hidden": "true",
		className: $("bui-avatar-inner", h),
		children: i
	}) : k ? /* @__PURE__ */ t("span", {
		"aria-hidden": "true",
		className: $("bui-avatar-inner bui-avatar-initials", h),
		children: k
	}) : /* @__PURE__ */ t(Qr, { className: h }), F = $("bui-avatar-root", Lr[o], zr[s], m), I = $("bui-avatar-interactive", y && "bui-avatar-disabled"), L = Rr[o];
	return D ? /* @__PURE__ */ n("div", {
		className: "bui-avatar-wrap",
		style: x,
		children: [
			/* @__PURE__ */ t("button", {
				type: "button",
				"aria-label": E ? `${r} — open menu` : r,
				"aria-haspopup": E ? "menu" : void 0,
				"aria-expanded": E ? w : void 0,
				"aria-disabled": y,
				tabIndex: O,
				onClick: M,
				onKeyDown: N,
				className: $(F, I),
				children: P
			}),
			l !== "none" && /* @__PURE__ */ t(Jr, {
				status: l,
				className: $(L, _)
			}),
			u && /* @__PURE__ */ t(Jr, {
				...u,
				className: $(u.className, v)
			}),
			E && /* @__PURE__ */ t(Zr, {
				items: d,
				isOpen: w,
				onClose: () => T(!1)
			})
		]
	}) : /* @__PURE__ */ n("div", {
		role: "img",
		"aria-label": r,
		className: F,
		style: x,
		children: [
			P,
			l !== "none" && /* @__PURE__ */ t(Jr, {
				status: l,
				className: $(L, _)
			}),
			u && /* @__PURE__ */ t(Jr, {
				...u,
				className: $(u.className, v)
			})
		]
	});
};
$r.displayName = "Avatar";
//#endregion
//#region src/components/Avatar/avatar-group.tsx
var ei = ({ avatars: e, max: r = 5, size: i = "md", shape: a = "circle", spacing: o = "normal", surplusClassName: s, className: c }) => {
	let l = e.slice(0, r), u = e.length - r;
	return /* @__PURE__ */ n("div", {
		role: "group",
		"aria-label": `${e.length} avatars`,
		className: $("bui-avatar-group", Vr[o], c),
		children: [l.map((e, n) => /* @__PURE__ */ t("div", {
			className: "bui-avatar-group-item rounded-full",
			style: { zIndex: l.length - n },
			children: /* @__PURE__ */ t($r, {
				...e,
				size: i,
				shape: a
			})
		}, e.alt + n)), u > 0 && /* @__PURE__ */ n("div", {
			"aria-label": `${u} more`,
			className: $("bui-avatar-surplus", Lr[i], zr[a], s),
			children: ["+", u]
		})]
	});
};
ei.displayName = "Avatar.Group";
//#endregion
//#region src/components/Profile/profile_utils.ts
function ti(e) {
	if (e.initials) return e.initials;
	let t = e.name.trim().split(/\s+/).filter(Boolean);
	return t.length ? t.length === 1 ? t[0].slice(0, 2).toUpperCase() : `${t[0][0]}${t[t.length - 1][0]}`.toUpperCase() : "US";
}
function ni(e) {
	if (e.initials) return e.initials;
	let t = e.name.trim().split(/\s+/).filter(Boolean), n = t[0]?.toLowerCase() === "finca" ? t.slice(1) : t;
	return n.length ? n.slice(0, 2).map((e) => e[0]).join("").toUpperCase() : "FI";
}
function ri(e, t) {
	return e.id ?? `${e.name}-${t}`;
}
function ii(e, t, n) {
	return e.length ? Array.from({ length: Math.min(n, e.length) }, (n, r) => e[(t + r) % e.length]) : [];
}
//#endregion
//#region src/components/Profile/profile_farm_carousel.tsx
function ai(...e) {
	return e.filter(Boolean).join(" ");
}
function oi({ ariaLabel: e = "Fincas asignadas", autoPlay: r = !0, autoPlayInterval: i, className: a, farms: o, variant: s = "full", visibleCount: l, ...d }) {
	let f = Math.max(1, l ?? 3), m = i ?? (s === "compact" ? 1800 : 2400), [h, _] = g(0), [v, y] = g(!1), b = o.length > f, x = p(() => ii(o, h, f), [
		h,
		o,
		f
	]), S = c(() => {
		o.length && _((e) => (e - 1 + o.length) % o.length);
	}, [o.length]), C = c(() => {
		o.length && _((e) => (e + 1) % o.length);
	}, [o.length]), w = (e) => {
		e.key === "ArrowLeft" && (e.preventDefault(), S()), e.key === "ArrowRight" && (e.preventDefault(), C());
	};
	return u(() => {
		if (!r || v || !b) return;
		let e = window.setInterval(C, m);
		return () => window.clearInterval(e);
	}, [
		r,
		b,
		C,
		v,
		m
	]), /* @__PURE__ */ n("div", {
		...d,
		"aria-label": e,
		className: ai("bui-profile-farm-carousel", `bui-profile-farm-carousel-${s}`, a),
		onBlur: (e) => {
			e.currentTarget.contains(e.relatedTarget) || y(!1);
		},
		onFocus: () => y(!0),
		onKeyDown: w,
		onMouseEnter: () => y(!0),
		onMouseLeave: () => y(!1),
		role: "group",
		tabIndex: 0,
		children: [
			/* @__PURE__ */ t("button", {
				"aria-label": "Ver fincas anteriores",
				className: "bui-profile-farm-control",
				disabled: !b,
				onClick: S,
				type: "button",
				children: /* @__PURE__ */ t($e, { size: 16 })
			}),
			/* @__PURE__ */ t("div", {
				className: "bui-profile-farm-viewport",
				"aria-live": "polite",
				children: o.length ? /* @__PURE__ */ t("div", {
					className: "bui-profile-farm-track",
					children: x.map((e, r) => /* @__PURE__ */ n("article", {
						className: "bui-profile-farm-card",
						children: [/* @__PURE__ */ t("span", {
							className: "bui-profile-farm-monogram",
							"aria-hidden": "true",
							children: ni(e)
						}), s === "full" && /* @__PURE__ */ t("strong", { children: e.name })]
					}, ri(e, r)))
				}) : /* @__PURE__ */ t("div", {
					className: "bui-profile-farm-empty",
					children: "Sin fincas asignadas"
				})
			}),
			/* @__PURE__ */ t("button", {
				"aria-label": "Ver fincas siguientes",
				className: "bui-profile-farm-control",
				disabled: !b,
				onClick: C,
				type: "button",
				children: /* @__PURE__ */ t(et, { size: 16 })
			})
		]
	});
}
//#endregion
//#region src/components/Profile/profile_dialog.tsx
function si(...e) {
	return e.filter(Boolean).join(" ");
}
function ci({ autoPlay: e, autoPlayInterval: r, className: i, closeLabel: a = "Cerrar", farms: o, onClose: s, open: c, sections: l = [], title: f = "Perfil de usuario", user: p, ...m }) {
	let h = d(), g = ti(p);
	return u(() => {
		if (!c) return;
		let e = (e) => {
			e.key === "Escape" && s();
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [s, c]), c ? /* @__PURE__ */ n("div", {
		className: "bui-profile-dialog-layer",
		children: [/* @__PURE__ */ t("div", {
			className: "bui-profile-dialog-backdrop",
			onClick: s
		}), /* @__PURE__ */ n("div", {
			...m,
			"aria-labelledby": h,
			"aria-modal": "true",
			className: si("bui-profile-dialog", i),
			role: "dialog",
			children: [
				/* @__PURE__ */ n("header", {
					className: "bui-profile-dialog-header",
					children: [/* @__PURE__ */ t("h2", {
						id: h,
						children: f
					}), /* @__PURE__ */ t("button", {
						className: "bui-profile-dialog-close",
						onClick: s,
						type: "button",
						"aria-label": "Cerrar perfil",
						children: /* @__PURE__ */ t(nt, { size: 20 })
					})]
				}),
				/* @__PURE__ */ n("div", {
					className: "bui-profile-dialog-body",
					children: [
						/* @__PURE__ */ n("section", {
							className: "bui-profile-overview",
							"aria-label": "Identidad y contacto",
							children: [/* @__PURE__ */ n("div", {
								className: "bui-profile-full-identity",
								children: [/* @__PURE__ */ t($r, {
									alt: p.name,
									initials: g,
									size: "xl"
								}), /* @__PURE__ */ n("div", { children: [/* @__PURE__ */ t("strong", { children: p.name }), p.role && /* @__PURE__ */ t("span", { children: p.role })] })]
							}), /* @__PURE__ */ n("div", {
								className: "bui-profile-contact-grid",
								"aria-label": "Datos del usuario",
								children: [
									p.username && /* @__PURE__ */ n("div", {
										className: "bui-profile-contact-item",
										children: [/* @__PURE__ */ t("span", { children: "Usuario" }), /* @__PURE__ */ t("strong", { children: p.username })]
									}),
									/* @__PURE__ */ n("div", {
										className: "bui-profile-contact-item",
										children: [/* @__PURE__ */ t("span", { children: "Identificación" }), /* @__PURE__ */ t("strong", { children: p.document ?? "Sin registro" })]
									}),
									/* @__PURE__ */ n("div", {
										className: "bui-profile-contact-item",
										children: [/* @__PURE__ */ t("span", { children: "Teléfono" }), /* @__PURE__ */ t("strong", { children: p.phone ?? "Sin registro" })]
									}),
									/* @__PURE__ */ n("div", {
										className: "bui-profile-contact-item",
										children: [/* @__PURE__ */ t("span", { children: "Correo principal" }), /* @__PURE__ */ t("strong", { children: p.email ?? "Sin registro" })]
									}),
									p.alternativeEmail && /* @__PURE__ */ n("div", {
										className: "bui-profile-contact-item",
										children: [/* @__PURE__ */ t("span", { children: "Correo alternativo" }), /* @__PURE__ */ t("strong", { children: p.alternativeEmail })]
									})
								]
							})]
						}),
						l.map((e, r) => /* @__PURE__ */ n("section", {
							className: "bui-profile-section",
							children: [/* @__PURE__ */ n("div", {
								className: "bui-profile-section-heading",
								children: [e.eyebrow && /* @__PURE__ */ t("span", { children: e.eyebrow }), /* @__PURE__ */ t("h3", { children: e.title })]
							}), /* @__PURE__ */ t("dl", {
								className: "bui-profile-section-grid",
								children: e.details.map((e, r) => /* @__PURE__ */ n("div", {
									className: "bui-profile-section-item",
									children: [/* @__PURE__ */ t("dt", { children: e.label }), /* @__PURE__ */ t("dd", { children: e.value })]
								}, e.id ?? `${String(e.label)}-${r}`))
							})]
						}, e.id ?? `${String(e.title)}-${r}`)),
						/* @__PURE__ */ n("section", {
							className: "bui-profile-farms-section",
							"aria-labelledby": "bui-profile-farms-title",
							children: [/* @__PURE__ */ n("div", {
								className: "bui-profile-farms-heading",
								children: [/* @__PURE__ */ n("div", { children: [/* @__PURE__ */ t("span", { children: "Asignacion operativa" }), /* @__PURE__ */ t("h3", {
									id: "bui-profile-farms-title",
									children: "Fincas asignadas"
								})] }), /* @__PURE__ */ n("strong", { children: [o.length, " fincas"] })]
							}), /* @__PURE__ */ t(oi, {
								autoPlay: e,
								autoPlayInterval: r,
								farms: o,
								variant: "full"
							})]
						})
					]
				}),
				/* @__PURE__ */ t("footer", {
					className: "bui-profile-dialog-footer",
					children: /* @__PURE__ */ t(J, {
						variant: "outlined",
						onClick: s,
						children: a
					})
				})
			]
		})]
	}) : null;
}
//#endregion
//#region src/components/Profile/profile_menu_farms.tsx
function li({ farms: e, autoPlay: n = !0, autoPlayInterval: r = 3200 }) {
	let i = e.length > 3, [a, o] = g(+!!i), [s, c] = g(!0), [l, d] = g(!1), [f, p] = g(0), m = h(null), _ = h(null), v = h(null), y = i ? [
		e[e.length - 1],
		...e,
		...e.slice(0, 3)
	] : e;
	u(() => {
		if (!i || !n || l) return;
		let t = window.setInterval(() => {
			document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches || _.current?.matches(":hover, :focus-within") || m.current !== null || o((t) => Math.min(t + 1, e.length + 1));
		}, Number.isFinite(r) ? Math.max(1600, r) : 3200);
		return () => window.clearInterval(t);
	}, [
		i,
		n,
		r,
		l,
		e.length
	]), u(() => () => {
		v.current !== null && cancelAnimationFrame(v.current);
	}, []);
	let b = (t) => o((n) => window.matchMedia("(prefers-reduced-motion: reduce)").matches ? (n - 1 + t + e.length) % e.length + 1 : Math.max(0, Math.min(n + t, e.length + 1))), x = () => {
		a > 0 && a <= e.length || (c(!1), o(a === 0 ? e.length : 1), v.current = requestAnimationFrame(() => {
			v.current = requestAnimationFrame(() => c(!0));
		}));
	};
	return e.length ? /* @__PURE__ */ t("div", {
		ref: _,
		className: `bui-profile-menu-farms${i ? " is-draggable" : ""}`,
		role: "group",
		"aria-label": i ? "Fincas asignadas. Use las flechas para recorrerlas" : "Fincas asignadas",
		tabIndex: i ? 0 : void 0,
		onMouseEnter: () => d(!0),
		onMouseLeave: () => {
			m.current === null && d(!1);
		},
		onFocus: () => d(!0),
		onBlur: (e) => {
			e.currentTarget.contains(e.relatedTarget) || d(!1);
		},
		onKeyDown: (e) => {
			i && (e.key === "ArrowRight" || e.key === "ArrowLeft") && (e.preventDefault(), b(e.key === "ArrowRight" ? 1 : -1));
		},
		onPointerDown: (t) => {
			!i || a === 0 || a > e.length || t.pointerType === "mouse" && t.button !== 0 || (m.current = t.clientX, t.currentTarget.setPointerCapture(t.pointerId), d(!0));
		},
		onPointerMove: (e) => {
			if (m.current !== null) {
				let t = (e.currentTarget.clientWidth + 4) / 3;
				p(Math.max(-t, Math.min(t, e.clientX - m.current)));
			}
		},
		onPointerUp: (e) => {
			if (m.current === null) return;
			let t = e.clientX - m.current;
			Math.abs(t) > 25 && b(t < 0 ? 1 : -1), m.current = null, p(0), e.pointerType !== "mouse" && d(!1);
		},
		onPointerCancel: () => {
			m.current = null, p(0), d(!1);
		},
		onLostPointerCapture: () => {
			m.current = null, p(0), d(!1);
		},
		children: /* @__PURE__ */ t("div", {
			className: "bui-profile-menu-farms-track",
			onTransitionEnd: (e) => {
				e.target === e.currentTarget && e.propertyName === "transform" && x();
			},
			style: {
				transform: `translateX(calc(${a} * (-100% / 3 - 4px / 3) + ${f}px))`,
				transition: s && f === 0 ? void 0 : "none"
			},
			children: y.map((n, r) => /* @__PURE__ */ t("span", {
				className: "bui-profile-menu-farm",
				"aria-hidden": i && (r === 0 || r > e.length) ? !0 : void 0,
				children: n.name
			}, `${r}-${n.id ?? n.name}`))
		})
	}) : /* @__PURE__ */ t("p", {
		className: "bui-profile-menu-farms-empty",
		children: "Sin fincas asignadas"
	});
}
//#endregion
//#region src/components/Profile/profile_menu.tsx
function ui(...e) {
	return e.filter(Boolean).join(" ");
}
function di({ autoPlay: e, autoPlayInterval: r, className: i, company: a, defaultOpen: o = !1, farms: s, logoutLabel: l = "Cerrar sesión", onLogout: p, onOpenChange: m, onViewProfile: _, open: v, user: y, viewProfileLabel: b = "Ver perfil", ...x }) {
	let S = h(null), C = h(null), w = h(null), T = d(), [E, D] = g(o), O = v ?? E, k = ti(y), A = c((e) => {
		v === void 0 && D(e), m?.(e);
	}, [m, v]);
	return f(() => {
		if (!O) return;
		let e = () => {
			let e = C.current, t = w.current;
			if (!e || !t) return;
			let n = e.getBoundingClientRect(), r = window.innerHeight - n.bottom - 22, i = n.top - 22, a = t.scrollHeight > r && i > r, o = Math.max(12, Math.min(n.right - t.offsetWidth, window.innerWidth - t.offsetWidth - 12));
			t.dataset.side = a ? "top" : "bottom", Object.assign(t.style, {
				position: "fixed",
				left: `${o}px`,
				right: "auto",
				top: a ? "auto" : `${n.bottom + 10}px`,
				bottom: a ? `${window.innerHeight - n.top + 10}px` : "auto",
				maxHeight: `${Math.max(0, a ? i : r)}px`
			}), t.style.setProperty("--profile-anchor", `${Math.max(16, Math.min(t.offsetWidth - 16, n.left + n.width / 2 - o))}px`);
		};
		return e(), w.current?.focus({ preventScroll: !0 }), window.addEventListener("resize", e), window.addEventListener("scroll", e, !0), () => {
			window.removeEventListener("resize", e), window.removeEventListener("scroll", e, !0);
		};
	}, [O]), u(() => {
		if (!O) return;
		let e = (e) => {
			S.current?.contains(e.target) || A(!1);
		}, t = (e) => {
			S.current?.contains(e.target) || A(!1);
		}, n = (e) => {
			e.key === "Escape" && (A(!1), C.current?.focus());
		};
		return document.addEventListener("pointerdown", e), document.addEventListener("focusin", t), document.addEventListener("keydown", n), () => {
			document.removeEventListener("pointerdown", e), document.removeEventListener("focusin", t), document.removeEventListener("keydown", n);
		};
	}, [O, A]), /* @__PURE__ */ n("div", {
		...x,
		className: ui("bui-profile-menu", O && "bui-profile-menu-open", i),
		ref: S,
		children: [/* @__PURE__ */ n("button", {
			"aria-expanded": O,
			"aria-controls": O ? T : void 0,
			"aria-haspopup": "dialog",
			"aria-label": "Abrir menú de perfil",
			className: "bui-profile-trigger",
			onClick: () => A(!O),
			ref: C,
			type: "button",
			children: [
				/* @__PURE__ */ t($r, {
					alt: y.name,
					initials: k,
					size: "sm"
				}),
				/* @__PURE__ */ t("span", {
					className: "bui-profile-trigger-name",
					title: y.name,
					children: y.name
				}),
				/* @__PURE__ */ t(Qe, {
					className: "bui-profile-trigger-chevron",
					size: 16
				})
			]
		}), O && /* @__PURE__ */ n("div", {
			className: "bui-profile-panel",
			id: T,
			role: "dialog",
			"aria-label": "Menú de perfil",
			ref: w,
			tabIndex: -1,
			children: [/* @__PURE__ */ n("div", {
				className: "bui-profile-menu-content",
				children: [/* @__PURE__ */ n("section", {
					className: "bui-profile-summary",
					children: [/* @__PURE__ */ n("div", {
						className: "bui-profile-summary-identity",
						children: [/* @__PURE__ */ t($r, {
							alt: y.name,
							initials: k,
							size: "md"
						}), /* @__PURE__ */ n("div", { children: [/* @__PURE__ */ t("strong", {
							className: "bui-profile-user",
							children: y.name
						}), y.role && /* @__PURE__ */ t("span", {
							className: "bui-profile-role",
							children: y.role
						})] })]
					}), y.document && /* @__PURE__ */ n("div", {
						className: "bui-profile-summary-meta",
						children: [/* @__PURE__ */ t("span", { children: "Identificación" }), /* @__PURE__ */ t("strong", { children: y.document })]
					})]
				}), /* @__PURE__ */ n("section", {
					className: "bui-profile-assignment-preview",
					children: [
						a != null && /* @__PURE__ */ n("div", {
							className: "bui-profile-company",
							children: [/* @__PURE__ */ t("strong", { children: "Compañía activa" }), /* @__PURE__ */ t("span", { children: a })]
						}),
						/* @__PURE__ */ n("div", {
							className: "bui-profile-assignment-heading",
							children: [/* @__PURE__ */ t("strong", { children: "Fincas asignadas" }), /* @__PURE__ */ t(X, {
								preset: "info",
								"aria-label": `${s.length} fincas asignadas`,
								children: s.length
							})]
						}),
						/* @__PURE__ */ t(li, {
							autoPlay: e,
							autoPlayInterval: r,
							farms: s
						}, s.length)
					]
				})]
			}), /* @__PURE__ */ n("div", {
				className: "bui-profile-menu-list",
				children: [/* @__PURE__ */ n("button", {
					className: "bui-profile-menu-item",
					onClick: () => {
						A(!1), _?.();
					},
					type: "button",
					children: [/* @__PURE__ */ t(en, { size: 18 }), /* @__PURE__ */ t("span", { children: b })]
				}), /* @__PURE__ */ n("button", {
					className: "bui-profile-menu-item bui-profile-menu-item-danger",
					onClick: () => {
						A(!1), p?.();
					},
					type: "button",
					children: [/* @__PURE__ */ t(qe, {
						className: "bui-profile-logout-icon",
						size: 18
					}), /* @__PURE__ */ t("span", { children: l })]
				})]
			})]
		})]
	});
}
var fi = (e) => {
	let t = {}, n = e.colorBorder ?? "var(--color-primary-500)", r = e.widthBorder ? `${e.widthBorder}px` : "3px";
	return e.leftBorder && (t.borderLeft = `${r} solid ${n}`), e.rightBorder && (t.borderRight = `${r} solid ${n}`), e.topBorder && (t.borderTop = `${r} solid ${n}`), e.bottomBorder && (t.borderBottom = `${r} solid ${n}`), t;
}, pi = "bui-card";
//#endregion
//#region src/components/Cards/card.tsx
function mi(e) {
	let r = fi({ ...e }), i = {
		...e.style,
		...r
	};
	return e.variant === "stats" ? /* @__PURE__ */ n("div", {
		className: `${e.className ?? ""} ${pi} bui-card-stats`,
		style: i,
		children: [/* @__PURE__ */ n("div", {
			className: "bui-card-stats-copy",
			children: [e.title && /* @__PURE__ */ t("span", {
				className: `${e.titleClassName ?? ""} bui-card-title`,
				children: e.title
			}), e.description && /* @__PURE__ */ t("p", {
				className: "bui-card-description",
				children: e.description
			})]
		}), e.value !== void 0 && /* @__PURE__ */ t("strong", {
			className: "bui-card-value",
			children: e.value
		})]
	}) : /* @__PURE__ */ t("div", {
		className: `${e.className ?? ""} ${pi}`,
		style: i,
		children: e.children
	});
}
//#endregion
//#region src/components/Cards/CheckboxCard/checkbox_card.tsx
function hi(e) {
	let [r, i] = Z({
		value: e.isChecked,
		defaultValue: e.isChecked ?? !1
	});
	return /* @__PURE__ */ t("label", { children: /* @__PURE__ */ n(mi, {
		className: `bui-checkbox-card${e.hasShadow === !1 ? " bui-checkbox-card-no-shadow" : ""} ${e.className ?? ""}`,
		leftBorder: e.leftBorder,
		rightBorder: e.rightBorder,
		topBorder: e.topBorder,
		bottomBorder: e.bottomBorder,
		colorBorder: e.colorBorder,
		children: [/* @__PURE__ */ t(zn, {
			onChange: (t) => {
				i(t), e.onChecked?.(e.value, t);
			},
			value: r
		}), /* @__PURE__ */ n("div", {
			className: "bui-checkbox-card-content",
			children: [/* @__PURE__ */ t("strong", {
				className: `${e.titleClassName ?? ""} bui-checkbox-card-title`,
				children: e.title
			}), e.children]
		})]
	}) });
}
//#endregion
//#region src/components/Cards/stats-card-group.tsx
function gi({ children: e, className: n, ...r }) {
	return /* @__PURE__ */ t("div", {
		...r,
		className: ["bui-stats-card-group", n].filter(Boolean).join(" "),
		children: e
	});
}
//#endregion
//#region src/components/Slider/slider_utils.ts
var _i = 3e3;
function vi(e, t = 0) {
	if (e) return r.map(e, (e, n) => s(e) ? i(e, { className: `absolute inset-0 m-0 opacity-0 transition-opacity duration-700 ease-in-out after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(90deg,var(--auth-visual-overlay-primary-strong),var(--auth-visual-overlay-primary-soft)_54%,var(--auth-visual-overlay-primary-end)),linear-gradient(0deg,var(--auth-visual-overlay-depth),var(--auth-visual-overlay-depth-soft)_48%)] ${n === t ? "opacity-100" : ""} ${e.props.className ?? ""}` }) : e);
}
function yi(e) {
	return r.count(e) === 1;
}
function bi(e, t, n) {
	if (e) {
		if (!yi(e)) throw Error("Stop button must be only one element");
		if (!s(e)) throw Error("Stop button should contain className property");
		return i(e, {
			className: `!min-h-[36px] !px-[12px] !border !border-[var(--auth-control-border)] !rounded-[8px] !bg-[var(--auth-control-soft)] !text-[var(--color-on-primary)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${e.props.className ?? ""}`,
			disabled: n || e.props.disabled,
			onClick: n ? void 0 : t
		});
	}
}
function xi(e) {
	return e ? r.count(e) : 0;
}
function Si(e, t = 0) {
	let n = xi(e), [r, i] = g(t < n ? t : 0), a = h(null), o = c(() => {
		a.current &&= (clearInterval(a.current), null);
	}, []);
	return {
		activeIndex: r,
		slidesCount: n,
		start: c(() => {
			n <= 1 || (o(), a.current = setInterval(() => {
				i((e) => (e + 1) % n);
			}, _i));
		}, [n, o]),
		stop: o,
		next: c(() => {
			n <= 1 || i((e) => (e + 1) % n);
		}, [n]),
		prev: c(() => {
			n <= 1 || i((e) => (e - 1 + n) % n);
		}, [n]),
		goTo: c((e) => {
			n !== 0 && i(e);
		}, [n])
	};
}
//#endregion
//#region src/components/Slider/slider.tsx
function Ci({ children: e, label: a, caption: o, className: c }) {
	return /* @__PURE__ */ n("figure", {
		className: c ?? "",
		children: [/* @__PURE__ */ t("div", {
			className: "absolute inset-0 overflow-hidden",
			children: r.map(e, (e) => s(e) ? i(e, { className: "w-full h-full block object-cover" }) : e)
		}), (a || o) && /* @__PURE__ */ n("figcaption", {
			className: "absolute flex flex-col items-start left-[32px] right-[32px] bottom-[84px] z-[1] text-[var(--color-on-primary)]",
			children: [a && /* @__PURE__ */ t("span", {
				className: "inline-flex min-h-[28px] items-center px-[10px] rounded-[999px] bg-[var(--auth-badge-bg)] text-[var(--auth-badge-text)] text-[12px] font-bold tracking-[0.08em] uppercase",
				children: a
			}), o && /* @__PURE__ */ t("strong", {
				className: "block text-start max-w-[520px] mt-[14px] text-[30px] leading-[1.18] font-bold",
				children: o
			})]
		})]
	});
}
function wi(e) {
	let { activeIndex: r, slidesCount: i, start: a, stop: o, goTo: s } = Si(e.children), c = !!e.disabled;
	return u(() => {
		if (c) {
			o();
			return;
		}
		return a(), o;
	}, [
		c,
		a,
		o
	]), /* @__PURE__ */ n("div", {
		className: `w-full h-full relative ${c ? "opacity-70" : ""} ${e.className ?? ""}`,
		children: [/* @__PURE__ */ t("div", {
			className: "absolute inset-0",
			children: vi(e.children, r)
		}), /* @__PURE__ */ n("div", {
			className: "absolute left-[32px] right-[32px] bottom-[32px] z-[2] flex items-center justify-between gap-[16px]",
			children: [/* @__PURE__ */ t("div", {
				className: "flex gap-[8px]",
				children: Array.from({ length: i }, (e, n) => /* @__PURE__ */ t("button", {
					type: "button",
					className: `w-[34px] h-[6px] border-0 rounded-[999px] bg-[var(--auth-dot-bg)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${n === r ? "bg-[var(--color-warning-main)]" : ""}`,
					disabled: c,
					onClick: () => s(n)
				}, n))
			}), bi(e.stopButton ?? /* @__PURE__ */ t(J, {
				variant: "ghost",
				children: "Pausar"
			}), o, c)]
		})]
	});
}
//#endregion
//#region src/components/Wizard/wizard.ts
var Ti = a(null);
function Ei() {
	let e = l(Ti);
	if (!e) throw Error("useWizard must be used inside a WizardForm");
	return e;
}
//#endregion
//#region src/components/Wizard/wizard_form.tsx
function Di({ children: i, onFinish: a, className: o, variant: c = "default", hideActions: l = !1 }) {
	let u = r.toArray(i).filter(s), [d, f] = g(0), p = u[d], m = async () => {
		p.props.validate && !await p.props.validate() || (d === u.length - 1 ? a() : f((e) => e + 1));
	}, h = () => f((e) => Math.max(0, e - 1));
	return /* @__PURE__ */ t(Ti.Provider, {
		value: {
			next: m,
			prev: h,
			currentIndex: d,
			stepsCount: u.length
		},
		children: /* @__PURE__ */ n("div", {
			className: `w-full flex flex-col gap-[20px] ${o ?? ""}`,
			children: [
				/* @__PURE__ */ t("div", {
					className: "flex flex-col gap-[12px]",
					children: c === "default" ? /* @__PURE__ */ t(e, { children: /* @__PURE__ */ t("div", {
						className: "flex items-center justify-around gap-[8px]",
						children: u.map((e, r) => /* @__PURE__ */ n("div", {
							className: `min-w-0 inline-flex items-center justify-center gap-[6px] min-h-[34px] px-[8px] border border-[var(--color-border-subtle)] rounded-[999px] bg-[var(--color-surface)] text-[var(--color-text-3)] text-[11px] font-semibold whitespace-nowrap ${r === d ? "!border-[color-mix(in_srgb,var(--color-primary-500)_18%,transparent)] !bg-[var(--color-primary-50)] !text-[var(--color-primary-600)]" : ""}`,
							children: [/* @__PURE__ */ t("span", {
								className: `font-(family-name:--poppins) w-[20px] h-[20px] grid place-items-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-500)] text-[11px] font-bold ${r === d ? "!bg-[var(--color-primary-500)] !text-[var(--color-on-primary)]" : ""}`,
								children: r + 1
							}), /* @__PURE__ */ t("span", {
								className: `font-(family-name:--poppins) text-inherit font-semibold ${r === d ? "active" : r < d ? "!text-[var(--color-primary-600)]" : ""}`,
								children: e.props.title
							})]
						}, r))
					}) }) : /* @__PURE__ */ n(e, { children: [/* @__PURE__ */ n("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ t("h2", {
							className: "font-(family-name:--poppins) text-base font-semibold text-(--color-primary-500) m-0 tracking-[0.02em]",
							children: p.props.title
						}), /* @__PURE__ */ n("span", {
							className: "font-(family-name:--poppins) text-sm font-medium text-(--color-primary-600)",
							children: [
								d + 1,
								" / ",
								u.length
							]
						})]
					}), /* @__PURE__ */ t("div", {
						className: "flex gap-[6px]",
						children: u.map((e, n) => /* @__PURE__ */ t("span", { className: `block h-[5px] rounded-full w-[28px] bg-(--color-border-subtle) transition-[background,width] duration-300 ease-in-out ${n === d ? "!w-[40px] !bg-(--color-primary-500)" : ""} ${n < d ? "bg-(--color-primary-100)" : ""}` }, n))
					})] })
				}),
				/* @__PURE__ */ t("div", {
					className: "flex flex-col gap-[12px]",
					children: p.props.children
				}),
				!l && /* @__PURE__ */ n("div", {
					className: "flex gap-[10px] pt-[4px]",
					children: [d > 0 && /* @__PURE__ */ t(J, {
						variant: "outlined",
						onClick: h,
						className: "flex-1",
						children: "Atrás"
					}), /* @__PURE__ */ t(J, {
						variant: "filled",
						onClick: m,
						className: "flex-1",
						children: d === u.length - 1 ? "Finalizar" : "Siguiente"
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/components/Wizard/wizard_step.tsx
function Oi(e) {
	return null;
}
//#endregion
//#region src/components/Drawers/drawer.tsx
function ki(r) {
	let { ariaLabel: i, children: a, data: o, onClose: s, position: c, show: l, subtitle: f, title: p, width: m } = r, h = d(), g = d(), _ = c ?? "right", v = !!(o?.length || a), y = m ? { "--bui-drawer-width": m } : void 0;
	return u(() => {
		if (!l || !s) return;
		let e = (e) => {
			e.key === "Escape" && s();
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [l, s]), /* @__PURE__ */ n(e, { children: [/* @__PURE__ */ t("div", {
		"aria-hidden": !l,
		className: `bui-drawer-backdrop ${l ? "bui-drawer-backdrop-show" : ""}`,
		onClick: s
	}), /* @__PURE__ */ n("aside", {
		"aria-describedby": f ? g : void 0,
		"aria-hidden": !l,
		"aria-label": p ? void 0 : i ?? "Detalle",
		"aria-labelledby": p ? h : void 0,
		"aria-modal": "true",
		className: `bui-drawer-container bui-drawer-container-${_} ${l ? "bui-drawer-container-show" : ""}`,
		role: "dialog",
		style: y,
		children: [/* @__PURE__ */ n("div", {
			className: "bui-drawer-header",
			children: [/* @__PURE__ */ n("div", {
				className: "bui-drawer-heading",
				children: [p && /* @__PURE__ */ t("h3", {
					className: "bui-drawer-title",
					id: h,
					children: p
				}), f && /* @__PURE__ */ t("p", {
					className: "bui-drawer-subtitle",
					id: g,
					children: f
				})]
			}), s && /* @__PURE__ */ t("button", {
				"aria-label": "Cerrar detalle",
				className: "bui-drawer-close",
				onClick: s,
				type: "button",
				children: /* @__PURE__ */ n("svg", {
					className: "bui-drawer-close-icon",
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ t("path", { d: "M18 6 6 18" }), /* @__PURE__ */ t("path", { d: "m6 6 12 12" })]
				})
			})]
		}), v && /* @__PURE__ */ n("div", {
			className: "bui-drawer-body",
			children: [o?.map((e, r) => /* @__PURE__ */ n("div", {
				className: "bui-drawer-detail-group",
				children: [/* @__PURE__ */ t("span", {
					className: "bui-drawer-detail-label",
					children: e.label
				}), /* @__PURE__ */ t("div", {
					className: "bui-drawer-detail-value",
					children: e.children
				})]
			}, `${e.label}-${r}`)), a]
		})]
	})] });
}
function Ai({ className: e, meta: r, title: i }) {
	return /* @__PURE__ */ n("div", {
		className: ["bui-drawer-audit-item", e].filter(Boolean).join(" "),
		children: [/* @__PURE__ */ t("strong", { children: i }), r && /* @__PURE__ */ t("span", { children: r })]
	});
}
function ji({ className: e, items: n }) {
	return /* @__PURE__ */ t("div", {
		className: ["bui-drawer-stack", e].filter(Boolean).join(" "),
		children: n.map((e, n) => /* @__PURE__ */ t(Ai, {
			title: e.title,
			meta: e.meta
		}, `${String(e.title)}-${n}`))
	});
}
//#endregion
//#region src/components/TreeList/tree_list.tsx
function Mi(...e) {
	return e.filter(Boolean).join(" ");
}
function Ni(e) {
	return new Set(e ?? []);
}
function Pi(e) {
	return e.flatMap((e) => [...e.children?.length ? [e.value] : [], ...e.children ? Pi(e.children) : []]);
}
function Fi({ checkedValues: e, depth: r, expandedSet: i, getNodeKey: a, node: o, onChecked: s, onSelect: c, onToggleExpanded: l, path: u, selectable: d, selectedValue: f, variant: p }) {
	let m = !!o.children?.length, h = m && i.has(o.value), g = e?.has(o.value) ?? !1, _ = f !== void 0 && Object.is(f, o.value), v = !!o.disabled, y = { "--bui-treelist-depth": r }, b = () => {
		!m || v || l(o, !h);
	}, x = () => {
		if (!v) {
			if (d) {
				s?.(o.value, !g, o);
				return;
			}
			if (c) {
				c(o.value, o);
				return;
			}
			b();
		}
	};
	return /* @__PURE__ */ n("div", {
		className: "bui-treelist-node",
		children: [/* @__PURE__ */ n("div", {
			"aria-disabled": v || void 0,
			"aria-expanded": m ? h : void 0,
			"aria-selected": _ || void 0,
			className: Mi("bui-treelist-row", `bui-treelist-row-${p}`, _ && "bui-treelist-row-selected", g && "bui-treelist-row-checked", v && "bui-treelist-row-disabled"),
			onClick: x,
			onKeyDown: (e) => {
				e.key !== "Enter" && e.key !== " " || (e.preventDefault(), x());
			},
			role: "treeitem",
			style: y,
			tabIndex: v ? -1 : 0,
			children: [
				/* @__PURE__ */ t("button", {
					"aria-label": h ? "Contraer nodo" : "Expandir nodo",
					className: Mi("bui-treelist-toggle", h && "bui-treelist-toggle-open", !m && "bui-treelist-toggle-hidden"),
					disabled: !m || v,
					onClick: (e) => {
						e.stopPropagation(), b();
					},
					type: "button",
					children: /* @__PURE__ */ t("svg", {
						viewBox: "0 0 24 24",
						"aria-hidden": "true",
						children: /* @__PURE__ */ t("path", { d: "m9 18 6-6-6-6" })
					})
				}),
				d && /* @__PURE__ */ t("input", {
					"aria-label": "Seleccionar nodo",
					checked: g,
					className: "bui-treelist-checkbox",
					disabled: v,
					onChange: (e) => s?.(o.value, e.target.checked, o),
					onClick: (e) => e.stopPropagation(),
					type: "checkbox"
				}),
				/* @__PURE__ */ n("span", {
					className: "bui-treelist-copy",
					children: [/* @__PURE__ */ t("strong", { children: o.label }), o.description && /* @__PURE__ */ t("span", { children: o.description })]
				})
			]
		}), m && h && /* @__PURE__ */ t("div", {
			className: "bui-treelist-children",
			role: "group",
			children: o.children?.map((n, o) => {
				let m = [...u, o];
				return /* @__PURE__ */ t(Fi, {
					checkedValues: e,
					depth: r + 1,
					expandedSet: i,
					getNodeKey: a,
					node: n,
					onChecked: s,
					onSelect: c,
					onToggleExpanded: l,
					path: m,
					selectable: d,
					selectedValue: f,
					variant: p
				}, a(n, o, m));
			})
		})]
	});
}
function Ii({ checkedValues: e, className: n, defaultExpandedValues: r, emptyState: i = "Sin elementos disponibles.", expandedValues: a, getNodeKey: o, nodes: s, onChecked: c, onExpandedChange: l, onSelect: u, selectable: d, selectedValue: f, variant: m, ...h }) {
	let _ = m ?? (d ? "selection" : "navigation"), v = o ?? ((e, t, n) => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "bigint" ? e.value : n.length ? n.join(".") : t), y = r ?? Pi(s), [b, x] = g(() => Ni(y)), S = p(() => a === void 0 ? void 0 : Ni(a), [a]) ?? b, C = (e, t) => {
		let n = new Set(S);
		t ? n.add(e.value) : n.delete(e.value), a === void 0 && x(n), l?.([...n], e, t);
	};
	return /* @__PURE__ */ t("div", {
		...h,
		"aria-multiselectable": d || void 0,
		className: Mi("bui-treelist", `bui-treelist-${_}`, n),
		role: "tree",
		children: s.length > 0 ? s.map((n, r) => {
			let i = [r];
			return /* @__PURE__ */ t(Fi, {
				checkedValues: e,
				depth: 0,
				expandedSet: S,
				getNodeKey: v,
				node: n,
				onChecked: c,
				onSelect: u,
				onToggleExpanded: C,
				path: i,
				selectable: d,
				selectedValue: f,
				variant: _
			}, v(n, r, i));
		}) : /* @__PURE__ */ t("div", {
			className: "bui-treelist-empty",
			children: i
		})
	});
}
//#endregion
//#region src/components/TransferList/transfer_list.tsx
function Li(...e) {
	return e.filter(Boolean).join(" ");
}
function Ri(e, t) {
	if (e.size !== t.size) return !1;
	for (let n of e) if (!t.has(n)) return !1;
	return !0;
}
function zi(e, t) {
	let n = /* @__PURE__ */ new Set();
	return e.forEach((e) => {
		t.has(e) && n.add(e);
	}), Ri(e, n) ? e : n;
}
function Bi(e, t) {
	return e.length === t.length ? e.every((e, n) => Object.is(e, t[n])) : !1;
}
function Vi(e, t) {
	let n = e.filter((e) => t.has(e));
	return Bi(e, n) ? e : n;
}
function Hi(e, t, n) {
	return n ? n(e) : typeof e == "string" || typeof e == "number" || typeof e == "bigint" ? e : t;
}
function Ui(e, t) {
	return e.reduce((e, n) => {
		let r = n.children ? Ui(n.children, t) : void 0;
		return (t.has(n.value) || r && r.length > 0) && e.push({
			...n,
			children: r
		}), e;
	}, []);
}
function Wi(e, t) {
	return e.reduce((e, n) => {
		if (t.has(n.value)) return e;
		let r = n.children ? Wi(n.children, t) : void 0;
		return e.push({
			...n,
			children: r
		}), e;
	}, []);
}
function Gi(e) {
	return e.flatMap((e) => [e.value, ...e.children ? Gi(e.children) : []]);
}
function Ki(e) {
	return e.flatMap((e) => [...e.disabled ? [] : [e.value], ...e.children ? Ki(e.children) : []]);
}
function qi(e) {
	return [...e.disabled ? [] : [e.value], ...e.children ? Ki(e.children) : []];
}
function Ji(e, t) {
	return e || (t ?? []).map((e) => ({
		value: e.render.props.value,
		label: e.render.props.title,
		selected: e.selected,
		render: e.render
	}));
}
function Yi(e, t, n) {
	return t?.[n] ?? e ?? "Sin elementos.";
}
function Xi(e) {
	let { variant: r = "card", inverted: a, titles: o = ["Disponibles", "Seleccionados"], className: s, panelClassName: c, listClassName: l, actionsClassName: d, emptyState: f, emptyStates: m, showBulkActions: _ = !0, onChange: v, items: y, data: b, selectedValues: x, getItemKey: S, treeNodes: C = [], treeSelected: w, ...T } = e, E = a ? [o[1], o[0]] : o, D = p(() => Ji(y, b), [y, b]), O = p(() => D.map((e, t) => ({
		item: e,
		key: Hi(e.value, t, S)
	})), [D, S]), [k, A] = g(() => new Set(O.filter(({ item: e }) => e.selected).map(({ key: e }) => e))), [j, M] = g([]), [N, P] = g([]), F = h(new Set(O.map(({ key: e }) => e))), I = p(() => x === void 0 ? k : new Set(x.map((e, t) => Hi(e, t, S))), [
		x,
		k,
		S
	]), [L, ee] = g(() => new Set(w ?? [])), R = p(() => w === void 0 ? L : new Set(w), [w, L]), [te, z] = g(/* @__PURE__ */ new Set()), [ne, B] = g(/* @__PURE__ */ new Set());
	u(() => {
		let e = new Set(O.map(({ key: e }) => e));
		A((e) => {
			let t = /* @__PURE__ */ new Set();
			return O.forEach(({ item: n, key: r }) => {
				(e.has(r) || !F.current.has(r) && n.selected) && t.add(r);
			}), Ri(e, t) ? e : t;
		}), M((t) => Vi(t, e)), P((t) => Vi(t, e)), F.current = e;
	}, [O]);
	let re = O.filter(({ key: e }) => a ? I.has(e) : !I.has(e)), V = O.filter(({ key: e }) => a ? !I.has(e) : I.has(e)), ie = (e) => {
		v && v(O.filter(({ key: t }) => e.has(t)).map(({ item: e }) => e.value), O.filter(({ key: t }) => !e.has(t)).map(({ item: e }) => e.value));
	}, ae = (e) => {
		x === void 0 && A(e), ie(e);
	}, H = (e, t, n) => {
		n((n) => t ? n.includes(e) ? n : [...n, e] : n.filter((t) => !Object.is(t, e)));
	}, oe = (e) => {
		let t = e.filter(({ item: e }) => !e.disabled);
		if (!t.length) return;
		let n = new Set(I);
		t.forEach(({ key: e }) => {
			a ? n.delete(e) : n.add(e);
		}), M([]), ae(n);
	}, U = (e) => {
		let t = e.filter(({ item: e }) => !e.disabled);
		if (!t.length) return;
		let n = new Set(I);
		t.forEach(({ key: e }) => {
			a ? n.add(e) : n.delete(e);
		}), P([]), ae(n);
	}, se = (e, r, a) => e.map(({ item: e, key: o }) => {
		let s = r.includes(o);
		return e.render ? i(e.render, {
			key: o,
			isChecked: s,
			onChecked: (e, t) => a(o, t)
		}) : /* @__PURE__ */ n("label", {
			className: Li("bui-transferlist-option", e.disabled && "bui-transferlist-option-disabled", s && "bui-transferlist-option-checked"),
			onKeyDown: (t) => {
				(t.key === " " || t.key === "Enter") && (t.preventDefault(), e.disabled || a(o, !s));
			},
			children: [
				/* @__PURE__ */ t("input", {
					type: "checkbox",
					className: "sr-only",
					checked: s,
					disabled: e.disabled,
					onChange: () => {
						e.disabled || a(o, !s);
					}
				}),
				/* @__PURE__ */ t("span", {
					className: Li("bui-transferlist-option-checkbox", s && "bui-transferlist-option-checkbox--checked"),
					"aria-hidden": "true",
					children: s && /* @__PURE__ */ t("svg", {
						viewBox: "0 0 24 24",
						className: "bui-transferlist-check-icon",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "4",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: /* @__PURE__ */ t("polyline", { points: "20 6 9 17 4 12" })
					})
				}),
				/* @__PURE__ */ n("span", {
					className: "bui-transferlist-option-text",
					children: [/* @__PURE__ */ t("strong", { children: e.label }), e.description && /* @__PURE__ */ t("span", { children: e.description })]
				})
			]
		}, o);
	}), ce = (e) => {
		if (!v) return;
		let t = Gi(C);
		v(t.filter((t) => e.has(t)), t.filter((t) => !e.has(t)));
	}, le = (e, t) => {
		let n = e(new Set(R));
		w === void 0 && ee(n), ce(n), t === "A" ? z(/* @__PURE__ */ new Set()) : B(/* @__PURE__ */ new Set());
	}, ue = (e, t, n) => {
		n((n) => {
			let r = new Set(n);
			return qi(e).forEach((e) => {
				t ? r.add(e) : r.delete(e);
			}), r;
		});
	}, W = p(() => a ? Ui(C, R) : Wi(C, R), [
		a,
		C,
		R
	]), G = p(() => a ? Wi(C, R) : Ui(C, R), [
		a,
		C,
		R
	]), K = p(() => new Set(Ki(W)), [W]), q = p(() => new Set(Ki(G)), [G]), de = p(() => zi(te, K), [te, K]), fe = p(() => zi(ne, q), [ne, q]), Y = p(() => [...K].filter((e) => a ? R.has(e) : !R.has(e)), [
		a,
		K,
		R
	]), pe = p(() => [...q].filter((e) => a ? !R.has(e) : R.has(e)), [
		a,
		q,
		R
	]), me = r === "card" ? () => oe(re) : () => le((e) => (Y.forEach((t) => a ? e.delete(t) : e.add(t)), e), "A"), he = r === "card" ? () => oe(re.filter(({ key: e }) => j.includes(e))) : () => le((e) => ([...de].forEach((t) => a ? e.delete(t) : e.add(t)), e), "A"), X = r === "card" ? () => U(V.filter(({ key: e }) => N.includes(e))) : () => le((e) => ([...fe].forEach((t) => a ? e.add(t) : e.delete(t)), e), "B"), ge = r === "card" ? () => U(V) : () => le((e) => (pe.forEach((t) => a ? e.add(t) : e.delete(t)), e), "B"), _e = r === "card" ? se(re, j, (e, t) => H(e, t, M)) : /* @__PURE__ */ t(Ii, {
		nodes: W,
		selectable: !0,
		variant: "selection",
		checkedValues: de,
		onChecked: (e, t, n) => ue(n, t, z)
	}), ve = r === "card" ? se(V, N, (e, t) => H(e, t, P)) : /* @__PURE__ */ t(Ii, {
		nodes: G,
		selectable: !0,
		variant: "selection",
		checkedValues: fe,
		onChecked: (e, t, n) => ue(n, t, B)
	}), ye = r === "card" ? re.length > 0 : W.length > 0, be = r === "card" ? V.length > 0 : G.length > 0;
	return /* @__PURE__ */ n("div", {
		...T,
		className: Li("bui-transferlist", s),
		children: [
			/* @__PURE__ */ n("section", {
				className: Li("bui-transferlist-panel", c),
				children: [/* @__PURE__ */ t("h3", {
					className: "bui-transferlist-panel-title",
					children: E[0]
				}), /* @__PURE__ */ t("div", {
					className: Li("bui-transferlist-panel-content", l),
					children: ye ? _e : /* @__PURE__ */ t("div", {
						className: "bui-transferlist-empty",
						children: Yi(f, m, 0)
					})
				})]
			}),
			/* @__PURE__ */ n("div", {
				className: Li("bui-transferlist-actions", d),
				children: [
					_ && /* @__PURE__ */ t(J, {
						className: "bui-transferlist-actions-btn",
						variant: "outlined",
						onClick: me,
						disabled: r === "card" ? re.length === 0 : Y.length === 0,
						children: "Agregar todo"
					}),
					/* @__PURE__ */ t(J, {
						className: "bui-transferlist-actions-btn",
						variant: "outlined",
						onClick: he,
						disabled: r === "card" ? j.length === 0 : de.size === 0,
						children: "Agregar"
					}),
					/* @__PURE__ */ t(J, {
						className: "bui-transferlist-actions-btn",
						variant: "outlined",
						onClick: X,
						disabled: r === "card" ? N.length === 0 : fe.size === 0,
						children: "Quitar"
					}),
					_ && /* @__PURE__ */ t(J, {
						className: "bui-transferlist-actions-btn",
						variant: "outlined",
						onClick: ge,
						disabled: r === "card" ? V.length === 0 : pe.length === 0,
						children: "Quitar todo"
					})
				]
			}),
			/* @__PURE__ */ n("section", {
				className: Li("bui-transferlist-panel", c),
				children: [/* @__PURE__ */ t("h3", {
					className: "bui-transferlist-panel-title",
					children: E[1]
				}), /* @__PURE__ */ t("div", {
					className: Li("bui-transferlist-panel-content", l),
					children: be ? ve : /* @__PURE__ */ t("div", {
						className: "bui-transferlist-empty",
						children: Yi(f, m, 1)
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/components/GroupMove/group_move_selection.ts
function Zi(e) {
	return e.disabled ? [] : e.items.filter((e) => !e.disabled).map((e) => e.id);
}
function Qi(e, t) {
	let n = e.find((e) => e.id === t.fromGroupId), r = e.find((e) => e.id === t.toGroupId);
	if (!n || n.disabled || !r || r.disabled || n.id === r.id) return [];
	let i = new Set(t.itemIds);
	if (i.size === 0 || i.size !== t.itemIds.length) return [];
	let a = n.items.filter((e) => i.has(e.id));
	return a.length !== i.size || a.some((e) => e.disabled) ? [] : a;
}
//#endregion
//#region src/components/GroupMove/use_group_move.ts
function $i({ groups: e, onMove: t, onMoveMany: n, canMove: r, disabled: i }) {
	let [a, o] = g(null), [s, c] = g(null), [l, d] = g(null), [p, m] = g(""), _ = h(/* @__PURE__ */ new Map()), v = h(null), y = h(null), b = h([]), x = h(0), S = e.find((e) => e.id === a?.fromGroupId && !e.disabled), C = S?.items.filter((e) => a?.itemIds.includes(e.id)) ?? [], w = !i && C.length === a?.itemIds.length && C.every((e) => !e.disabled) ? C : [], T = S && w.length ? {
		fromGroupId: S.id,
		itemIds: w.map((e) => e.id)
	} : null;
	f(() => {
		let t = v.current;
		if (!t) return;
		let n = e.find((e) => e.id === t.move.toGroupId);
		if (!t.move.itemIds.every((e) => n?.items.some((t) => t.id === e))) return;
		b.current.forEach((e) => e.cancel()), b.current = [], window.matchMedia("(prefers-reduced-motion: reduce)").matches || _.current.forEach((e, n) => {
			let r = t.positions.get(n);
			if (!r || !e.animate) return;
			let i = e.getBoundingClientRect(), a = r.left - i.left, o = r.top - i.top;
			if (!i.width || !i.height) return;
			let s = r.width / i.width, c = r.height / i.height;
			if (!a && !o && s === 1 && c === 1) return;
			let l = t.move.itemIds.includes(n);
			b.current.push(e.animate([{
				transform: `translate(${a}px, ${o}px) scale(${s}, ${c})`,
				transformOrigin: "top left"
			}, {
				transform: "translate(0, 0) scale(1, 1)",
				transformOrigin: "top left"
			}], {
				duration: l ? 380 : 240,
				easing: "cubic-bezier(0.22, 0.8, 0.24, 1)"
			}));
		});
		let r = t.move.itemIds.length;
		m(`${r} ${r === 1 ? "elemento movido" : "elementos movidos"} a ${t.destination}.`), t.focus && _.current.get(t.move.itemIds[0])?.focus({ preventScroll: !0 }), v.current = null;
	}, [e]), u(() => () => b.current.forEach((e) => e.cancel()), []);
	function E(t, a) {
		if (i || t.itemIds.length > 1 && !n) return !1;
		let o = Qi(e, {
			...t,
			toGroupId: a.id
		});
		return o.length > 0 && o.every((e) => r?.({
			itemId: e.id,
			fromGroupId: t.fromGroupId,
			toGroupId: a.id
		}) ?? !0);
	}
	function D(r, i, a) {
		if (!E(r, i)) return;
		let s = {
			itemIds: Qi(e, {
				...r,
				toGroupId: i.id
			}).map((e) => e.id),
			fromGroupId: r.fromGroupId,
			toGroupId: i.id
		};
		v.current = {
			move: s,
			destination: i.label,
			focus: a,
			positions: new Map([..._.current].map(([e, t]) => [e, t.getBoundingClientRect()]))
		}, m(""), o(null), c(null), d(null), s.itemIds.length > 1 && n ? n(s) : t({
			itemId: s.itemIds[0],
			fromGroupId: s.fromGroupId,
			toGroupId: s.toGroupId
		});
	}
	function O(e, t, r) {
		if (i || e.disabled || t.disabled || Date.now() < x.current) return;
		v.current = null, m("");
		let a = T?.fromGroupId === e.id ? T.itemIds : [], s = a.includes(t.id) ? a.filter((e) => e !== t.id) : [...a, t.id];
		if (!n) s = a.includes(t.id) ? [] : [t.id];
		else if (r && y.current && a.length) {
			let n = e.items.findIndex((e) => e.id === y.current), r = e.items.indexOf(t);
			n >= 0 && (s = [...new Set([...a, ...e.items.slice(Math.min(n, r), Math.max(n, r) + 1).filter((e) => !e.disabled).map((e) => e.id)])]);
		}
		y.current = t.id, o(s.length ? {
			itemIds: s,
			fromGroupId: e.id
		} : null);
	}
	function k(e) {
		if (i || !n) return;
		let t = Zi(e), r = A(e);
		v.current = null, y.current = t[0] ?? null, o(t.length && !r ? {
			itemIds: t,
			fromGroupId: e.id
		} : null), m(r ? "Selección cancelada." : `${t.length} elementos seleccionados en ${e.label}.`);
	}
	function A(e) {
		let t = Zi(e).length;
		return t > 0 && T?.fromGroupId === e.id && T.itemIds.length === t;
	}
	function j(e, t) {
		let n = T?.fromGroupId === e.id && T.itemIds.includes(t.id) ? T : {
			itemIds: [t.id],
			fromGroupId: e.id
		};
		return o(n), c(n), n;
	}
	function M() {
		T && _.current.get(T.itemIds[0])?.focus(), o(null), c(null), d(null), m("Selección cancelada.");
	}
	return {
		selection: T,
		selectedItems: w,
		dragged: s,
		over: l,
		setOver: d,
		announcement: p,
		buttons: _,
		allowed: E,
		moveTo: D,
		select: O,
		selectAll: k,
		allSelected: A,
		startDrag: j,
		cancel: M,
		endDrag: () => {
			x.current = Date.now() + 180, c(null), d(null);
		}
	};
}
//#endregion
//#region src/components/GroupMove/group_move.tsx
function ea(e) {
	let { groups: r, label: i = "Mover elementos entre grupos", disabled: a = !1, onMoveMany: o } = e, s = $i(e), c = h(/* @__PURE__ */ new Map());
	return /* @__PURE__ */ n("div", {
		className: "bui-group-move",
		role: "group",
		"aria-label": i,
		onKeyDown: (e) => {
			e.key === "Escape" && (e.preventDefault(), s.cancel());
		},
		children: [
			/* @__PURE__ */ t("p", {
				className: "bui-group-move-help",
				children: o ? "Selecciona uno o varios elementos del mismo grupo y arrástralos juntos, o elige Colocar aquí. Shift selecciona un rango. Escape cancela." : "Arrastra un elemento o selecciónalo y elige un destino. Escape cancela la selección."
			}),
			/* @__PURE__ */ t("div", {
				className: "bui-group-move-status",
				role: "status",
				"aria-live": "polite",
				children: s.announcement || (s.selection ? `${s.selectedItems.length} ${s.selectedItems.length === 1 ? "seleccionado" : "seleccionados"}. Elige un destino.` : "")
			}),
			typeof document < "u" && _(r.flatMap((e) => e.items.map((e) => {
				let r = s.selection?.itemIds.includes(e.id) ? s.selectedItems : [e];
				return /* @__PURE__ */ t("span", {
					ref: (t) => {
						t ? c.current.set(e.id, t) : c.current.delete(e.id);
					},
					className: "bui-group-move-preview",
					"aria-hidden": "true",
					children: /* @__PURE__ */ n("span", {
						className: "bui-group-move-preview-stack",
						children: [r.slice(0, 3).map((e) => /* @__PURE__ */ n("span", {
							className: "bui-group-move-preview-card",
							children: [/* @__PURE__ */ t("span", {
								className: "bui-group-move-preview-icon",
								children: e.dragPreview?.icon ?? e.icon ?? /* @__PURE__ */ t(Rt, { size: 20 })
							}), /* @__PURE__ */ t("span", {
								className: "bui-group-move-preview-label",
								children: e.dragPreview?.label ?? e.label
							})]
						}, e.id)), r.length > 1 && /* @__PURE__ */ n("span", {
							className: "bui-group-move-preview-count",
							children: [r.length, " elementos"]
						})]
					})
				}, e.id);
			})), document.body),
			/* @__PURE__ */ t("div", {
				className: "bui-group-move-grid",
				children: r.map((e, i) => /* @__PURE__ */ n("section", {
					className: `bui-group-move-group${i === 0 ? " is-first" : ""}${s.over === e.id ? " is-over" : ""}${s.dragged && s.allowed(s.dragged, e) ? " is-drop-ready" : ""}`,
					style: i === 0 ? { gridRow: `1 / span ${Math.max(1, r.length - 1)}` } : void 0,
					"aria-label": e.label,
					"aria-disabled": a || e.disabled,
					onDragOver: (t) => {
						s.dragged && s.allowed(s.dragged, e) && (t.preventDefault(), t.dataTransfer.dropEffect = "move", s.setOver(e.id));
					},
					onDragLeave: (e) => {
						(!(e.relatedTarget instanceof Node) || !e.currentTarget.contains(e.relatedTarget)) && s.setOver(null);
					},
					onDrop: (t) => {
						t.preventDefault(), s.dragged && s.moveTo(s.dragged, e, !1), s.setOver(null);
					},
					children: [
						/* @__PURE__ */ n("div", {
							className: "bui-group-move-heading",
							children: [/* @__PURE__ */ n("div", { children: [e.eyebrow && /* @__PURE__ */ t("span", {
								className: "bui-group-move-eyebrow",
								children: e.eyebrow
							}), /* @__PURE__ */ t("h3", { children: e.label })] }), /* @__PURE__ */ n("span", {
								className: "bui-group-move-count",
								children: [
									e.items.length,
									" ",
									e.items.length === 1 ? "elemento" : "elementos"
								]
							})]
						}),
						o && /* @__PURE__ */ n("div", {
							className: "bui-group-move-toolbar",
							children: [s.selection && s.allowed(s.selection, e) ? /* @__PURE__ */ n("button", {
								type: "button",
								className: "bui-group-move-action",
								"aria-label": `${e.moveHereLabel?.(s.selectedItems.length) ?? `Mover ${s.selectedItems.length} elementos aquí`} en ${e.label}`,
								onClick: (t) => {
									s.selection && s.moveTo(s.selection, e, t.detail === 0);
								},
								children: [/* @__PURE__ */ t("span", {
									"aria-hidden": "true",
									children: /* @__PURE__ */ t(qe, {
										size: 16,
										className: i === 0 ? "bui-group-move-return" : void 0
									})
								}), e.moveHereLabel?.(s.selectedItems.length) ?? `Mover ${s.selectedItems.length} elementos aquí`]
							}) : /* @__PURE__ */ t("button", {
								type: "button",
								className: "bui-group-move-action",
								disabled: a || e.disabled || !e.items.some((e) => !e.disabled),
								onClick: () => s.selectAll(e),
								"aria-label": `${s.allSelected(e) ? "Limpiar selección" : "Seleccionar todos"} en ${e.label}`,
								children: s.allSelected(e) ? "Limpiar selección" : "Seleccionar todos"
							}), e.moveAll && /* @__PURE__ */ n("button", {
								type: "button",
								className: "bui-group-move-action",
								"aria-label": `${e.moveAll.label} de ${e.label}`,
								disabled: !r.some((t) => t.id === e.moveAll?.toGroupId && s.allowed({
									fromGroupId: e.id,
									itemIds: e.items.map((e) => e.id)
								}, t)),
								onClick: (t) => {
									let n = r.find((t) => t.id === e.moveAll?.toGroupId);
									n && s.moveTo({
										fromGroupId: e.id,
										itemIds: e.items.map((e) => e.id)
									}, n, t.detail === 0);
								},
								children: [/* @__PURE__ */ t("span", {
									"aria-hidden": "true",
									children: /* @__PURE__ */ t(qe, {
										size: 16,
										className: i ? "bui-group-move-return" : void 0
									})
								}), e.moveAll.label]
							})]
						}),
						s.dragged && s.allowed(s.dragged, e) && /* @__PURE__ */ n("span", {
							className: "bui-group-move-drop-hint",
							"aria-hidden": "true",
							children: [
								"Suelta",
								" ",
								s.dragged.itemIds.length === 1 ? "aquí" : `${s.dragged.itemIds.length} elementos aquí`
							]
						}),
						!o && s.selection && s.allowed(s.selection, e) && /* @__PURE__ */ n("button", {
							className: "bui-group-move-place",
							type: "button",
							onClick: (t) => {
								s.selection && s.moveTo(s.selection, e, t.detail === 0);
							},
							children: [
								"Colocar ",
								s.selectedItems.length > 1 ? `${s.selectedItems.length} elementos` : "aquí",
								/* @__PURE__ */ n("span", {
									className: "sr-only",
									children: [" en ", e.label]
								})
							]
						}),
						e.items.length ? /* @__PURE__ */ t("ul", { children: e.items.map((r) => {
							let i = s.selection?.itemIds.includes(r.id) ?? !1;
							return /* @__PURE__ */ t("li", { children: /* @__PURE__ */ n("button", {
								type: "button",
								ref: (e) => {
									e ? s.buttons.current.set(r.id, e) : s.buttons.current.delete(r.id);
								},
								className: `bui-group-move-item${i ? " is-selected" : ""}${s.dragged?.itemIds.includes(r.id) ? " is-dragging" : ""}`,
								disabled: a || e.disabled || r.disabled,
								draggable: !a && !e.disabled && !r.disabled,
								"aria-pressed": i,
								onClick: (t) => s.select(e, r, t.shiftKey),
								onDragStart: (t) => {
									let n = s.startDrag(e, r);
									t.dataTransfer.setData("text/plain", n.itemIds.join("\n")), t.dataTransfer.effectAllowed = "move";
									let i = c.current.get(r.id);
									i && t.dataTransfer.setDragImage(i, 28, 28);
								},
								onDragEnd: s.endDrag,
								children: [
									o && /* @__PURE__ */ t("span", {
										className: "bui-group-move-select-mark",
										"aria-hidden": "true",
										children: i && /* @__PURE__ */ t(Ze, { size: 14 })
									}),
									(r.icon ?? r.badge) != null && /* @__PURE__ */ t("span", {
										className: "bui-group-move-badge",
										"aria-hidden": "true",
										children: r.icon ?? r.badge
									}),
									/* @__PURE__ */ n("span", {
										className: "bui-group-move-copy",
										children: [/* @__PURE__ */ t("strong", { children: r.label }), r.description && /* @__PURE__ */ t("span", { children: r.description })]
									}),
									r.detail != null && /* @__PURE__ */ t("span", {
										className: "bui-group-move-detail",
										children: r.detail
									}),
									/* @__PURE__ */ t("span", {
										className: "bui-group-move-grip",
										"aria-hidden": "true",
										children: /* @__PURE__ */ t(Rt, { size: 16 })
									})
								]
							}) }, r.id);
						}) }) : /* @__PURE__ */ t("p", {
							className: "bui-group-move-empty",
							children: e.emptyText ?? "Sin elementos."
						})
					]
				}, e.id))
			})
		]
	});
}
//#endregion
//#region src/components/Charts/chart.ts
var ta = [
	"var(--bui-color-primary-main)",
	"var(--bui-color-success-main)",
	"var(--bui-color-warning-main)",
	"var(--bui-color-error-main)"
], na = {
	top: 12,
	right: 16,
	bottom: 32,
	left: 48
};
function ra(e, t) {
	return e.color ?? ta[t % ta.length];
}
function ia(e) {
	return e.map((e, t) => ({
		...e,
		color: ra(e, t)
	}));
}
function aa(e) {
	return e >= 1e6 ? `${(e / 1e6).toFixed(1)}M` : e >= 1e3 ? `${(e / 1e3).toFixed(1)}k` : String(e);
}
function oa(...e) {
	return e.filter(Boolean).join(" ");
}
function sa(e, t, n = 5) {
	let r = (t - e || 1) / (n - 1), i = 10 ** Math.floor(Math.log10(r)), a = Math.ceil(r / i) * i, o = Math.floor(e / a) * a;
	return Array.from({ length: n }, (e, t) => o + t * a);
}
function ca(e, t, n = .1) {
	let r = Infinity, i = -Infinity;
	for (let n of e) for (let e of t) {
		let t = Number(n[e]);
		isNaN(t) || (t < r && (r = t), t > i && (i = t));
	}
	if (!isFinite(r)) return [0, 100];
	let a = (i - r) * n;
	return [Math.max(0, r - a), i + a];
}
//#endregion
//#region src/components/Charts/Barchart/bar_chart.ts
function la(e, t) {
	return oa("bui-chart", "bui-bar-chart", `bui-bar-chart--${e}`, t);
}
function ua(e, t, n, r) {
	let [i, a] = ca(e, t.map((e) => e.key)), o = sa(i, a), s = o[0], c = o[o.length - 1], l = c - s || 1;
	return {
		yTicks: o,
		yMin: s,
		yMax: c,
		plotWidth: n,
		plotHeight: r,
		valueToY: (e) => r - (e - s) / l * r,
		valueToX: (e) => (e - s) / l * n
	};
}
//#endregion
//#region src/components/Charts/common/chart_header.tsx
var da = ({ title: e, subtitle: r }) => !e && !r ? null : /* @__PURE__ */ n("div", {
	className: "bui-chart-header",
	children: [e && /* @__PURE__ */ t("h3", {
		className: "bui-chart-title",
		children: e
	}), r && /* @__PURE__ */ t("p", {
		className: "bui-chart-subtitle",
		children: r
	})]
}), fa = ({ series: e, isVisible: r }) => r ? /* @__PURE__ */ t("div", {
	className: "bui-chart-legend",
	children: e.map((e) => /* @__PURE__ */ n("div", {
		className: "bui-chart-legend-item",
		style: { "--bui-series-color": e.color },
		children: [/* @__PURE__ */ t("span", { className: "bui-chart-legend-dot" }), e.name]
	}, e.key))
}) : null, pa = ({ isVisible: n, yTicks: r, valueToY: i, plotWidth: a }) => n ? /* @__PURE__ */ t(e, { children: r.map((e) => /* @__PURE__ */ t("line", {
	className: "bui-chart-grid-line",
	x1: 0,
	x2: a,
	y1: i(e),
	y2: i(e)
}, e)) }) : null, ma = ({ isVisible: r, yTicks: i, valueToY: a, plotHeight: o }) => r ? /* @__PURE__ */ n(e, { children: [/* @__PURE__ */ t("line", {
	className: "bui-chart-axis-line",
	x1: 0,
	y1: 0,
	x2: 0,
	y2: o
}), i.map((e) => /* @__PURE__ */ t("text", {
	className: "bui-chart-axis-text",
	x: -8,
	y: a(e),
	textAnchor: "end",
	dominantBaseline: "middle",
	children: aa(e)
}, e))] }) : null, ha = ({ isVisible: r, dataPoints: i, indexToX: a, plotHeight: o }) => r ? /* @__PURE__ */ n(e, { children: [/* @__PURE__ */ t("line", {
	className: "bui-chart-axis-line",
	x1: 0,
	y1: o,
	x2: a(i.length - 1),
	y2: o
}), i.map((e, n) => /* @__PURE__ */ t("text", {
	className: "bui-chart-axis-text",
	x: a(n),
	y: o + 16,
	textAnchor: "middle",
	children: e.label
}, n))] }) : null, ga = .6, _a = (e, t, n, r) => e === "vertical" ? n / t : r / t, va = (e, t, n, r, i, a) => {
	if (r <= 0 || n <= 0) return "";
	let o = Math.min(i, n / 2, r / 2);
	return a === "vertical" ? [
		`M ${e + o} ${t}`,
		`H ${e + n - o}`,
		`Q ${e + n} ${t} ${e + n} ${t + o}`,
		`V ${t + r}`,
		`H ${e}`,
		`V ${t + o}`,
		`Q ${e} ${t} ${e + o} ${t}`,
		"Z"
	].join(" ") : [
		`M ${e} ${t}`,
		`V ${t + r}`,
		`H ${e + n - o}`,
		`Q ${e + n} ${t + r} ${e + n} ${t + r - o}`,
		`V ${t + o}`,
		`Q ${e + n} ${t} ${e + n - o} ${t}`,
		"Z"
	].join(" ");
}, ya = (e, t, n, r, i) => {
	let a = i / t.length;
	return e.map((e, o) => {
		let s = o * i;
		return t.map((t, i) => {
			let o = Number(e[t.key]) || 0;
			if (r === "vertical") {
				let t = n.plotHeight - n.valueToY(o);
				return {
					x: s + i * a,
					y: n.valueToY(o),
					width: a,
					height: t,
					value: o,
					label: e.label,
					seriesIndex: i
				};
			}
			let c = Math.min(a, 32);
			return {
				x: 0,
				y: s + i * c,
				width: n.valueToX(o),
				height: c,
				value: o,
				label: e.label,
				seriesIndex: i
			};
		});
	});
}, ba = (e, t, n, r, i) => {
	let a = i * ga, o = (i - a) / 2;
	return e.map((e, s) => {
		let c = 0, l = s * i;
		return t.map((t, i) => {
			let s = Number(e[t.key]) || 0;
			if (r === "vertical") {
				let t = n.plotHeight - n.valueToY(c + s), r = l + o, u = n.valueToY(c + s);
				return c += s, {
					x: r,
					y: u,
					width: a,
					height: t,
					value: s,
					label: e.label,
					seriesIndex: i
				};
			}
			let u = a, d = n.valueToX(c), f = l + o;
			return c += s, {
				x: d,
				y: f,
				width: n.valueToX(s),
				height: u,
				value: s,
				label: e.label,
				seriesIndex: i
			};
		});
	});
}, xa = (e, t, n, r, i, a) => e === "stacked" ? ba(t, n, r, i, a) : ya(t, n, r, i, a), Sa = (e, t, n) => t.map((t) => ({
	name: t.name,
	value: Number(e[n][t.key]) || 0,
	color: t.color
})), Ca = ({ barGroups: n, series: r, orientation: i, barRadius: a, onBarMouseEnter: o, onBarMouseLeave: s }) => /* @__PURE__ */ t(e, { children: n.map((e, n) => e.map((e, c) => {
	let l = r[e.seriesIndex];
	return /* @__PURE__ */ t("path", {
		className: "bui-bar-chart-bar",
		d: va(e.x, e.y, e.width, e.height, a, i),
		style: { "--bui-series-color": l.color },
		onMouseEnter: (t) => o(t, e.label, n),
		onMouseLeave: s
	}, `bar-${n}-${c}`);
})) });
//#endregion
//#region src/components/Charts/common/ChartTooltip.tsx
function wa({ tooltip: e, tooltipRef: r }) {
	return e.visible ? /* @__PURE__ */ n("div", {
		ref: r,
		className: "bui-chart-tooltip",
		style: {
			position: "absolute",
			left: e.x,
			top: e.y,
			transform: "translate(-50%, -110%)"
		},
		children: [/* @__PURE__ */ t("span", {
			className: "bui-chart-tooltip-label",
			children: e.label
		}), e.entries.map((e) => /* @__PURE__ */ n("div", {
			className: "bui-chart-tooltip-row",
			style: { "--bui-series-color": e.color },
			children: [
				/* @__PURE__ */ t("span", { className: "bui-chart-tooltip-dot" }),
				/* @__PURE__ */ t("span", { children: e.name }),
				/* @__PURE__ */ t("span", {
					className: "bui-chart-tooltip-value",
					children: e.value.toLocaleString()
				})
			]
		}, e.name))]
	}) : null;
}
//#endregion
//#region src/components/Charts/common/useChartTooltip.ts
var Ta = {
	visible: !1,
	x: 0,
	y: 0,
	label: "",
	entries: []
};
function Ea() {
	let [e, t] = g(Ta), n = h(null);
	return {
		tooltip: e,
		showTooltip: c((e, n, r, i) => {
			t({
				visible: !0,
				x: e,
				y: n,
				label: r,
				entries: i
			});
		}, []),
		hideTooltip: c(() => {
			t(Ta);
		}, []),
		tooltipRef: n
	};
}
//#endregion
//#region src/components/Charts/Barchart/bar_chart.tsx
function Da({ data: r, series: i, className: a, height: o, orientation: s = "vertical", layout: l = "grouped", title: u, subtitle: d, showLegend: f = !0, showTooltip: p = !0, showGrid: m = !0, barRadius: g = 4 }) {
	let _ = h(null), { tooltip: v, showTooltip: y, hideTooltip: b, tooltipRef: x } = Ea(), S = ia(i), C = na, w = 600 - C.left - C.right, T = 300 - C.top - C.bottom, E = _a(s, r.length, w, T), D = ua(r, S, w, T), O = xa(l, r, S, D, s, E), k = c((e, t, n) => {
		if (!p || !_.current) return;
		let i = _.current.getBoundingClientRect();
		y(e.clientX - i.left, e.clientY - i.top, t, Sa(r, S, n).map((e) => ({
			...e,
			color: e.color ?? "var(--bui-color-primary-main)"
		})));
	}, [
		p,
		y,
		r,
		S
	]), A = o ? "bui-chart-canvas bui-chart-canvas--fixed" : "bui-chart-canvas", j = o ? { "--bui-chart-height": `${o}px` } : void 0, M = s === "vertical", N = D.yTicks;
	return /* @__PURE__ */ n("div", {
		className: la(s, a),
		children: [
			/* @__PURE__ */ t(da, {
				title: u,
				subtitle: d
			}),
			/* @__PURE__ */ t(fa, {
				series: S,
				isVisible: f
			}),
			/* @__PURE__ */ t("div", {
				className: A,
				style: j,
				children: /* @__PURE__ */ n("div", {
					style: {
						position: "relative",
						width: "100%",
						height: "100%"
					},
					children: [/* @__PURE__ */ t("svg", {
						ref: _,
						className: "bui-chart-svg",
						viewBox: "0 0 600 300",
						preserveAspectRatio: "xMidYMid meet",
						children: /* @__PURE__ */ n("g", {
							transform: `translate(${C.left}, ${C.top})`,
							children: [
								/* @__PURE__ */ t(pa, {
									isVisible: m,
									yTicks: N,
									valueToY: M ? D.valueToY : D.valueToX,
									plotWidth: w
								}),
								/* @__PURE__ */ t(Ca, {
									barGroups: O,
									series: S,
									orientation: s,
									barRadius: g,
									onBarMouseEnter: k,
									onBarMouseLeave: b
								}),
								M && /* @__PURE__ */ n(e, { children: [/* @__PURE__ */ t(ma, {
									isVisible: !0,
									yTicks: N,
									valueToY: D.valueToY,
									plotHeight: T
								}), /* @__PURE__ */ t(ha, {
									isVisible: !0,
									dataPoints: r,
									indexToX: (e) => e * E + E / 2,
									plotHeight: T
								})] }),
								!M && /* @__PURE__ */ n(e, { children: [/* @__PURE__ */ t(ha, {
									isVisible: !0,
									dataPoints: r,
									indexToX: (e) => e * E + E / 2,
									plotHeight: T
								}), /* @__PURE__ */ t(ma, {
									isVisible: !0,
									yTicks: N,
									valueToY: D.valueToX,
									plotHeight: T
								})] })
							]
						})
					}), /* @__PURE__ */ t(wa, {
						tooltip: v,
						tooltipRef: x
					})]
				})
			})
		]
	});
}
//#endregion
//#region src/components/Charts/LineChart/line_chart.ts
function Oa(e) {
	return oa("bui-chart", "bui-line-chart", e);
}
function ka(e, t, n, r) {
	let [i, a] = ca(e, t.map((e) => e.key)), o = sa(i, a), s = o[0], c = o[o.length - 1] - s || 1, l = e.length > 1 ? n / (e.length - 1) : n;
	return {
		yTicks: o,
		plotWidth: n,
		plotHeight: r,
		xStep: l,
		valueToY: (e) => r - (e - s) / c * r,
		indexToX: (e) => e * l
	};
}
function Aa(e, t) {
	return e.length === 0 ? "" : e.length === 1 ? `M ${e[0].x} ${e[0].y}` : t === "step" ? e.reduce((t, n, r) => r === 0 ? `M ${n.x} ${n.y}` : `${t} H ${(e[r - 1].x + n.x) / 2} V ${n.y} H ${n.x}`, "") : t === "monotone" ? Ma(e) : e.reduce((e, t, n) => n === 0 ? `M ${t.x} ${t.y}` : `${e} L ${t.x} ${t.y}`, "");
}
function ja(e, t, n) {
	if (e.length === 0) return "";
	let r = Aa(e, t), i = e[e.length - 1], a = e[0];
	return `${r} L ${i.x} ${n} L ${a.x} ${n} Z`;
}
function Ma(e) {
	let t = e.length, n = [], r = [], i = [];
	for (let a = 0; a < t - 1; a++) n[a] = e[a + 1].x - e[a].x, r[a] = e[a + 1].y - e[a].y, i[a] = r[a] / n[a];
	let a = Array(t);
	a[0] = i[0], a[t - 1] = i[t - 2];
	for (let e = 1; e < t - 1; e++) i[e - 1] * i[e] <= 0 ? a[e] = 0 : a[e] = (i[e - 1] + i[e]) / 2;
	let o = `M ${e[0].x} ${e[0].y}`;
	for (let r = 0; r < t - 1; r++) {
		let t = e[r].x + n[r] / 3, i = e[r].y + a[r] * n[r] / 3, s = e[r + 1].x - n[r] / 3, c = e[r + 1].y - a[r + 1] * n[r] / 3;
		o += ` C ${t} ${i}, ${s} ${c}, ${e[r + 1].x} ${e[r + 1].y}`;
	}
	return o;
}
//#endregion
//#region src/components/Charts/LineChart/LineChart.helpers.ts
var Na = (e, t, n) => t.map((t) => ({
	name: t.name,
	value: Number(e[n][t.key]) || 0,
	color: t.color ?? ""
})), Pa = (e, t, n) => e.map((e, r) => ({
	x: t.indexToX(r),
	y: t.valueToY(Number(e[n]) || 0)
})), Fa = (e, t) => {
	if (!t.current) return {
		x: 0,
		y: 0
	};
	let n = t.current.getBoundingClientRect();
	return {
		x: e.clientX - n.left,
		y: e.clientY - n.top
	};
}, Ia = ({ isVisible: n, series: r, buildPoints: i, curve: a, plotHeight: o }) => n ? /* @__PURE__ */ t(e, { children: r.map((e) => /* @__PURE__ */ t("path", {
	className: "bui-line-chart-area",
	d: ja(i(e.key), a, o),
	style: { "--bui-series-color": e.color }
}, `area-${e.key}`)) }) : null, La = ({ series: n, buildPoints: r, curve: i }) => /* @__PURE__ */ t(e, { children: n.map((e) => /* @__PURE__ */ t("path", {
	className: "bui-line-chart-line",
	d: Aa(r(e.key), i),
	style: { "--bui-series-color": e.color }
}, `line-${e.key}`)) }), Ra = ({ isVisible: n, series: r, dataPoints: i, buildPoints: a, onDotMouseEnter: o, onDotMouseLeave: s }) => n ? /* @__PURE__ */ t(e, { children: r.map((e) => i.map((n, r) => {
	let i = a(e.key)[r];
	return /* @__PURE__ */ t("circle", {
		className: "bui-line-chart-dot",
		cx: i.x,
		cy: i.y,
		style: { "--bui-series-color": e.color },
		onMouseEnter: (e) => o(e, r),
		onMouseLeave: s
	}, `dot-${e.key}-${r}`);
})) }) : null;
//#endregion
//#region src/components/Charts/LineChart/line_chart.tsx
function za({ data: e, series: r, className: i, height: a, title: o, subtitle: s, curve: l = "monotone", showArea: u = !1, showDots: d = !0, showLegend: f = !0, showTooltip: p = !0, showGrid: m = !0, showAxes: g = !0 }) {
	let _ = h(null), { tooltip: v, showTooltip: y, hideTooltip: b, tooltipRef: x } = Ea(), S = ia(r), C = na, w = 600 - C.left - C.right, T = 300 - C.top - C.bottom, E = ka(e, S, w, T), D = c((t, n) => {
		if (!p || !_.current) return;
		let r = Fa(t, _), i = e[n].label, a = Na(e, S, n);
		y(r.x, r.y, i, a);
	}, [
		p,
		y,
		e,
		S
	]), O = a ? "bui-chart-canvas bui-chart-canvas--fixed" : "bui-chart-canvas", k = a ? { "--bui-chart-height": `${a}px` } : void 0, A = (t) => Pa(e, E, t);
	return /* @__PURE__ */ n("div", {
		className: Oa(i),
		children: [
			/* @__PURE__ */ t(da, {
				title: o,
				subtitle: s
			}),
			/* @__PURE__ */ t(fa, {
				series: S,
				isVisible: f
			}),
			/* @__PURE__ */ t("div", {
				className: O,
				style: k,
				children: /* @__PURE__ */ n("div", {
					style: {
						position: "relative",
						width: "100%",
						height: "100%"
					},
					children: [/* @__PURE__ */ t("svg", {
						ref: _,
						className: "bui-chart-svg",
						viewBox: "0 0 600 300",
						preserveAspectRatio: "xMidYMid meet",
						children: /* @__PURE__ */ n("g", {
							transform: `translate(${C.left}, ${C.top})`,
							children: [
								/* @__PURE__ */ t(pa, {
									isVisible: m,
									yTicks: E.yTicks,
									valueToY: E.valueToY,
									plotWidth: w
								}),
								/* @__PURE__ */ t(Ia, {
									isVisible: u,
									series: S,
									buildPoints: A,
									curve: l,
									plotHeight: T
								}),
								/* @__PURE__ */ t(La, {
									series: S,
									buildPoints: A,
									curve: l
								}),
								/* @__PURE__ */ t(Ra, {
									isVisible: d,
									series: S,
									dataPoints: e,
									buildPoints: A,
									onDotMouseEnter: D,
									onDotMouseLeave: b
								}),
								/* @__PURE__ */ t(ma, {
									isVisible: g,
									yTicks: E.yTicks,
									valueToY: E.valueToY,
									plotHeight: T
								}),
								/* @__PURE__ */ t(ha, {
									isVisible: g,
									dataPoints: e,
									indexToX: E.indexToX,
									plotHeight: T
								})
							]
						})
					}), /* @__PURE__ */ t(wa, {
						tooltip: v,
						tooltipRef: x
					})]
				})
			})
		]
	});
}
//#endregion
//#region src/components/Timeline/time_line.ts
function Ba(e, t) {
	return [
		"bui-timeline",
		`bui-timeline--${e}`,
		t
	].filter(Boolean).join(" ");
}
function Va(e, t) {
	return [
		"bui-timeline-item",
		e ? "bui-timeline-item--selected" : "",
		t ? "bui-timeline-item--expanded" : ""
	].filter(Boolean).join(" ");
}
function Ha(e = "pending", t) {
	return t || {
		pending: "var(--bui-color-text-disabled, #c4c9d4)",
		active: "var(--bui-color-primary-main)",
		completed: "var(--bui-color-success-main)",
		error: "var(--bui-color-error-main)"
	}[e];
}
function Ua(e, t) {
	return e < t - 1;
}
//#endregion
//#region src/components/Timeline/time_line.tsx
function Wa() {
	return /* @__PURE__ */ t("svg", {
		className: "bui-timeline-toggle-icon",
		width: "12",
		height: "12",
		viewBox: "0 0 12 12",
		fill: "none",
		"aria-hidden": "true",
		children: /* @__PURE__ */ t("path", {
			d: "M2 4L6 8L10 4",
			stroke: "currentColor",
			strokeWidth: "1.5",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
function Ga({ item: e, isSelected: r, isExpanded: i, index: a, total: o, onSelect: s, onToggleExpand: l }) {
	let u = Ha(e.status, e.color), d = !!e.children, f = Ua(a, o), p = c(() => {
		s(e.key);
	}, [e.key, s]), m = c((t) => {
		t.stopPropagation(), l(e.key);
	}, [e.key, l]);
	return /* @__PURE__ */ n("div", {
		className: Va(r, i),
		style: { "--bui-timeline-node-color": u },
		onClick: p,
		role: "button",
		tabIndex: 0,
		"aria-selected": r,
		"aria-expanded": d ? i : void 0,
		onKeyDown: (e) => {
			(e.key === "Enter" || e.key === " ") && p();
		},
		children: [/* @__PURE__ */ n("div", {
			className: "bui-timeline-track",
			children: [/* @__PURE__ */ t("div", {
				className: "bui-timeline-node",
				"aria-hidden": "true"
			}), f && /* @__PURE__ */ t("div", {
				className: "bui-timeline-connector",
				"aria-hidden": "true"
			})]
		}), /* @__PURE__ */ n("div", {
			className: "bui-timeline-content",
			children: [
				/* @__PURE__ */ n("div", {
					className: "bui-timeline-header",
					children: [e.date && /* @__PURE__ */ t("span", {
						className: "bui-timeline-date",
						children: e.date
					}), d && /* @__PURE__ */ t("button", {
						className: "bui-timeline-toggle",
						onClick: m,
						"aria-label": i ? "Colapsar" : "Expandir",
						type: "button",
						children: /* @__PURE__ */ t(Wa, {})
					})]
				}),
				/* @__PURE__ */ t("h4", {
					className: "bui-timeline-title",
					children: e.title
				}),
				e.description && /* @__PURE__ */ t("p", {
					className: "bui-timeline-description",
					children: e.description
				}),
				d && /* @__PURE__ */ t("div", {
					className: "bui-timeline-expandable",
					"aria-hidden": !i,
					children: /* @__PURE__ */ t("div", {
						className: "bui-timeline-expandable-inner",
						children: e.children
					})
				})
			]
		})]
	});
}
function Ka({ items: e, orientation: n = "vertical", className: r, expandedKeys: i, selectedKey: a, onExpandChange: o, onSelect: s }) {
	let [l, u] = g(/* @__PURE__ */ new Set()), [d, f] = g(null), m = i !== void 0, h = a !== void 0, _ = p(() => m ? new Set(i) : l, [
		i,
		l,
		m
	]), v = h ? a : d, y = c((e) => {
		let t = _.has(e);
		m || u((n) => {
			let r = new Set(n);
			return t ? r.delete(e) : r.add(e), r;
		}), o?.(e, !t);
	}, [
		_,
		m,
		o
	]), b = c((e) => {
		h || f((t) => t === e ? null : e), s?.(e);
	}, [h, s]);
	return /* @__PURE__ */ t("div", {
		className: Ba(n, r),
		children: e.map((n, r) => /* @__PURE__ */ t(Ga, {
			item: n,
			index: r,
			total: e.length,
			isSelected: v === n.key,
			isExpanded: _.has(n.key),
			isLast: r === e.length - 1,
			onSelect: b,
			onToggleExpand: y
		}, n.key))
	});
}
//#endregion
//#region src/components/Toggle/toggle.tsx
function qa(e) {
	let [r, i] = g({ hasError: !1 }), [a, o] = Z({
		value: e.value,
		defaultValue: e.value ?? e.defaultValue ?? !1
	}), s = e.validate?.status ? {
		hasError: !0,
		message: e.validate.message
	} : r, c = () => {
		e.required === !0 && !a && i({
			hasError: !0,
			message: "El campo es requerido"
		});
	}, l = () => {
		if (e.readonly || e.disabled) return;
		let t = !a;
		o(t), i({ hasError: !1 }), e.onChange?.(t);
	}, u = ["bui-toggle-track", a && "bui-toggle-track--on"].filter(Boolean).join(" "), d = ["bui-toggle-thumb", a && "bui-toggle-thumb--on"].filter(Boolean).join(" ");
	return /* @__PURE__ */ n("div", {
		className: `bui-toggle-wrapper flex flex-col gap-[8px]${e.labelPosition === "left" ? " items-end" : ""}`,
		children: [
			/* @__PURE__ */ n("label", {
				className: `inline-flex items-center gap-[8px] text-[var(--color-text-2)] text-[13px] ${e.disabled || e.readonly ? "bui-toggle-disabled" : ""}`,
				children: [
					e.labelPosition === "left" && /* @__PURE__ */ t("span", {
						className: "bui-toggle-label",
						children: e.label
					}),
					/* @__PURE__ */ t("input", {
						id: e.id,
						name: e.name,
						type: "checkbox",
						className: "sr-only",
						checked: a,
						disabled: e.disabled,
						required: e.required,
						onChange: l,
						onBlur: () => {
							c(), e.onBlur?.();
						},
						onFocus: () => {
							i({ hasError: !1 }), e.onFocus?.();
						}
					}),
					/* @__PURE__ */ t("span", {
						className: u,
						"aria-hidden": "true",
						children: /* @__PURE__ */ t("span", {
							className: d,
							children: a && /* @__PURE__ */ t("svg", {
								viewBox: "0 0 24 24",
								className: "bui-toggle-icon",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "4",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ t("polyline", { points: "20 6 9 17 4 12" })
							})
						})
					}),
					e.labelPosition !== "left" && /* @__PURE__ */ t("span", {
						className: "bui-toggle-label",
						children: e.label
					})
				]
			}),
			e.helperText && !s.hasError && /* @__PURE__ */ t("span", {
				className: "self-start m-0 text-[var(--color-text-3)] text-[12px] leading-[1.45]",
				children: e.helperText
			}),
			s.hasError && /* @__PURE__ */ t("span", {
				className: "self-start mt-[-2px] text-[var(--color-error-main)] text-[12px] leading-[1.45]",
				children: s.message
			})
		]
	});
}
//#endregion
//#region src/components/Toggle/toggleMixed.tsx
function Ja(e) {
	return e === !1 ? !0 : e === !0 ? null : !1;
}
function Ya(e) {
	let [r, i] = g({ hasError: !1 }), [a, o] = Z({
		value: e.value,
		defaultValue: e.value ?? e.defaultValue ?? !1
	}), s = h(null), c = e.validate?.status ? {
		hasError: !0,
		message: e.validate.message
	} : r;
	u(() => {
		s.current && (s.current.indeterminate = a === null);
	}, [a]);
	let l = () => {
		e.required === !0 && !a && i({
			hasError: !0,
			message: "El campo es requerido"
		});
	}, d = () => {
		if (e.readonly || e.disabled) return;
		let t = Ja(a);
		o(t), i({ hasError: !1 }), e.onChange?.(t);
	}, f = a === !0, p = a === null, m = ["bui-toggle-track", f && "bui-toggle-track--on"].filter(Boolean).join(" "), _ = [
		"bui-toggle-thumb",
		f && "bui-toggle-thumb--on",
		p && "bui-toggle-thumb--mixed"
	].filter(Boolean).join(" ");
	return /* @__PURE__ */ n("div", {
		className: `bui-toggle-wrapper flex flex-col gap-[8px]${e.labelPosition === "left" ? " items-end" : ""}`,
		children: [
			/* @__PURE__ */ n("label", {
				className: `inline-flex items-center gap-[8px] text-[var(--color-text-2)] text-[13px] ${e.disabled || e.readonly ? "bui-toggle-disabled" : ""}`,
				children: [
					e.labelPosition === "left" && /* @__PURE__ */ t("span", {
						className: "bui-toggle-label",
						children: e.label
					}),
					/* @__PURE__ */ t("input", {
						ref: s,
						id: e.id,
						name: e.name,
						type: "checkbox",
						className: "sr-only",
						checked: f,
						disabled: e.disabled,
						required: e.required,
						onChange: d,
						onBlur: () => {
							l(), e.onBlur?.();
						},
						onFocus: () => {
							i({ hasError: !1 }), e.onFocus?.();
						}
					}),
					/* @__PURE__ */ t("span", {
						className: m,
						"aria-hidden": "true",
						children: /* @__PURE__ */ n("span", {
							className: _,
							children: [f && /* @__PURE__ */ t("svg", {
								viewBox: "0 0 24 24",
								className: "bui-toggle-icon",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "4",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ t("polyline", { points: "20 6 9 17 4 12" })
							}), p && /* @__PURE__ */ t("svg", {
								viewBox: "0 0 24 24",
								className: "bui-toggle-icon",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "4",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ t("line", {
									x1: "6",
									y1: "12",
									x2: "18",
									y2: "12"
								})
							})]
						})
					}),
					e.labelPosition !== "left" && /* @__PURE__ */ t("span", {
						className: "bui-toggle-label",
						children: e.label
					})
				]
			}),
			e.helperText && !c.hasError && /* @__PURE__ */ t("span", {
				className: "self-start m-0 text-[var(--color-text-3)] text-[12px] leading-[1.45]",
				children: e.helperText
			}),
			c.hasError && /* @__PURE__ */ t("span", {
				className: "self-start mt-[-2px] text-[var(--color-error-main)] text-[12px] leading-[1.45]",
				children: c.message
			})
		]
	});
}
//#endregion
//#region src/components/Audit/audit_utils.ts
function Xa(...e) {
	return e.filter(Boolean).join(" ");
}
function Za(e = 4) {
	return `bui-key-value-grid-${e}`;
}
//#endregion
//#region src/components/Audit/audit_status_dot.tsx
function Qa({ active: e, className: n, label: r, tone: i = "default" }) {
	return /* @__PURE__ */ t("span", {
		"aria-label": r ? String(r) : void 0,
		className: Xa("bui-audit-status-dot", `bui-audit-status-dot-${i}`, e && "bui-audit-status-dot-selected", n),
		role: r ? "img" : void 0,
		title: r ? String(r) : void 0
	});
}
//#endregion
//#region src/components/Audit/use_case_carousel_motion.ts
function $a(e, t, n, r, i) {
	u(() => {
		let n = e.current, a = t.current;
		if (!r || !n || !a) return;
		let o = matchMedia("(prefers-reduced-motion: reduce)"), s = 0, c = 0, l = performance.now() + 3e3, u = !1, d = !1, f = !1, p = 0, m = 0, h = null, g = a.scrollLeft, _ = 0, v = 0, y = 0, b = !1, x = () => {
			b = !1, i || (cancelAnimationFrame(s), s = 0), l = performance.now() + 4e3, g = a.scrollLeft;
		}, S = () => {
			u = !0;
		}, C = () => {
			u = !1, l = performance.now() + 4e3;
		}, w = (e) => {
			x(), f = !1, n.dataset.input = "pointer", !(e.pointerType !== "mouse" || e.button !== 0) && (h = e.pointerId, d = !0, p = e.clientX, m = a.scrollLeft, v = e.clientX, y = performance.now(), _ = 0);
		}, T = (e) => {
			if (!d || e.pointerId !== h) return;
			let t = e.clientX - p, n = performance.now(), r = Math.max(8, n - y);
			_ = _ * .25 + (v - e.clientX) / r * .75, v = e.clientX, y = n, !f && Math.abs(t) > 7 && (f = !0, a.setPointerCapture(e.pointerId)), f && (e.preventDefault(), a.dataset.dragging = "true", a.scrollLeft = m - t);
		}, E = () => {
			d && (d = !1, delete a.dataset.dragging, h !== null && a.hasPointerCapture(h) && a.releasePointerCapture(h), h = null, g = a.scrollLeft, l = performance.now() + 4e3, _ = Math.max(-2.8, Math.min(2.8, _)), b = f && performance.now() - y < 100 && !o.matches, b && !s && (c = 0, s = requestAnimationFrame(j)));
		}, D = () => {
			d = !1, h !== null && a.hasPointerCapture(h) && a.releasePointerCapture(h), h = null, delete a.dataset.dragging, x();
		}, O = () => {
			f = !1, n.dataset.input = "keyboard", x();
		}, k = (e) => e.preventDefault(), A = (e) => {
			f &&= (e.preventDefault(), e.stopPropagation(), !1);
		}, j = (e) => {
			let t = c ? Math.min(e - c, 40) : 0;
			c = e;
			let r = !i || o.matches || document.hidden || u || d || n.contains(document.activeElement) || e < l;
			if (b && !d && !o.matches && !document.hidden) {
				let n = Math.max(0, a.scrollWidth - a.clientWidth), r = Math.exp(-t / 240);
				g = Math.max(0, Math.min(n, g + _ * 240 * (1 - r))), _ *= r, a.scrollLeft = g, (Math.abs(_) < .025 || g === 0 || g === n) && (b = !1, l = e + 4e3);
			} else !r && a.scrollWidth > a.clientWidth + 2 ? (g = Math.min(a.scrollWidth - a.clientWidth, g + t * .032), a.scrollLeft = g) : g = a.scrollLeft;
			(o.matches || document.hidden) && (b = !1), s = i || b ? requestAnimationFrame(j) : 0;
		};
		return n.addEventListener("pointerenter", S), n.addEventListener("pointerleave", C), n.addEventListener("wheel", x, { passive: !0 }), n.addEventListener("keydown", O), n.addEventListener("focusin", x), document.addEventListener("visibilitychange", x), n.addEventListener("pointerdown", x), a.addEventListener("pointerdown", w), a.addEventListener("dragstart", k), window.addEventListener("pointermove", T, { passive: !1 }), window.addEventListener("pointerup", E), window.addEventListener("pointercancel", D), window.addEventListener("blur", D), a.addEventListener("click", A, !0), i && (s = requestAnimationFrame(j)), () => {
			D(), cancelAnimationFrame(s), n.removeEventListener("pointerenter", S), n.removeEventListener("pointerleave", C), n.removeEventListener("wheel", x), n.removeEventListener("keydown", O), n.removeEventListener("pointerdown", x), n.removeEventListener("focusin", x), document.removeEventListener("visibilitychange", x), a.removeEventListener("pointerdown", w), a.removeEventListener("dragstart", k), a.removeEventListener("click", A, !0), window.removeEventListener("pointermove", T), window.removeEventListener("pointerup", E), window.removeEventListener("pointercancel", D), window.removeEventListener("blur", D);
		};
	}, [
		n,
		r,
		i,
		e,
		t
	]);
}
//#endregion
//#region src/components/Audit/case_carousel_geometry.ts
function eo(e, t, n) {
	let r = Math.max(0, n - t);
	return {
		previous: e > 1,
		next: e < r - 1
	};
}
function to(e, t, n, r) {
	return e < n || t - e > r - n ? e - n : t > r ? t - r : 0;
}
//#endregion
//#region src/components/Audit/use_case_carousel_navigation.ts
function no(e, t) {
	let n = e.querySelector(".bui-case-card[aria-pressed=\"true\"]");
	if (!n) return;
	let r = e.getBoundingClientRect(), i = n.getBoundingClientRect(), a = to(i.left, i.right, r.left + 4, r.right - 4);
	a && e.scrollBy({
		left: a,
		behavior: t
	});
}
function ro(e, t, n) {
	let [r, i] = g({
		previous: !1,
		next: !1
	}), a = h(!1);
	u(() => {
		let t = e.current;
		if (!t) return;
		let n = () => {
			let e = eo(t.scrollLeft, t.clientWidth, t.scrollWidth);
			i((t) => t.previous === e.previous && t.next === e.next ? t : e);
		};
		n();
		let r = new ResizeObserver(() => {
			n(), no(t, "instant");
		});
		return r.observe(t), t.addEventListener("scroll", n, { passive: !0 }), () => {
			r.disconnect(), t.removeEventListener("scroll", n);
		};
	}, [t, e]), u(() => {
		let t = e.current;
		t && (no(t, !a.current || matchMedia("(prefers-reduced-motion: reduce)").matches || t.closest(".bui-case-carousel")?.dataset.input === "keyboard" ? "instant" : "smooth"), a.current = !0);
	}, [
		t,
		n,
		e
	]);
	let o = (t, n) => {
		let r = e.current;
		if (!r) return;
		let i = (r.querySelector(".bui-case-card")?.offsetWidth ?? 250) + (parseFloat(getComputedStyle(r).gap) || 10);
		r.scrollBy({
			left: t * i,
			behavior: n || matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
		});
	};
	return {
		...r,
		scroll: o
	};
}
//#endregion
//#region src/components/Audit/case_carousel.tsx
function io() {
	return /* @__PURE__ */ t("svg", {
		className: "bui-audit-icon",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: /* @__PURE__ */ t("path", { d: "m15 18-6-6 6-6" })
	});
}
function ao() {
	return /* @__PURE__ */ t("svg", {
		className: "bui-audit-icon",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: /* @__PURE__ */ t("path", { d: "m9 18 6-6-6-6" })
	});
}
function oo({ className: e, variant: r = "default", autoAdvance: i = !1, emptyState: a = "Sin casos disponibles.", items: o, onSelect: s, selectedKey: c, ...l }) {
	let u = h(null), d = h(null), f = JSON.stringify(o.map((e) => e.key));
	$a(u, d, f, r === "interactive", i);
	let p = ro(d, f, c);
	return /* @__PURE__ */ n("div", {
		...l,
		role: l.role ?? "group",
		"aria-label": l["aria-label"] ?? "Selector de casos",
		ref: u,
		className: Xa("bui-case-carousel", r === "interactive" && "bui-case-carousel-interactive", e),
		children: [
			/* @__PURE__ */ t("button", {
				"aria-label": "Ver casos anteriores",
				className: "bui-case-carousel-nav",
				disabled: !p.previous,
				onClick: (e) => p.scroll(-1, e.detail === 0),
				type: "button",
				children: /* @__PURE__ */ t(io, {})
			}),
			/* @__PURE__ */ t("div", {
				className: "bui-case-carousel-strip",
				ref: d,
				children: o.length ? o.map((e, i) => {
					let a = e.key === c;
					return /* @__PURE__ */ n("button", {
						"aria-pressed": a,
						"data-case-key": e.key,
						tabIndex: a || !o.some((e) => e.key === c) && i === 0 ? 0 : -1,
						className: Xa("bui-case-card", a && "bui-case-card-active"),
						onClick: (t) => {
							u.current && (u.current.dataset.input = t.detail === 0 ? "keyboard" : "pointer"), s?.(e.key, e);
						},
						onKeyDown: (e) => {
							let t = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
							if (!t && e.key !== "Home" && e.key !== "End") return;
							e.preventDefault(), u.current && (u.current.dataset.input = "keyboard");
							let n = e.key === "Home" ? 0 : e.key === "End" ? o.length - 1 : Math.max(0, Math.min(o.length - 1, i + t));
							(d.current?.querySelectorAll(".bui-case-card").item(n))?.focus({ preventScroll: !0 }), n !== i && s?.(o[n].key, o[n]);
						},
						type: "button",
						children: [
							/* @__PURE__ */ t(Qa, {
								active: r !== "interactive" && a,
								className: "bui-case-status-dot",
								label: e.statusLabel,
								tone: e.statusTone
							}),
							(e.eyebrow || r === "interactive") && /* @__PURE__ */ n("span", {
								className: "bui-case-card-head",
								children: [e.eyebrow && /* @__PURE__ */ t("span", {
									className: "bui-case-eyebrow",
									children: e.eyebrow
								}), r === "interactive" && a && /* @__PURE__ */ n("span", {
									className: "bui-case-selected-mark",
									"aria-hidden": "true",
									children: [/* @__PURE__ */ t(Ze, { size: 13 }), " Seleccionada"]
								})]
							}),
							/* @__PURE__ */ t("strong", { children: e.title }),
							e.subtitle && /* @__PURE__ */ t("small", { children: e.subtitle }),
							e.meta && /* @__PURE__ */ t("span", {
								className: "bui-case-meta-row",
								children: /* @__PURE__ */ t("em", { children: e.meta })
							})
						]
					}, e.key);
				}) : /* @__PURE__ */ t("div", {
					className: "bui-audit-empty",
					children: a
				})
			}),
			/* @__PURE__ */ t("button", {
				"aria-label": "Ver mas casos",
				className: "bui-case-carousel-nav",
				disabled: !p.next,
				onClick: (e) => p.scroll(1, e.detail === 0),
				type: "button",
				children: /* @__PURE__ */ t(ao, {})
			})
		]
	});
}
//#endregion
//#region src/components/Audit/flow_timeline.tsx
function so({ className: e, emptyState: r = "Sin eventos disponibles.", items: i, onSelect: a, reverseIndex: o = !1, selectedKey: s, variant: c = "cards", maxHeight: l, style: d, onKeyDown: f, ...p }) {
	let m = h(null), g = c === "connected";
	u(() => {
		if (!g) return;
		let e = m.current, t = e?.querySelector("[aria-current=\"step\"]");
		if (!e || !t) return;
		let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
		(r.top < n.top || r.bottom > n.bottom) && e.scrollTo({
			top: e.scrollTop + r.top - n.top - 8,
			behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
		});
	}, [
		g,
		s,
		i
	]);
	let _ = (e) => {
		if (f?.(e), e.defaultPrevented || !g || !a || ![
			"ArrowDown",
			"ArrowUp",
			"Home",
			"End"
		].includes(e.key)) return;
		let t = Array.from(m.current?.querySelectorAll(":scope > .bui-flow-step") ?? []), n = t.indexOf(document.activeElement);
		if (n < 0) return;
		e.preventDefault();
		let r = e.key === "Home" ? 0 : e.key === "End" ? t.length - 1 : Math.max(0, Math.min(t.length - 1, n + (e.key === "ArrowDown" ? 1 : -1)));
		t[r]?.focus({ preventScroll: !0 }), i[r] && a(i[r].key, i[r]);
	};
	return /* @__PURE__ */ t("div", {
		...p,
		ref: m,
		style: {
			...d,
			...l === void 0 ? {} : { maxHeight: l }
		},
		onKeyDown: _,
		className: Xa("bui-flow-timeline", g && "bui-flow-timeline-connected", e),
		children: i.length ? i.map((e, r) => {
			let c = e.key === s, l = o ? i.length - r : r + 1;
			return /* @__PURE__ */ n("button", {
				"aria-current": c ? "step" : void 0,
				className: Xa("bui-flow-step", c && "bui-flow-step-active", e.muted && "bui-flow-step-muted"),
				onClick: () => a?.(e.key, e),
				type: "button",
				children: [
					/* @__PURE__ */ t("span", {
						className: "bui-flow-step-track",
						"aria-hidden": "true",
						children: /* @__PURE__ */ t("span", {
							className: "bui-flow-step-index",
							children: l
						})
					}),
					/* @__PURE__ */ n("span", {
						className: "bui-flow-step-copy",
						children: [
							g && e.markerLabel && /* @__PURE__ */ t("span", {
								className: "bui-flow-marker-label",
								children: e.markerLabel
							}),
							/* @__PURE__ */ t("strong", { children: e.title }),
							!g && (e.description || e.meta) && /* @__PURE__ */ n("small", { children: [
								e.description,
								e.description && e.meta ? " / " : "",
								e.meta
							] }),
							g && e.description && /* @__PURE__ */ t("small", { children: e.description }),
							g && e.meta && /* @__PURE__ */ t("small", {
								className: "bui-flow-meta",
								children: e.meta
							}),
							g && e.timestamp && /* @__PURE__ */ t("time", {
								className: "bui-flow-time",
								dateTime: e.timestamp.dateTime,
								children: e.timestamp.label
							})
						]
					}),
					e.statusLabel && /* @__PURE__ */ t(X, {
						tone: e.statusTone,
						children: e.statusLabel
					})
				]
			}, e.key);
		}) : /* @__PURE__ */ t("div", {
			className: "bui-audit-empty",
			children: r
		})
	});
}
//#endregion
//#region src/components/Audit/key_value_grid.tsx
function co({ className: e, columns: r = 4, items: i, ...a }) {
	return /* @__PURE__ */ t("div", {
		...a,
		className: Xa("bui-key-value-grid", Za(r), e),
		children: i.map((e, r) => /* @__PURE__ */ n("div", {
			className: "bui-key-value-item",
			children: [/* @__PURE__ */ t("span", { children: e.label }), /* @__PURE__ */ t("strong", { children: e.value })]
		}, `${String(e.label)}-${r}`))
	});
}
//#endregion
//#region src/components/Audit/evidence_viewer.tsx
function lo() {
	return /* @__PURE__ */ n("svg", {
		className: "bui-evidence-camera",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ t("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }), /* @__PURE__ */ t("circle", {
			cx: "12",
			cy: "13",
			r: "4"
		})]
	});
}
function uo({ direction: e }) {
	return /* @__PURE__ */ t("svg", {
		className: "bui-audit-icon",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: e === "previous" ? /* @__PURE__ */ t("path", { d: "m15 18-6-6 6-6" }) : /* @__PURE__ */ t("path", { d: "m9 18 6-6-6-6" })
	});
}
function fo(e, t) {
	let n = Math.max(0, e.findIndex((e) => e.key === t));
	return [e[n], e[n] ? n : -1];
}
function po({ className: r, emptyState: i = "Sin evidencias asociadas.", items: a, onSelect: o, selectedKey: s, ...c }) {
	let [l, u] = fo(a, s), d = u > 0, f = u >= 0 && u < a.length - 1, p = (e) => {
		let t = a[e];
		t && o?.(t.key, t);
	};
	return /* @__PURE__ */ t("section", {
		...c,
		className: Xa("bui-evidence-viewer", r),
		children: l ? /* @__PURE__ */ n("div", {
			className: "bui-evidence-layout",
			children: [
				/* @__PURE__ */ t("button", {
					"aria-label": "Evidencia anterior",
					className: "bui-evidence-nav",
					disabled: !d,
					onClick: () => p(u - 1),
					type: "button",
					children: /* @__PURE__ */ t(uo, { direction: "previous" })
				}),
				/* @__PURE__ */ n("article", {
					className: "bui-evidence-card",
					children: [
						/* @__PURE__ */ n("header", {
							className: "bui-evidence-head",
							children: [
								/* @__PURE__ */ n("span", { children: [
									l.type ?? "Evidencia",
									" ",
									u + 1,
									" de ",
									a.length
								] }),
								/* @__PURE__ */ t("strong", { children: l.title }),
								l.capturedAt && /* @__PURE__ */ t("small", { children: l.capturedAt })
							]
						}),
						/* @__PURE__ */ t("div", {
							className: Xa("bui-evidence-frame", `bui-evidence-frame-${l.statusTone ?? "default"}`),
							children: l.imageSrc ? /* @__PURE__ */ t("img", {
								src: l.imageSrc,
								alt: l.imageAlt ?? String(l.title)
							}) : /* @__PURE__ */ n(e, { children: [/* @__PURE__ */ t(lo, {}), /* @__PURE__ */ n("span", { children: ["Foto ", u + 1] })] })
						}),
						(l.observation || l.statusLabel || l.observationTitle) && /* @__PURE__ */ n("div", {
							className: "bui-evidence-observation",
							children: [
								/* @__PURE__ */ t("span", { children: "Observaciones" }),
								l.statusLabel && /* @__PURE__ */ t(X, {
									tone: l.statusTone,
									children: l.statusLabel
								}),
								l.observationTitle && /* @__PURE__ */ t("strong", { children: l.observationTitle }),
								l.observation && /* @__PURE__ */ t("p", { children: l.observation })
							]
						})
					]
				}),
				/* @__PURE__ */ t("button", {
					"aria-label": "Siguiente evidencia",
					className: "bui-evidence-nav",
					disabled: !f,
					onClick: () => p(u + 1),
					type: "button",
					children: /* @__PURE__ */ t(uo, { direction: "next" })
				})
			]
		}) : /* @__PURE__ */ t("div", {
			className: "bui-audit-empty",
			children: i
		})
	});
}
//#endregion
//#region src/components/Audit/control_point_list.tsx
function mo({ className: e, compact: r, emptyState: i = "Sin puntos de control asociados.", items: a, ...o }) {
	return /* @__PURE__ */ t("div", {
		...o,
		className: Xa("bui-control-point-list", r && "bui-control-point-list-compact", e),
		children: a.length ? a.map((e) => /* @__PURE__ */ n("article", {
			className: "bui-control-point",
			children: [/* @__PURE__ */ n("div", { children: [/* @__PURE__ */ t("strong", { children: e.title }), e.description && /* @__PURE__ */ t("span", { children: e.description })] }), e.statusLabel && /* @__PURE__ */ t(X, {
				tone: e.statusTone,
				children: e.statusLabel
			})]
		}, e.key)) : /* @__PURE__ */ t("div", {
			className: "bui-audit-empty",
			children: i
		})
	});
}
//#endregion
//#region src/components/Audit/comment_list.tsx
function ho({ className: e, emptyState: r = "Sin comentarios registrados.", items: i, ...a }) {
	return /* @__PURE__ */ t("div", {
		...a,
		className: Xa("bui-comment-list", e),
		children: i.length ? i.map((e) => /* @__PURE__ */ n("article", {
			className: "bui-comment-item",
			children: [
				/* @__PURE__ */ t("strong", { children: e.author }),
				e.date && /* @__PURE__ */ t("span", { children: e.date }),
				/* @__PURE__ */ t("p", { children: e.children })
			]
		}, e.key)) : /* @__PURE__ */ t("div", {
			className: "bui-audit-empty",
			children: r
		})
	});
}
//#endregion
//#region src/components/Mascot/mascot_master_limbs.tsx
function go({ id: r }) {
	return /* @__PURE__ */ n(e, { children: [
		"                ",
		/* @__PURE__ */ t("circle", {
			cx: "365",
			cy: "425",
			r: "24",
			fill: "#f4b511"
		}),
		/* @__PURE__ */ t("path", {
			d: "M349 402C378 399 408 441 436 412l19 20c-17 23-39 40-66 29l-40-14Z",
			fill: "#f4b511"
		}),
		/* @__PURE__ */ t("path", {
			d: "M350 408C383 406 416 434 437 411l15 19c-16 22-39 33-52 17l-50-11Z",
			fill: `url(#${r}-front)`
		})
	] });
}
function _o({ id: r }) {
	return /* @__PURE__ */ n(e, { children: [
		"                ",
		/* @__PURE__ */ t("path", {
			d: "M205 405c11-9 26 5 21 20-4 13-17 23-22 38-5 12 5 25 1 37-5 16-28 19-39 5-14-18-2-48 10-66 9-13 19-26 29-34Z",
			fill: "#f1b20d"
		}),
		/* @__PURE__ */ t("path", {
			d: "M206 402c11-7 25 7 20 21-4 11-17 24-23 39-5 11 3 22-1 32-5 12-22 15-34 8-15-10-5-42 8-63 9-14 20-28 30-37Z",
			fill: `url(#${r}-front)`
		})
	] });
}
function vo({ id: r }) {
	return /* @__PURE__ */ n(e, { children: [
		"                        ",
		/* @__PURE__ */ t("path", {
			d: "M441 404c7-6 20-6 27 1 6 7 7 23 0 30-7 8-24 8-32 0-6-6-4-16 2-20-2-4-1-8 3-11Z",
			fill: "#f4b511"
		}),
		/* @__PURE__ */ t("path", {
			d: "M443 402c7-5 17-4 22 2 6 6 6 19 1 26-6 7-19 8-27 2-5-4-4-11 2-14-4-5-3-11 2-16Z",
			fill: `url(#${r}-front)`
		})
	] });
}
//#endregion
//#region src/components/Mascot/maintenance_tool.tsx
function yo({ id: r }) {
	return /* @__PURE__ */ n(e, { children: [/* @__PURE__ */ n("g", {
		className: "bui-mascot__hammer",
		children: [
			/* @__PURE__ */ t("path", {
				d: "M445 348q9-6 18 0l2 98q-1 11-13 11t-11-11Z",
				fill: "var(--bui-mascot-ink)"
			}),
			/* @__PURE__ */ t("path", {
				d: "M449 351h10l2 94q0 6-8 6t-8-6Z",
				fill: "#5781a6"
			}),
			/* @__PURE__ */ t("path", {
				d: "m449 355-2 74",
				stroke: "#cbddeb",
				strokeWidth: "3.5",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ t("path", {
				d: "M433 322q-8-4-16 1l-23 17q-4 4 1 8l5 3 24-9-21 17q-4 4 2 7l6 2 25-12h30v7h13q6 0 6-6v-25q0-9-8-10Z",
				fill: "var(--bui-mascot-ink)"
			}),
			/* @__PURE__ */ t("path", {
				d: "m432 328-10-1-22 16 5 2 22-9 9 6h32v-14Z",
				fill: "#cbddeb"
			}),
			/* @__PURE__ */ t("path", {
				d: "m436 342h32v10h-32l-24 12-5-2 21-17Z",
				fill: "#5781a6"
			}),
			/* @__PURE__ */ t("path", {
				className: "bui-mascot__hammer-face",
				d: "M468 326h16.30999262681678v31q0 6-6 6H468Z",
				fill: "var(--bui-mascot-ink)"
			}),
			/* @__PURE__ */ t("path", {
				d: "M472 330h8v25q0 4-4 4h-4Z",
				fill: "#e8f1f8"
			})
		]
	}), /* @__PURE__ */ t("g", {
		className: "bui-mascot__grip",
		children: /* @__PURE__ */ t(vo, { id: r })
	})] });
}
//#endregion
//#region src/components/Mascot/mascot_artwork.tsx
function bo({ id: r, pose: i }) {
	let a = i === "neutral", o = i === "authentication", s = i === "forbidden", c = i === "maintenance";
	return /* @__PURE__ */ n(e, { children: [
		/* @__PURE__ */ n("defs", { children: [/* @__PURE__ */ n("linearGradient", {
			id: `${r}-peel`,
			x1: "200",
			y1: "260",
			x2: "409",
			y2: "555",
			gradientUnits: "userSpaceOnUse",
			children: [/* @__PURE__ */ t("stop", { stopColor: "#ffb911" }), /* @__PURE__ */ t("stop", {
				offset: "1",
				stopColor: "#f7bd13"
			})]
		}), /* @__PURE__ */ n("radialGradient", {
			id: `${r}-front`,
			cx: "318",
			cy: "396",
			r: "260",
			gradientUnits: "userSpaceOnUse",
			children: [/* @__PURE__ */ t("stop", { stopColor: "#ffdf31" }), /* @__PURE__ */ t("stop", {
				offset: "1",
				stopColor: "var(--bui-mascot-yellow)"
			})]
		})] }),
		/* @__PURE__ */ t("ellipse", {
			className: "bui-mascot__shadow",
			cx: "322",
			cy: "641",
			rx: "129",
			ry: "17",
			fill: `url(#${r}-shadow)`
		}),
		/* @__PURE__ */ n("g", {
			className: "bui-mascot__feet",
			fill: "var(--bui-mascot-ink)",
			children: [/* @__PURE__ */ n("g", {
				className: "bui-mascot__foot-left",
				children: [/* @__PURE__ */ t("path", { d: "M277 592 303 600 302 632Q302 644 291 644C276 646 251 647 250 638 249 628 262 621 275 621Z" }), /* @__PURE__ */ t("path", {
					d: "m278 606 24 10v13l-26-9Z",
					fill: "#20558b",
					opacity: ".45"
				})]
			}), /* @__PURE__ */ n("g", {
				className: "bui-mascot__foot-right",
				children: [/* @__PURE__ */ t("path", { d: "m365 601 26-1v21c16 0 28 10 25 19-1 7-25 5-42 4-11-1-14-3-12-12Z" }), /* @__PURE__ */ t("path", {
					d: "m365 611 25-8v16l-26 16Z",
					fill: "#20558b",
					opacity: ".4"
				})]
			})]
		}),
		/* @__PURE__ */ n("g", {
			className: "bui-mascot__body",
			children: [
				a ? /* @__PURE__ */ t("g", {
					className: "bui-mascot__rest-arm",
					transform: "translate(594 0) scale(-1 1)",
					children: /* @__PURE__ */ t(_o, { id: r })
				}) : /* @__PURE__ */ t("g", {
					className: "bui-mascot__present",
					children: /* @__PURE__ */ n("g", {
						className: s ? "bui-mascot__shield-arm-placement" : void 0,
						transform: s ? "translate(365 425) rotate(-18) scale(.92) translate(-365 -425)" : void 0,
						children: [/* @__PURE__ */ t(go, { id: r }), /* @__PURE__ */ n("g", {
							className: "bui-mascot__wrist",
							children: [
								c && /* @__PURE__ */ t(yo, { id: r }),
								s && /* @__PURE__ */ t("g", {
									transform: "rotate(18 453 420)",
									children: /* @__PURE__ */ n("g", {
										className: "bui-mascot__shield",
										transform: "translate(-11 -5)",
										children: [
											/* @__PURE__ */ t("path", {
												d: "M482 315c12 9 27 14 43 17v34c0 25-18 44-43 55-25-11-43-30-43-55v-34c16-3 31-8 43-17Z",
												fill: "var(--bui-mascot-ink)"
											}),
											/* @__PURE__ */ t("path", {
												d: "M482 325c10 6 22 11 33 14v27c0 19-13 35-33 45-20-10-33-26-33-45v-27c11-3 23-8 33-14Z",
												fill: "#e8f1f8"
											}),
											/* @__PURE__ */ t("path", {
												d: "M482 325v86c20-10 33-26 33-45v-27c-11-3-23-8-33-14Z",
												fill: "#cbddeb"
											}),
											/* @__PURE__ */ t("path", {
												d: "M471 359v-9a11 11 0 0 1 22 0v9",
												fill: "none",
												stroke: "var(--bui-mascot-ink)",
												strokeWidth: "5",
												strokeLinecap: "round"
											}),
											/* @__PURE__ */ t("rect", {
												x: "465",
												y: "356",
												width: "34",
												height: "29",
												rx: "6",
												fill: "var(--bui-mascot-ink)"
											}),
											/* @__PURE__ */ t("circle", {
												cx: "482",
												cy: "368",
												r: "3.5",
												fill: "#e8f1f8"
											}),
											/* @__PURE__ */ t("path", {
												d: "M482 370v6",
												stroke: "#e8f1f8",
												strokeWidth: "3",
												strokeLinecap: "round"
											})
										]
									})
								}),
								o && /* @__PURE__ */ n("g", {
									className: "bui-mascot__credential",
									children: [
										/* @__PURE__ */ t("rect", {
											x: "448",
											y: "330",
											width: "72",
											height: "84",
											rx: "10",
											fill: "var(--bui-mascot-ink)"
										}),
										/* @__PURE__ */ t("rect", {
											x: "455",
											y: "341",
											width: "58",
											height: "48",
											rx: "5",
											fill: "#e8f1f8"
										}),
										/* @__PURE__ */ t("rect", {
											x: "475",
											y: "324",
											width: "18",
											height: "12",
											rx: "4",
											fill: "#5781a6"
										}),
										/* @__PURE__ */ t("circle", {
											cx: "484",
											cy: "356",
											r: "8",
											fill: "var(--bui-mascot-ink)"
										}),
										/* @__PURE__ */ t("path", {
											d: "M469 381v-3c0-15 30-15 30 0v3Z",
											fill: "var(--bui-mascot-ink)"
										}),
										/* @__PURE__ */ t("path", {
											d: "M463 399h24m7 0h10",
											stroke: "#e8f1f8",
											strokeWidth: "4",
											strokeLinecap: "round"
										})
									]
								}),
								!c && /* @__PURE__ */ t("path", {
									className: "bui-mascot__support-palm",
									d: "M430 422c4-8 7-23 15-27 7-4 12 2 10 9l-2 6c14 0 28-9 36 0 12 16-11 32-33 31-10 0-21-7-26-19Z",
									fill: `url(#${r}-front)`
								})
							]
						})]
					})
				}),
				s && /* @__PURE__ */ t("g", {
					className: "bui-mascot__arm-back",
					children: /* @__PURE__ */ n("g", {
						className: "bui-mascot__sign-arm-placement",
						transform: "translate(215 425) rotate(28) scale(.9) translate(-215 -425)",
						children: [
							/* @__PURE__ */ t("g", {
								transform: "translate(580 0) scale(-1 1)",
								children: /* @__PURE__ */ t(go, { id: r })
							}),
							/* @__PURE__ */ t("g", {
								transform: "rotate(-28 127 420)",
								children: /* @__PURE__ */ n("g", {
									className: "bui-mascot__stop-sign",
									children: [
										/* @__PURE__ */ t("path", {
											d: "M127 357v67",
											stroke: "var(--bui-mascot-ink)",
											strokeWidth: "10",
											strokeLinecap: "round"
										}),
										/* @__PURE__ */ t("path", {
											d: "m103 297h48l28 28v40l-28 28h-48l-28-28v-40Z",
											fill: "#b72d36",
											stroke: "#123f70",
											strokeWidth: "5",
											strokeLinejoin: "round"
										}),
										/* @__PURE__ */ t("path", {
											d: "m107 307h40l22 22v32l-22 22h-40l-22-22v-32Z",
											fill: "none",
											stroke: "#fff5e9",
											strokeWidth: "3"
										}),
										/* @__PURE__ */ t("text", {
											x: "127",
											y: "353",
											textAnchor: "middle",
											fill: "#fff",
											fontFamily: "Arial, sans-serif",
											fontWeight: "700",
											fontSize: "24",
											children: "ALTO"
										})
									]
								})
							}),
							/* @__PURE__ */ t("g", {
								transform: "translate(580 0) scale(-1 1)",
								children: /* @__PURE__ */ t(vo, { id: r })
							})
						]
					})
				}),
				/* @__PURE__ */ t("path", {
					d: "M351 154C337 174 308 177 279 199 218 245 186 326 193 411c4 90 26 153 79 188 31 21 90 24 124 12 26-9 36-27 25-54-29-63-39-112-39-161 0-48 13-121 7-162-3-27-11-42-2-66Z",
					fill: `url(#${r}-peel)`
				}),
				/* @__PURE__ */ t("path", {
					d: "M362 159C341 185 316 195 287 230 242 285 225 345 233 418c5 69 31 125 77 159 32 23 71 31 107 9 9-7 10-17 4-29-29-63-39-112-39-161 0-48 13-121 7-162-3-27-11-42-2-66Z",
					fill: `url(#${r}-front)`
				}),
				/* @__PURE__ */ t("path", {
					d: "m350 154 9-19c4-9 23-3 34 2 8 4 12 7 8 12l-14 19Z",
					fill: "var(--bui-mascot-tip)"
				}),
				/* @__PURE__ */ t("path", {
					d: "m359 135 7-3c12 0 25 5 33 11l-4 6-30-8Z",
					fill: "white",
					opacity: ".055"
				}),
				/* @__PURE__ */ t("path", {
					d: "M203 471 216 482 240 491 260 554 281 569M289 544l23 56",
					fill: "none",
					stroke: "var(--bui-mascot-ink)",
					strokeWidth: "4.5",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}),
				/* @__PURE__ */ t("circle", {
					cx: "287",
					cy: "536",
					r: "8",
					fill: "#ffdd2b",
					stroke: "var(--bui-mascot-ink)",
					strokeWidth: "5"
				}),
				!s && /* @__PURE__ */ t("g", {
					className: "bui-mascot__arm-back",
					children: /* @__PURE__ */ t(_o, { id: r })
				}),
				/* @__PURE__ */ t("g", {
					className: "bui-mascot__face",
					children: /* @__PURE__ */ n("g", {
						transform: c ? "rotate(11.6 334 340)" : o ? "rotate(4 334 340)" : void 0,
						children: [
							/* @__PURE__ */ t("g", {
								className: "bui-mascot__brows",
								fill: "none",
								stroke: "var(--bui-mascot-ink)",
								strokeWidth: "5",
								strokeLinecap: "round",
								children: s || c ? /* @__PURE__ */ n(e, { children: [/* @__PURE__ */ t("path", {
									className: "bui-mascot__brow-left",
									d: "M287 317q9-5 17-2"
								}), /* @__PURE__ */ t("path", {
									className: "bui-mascot__brow-right",
									d: "M362 302q7-3 14 2"
								})] }) : /* @__PURE__ */ t("path", { d: "M287 320q12 2 16-10M364 298q3 8 11 7" })
							}),
							/* @__PURE__ */ t("g", {
								className: "bui-mascot__eyes",
								fill: "var(--bui-mascot-ink)",
								children: /* @__PURE__ */ n("g", {
									className: s ? "bui-mascot__gaze" : void 0,
									children: [/* @__PURE__ */ t("ellipse", {
										cx: "297",
										cy: "347",
										rx: "8.5",
										ry: "15"
									}), /* @__PURE__ */ t("ellipse", {
										cx: "370",
										cy: "332",
										rx: "8",
										ry: "15"
									})]
								})
							}),
							/* @__PURE__ */ t("path", {
								d: c ? "M324 368q10 8 20 0" : o ? "M328 369q10 11 22-2" : s ? "M329 370q9 3 18-2" : "M328 370q10 11 20-3",
								fill: "none",
								stroke: "var(--bui-mascot-ink)",
								strokeWidth: "5",
								strokeLinecap: "round"
							})
						]
					})
				})
			]
		})
	] });
}
//#endregion
//#region src/components/Mascot/maintenance_artwork.tsx
var xo = [
	{
		x: -38,
		y: -30
	},
	{
		x: -20,
		y: -46
	},
	{
		x: 6,
		y: -40
	},
	{
		x: 28,
		y: -24
	},
	{
		x: 36,
		y: 7
	},
	{
		x: 18,
		y: 32
	},
	{
		x: -14,
		y: 38
	},
	{
		x: -42,
		y: 12
	}
];
function So({ id: r, sparks: i = !0 }) {
	return /* @__PURE__ */ n(e, { children: [
		/* @__PURE__ */ t("defs", { children: /* @__PURE__ */ n("filter", {
			id: `${r}-relief`,
			x: "-10%",
			y: "-10%",
			width: "130%",
			height: "140%",
			children: [
				/* @__PURE__ */ t("feFlood", { floodColor: "#083d70" }),
				/* @__PURE__ */ t("feComposite", {
					in2: "SourceAlpha",
					operator: "in"
				}),
				/* @__PURE__ */ t("feOffset", {
					dx: "5",
					dy: "7"
				}),
				/* @__PURE__ */ n("feMerge", { children: [/* @__PURE__ */ t("feMergeNode", {}), /* @__PURE__ */ t("feMergeNode", { in: "SourceGraphic" })] })
			]
		}) }),
		/* @__PURE__ */ t("ellipse", {
			cx: "297",
			cy: "641",
			rx: "200",
			ry: "19",
			fill: `url(#${r}-shadow)`
		}),
		/* @__PURE__ */ t("g", {
			transform: "translate(190 310)",
			children: /* @__PURE__ */ t("g", {
				className: "bui-mascot__assembly",
				children: /* @__PURE__ */ t("g", {
					className: "bui-mascot__logo-impact",
					children: [
						"base",
						"curve",
						"circuit"
					].map((e) => /* @__PURE__ */ t("g", {
						className: `bui-mascot__logo-layer bui-mascot__logo-layer--${e}`,
						filter: `url(#${r}-relief)`,
						children: /* @__PURE__ */ t(Ge, { size: 300 })
					}, e))
				})
			})
		}),
		/* @__PURE__ */ t("g", {
			transform: "translate(990 0) scale(-1 1)",
			children: /* @__PURE__ */ t(bo, {
				id: r,
				pose: "maintenance"
			})
		}),
		i && /* @__PURE__ */ n("g", {
			transform: "translate(470.727435887 409.642581507)",
			"aria-hidden": "true",
			pointerEvents: "none",
			children: [/* @__PURE__ */ n("g", {
				className: "bui-mascot__impact-flash",
				children: [/* @__PURE__ */ t("path", {
					d: "m0-28 7 17 16-6-8 15 17 8-21 4 3 19-14-15-14 15 3-19-21-4 17-8-8-15 16 6Z",
					fill: "#ffd523"
				}), /* @__PURE__ */ t("path", {
					d: "m0-17 4 12 12 5-12 4-4 13-4-13-12-4 12-5Z",
					fill: "#fff9df"
				})]
			}), xo.map((e, r) => /* @__PURE__ */ n("g", {
				className: "bui-mascot__spark",
				style: {
					"--bui-spark-x": `${e.x}px`,
					"--bui-spark-y": `${e.y}px`
				},
				children: [/* @__PURE__ */ t("path", {
					d: `M0 0l${e.x * .42} ${e.y * .42}`,
					stroke: "var(--bui-mascot-spark, #f49b27)",
					strokeWidth: "4"
				}), /* @__PURE__ */ t("path", {
					d: `M0 0l${e.x * .3} ${e.y * .3}`,
					stroke: "#fff0af",
					strokeWidth: "1.8"
				})]
			}, r))]
		})
	] });
}
//#endregion
//#region src/components/Mascot/mascot.tsx
function Co({ pose: e = "neutral", motion: r = "loop", paused: i = !1, size: a = 280, label: o, className: s, style: c, maintenance: l }) {
	let f = d().replace(/:/g, ""), p = h(null), [m, _] = g(!0), v = l?.cycleDurationMs ?? 8e3, y = Number.isFinite(v) ? Math.max(2e3, v) : 8e3;
	return u(() => {
		if (typeof IntersectionObserver > "u" || !p.current) return;
		let e = new IntersectionObserver(([e]) => _(e.isIntersecting));
		return e.observe(p.current), () => e.disconnect();
	}, []), /* @__PURE__ */ n("svg", {
		ref: p,
		viewBox: e === "maintenance" ? "40 90 830 580" : e === "forbidden" ? "65 110 485 560" : "140 110 410 560",
		width: a,
		className: ["bui-mascot", s].filter(Boolean).join(" "),
		style: {
			...c,
			"--bui-maintenance-duration": `${y}ms`
		},
		"data-pose": e,
		"data-motion": r,
		"data-paused": i || !m,
		role: o ? "img" : void 0,
		"aria-hidden": o ? void 0 : !0,
		"aria-labelledby": o ? `${f}-title` : void 0,
		children: [
			o && /* @__PURE__ */ t("title", {
				id: `${f}-title`,
				children: o
			}),
			/* @__PURE__ */ t("defs", { children: /* @__PURE__ */ n("radialGradient", {
				id: `${f}-shadow`,
				children: [
					/* @__PURE__ */ t("stop", {
						offset: "0",
						stopColor: "var(--bui-mascot-ink)",
						stopOpacity: ".22"
					}),
					/* @__PURE__ */ t("stop", {
						offset: ".55",
						stopColor: "var(--bui-mascot-ink)",
						stopOpacity: ".1"
					}),
					/* @__PURE__ */ t("stop", {
						offset: "1",
						stopColor: "var(--bui-mascot-ink)",
						stopOpacity: "0"
					})
				]
			}) }),
			e === "maintenance" ? /* @__PURE__ */ t(So, {
				id: f,
				sparks: l?.sparks ?? l?.dust ?? !0
			}, l?.replayKey) : /* @__PURE__ */ t(bo, {
				id: f,
				pose: e
			})
		]
	});
}
//#endregion
//#region src/components/Seasonal/christmas-garland.tsx
var wo = [
	{
		from: 0,
		to: 235,
		depth: 18
	},
	{
		from: 235,
		to: 510,
		depth: 24
	},
	{
		from: 510,
		to: 780,
		depth: 20
	},
	{
		from: 780,
		to: 1e3,
		depth: 22
	}
], To = [
	0,
	235,
	510,
	780,
	1e3
], Eo = [
	3.6,
	4.8,
	4.1,
	5.4,
	4.6,
	3.9,
	5.8
];
function Do({ transform: e }) {
	return /* @__PURE__ */ n("g", {
		transform: e,
		children: [
			/* @__PURE__ */ t("path", {
				d: "M-5 0H45",
				stroke: "#71603d",
				strokeWidth: "1.8",
				strokeLinecap: "round"
			}),
			Array.from({ length: 10 }, (e, r) => {
				let i = r * 4.4, a = 6 + Math.sin(r / 10 * Math.PI) * 10;
				return /* @__PURE__ */ n("g", { children: [/* @__PURE__ */ t("path", {
					d: `M${i + 2} 1Q${i - a * .6} -3 ${i - a * .56} ${-a}Q${i + 1} -6 ${i + 2} 1Z`,
					fill: [
						"#205b43",
						"#2e7656",
						"#48926a"
					][r % 3]
				}), /* @__PURE__ */ t("path", {
					d: `M${i + 2} -1Q${i - a * .6} 3 ${i - a * .5} ${a * .85}Q${i + 1} 6 ${i + 2} -1Z`,
					fill: r % 2 ? "#307454" : "#194c38"
				})] }, r);
			}),
			/* @__PURE__ */ t("path", {
				d: "M0 0H43",
				stroke: "#90aa68",
				strokeOpacity: ".5",
				strokeWidth: ".7"
			})
		]
	});
}
function Oo({ x: e }) {
	return /* @__PURE__ */ n("g", {
		transform: `translate(${e - 32} -6) scale(.55)`,
		children: [
			/* @__PURE__ */ t(Do, { transform: "translate(58 19) rotate(190) scale(.95)" }),
			/* @__PURE__ */ t(Do, { transform: "translate(54 17) rotate(220) scale(.82)" }),
			/* @__PURE__ */ t(Do, { transform: "translate(56 18) rotate(165) scale(.8)" }),
			/* @__PURE__ */ t(Do, { transform: "translate(58 18) rotate(-20) scale(.86)" }),
			/* @__PURE__ */ t(Do, { transform: "translate(60 18) rotate(-48) scale(.7)" }),
			/* @__PURE__ */ n("g", {
				fill: "#be3045",
				stroke: "#8e2333",
				strokeWidth: ".6",
				children: [
					/* @__PURE__ */ t("circle", {
						cx: "56",
						cy: "17",
						r: "3.7"
					}),
					/* @__PURE__ */ t("circle", {
						cx: "62",
						cy: "20",
						r: "3.2"
					}),
					/* @__PURE__ */ t("circle", {
						cx: "56",
						cy: "24",
						r: "3"
					})
				]
			}),
			/* @__PURE__ */ n("g", {
				fill: "#f6a0a2",
				children: [/* @__PURE__ */ t("circle", {
					cx: "55",
					cy: "16",
					r: "1"
				}), /* @__PURE__ */ t("circle", {
					cx: "61",
					cy: "19",
					r: ".8"
				})]
			})
		]
	});
}
function ko({ id: e }) {
	return /* @__PURE__ */ n("defs", { children: [/* @__PURE__ */ n("radialGradient", {
		id: e,
		children: [
			/* @__PURE__ */ t("stop", {
				stopColor: "#ffd794",
				stopOpacity: ".48"
			}),
			/* @__PURE__ */ t("stop", {
				offset: ".45",
				stopColor: "#ffc568",
				stopOpacity: ".16"
			}),
			/* @__PURE__ */ t("stop", {
				offset: "1",
				stopColor: "#ffc568",
				stopOpacity: "0"
			})
		]
	}), /* @__PURE__ */ n("linearGradient", {
		id: `${e}-glass`,
		x1: "0",
		x2: "1",
		children: [
			/* @__PURE__ */ t("stop", { stopColor: "#b87729" }),
			/* @__PURE__ */ t("stop", {
				offset: ".3",
				stopColor: "#ffe7ae"
			}),
			/* @__PURE__ */ t("stop", {
				offset: ".6",
				stopColor: "#fff3cb"
			}),
			/* @__PURE__ */ t("stop", {
				offset: "1",
				stopColor: "#d79a42"
			})
		]
	})] });
}
function Ao({ x: e, y: r, index: i, halo: a, active: o }) {
	let s = Eo[i % Eo.length] ?? 4.8, c = [
		6,
		8,
		7,
		9,
		7,
		6
	][i % 6];
	return /* @__PURE__ */ n("g", {
		className: "bui-garland-light",
		"data-lit": o,
		style: {
			"--bui-garland-cycle": `${s}s`,
			"--bui-garland-phase": `${-(i * .71 % s)}s`,
			"--bui-garland-order": `${i * 28}ms`
		},
		transform: `translate(${e} ${r})`,
		children: [
			/* @__PURE__ */ t("path", {
				d: `M-1 -1Q2 1 0 3V${c}`,
				stroke: "#3b5141",
				strokeWidth: "1.1",
				fill: "none"
			}),
			/* @__PURE__ */ t("circle", {
				cx: "0",
				cy: "0",
				r: "1.5",
				fill: "#526b4b"
			}),
			/* @__PURE__ */ n("g", {
				transform: `translate(0 ${c})`,
				children: [
					/* @__PURE__ */ t("g", {
						className: "bui-garland-power",
						children: /* @__PURE__ */ t("ellipse", {
							className: "bui-garland-halo",
							cx: "0",
							cy: "10",
							rx: "11",
							ry: "13",
							fill: `url(#${a})`
						})
					}),
					/* @__PURE__ */ t("path", {
						d: "M-2.8 3.5C-3 7-4.1 8.5-3.2 11.5Q0 16 3.2 11.5C4.1 8.5 3 7 2.8 3.5Z",
						fill: "#d6bf8c",
						fillOpacity: ".45",
						stroke: "#af8b4a",
						strokeOpacity: ".6",
						strokeWidth: ".6"
					}),
					/* @__PURE__ */ n("g", {
						className: "bui-garland-power",
						children: [/* @__PURE__ */ t("path", {
							className: "bui-garland-bulb",
							d: "M-2.8 3.5C-3 7-4.1 8.5-3.2 11.5Q0 16 3.2 11.5C4.1 8.5 3 7 2.8 3.5Z",
							fill: `url(#${a}-glass)`
						}), /* @__PURE__ */ t("path", {
							d: "M-1 6V9L0 10L1 9V6",
							stroke: "#fff9da",
							strokeWidth: ".9",
							fill: "none"
						})]
					}),
					/* @__PURE__ */ t("rect", {
						x: "-3",
						y: "0",
						width: "6",
						height: "4.5",
						rx: "1",
						fill: "#49634a"
					}),
					/* @__PURE__ */ t("path", {
						d: "M-2 1H2M-2 3H2",
						stroke: "#8d9b72",
						strokeWidth: ".6"
					}),
					/* @__PURE__ */ t("path", {
						className: "bui-garland-shine",
						d: "M-1.8 6Q-2.7 9-1.8 10",
						stroke: "#fff9ec",
						strokeOpacity: ".8",
						strokeWidth: ".8",
						fill: "none"
					})
				]
			})
		]
	});
}
function jo({ lights: e = "ambient", motion: r = "none", layout: i = "auto", className: a = "", style: o }) {
	let s = h(null), [c, l] = g(1e3);
	u(() => {
		if (!s.current) return;
		let e = new ResizeObserver(([e]) => l(Math.max(1, e.contentRect.width)));
		return e.observe(s.current), () => e.disconnect();
	}, []);
	let f = wo.map((e) => ({
		...e,
		from: e.from * c / 1e3,
		to: e.to * c / 1e3
	})), p = `bui-garland-${d().replace(/:/g, "")}`, m = `${p}-wide`, _ = `${p}-compact`;
	return /* @__PURE__ */ n("div", {
		ref: s,
		className: `bui-christmas-garland ${a}`,
		style: o,
		"data-layout": i,
		"data-motion": r,
		"data-lights": e,
		"aria-hidden": "true",
		children: [/* @__PURE__ */ n("svg", {
			className: "bui-garland-wide",
			viewBox: `-24 -20 ${c + 48} 72`,
			preserveAspectRatio: "none",
			focusable: "false",
			children: [
				/* @__PURE__ */ t(ko, { id: m }),
				/* @__PURE__ */ t("path", {
					d: f.map(({ from: e, to: t, depth: n }) => `M${e} 4Q${(e + t) / 2} ${4 + 2 * n} ${t} 4`).join(" "),
					stroke: "#32664c",
					strokeWidth: "1.8",
					fill: "none"
				}),
				To.map((e) => /* @__PURE__ */ t(Oo, { x: e * c / 1e3 }, e)),
				f.map(({ from: e, to: n, depth: r }, i) => {
					let a = [
						.5,
						.36,
						.64,
						.5
					][i] ?? .5, o = Math.atan2(4 * r * (1 - 2 * a), n - e) * 180 / Math.PI;
					return /* @__PURE__ */ t(Do, { transform: `translate(${e + (n - e) * a} ${4 + 4 * r * a * (1 - a)}) rotate(${o}) scale(.38)` }, e);
				}),
				f.flatMap(({ from: n, to: r, depth: i }, a) => Array.from({ length: 6 }, (o, s) => {
					let c = (s + 1) / 7, l = a * 6 + s;
					return /* @__PURE__ */ t(Ao, {
						x: n + (r - n) * c,
						y: 4 + 4 * i * c * (1 - c),
						index: l,
						halo: m,
						active: e === "all" || e === "ambient" && l % 3 == 0
					}, l);
				}))
			]
		}), /* @__PURE__ */ n("svg", {
			className: "bui-garland-compact",
			viewBox: "-4 -4 128 52",
			focusable: "false",
			children: [
				/* @__PURE__ */ t(ko, { id: _ }),
				/* @__PURE__ */ t("path", {
					d: "M2 2Q60 32 118 2",
					stroke: "#32664c",
					strokeWidth: "1.5",
					fill: "none"
				}),
				[
					20,
					45,
					75,
					100
				].map((n, r) => {
					let i = (n - 2) / 116;
					return /* @__PURE__ */ t(Ao, {
						x: n,
						y: 2 + 60 * i * (1 - i),
						index: r,
						halo: _,
						active: e === "all" || e === "ambient" && r % 2 == 0
					}, n);
				})
			]
		})]
	});
}
//#endregion
//#region src/components/Seasonal/christmas-action-art.tsx
function Mo({ id: r, registerTarget: i }) {
	return /* @__PURE__ */ n(e, { children: [
		/* @__PURE__ */ n("svg", {
			className: "bui-christmas-rim-cord",
			viewBox: "0 0 1000 14",
			preserveAspectRatio: "none",
			children: [
				/* @__PURE__ */ t("path", {
					d: "M2 3Q500 13 998 3",
					stroke: "#153f32",
					strokeOpacity: ".18",
					strokeWidth: "5",
					fill: "none"
				}),
				/* @__PURE__ */ t("path", {
					d: "M2 1Q500 11 998 1",
					stroke: "#31694c",
					strokeWidth: "3",
					fill: "none"
				}),
				/* @__PURE__ */ t("path", {
					d: "M2 .4Q500 10.4 998 .4",
					stroke: "#80a464",
					strokeWidth: ".65",
					fill: "none"
				})
			]
		}),
		/* @__PURE__ */ n("svg", {
			className: "bui-christmas-rim-foliage",
			viewBox: "0 0 66 52",
			children: [
				/* @__PURE__ */ n("defs", { children: [/* @__PURE__ */ n("linearGradient", {
					id: `${r}-leaf`,
					x1: "0",
					y1: "0",
					x2: "1",
					y2: "1",
					children: [
						/* @__PURE__ */ t("stop", { stopColor: "#5b986a" }),
						/* @__PURE__ */ t("stop", {
							offset: ".5",
							stopColor: "#286249"
						}),
						/* @__PURE__ */ t("stop", {
							offset: "1",
							stopColor: "#123e30"
						})
					]
				}), /* @__PURE__ */ n("linearGradient", {
					id: `${r}-ribbon`,
					children: [
						/* @__PURE__ */ t("stop", { stopColor: "#7c2034" }),
						/* @__PURE__ */ t("stop", {
							offset: ".3",
							stopColor: "#dc5c66"
						}),
						/* @__PURE__ */ t("stop", {
							offset: ".55",
							stopColor: "#ad2b43"
						}),
						/* @__PURE__ */ t("stop", {
							offset: ".8",
							stopColor: "#e06b72"
						}),
						/* @__PURE__ */ t("stop", {
							offset: "1",
							stopColor: "#8d2238"
						})
					]
				})] }),
				/* @__PURE__ */ t("path", {
					d: "M18 25q-6-12 1-12q6 0 4 7",
					fill: "none",
					stroke: "#9e7840",
					strokeWidth: "1.4"
				}),
				/* @__PURE__ */ n("g", {
					transform: "translate(24 25) rotate(-10)",
					children: [/* @__PURE__ */ t("path", {
						d: "M0 0C6-3 5-10 11-9C13-15 17-10 21-15L33-17L29-7C23-8 28-2 21-2C20 4 14 0 12 6C8 3 3 5 0 0Z",
						fill: `url(#${r}-leaf)`,
						stroke: "#154630",
						strokeWidth: ".7"
					}), /* @__PURE__ */ t("path", {
						d: "M1 0Q18-4 31-15M10-3l0-5M18-7l2-4M12-4l5 3",
						stroke: "#99b87b",
						strokeOpacity: ".7",
						strokeWidth: ".7",
						fill: "none"
					})]
				}),
				/* @__PURE__ */ n("g", {
					transform: "translate(26 24) rotate(-65) scale(.8)",
					children: [/* @__PURE__ */ t("path", {
						d: "M0 0C6-3 5-10 11-9C13-15 17-10 21-15L33-17L29-7C23-8 28-2 21-2C20 4 14 0 12 6C8 3 3 5 0 0Z",
						fill: `url(#${r}-leaf)`,
						stroke: "#154630",
						strokeWidth: ".7"
					}), /* @__PURE__ */ t("path", {
						d: "M1 0Q18-4 31-15M10-3l0-5M18-7l2-4M12-4l5 3",
						stroke: "#99b87b",
						strokeOpacity: ".7",
						strokeWidth: ".7",
						fill: "none"
					})]
				}),
				/* @__PURE__ */ n("g", {
					transform: "translate(27 25) rotate(28) scale(.8)",
					children: [/* @__PURE__ */ t("path", {
						d: "M0 0C6-3 5-10 11-9C13-15 17-10 21-15L33-17L29-7C23-8 28-2 21-2C20 4 14 0 12 6C8 3 3 5 0 0Z",
						fill: `url(#${r}-leaf)`,
						stroke: "#154630",
						strokeWidth: ".7"
					}), /* @__PURE__ */ t("path", {
						d: "M1 0Q18-4 31-15M10-3l0-5M18-7l2-4M12-4l5 3",
						stroke: "#99b87b",
						strokeOpacity: ".7",
						strokeWidth: ".7",
						fill: "none"
					})]
				}),
				/* @__PURE__ */ n("g", {
					transform: "translate(26 24) rotate(185) scale(0.56)",
					children: [
						/* @__PURE__ */ t("path", {
							d: "M-5 0H45",
							stroke: "#71603d",
							strokeWidth: "1.8",
							strokeLinecap: "round"
						}),
						/* @__PURE__ */ t("path", {
							d: "M2 1Q-3.5999999999999996 -3 -3.3600000000000003 -6Q1 -6 2 1Z",
							fill: "#205b43"
						}),
						/* @__PURE__ */ t("path", {
							d: "M2 -1Q-3.5999999999999996 3 -3 5.1Q1 6 2 -1Z",
							fill: "#194c38"
						}),
						/* @__PURE__ */ t("path", {
							d: "M6.4 1Q-1.054101966249684 -3 -0.690495168499706 -9.090169943749475Q5.4 -6 6.4 1Z",
							fill: "#2e7656"
						}),
						/* @__PURE__ */ t("path", {
							d: "M6.4 -1Q-1.054101966249684 3 -0.1450849718747369 7.726644452187053Q5.4 6 6.4 -1Z",
							fill: "#307454"
						}),
						/* @__PURE__ */ t("path", {
							d: "M10.8 1Q1.6732884862451618 -3 2.14840258716215 -11.877852522924732Q9.8 -6 10.8 1Z",
							fill: "#48926a"
						}),
						/* @__PURE__ */ t("path", {
							d: "M10.8 -1Q1.6732884862451618 3 2.861073738537635 10.096174644486021Q9.8 6 10.8 -1Z",
							fill: "#194c38"
						}),
						/* @__PURE__ */ t("path", {
							d: "M15.200000000000001 1Q4.745898033750317 -3 5.309504831500295 -14.090169943749475Q14.200000000000001 -6 15.200000000000001 1Z",
							fill: "#205b43"
						}),
						/* @__PURE__ */ t("path", {
							d: "M15.200000000000001 -1Q4.745898033750317 3 6.154915028125264 11.976644452187053Q14.200000000000001 6 15.200000000000001 -1Z",
							fill: "#307454"
						}),
						/* @__PURE__ */ t("path", {
							d: "M19.6 1Q8.293660902229082 -3 8.914083508747142 -15.510565162951535Q18.6 -6 19.6 1Z",
							fill: "#2e7656"
						}),
						/* @__PURE__ */ t("path", {
							d: "M19.6 -1Q8.293660902229082 3 9.844717418524233 13.183980388508804Q18.6 6 19.6 -1Z",
							fill: "#194c38"
						}),
						/* @__PURE__ */ t("path", {
							d: "M24 1Q12.4 -3 13.04 -16Q23 -6 24 1Z",
							fill: "#48926a"
						}),
						/* @__PURE__ */ t("path", {
							d: "M24 -1Q12.4 3 14 13.6Q23 6 24 -1Z",
							fill: "#307454"
						}),
						/* @__PURE__ */ t("path", {
							d: "M28.400000000000002 1Q17.093660902229082 -3 17.71408350874714 -15.510565162951536Q27.400000000000002 -6 28.400000000000002 1Z",
							fill: "#205b43"
						}),
						/* @__PURE__ */ t("path", {
							d: "M28.400000000000002 -1Q17.093660902229082 3 18.644717418524234 13.183980388508806Q27.400000000000002 6 28.400000000000002 -1Z",
							fill: "#194c38"
						}),
						/* @__PURE__ */ t("path", {
							d: "M32.800000000000004 1Q22.34589803375032 -3 22.9095048315003 -14.090169943749475Q31.800000000000004 -6 32.800000000000004 1Z",
							fill: "#2e7656"
						}),
						/* @__PURE__ */ t("path", {
							d: "M32.800000000000004 -1Q22.34589803375032 3 23.754915028125268 11.976644452187053Q31.800000000000004 6 32.800000000000004 -1Z",
							fill: "#307454"
						}),
						/* @__PURE__ */ t("path", {
							d: "M37.2 1Q28.07328848624516 -3 28.54840258716215 -11.877852522924734Q36.2 -6 37.2 1Z",
							fill: "#48926a"
						}),
						/* @__PURE__ */ t("path", {
							d: "M37.2 -1Q28.07328848624516 3 29.261073738537636 10.096174644486023Q36.2 6 37.2 -1Z",
							fill: "#194c38"
						}),
						/* @__PURE__ */ t("path", {
							d: "M41.6 1Q34.14589803375031 -3 34.509504831500294 -9.090169943749475Q40.6 -6 41.6 1Z",
							fill: "#205b43"
						}),
						/* @__PURE__ */ t("path", {
							d: "M41.6 -1Q34.14589803375031 3 35.054915028125265 7.726644452187053Q40.6 6 41.6 -1Z",
							fill: "#307454"
						}),
						/* @__PURE__ */ t("path", {
							d: "M0 0H43",
							stroke: "#90aa68",
							strokeOpacity: ".5",
							strokeWidth: ".7"
						})
					]
				}),
				/* @__PURE__ */ t("path", {
					d: "M17 24L8 46l8-4 5 5 5-23",
					fill: `url(#${r}-ribbon)`,
					stroke: "#8d263b",
					strokeWidth: ".6"
				}),
				/* @__PURE__ */ t("path", {
					d: "M21 25L31 44l1-8 7 2-11-17",
					fill: `url(#${r}-ribbon)`,
					stroke: "#8d263b",
					strokeWidth: ".6"
				}),
				/* @__PURE__ */ t("path", {
					d: "M20 23C-7 3 2 36 21 25C51 5 45 38 22 26Z",
					fill: `url(#${r}-ribbon)`,
					stroke: "#8a2238",
					strokeWidth: ".7"
				}),
				/* @__PURE__ */ t("path", {
					d: "M17 22Q6 12 7 22M26 23Q38 15 38 23",
					fill: "none",
					stroke: "#f4a4a5",
					strokeWidth: ".7"
				}),
				/* @__PURE__ */ t("path", {
					d: "M18 21Q23 18 26 22L25 28Q21 30 18 26Z",
					fill: "#b83a50",
					stroke: "#8a2238",
					strokeWidth: ".6"
				}),
				/* @__PURE__ */ t("path", {
					d: "M20 21v6",
					stroke: "#e9868d",
					strokeWidth: "1"
				})
			]
		}),
		/* @__PURE__ */ n("svg", {
			className: "bui-christmas-rim-bells",
			viewBox: "0 0 50 68",
			children: [
				/* @__PURE__ */ t("defs", { children: /* @__PURE__ */ n("linearGradient", {
					id: `${r}-brass`,
					children: [
						/* @__PURE__ */ t("stop", { stopColor: "#98702b" }),
						/* @__PURE__ */ t("stop", {
							offset: ".2",
							stopColor: "#f2ca72"
						}),
						/* @__PURE__ */ t("stop", {
							offset: ".4",
							stopColor: "#fff1b2"
						}),
						/* @__PURE__ */ t("stop", {
							offset: ".6",
							stopColor: "#d7a44d"
						}),
						/* @__PURE__ */ t("stop", {
							offset: ".82",
							stopColor: "#aa742d"
						}),
						/* @__PURE__ */ t("stop", {
							offset: "1",
							stopColor: "#efd083"
						})
					]
				}) }),
				/* @__PURE__ */ t("path", {
					d: "M13 13q-6-12 1-12q6 0 4 7",
					fill: "none",
					stroke: "#9e7840",
					strokeWidth: "1.5"
				}),
				/* @__PURE__ */ t("path", {
					d: "M13 11q6-5 10 1",
					stroke: "#427252",
					strokeWidth: "3",
					fill: "none"
				}),
				/* @__PURE__ */ n("g", {
					ref: (e) => {
						i(0, e);
					},
					className: "bui-christmas-bell-rig",
					children: [
						/* @__PURE__ */ t("path", {
							d: "M15 8Q23 11 24 23M15 8Q36 12 35 32",
							stroke: "#ae8b4c",
							strokeWidth: "1.2",
							fill: "none"
						}),
						/* @__PURE__ */ t("path", {
							d: "M17 10Q26 7 28 17",
							stroke: "#c74453",
							strokeWidth: "2.5",
							fill: "none"
						}),
						/* @__PURE__ */ n("g", {
							transform: "translate(24 23) rotate(-17) scale(.68)",
							children: [
								/* @__PURE__ */ t("ellipse", {
									cy: "-2",
									rx: "2.7",
									ry: "3.4",
									fill: "none",
									stroke: "#a9792f",
									strokeWidth: "1.7"
								}),
								/* @__PURE__ */ t("path", {
									d: "M-3 0H3V4H-3Z",
									fill: "#bd8d3e"
								}),
								/* @__PURE__ */ t("path", {
									d: "M-10 20C-8 15-7 12-7 8C-7-2 7-2 7 8C7 12 8 15 10 20Z",
									fill: `url(#${r}-brass)`,
									stroke: "#8b5b23",
									strokeWidth: ".8"
								}),
								/* @__PURE__ */ t("path", {
									d: "M-5 5Q-8 12-8 17",
									fill: "none",
									stroke: "#fff3b5",
									strokeWidth: "1.8",
									strokeLinecap: "round"
								}),
								/* @__PURE__ */ t("path", {
									d: "M4 5Q7 12 7 17",
									fill: "none",
									stroke: "#ad752a",
									strokeWidth: "1.2"
								}),
								/* @__PURE__ */ t("path", {
									d: "M-8 15Q0 18 8 15",
									stroke: "#9d6c28",
									strokeWidth: ".65",
									fill: "none"
								}),
								/* @__PURE__ */ t("path", {
									d: "M-9 17Q0 20 9 17",
									stroke: "#ffe29a",
									strokeWidth: ".8",
									fill: "none"
								}),
								/* @__PURE__ */ t("ellipse", {
									cy: "20",
									rx: "10.2",
									ry: "3.1",
									fill: "#73501e",
									stroke: "#c79a4c",
									strokeWidth: "1"
								}),
								/* @__PURE__ */ t("ellipse", {
									cy: "19.5",
									rx: "8.5",
									ry: "1.6",
									fill: "#a87b30"
								}),
								/* @__PURE__ */ n("g", {
									ref: (e) => {
										i(1, e);
									},
									className: "bui-christmas-bell-clapper",
									children: [/* @__PURE__ */ t("path", {
										d: "M0 17v7",
										stroke: "#73501e",
										strokeWidth: "1.3"
									}), /* @__PURE__ */ t("circle", {
										cy: "24",
										r: "2.8",
										fill: `url(#${r}-brass)`,
										stroke: "#926227",
										strokeWidth: ".6"
									})]
								}),
								/* @__PURE__ */ t("path", {
									d: "M-8 21Q0 24 8 21",
									stroke: "#f9d280",
									strokeWidth: ".8",
									fill: "none"
								})
							]
						}),
						/* @__PURE__ */ n("g", {
							transform: "translate(35 33) rotate(12) scale(.85)",
							children: [
								/* @__PURE__ */ t("ellipse", {
									cy: "-2",
									rx: "2.7",
									ry: "3.4",
									fill: "none",
									stroke: "#a9792f",
									strokeWidth: "1.7"
								}),
								/* @__PURE__ */ t("path", {
									d: "M-3 0H3V4H-3Z",
									fill: "#bd8d3e"
								}),
								/* @__PURE__ */ t("path", {
									d: "M-10 20C-8 15-7 12-7 8C-7-2 7-2 7 8C7 12 8 15 10 20Z",
									fill: `url(#${r}-brass)`,
									stroke: "#8b5b23",
									strokeWidth: ".8"
								}),
								/* @__PURE__ */ t("path", {
									d: "M-5 5Q-8 12-8 17",
									fill: "none",
									stroke: "#fff3b5",
									strokeWidth: "1.8",
									strokeLinecap: "round"
								}),
								/* @__PURE__ */ t("path", {
									d: "M4 5Q7 12 7 17",
									fill: "none",
									stroke: "#ad752a",
									strokeWidth: "1.2"
								}),
								/* @__PURE__ */ t("path", {
									d: "M-8 15Q0 18 8 15",
									stroke: "#9d6c28",
									strokeWidth: ".65",
									fill: "none"
								}),
								/* @__PURE__ */ t("path", {
									d: "M-9 17Q0 20 9 17",
									stroke: "#ffe29a",
									strokeWidth: ".8",
									fill: "none"
								}),
								/* @__PURE__ */ t("ellipse", {
									cy: "20",
									rx: "10.2",
									ry: "3.1",
									fill: "#73501e",
									stroke: "#c79a4c",
									strokeWidth: "1"
								}),
								/* @__PURE__ */ t("ellipse", {
									cy: "19.5",
									rx: "8.5",
									ry: "1.6",
									fill: "#a87b30"
								}),
								/* @__PURE__ */ n("g", {
									ref: (e) => {
										i(2, e);
									},
									className: "bui-christmas-bell-clapper",
									children: [/* @__PURE__ */ t("path", {
										d: "M0 17v7",
										stroke: "#73501e",
										strokeWidth: "1.3"
									}), /* @__PURE__ */ t("circle", {
										cy: "24",
										r: "2.8",
										fill: `url(#${r}-brass)`,
										stroke: "#926227",
										strokeWidth: ".6"
									})]
								}),
								/* @__PURE__ */ t("path", {
									d: "M-8 21Q0 24 8 21",
									stroke: "#f9d280",
									strokeWidth: ".8",
									fill: "none"
								})
							]
						})
					]
				})
			]
		})
	] });
}
//#endregion
//#region src/components/Seasonal/christmas-corner-art.tsx
function No({ id: r, registerTarget: i }) {
	return /* @__PURE__ */ t(e, { children: /* @__PURE__ */ n("svg", {
		viewBox: "0 0 60 64",
		preserveAspectRatio: "xMidYMid meet",
		fill: "none",
		focusable: "false",
		children: [
			/* @__PURE__ */ n("defs", { children: [
				/* @__PURE__ */ n("radialGradient", {
					id: `${r}-halo`,
					children: [/* @__PURE__ */ t("stop", {
						stopColor: "#ffdc83",
						stopOpacity: ".55"
					}), /* @__PURE__ */ t("stop", {
						offset: "1",
						stopColor: "#ffdc83",
						stopOpacity: "0"
					})]
				}),
				/* @__PURE__ */ n("radialGradient", {
					id: `${r}-red`,
					cx: ".3",
					cy: ".25",
					r: ".8",
					children: [
						/* @__PURE__ */ t("stop", { stopColor: "#e15b66" }),
						/* @__PURE__ */ t("stop", {
							offset: ".65",
							stopColor: "#ba3045"
						}),
						/* @__PURE__ */ t("stop", {
							offset: "1",
							stopColor: "#8c2035"
						})
					]
				}),
				/* @__PURE__ */ n("radialGradient", {
					id: `${r}-gold`,
					cx: ".3",
					cy: ".25",
					r: ".8",
					children: [
						/* @__PURE__ */ t("stop", { stopColor: "#ffe7a1" }),
						/* @__PURE__ */ t("stop", {
							offset: ".6",
							stopColor: "#d7ad55"
						}),
						/* @__PURE__ */ t("stop", {
							offset: "1",
							stopColor: "#a67b36"
						})
					]
				})
			] }),
			/* @__PURE__ */ t("path", {
				d: "M44-2q-7 0-5 7l5 4",
				fill: "none",
				stroke: "#a88548",
				strokeWidth: "1.3"
			}),
			/* @__PURE__ */ t("path", {
				d: "M40 1q2-2 4 0",
				stroke: "#f8dd99",
				strokeWidth: ".7"
			}),
			/* @__PURE__ */ n("g", {
				transform: "translate(20 -4) scale(.4)",
				children: [
					/* @__PURE__ */ n("g", {
						transform: "translate(58 19) rotate(190) scale(0.95)",
						children: [
							/* @__PURE__ */ t("path", {
								d: "M-5 0H45",
								stroke: "#71603d",
								strokeWidth: "1.8",
								strokeLinecap: "round"
							}),
							/* @__PURE__ */ t("path", {
								d: "M2 1Q-3.5999999999999996 -3 -3.3600000000000003 -6Q1 -6 2 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M2 -1Q-3.5999999999999996 3 -3 5.1Q1 6 2 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M6.4 1Q-1.054101966249684 -3 -0.690495168499706 -9.090169943749475Q5.4 -6 6.4 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M6.4 -1Q-1.054101966249684 3 -0.1450849718747369 7.726644452187053Q5.4 6 6.4 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M10.8 1Q1.6732884862451618 -3 2.14840258716215 -11.877852522924732Q9.8 -6 10.8 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M10.8 -1Q1.6732884862451618 3 2.861073738537635 10.096174644486021Q9.8 6 10.8 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M15.200000000000001 1Q4.745898033750317 -3 5.309504831500295 -14.090169943749475Q14.200000000000001 -6 15.200000000000001 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M15.200000000000001 -1Q4.745898033750317 3 6.154915028125264 11.976644452187053Q14.200000000000001 6 15.200000000000001 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M19.6 1Q8.293660902229082 -3 8.914083508747142 -15.510565162951535Q18.6 -6 19.6 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M19.6 -1Q8.293660902229082 3 9.844717418524233 13.183980388508804Q18.6 6 19.6 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M24 1Q12.4 -3 13.04 -16Q23 -6 24 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M24 -1Q12.4 3 14 13.6Q23 6 24 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M28.400000000000002 1Q17.093660902229082 -3 17.71408350874714 -15.510565162951536Q27.400000000000002 -6 28.400000000000002 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M28.400000000000002 -1Q17.093660902229082 3 18.644717418524234 13.183980388508806Q27.400000000000002 6 28.400000000000002 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M32.800000000000004 1Q22.34589803375032 -3 22.9095048315003 -14.090169943749475Q31.800000000000004 -6 32.800000000000004 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M32.800000000000004 -1Q22.34589803375032 3 23.754915028125268 11.976644452187053Q31.800000000000004 6 32.800000000000004 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M37.2 1Q28.07328848624516 -3 28.54840258716215 -11.877852522924734Q36.2 -6 37.2 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M37.2 -1Q28.07328848624516 3 29.261073738537636 10.096174644486023Q36.2 6 37.2 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M41.6 1Q34.14589803375031 -3 34.509504831500294 -9.090169943749475Q40.6 -6 41.6 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M41.6 -1Q34.14589803375031 3 35.054915028125265 7.726644452187053Q40.6 6 41.6 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M0 0H43",
								stroke: "#90aa68",
								strokeOpacity: ".5",
								strokeWidth: ".7"
							})
						]
					}),
					/* @__PURE__ */ n("g", {
						transform: "translate(54 17) rotate(220) scale(0.82)",
						children: [
							/* @__PURE__ */ t("path", {
								d: "M-5 0H45",
								stroke: "#71603d",
								strokeWidth: "1.8",
								strokeLinecap: "round"
							}),
							/* @__PURE__ */ t("path", {
								d: "M2 1Q-3.5999999999999996 -3 -3.3600000000000003 -6Q1 -6 2 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M2 -1Q-3.5999999999999996 3 -3 5.1Q1 6 2 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M6.4 1Q-1.054101966249684 -3 -0.690495168499706 -9.090169943749475Q5.4 -6 6.4 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M6.4 -1Q-1.054101966249684 3 -0.1450849718747369 7.726644452187053Q5.4 6 6.4 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M10.8 1Q1.6732884862451618 -3 2.14840258716215 -11.877852522924732Q9.8 -6 10.8 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M10.8 -1Q1.6732884862451618 3 2.861073738537635 10.096174644486021Q9.8 6 10.8 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M15.200000000000001 1Q4.745898033750317 -3 5.309504831500295 -14.090169943749475Q14.200000000000001 -6 15.200000000000001 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M15.200000000000001 -1Q4.745898033750317 3 6.154915028125264 11.976644452187053Q14.200000000000001 6 15.200000000000001 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M19.6 1Q8.293660902229082 -3 8.914083508747142 -15.510565162951535Q18.6 -6 19.6 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M19.6 -1Q8.293660902229082 3 9.844717418524233 13.183980388508804Q18.6 6 19.6 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M24 1Q12.4 -3 13.04 -16Q23 -6 24 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M24 -1Q12.4 3 14 13.6Q23 6 24 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M28.400000000000002 1Q17.093660902229082 -3 17.71408350874714 -15.510565162951536Q27.400000000000002 -6 28.400000000000002 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M28.400000000000002 -1Q17.093660902229082 3 18.644717418524234 13.183980388508806Q27.400000000000002 6 28.400000000000002 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M32.800000000000004 1Q22.34589803375032 -3 22.9095048315003 -14.090169943749475Q31.800000000000004 -6 32.800000000000004 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M32.800000000000004 -1Q22.34589803375032 3 23.754915028125268 11.976644452187053Q31.800000000000004 6 32.800000000000004 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M37.2 1Q28.07328848624516 -3 28.54840258716215 -11.877852522924734Q36.2 -6 37.2 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M37.2 -1Q28.07328848624516 3 29.261073738537636 10.096174644486023Q36.2 6 37.2 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M41.6 1Q34.14589803375031 -3 34.509504831500294 -9.090169943749475Q40.6 -6 41.6 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M41.6 -1Q34.14589803375031 3 35.054915028125265 7.726644452187053Q40.6 6 41.6 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M0 0H43",
								stroke: "#90aa68",
								strokeOpacity: ".5",
								strokeWidth: ".7"
							})
						]
					}),
					/* @__PURE__ */ n("g", {
						transform: "translate(56 18) rotate(165) scale(0.8)",
						children: [
							/* @__PURE__ */ t("path", {
								d: "M-5 0H45",
								stroke: "#71603d",
								strokeWidth: "1.8",
								strokeLinecap: "round"
							}),
							/* @__PURE__ */ t("path", {
								d: "M2 1Q-3.5999999999999996 -3 -3.3600000000000003 -6Q1 -6 2 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M2 -1Q-3.5999999999999996 3 -3 5.1Q1 6 2 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M6.4 1Q-1.054101966249684 -3 -0.690495168499706 -9.090169943749475Q5.4 -6 6.4 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M6.4 -1Q-1.054101966249684 3 -0.1450849718747369 7.726644452187053Q5.4 6 6.4 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M10.8 1Q1.6732884862451618 -3 2.14840258716215 -11.877852522924732Q9.8 -6 10.8 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M10.8 -1Q1.6732884862451618 3 2.861073738537635 10.096174644486021Q9.8 6 10.8 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M15.200000000000001 1Q4.745898033750317 -3 5.309504831500295 -14.090169943749475Q14.200000000000001 -6 15.200000000000001 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M15.200000000000001 -1Q4.745898033750317 3 6.154915028125264 11.976644452187053Q14.200000000000001 6 15.200000000000001 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M19.6 1Q8.293660902229082 -3 8.914083508747142 -15.510565162951535Q18.6 -6 19.6 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M19.6 -1Q8.293660902229082 3 9.844717418524233 13.183980388508804Q18.6 6 19.6 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M24 1Q12.4 -3 13.04 -16Q23 -6 24 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M24 -1Q12.4 3 14 13.6Q23 6 24 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M28.400000000000002 1Q17.093660902229082 -3 17.71408350874714 -15.510565162951536Q27.400000000000002 -6 28.400000000000002 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M28.400000000000002 -1Q17.093660902229082 3 18.644717418524234 13.183980388508806Q27.400000000000002 6 28.400000000000002 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M32.800000000000004 1Q22.34589803375032 -3 22.9095048315003 -14.090169943749475Q31.800000000000004 -6 32.800000000000004 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M32.800000000000004 -1Q22.34589803375032 3 23.754915028125268 11.976644452187053Q31.800000000000004 6 32.800000000000004 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M37.2 1Q28.07328848624516 -3 28.54840258716215 -11.877852522924734Q36.2 -6 37.2 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M37.2 -1Q28.07328848624516 3 29.261073738537636 10.096174644486023Q36.2 6 37.2 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M41.6 1Q34.14589803375031 -3 34.509504831500294 -9.090169943749475Q40.6 -6 41.6 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M41.6 -1Q34.14589803375031 3 35.054915028125265 7.726644452187053Q40.6 6 41.6 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M0 0H43",
								stroke: "#90aa68",
								strokeOpacity: ".5",
								strokeWidth: ".7"
							})
						]
					}),
					/* @__PURE__ */ n("g", {
						transform: "translate(58 18) rotate(-20) scale(0.86)",
						children: [
							/* @__PURE__ */ t("path", {
								d: "M-5 0H45",
								stroke: "#71603d",
								strokeWidth: "1.8",
								strokeLinecap: "round"
							}),
							/* @__PURE__ */ t("path", {
								d: "M2 1Q-3.5999999999999996 -3 -3.3600000000000003 -6Q1 -6 2 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M2 -1Q-3.5999999999999996 3 -3 5.1Q1 6 2 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M6.4 1Q-1.054101966249684 -3 -0.690495168499706 -9.090169943749475Q5.4 -6 6.4 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M6.4 -1Q-1.054101966249684 3 -0.1450849718747369 7.726644452187053Q5.4 6 6.4 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M10.8 1Q1.6732884862451618 -3 2.14840258716215 -11.877852522924732Q9.8 -6 10.8 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M10.8 -1Q1.6732884862451618 3 2.861073738537635 10.096174644486021Q9.8 6 10.8 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M15.200000000000001 1Q4.745898033750317 -3 5.309504831500295 -14.090169943749475Q14.200000000000001 -6 15.200000000000001 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M15.200000000000001 -1Q4.745898033750317 3 6.154915028125264 11.976644452187053Q14.200000000000001 6 15.200000000000001 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M19.6 1Q8.293660902229082 -3 8.914083508747142 -15.510565162951535Q18.6 -6 19.6 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M19.6 -1Q8.293660902229082 3 9.844717418524233 13.183980388508804Q18.6 6 19.6 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M24 1Q12.4 -3 13.04 -16Q23 -6 24 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M24 -1Q12.4 3 14 13.6Q23 6 24 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M28.400000000000002 1Q17.093660902229082 -3 17.71408350874714 -15.510565162951536Q27.400000000000002 -6 28.400000000000002 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M28.400000000000002 -1Q17.093660902229082 3 18.644717418524234 13.183980388508806Q27.400000000000002 6 28.400000000000002 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M32.800000000000004 1Q22.34589803375032 -3 22.9095048315003 -14.090169943749475Q31.800000000000004 -6 32.800000000000004 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M32.800000000000004 -1Q22.34589803375032 3 23.754915028125268 11.976644452187053Q31.800000000000004 6 32.800000000000004 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M37.2 1Q28.07328848624516 -3 28.54840258716215 -11.877852522924734Q36.2 -6 37.2 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M37.2 -1Q28.07328848624516 3 29.261073738537636 10.096174644486023Q36.2 6 37.2 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M41.6 1Q34.14589803375031 -3 34.509504831500294 -9.090169943749475Q40.6 -6 41.6 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M41.6 -1Q34.14589803375031 3 35.054915028125265 7.726644452187053Q40.6 6 41.6 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M0 0H43",
								stroke: "#90aa68",
								strokeOpacity: ".5",
								strokeWidth: ".7"
							})
						]
					}),
					/* @__PURE__ */ n("g", {
						transform: "translate(60 18) rotate(-48) scale(0.7)",
						children: [
							/* @__PURE__ */ t("path", {
								d: "M-5 0H45",
								stroke: "#71603d",
								strokeWidth: "1.8",
								strokeLinecap: "round"
							}),
							/* @__PURE__ */ t("path", {
								d: "M2 1Q-3.5999999999999996 -3 -3.3600000000000003 -6Q1 -6 2 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M2 -1Q-3.5999999999999996 3 -3 5.1Q1 6 2 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M6.4 1Q-1.054101966249684 -3 -0.690495168499706 -9.090169943749475Q5.4 -6 6.4 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M6.4 -1Q-1.054101966249684 3 -0.1450849718747369 7.726644452187053Q5.4 6 6.4 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M10.8 1Q1.6732884862451618 -3 2.14840258716215 -11.877852522924732Q9.8 -6 10.8 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M10.8 -1Q1.6732884862451618 3 2.861073738537635 10.096174644486021Q9.8 6 10.8 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M15.200000000000001 1Q4.745898033750317 -3 5.309504831500295 -14.090169943749475Q14.200000000000001 -6 15.200000000000001 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M15.200000000000001 -1Q4.745898033750317 3 6.154915028125264 11.976644452187053Q14.200000000000001 6 15.200000000000001 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M19.6 1Q8.293660902229082 -3 8.914083508747142 -15.510565162951535Q18.6 -6 19.6 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M19.6 -1Q8.293660902229082 3 9.844717418524233 13.183980388508804Q18.6 6 19.6 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M24 1Q12.4 -3 13.04 -16Q23 -6 24 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M24 -1Q12.4 3 14 13.6Q23 6 24 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M28.400000000000002 1Q17.093660902229082 -3 17.71408350874714 -15.510565162951536Q27.400000000000002 -6 28.400000000000002 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M28.400000000000002 -1Q17.093660902229082 3 18.644717418524234 13.183980388508806Q27.400000000000002 6 28.400000000000002 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M32.800000000000004 1Q22.34589803375032 -3 22.9095048315003 -14.090169943749475Q31.800000000000004 -6 32.800000000000004 1Z",
								fill: "#2e7656"
							}),
							/* @__PURE__ */ t("path", {
								d: "M32.800000000000004 -1Q22.34589803375032 3 23.754915028125268 11.976644452187053Q31.800000000000004 6 32.800000000000004 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M37.2 1Q28.07328848624516 -3 28.54840258716215 -11.877852522924734Q36.2 -6 37.2 1Z",
								fill: "#48926a"
							}),
							/* @__PURE__ */ t("path", {
								d: "M37.2 -1Q28.07328848624516 3 29.261073738537636 10.096174644486023Q36.2 6 37.2 -1Z",
								fill: "#194c38"
							}),
							/* @__PURE__ */ t("path", {
								d: "M41.6 1Q34.14589803375031 -3 34.509504831500294 -9.090169943749475Q40.6 -6 41.6 1Z",
								fill: "#205b43"
							}),
							/* @__PURE__ */ t("path", {
								d: "M41.6 -1Q34.14589803375031 3 35.054915028125265 7.726644452187053Q40.6 6 41.6 -1Z",
								fill: "#307454"
							}),
							/* @__PURE__ */ t("path", {
								d: "M0 0H43",
								stroke: "#90aa68",
								strokeOpacity: ".5",
								strokeWidth: ".7"
							})
						]
					}),
					/* @__PURE__ */ n("g", {
						fill: "#be3045",
						stroke: "#8e2333",
						strokeWidth: ".6",
						children: [
							/* @__PURE__ */ t("circle", {
								cx: "56",
								cy: "17",
								r: "3.7"
							}),
							/* @__PURE__ */ t("circle", {
								cx: "62",
								cy: "20",
								r: "3.2"
							}),
							/* @__PURE__ */ t("circle", {
								cx: "56",
								cy: "24",
								r: "3"
							})
						]
					}),
					/* @__PURE__ */ n("g", {
						fill: "#f6a0a2",
						children: [/* @__PURE__ */ t("circle", {
							cx: "55",
							cy: "16",
							r: "1"
						}), /* @__PURE__ */ t("circle", {
							cx: "61",
							cy: "19",
							r: ".8"
						})]
					})
				]
			}),
			/* @__PURE__ */ n("g", {
				ref: (e) => {
					i(0, e);
				},
				className: "bui-christmas-card-rig",
				children: [
					/* @__PURE__ */ t("path", {
						d: "M44 9v14M49 10q7 6 7 25",
						stroke: "#ae8a49",
						strokeWidth: ".9"
					}),
					/* @__PURE__ */ t("rect", {
						x: "41.5",
						y: "21",
						width: "5",
						height: "4",
						rx: ".8",
						fill: "#a4803f"
					}),
					/* @__PURE__ */ t("circle", {
						cx: "44",
						cy: "31",
						r: "7",
						fill: `url(#${r}-gold)`,
						stroke: "#b48a42",
						strokeWidth: ".6"
					}),
					/* @__PURE__ */ t("path", {
						d: "M40 27q-3 3-1 6",
						stroke: "#fff3bc",
						strokeWidth: "1.2",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ t("path", {
						d: "M39 34q5 4 10-1",
						stroke: "#b88d43",
						strokeWidth: ".6"
					}),
					/* @__PURE__ */ t("rect", {
						x: "54",
						y: "34",
						width: "4",
						height: "3",
						rx: ".6",
						fill: "#a4803f"
					}),
					/* @__PURE__ */ t("circle", {
						cx: "56",
						cy: "41",
						r: "4.5",
						fill: `url(#${r}-red)`,
						stroke: "#9f2c40",
						strokeWidth: ".6"
					}),
					/* @__PURE__ */ t("path", {
						d: "M54 39q-1 1-1 3",
						stroke: "#f7b9af",
						strokeWidth: ".8"
					})
				]
			})
		]
	}) });
}
//#endregion
//#region src/components/Seasonal/christmas-star-art.tsx
function Po({ id: r, registerTarget: i }) {
	return /* @__PURE__ */ t(e, { children: /* @__PURE__ */ n("svg", {
		viewBox: "0 0 60 64",
		preserveAspectRatio: "xMidYMid meet",
		fill: "none",
		focusable: "false",
		children: [
			/* @__PURE__ */ n("defs", { children: [
				/* @__PURE__ */ n("radialGradient", {
					id: `${r}-halo`,
					children: [/* @__PURE__ */ t("stop", {
						stopColor: "#ffdc83",
						stopOpacity: ".55"
					}), /* @__PURE__ */ t("stop", {
						offset: "1",
						stopColor: "#ffdc83",
						stopOpacity: "0"
					})]
				}),
				/* @__PURE__ */ n("radialGradient", {
					id: `${r}-red`,
					cx: ".3",
					cy: ".25",
					r: ".8",
					children: [
						/* @__PURE__ */ t("stop", { stopColor: "#e15b66" }),
						/* @__PURE__ */ t("stop", {
							offset: ".65",
							stopColor: "#ba3045"
						}),
						/* @__PURE__ */ t("stop", {
							offset: "1",
							stopColor: "#8c2035"
						})
					]
				}),
				/* @__PURE__ */ n("radialGradient", {
					id: `${r}-gold`,
					cx: ".3",
					cy: ".25",
					r: ".8",
					children: [
						/* @__PURE__ */ t("stop", { stopColor: "#ffe7a1" }),
						/* @__PURE__ */ t("stop", {
							offset: ".6",
							stopColor: "#d7ad55"
						}),
						/* @__PURE__ */ t("stop", {
							offset: "1",
							stopColor: "#a67b36"
						})
					]
				})
			] }),
			/* @__PURE__ */ t("path", {
				d: "M43-2q-7 0-5 7l5 4",
				stroke: "#a88548",
				strokeWidth: "1.3",
				fill: "none"
			}),
			/* @__PURE__ */ t("path", {
				d: "M39 1q2-2 4 0",
				stroke: "#f8dd99",
				strokeWidth: ".7"
			}),
			/* @__PURE__ */ n("g", {
				ref: (e) => {
					i(0, e);
				},
				className: "bui-christmas-card-rig",
				children: [/* @__PURE__ */ t("path", {
					d: "M43 9v9",
					stroke: "#a88548",
					strokeWidth: ".9"
				}), /* @__PURE__ */ n("g", {
					transform: "translate(20 17) scale(.65)",
					children: [/* @__PURE__ */ t("path", {
						d: "M35 1v16",
						stroke: "#ac8c4a"
					}), /* @__PURE__ */ n("g", {
						className: "bui-christmas-card-pendant",
						children: [
							/* @__PURE__ */ t("path", {
								d: "m35 15 5.5 11.5 12.7 1.8-9.2 9 2.2 12.7L35 44l-11.2 6 2.2-12.7-9.2-9 12.7-1.8Z",
								fill: `url(#${r}-gold)`,
								stroke: "#bd9549",
								strokeWidth: ".8"
							}),
							/* @__PURE__ */ t("path", {
								d: "M35 15v19L29.5 26.5Z",
								fill: "#fff0b8"
							}),
							/* @__PURE__ */ t("path", {
								d: "M53.2 28.3 35 34l8.8 3.3Z",
								fill: "#ffdc83"
							}),
							/* @__PURE__ */ t("path", {
								d: "m46.2 50.7-11.2-16.7V44Z",
								fill: "#ae7e32"
							}),
							/* @__PURE__ */ t("path", {
								d: "M23.8 50.7 35 34l-9 3.3Z",
								fill: "#e8bc63"
							}),
							/* @__PURE__ */ t("path", {
								d: "m16.8 28.3 18.2 5.7-5.5-7.5Z",
								fill: "#b88b3d"
							}),
							/* @__PURE__ */ t("path", {
								d: "m35 18 4.7 10 10.6 1.5-7.8 7.6 1.8 10.7-9.3-5-9.3 5 1.8-10.7-7.8-7.6 10.6-1.5Z",
								stroke: "#ffe6a4",
								strokeWidth: ".5",
								fill: "none"
							}),
							/* @__PURE__ */ t("path", {
								d: "M35 12C17-3 18 22 35 13C52-3 54 22 35 13",
								fill: "#bb314a",
								stroke: "#94273c",
								strokeWidth: ".7"
							}),
							/* @__PURE__ */ t("ellipse", {
								cx: "35",
								cy: "13",
								rx: "3",
								ry: "3.6",
								fill: "#db5868"
							})
						]
					})]
				})]
			})
		]
	}) });
}
//#endregion
//#region src/components/Seasonal/christmas-candy-art.tsx
function Fo({ id: r, registerTarget: i }) {
	return /* @__PURE__ */ t(e, { children: /* @__PURE__ */ n("svg", {
		viewBox: "0 0 40 86",
		preserveAspectRatio: "xMidYMid meet",
		fill: "none",
		focusable: "false",
		children: [/* @__PURE__ */ n("defs", { children: [
			/* @__PURE__ */ n("radialGradient", {
				id: `${r}-halo`,
				children: [/* @__PURE__ */ t("stop", {
					stopColor: "#ffdc83",
					stopOpacity: ".55"
				}), /* @__PURE__ */ t("stop", {
					offset: "1",
					stopColor: "#ffdc83",
					stopOpacity: "0"
				})]
			}),
			/* @__PURE__ */ n("radialGradient", {
				id: `${r}-red`,
				cx: ".3",
				cy: ".25",
				r: ".8",
				children: [
					/* @__PURE__ */ t("stop", { stopColor: "#e15b66" }),
					/* @__PURE__ */ t("stop", {
						offset: ".65",
						stopColor: "#ba3045"
					}),
					/* @__PURE__ */ t("stop", {
						offset: "1",
						stopColor: "#8c2035"
					})
				]
			}),
			/* @__PURE__ */ n("radialGradient", {
				id: `${r}-gold`,
				cx: ".3",
				cy: ".25",
				r: ".8",
				children: [
					/* @__PURE__ */ t("stop", { stopColor: "#ffe7a1" }),
					/* @__PURE__ */ t("stop", {
						offset: ".6",
						stopColor: "#d7ad55"
					}),
					/* @__PURE__ */ t("stop", {
						offset: "1",
						stopColor: "#a67b36"
					})
				]
			})
		] }), /* @__PURE__ */ n("g", {
			ref: (e) => {
				i(0, e);
			},
			className: "bui-christmas-candy-pendant",
			children: [
				/* @__PURE__ */ t("defs", { children: /* @__PURE__ */ t("mask", {
					id: `${r}-cane`,
					maskUnits: "userSpaceOnUse",
					x: "0",
					y: "0",
					width: "40",
					height: "86",
					children: /* @__PURE__ */ t("path", {
						d: "M11 75V27C11 9 33 9 33 27v6",
						fill: "none",
						stroke: "white",
						strokeWidth: "8",
						strokeLinecap: "round"
					})
				}) }),
				/* @__PURE__ */ t("path", {
					d: "M11 75V27C11 9 33 9 33 27v6",
					stroke: "#d2dce3",
					strokeWidth: "10",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ t("path", {
					d: "M11 75V27C11 9 33 9 33 27v6",
					stroke: "#fffdf5",
					strokeWidth: "8",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ n("g", {
					mask: `url(#${r}-cane)`,
					children: [
						/* @__PURE__ */ t("path", {
							d: "M0 4l42-18",
							stroke: "#c53850",
							strokeWidth: "6"
						}),
						/* @__PURE__ */ t("path", {
							d: "M0 17l42-18",
							stroke: "#c53850",
							strokeWidth: "6"
						}),
						/* @__PURE__ */ t("path", {
							d: "M0 30l42-18",
							stroke: "#c53850",
							strokeWidth: "6"
						}),
						/* @__PURE__ */ t("path", {
							d: "M0 43l42-18",
							stroke: "#c53850",
							strokeWidth: "6"
						}),
						/* @__PURE__ */ t("path", {
							d: "M0 56l42-18",
							stroke: "#c53850",
							strokeWidth: "6"
						}),
						/* @__PURE__ */ t("path", {
							d: "M0 69l42-18",
							stroke: "#c53850",
							strokeWidth: "6"
						}),
						/* @__PURE__ */ t("path", {
							d: "M0 82l42-18",
							stroke: "#c53850",
							strokeWidth: "6"
						})
					]
				}),
				/* @__PURE__ */ t("path", {
					d: "M8.5 29v39",
					stroke: "white",
					strokeWidth: "1.2",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ t("path", {
					d: "M12 32C-5 20-4 43 12 34C28 21 30 44 12 34l-4 13 6-3 5 3-3-13",
					fill: "#b82e46",
					stroke: "#8e243b",
					strokeWidth: ".6"
				}),
				/* @__PURE__ */ t("circle", {
					cx: "13",
					cy: "33",
					r: "3",
					fill: "#df6070"
				})
			]
		})]
	}) });
}
//#endregion
//#region src/components/Seasonal/use-ornament-motion.ts
var Io = [
	{
		factor: 1,
		offset: .15
	},
	{
		factor: -.7,
		offset: .34
	},
	{
		factor: .43,
		offset: .54
	},
	{
		factor: -.2,
		offset: .73
	},
	{
		factor: .06,
		offset: .89
	},
	{
		factor: 0,
		offset: 1
	}
];
function Lo(e, t) {
	let n = h([]), r = h([]), i = h(!0), a = c((e, t) => {
		n.current[e] = t;
	}, []), o = e !== "none";
	u(() => {
		if (!o) return;
		let e = window.matchMedia("(prefers-reduced-motion: reduce)"), t = () => {
			i.current = e.matches, e.matches && (r.current.forEach((e) => e.cancel()), r.current = []);
		};
		return t(), e.addEventListener("change", t), () => {
			e.removeEventListener("change", t), r.current.forEach((e) => e.cancel()), r.current = [];
		};
	}, [o]), u(() => {
		e === "none" ? (r.current.forEach((e) => e.cancel()), r.current = []) : r.current.forEach((t) => {
			e === "paused" ? t.pause() : t.playState === "paused" && t.play();
		});
	}, [e]);
	let s = () => {
		if (e !== "reactive" || i.current) return;
		let a = n.current.map((e) => e ? getComputedStyle(e).transform : "none");
		r.current.forEach((e) => e.cancel()), r.current = [], t.forEach(({ amplitude: e, rest: t, duration: i, delay: o = 0 }, s) => {
			let c = n.current[s];
			if (!c || typeof c.animate != "function") return;
			let l = a[s], u = c.animate([{ transform: !l || l === "none" ? `rotate(${t}deg)` : l }, ...Io.map(({ factor: n, offset: r }) => ({
				transform: `rotate(${t + e * n}deg)`,
				offset: r
			}))], {
				duration: i,
				delay: o,
				fill: "backwards",
				easing: "ease-in-out"
			});
			r.current.push(u);
			let d = () => {
				r.current = r.current.filter((e) => e !== u);
			};
			u.addEventListener("finish", d, { once: !0 }), u.addEventListener("cancel", d, { once: !0 });
		});
	};
	return {
		registerTarget: a,
		onPointerEnter: s,
		onPointerDown: (e) => {
			e.pointerType !== "mouse" && s();
		},
		onFocus: (e) => {
			(!(e.relatedTarget instanceof Node) || !e.currentTarget.contains(e.relatedTarget)) && s();
		}
	};
}
//#endregion
//#region src/components/Seasonal/christmas-decorations.tsx
var Ro = [
	{
		amplitude: 12,
		rest: 0,
		duration: 1600
	},
	{
		amplitude: -8,
		rest: 0,
		duration: 1510,
		delay: 70
	},
	{
		amplitude: -8,
		rest: 0,
		duration: 1510,
		delay: 70
	}
], zo = [{
	amplitude: 4.5,
	rest: 0,
	duration: 1700
}], Bo = [{
	amplitude: 5.5,
	rest: 0,
	duration: 1700
}], Vo = [{
	amplitude: 4,
	rest: -24,
	duration: 1700
}];
function Ho({ children: e, enabled: r = !0, motion: i = "reactive", className: a = "", style: o }) {
	let s = d(), { registerTarget: c, onPointerEnter: l, onPointerDown: u, onFocus: f } = Lo(r ? i : "none", Ro);
	return /* @__PURE__ */ n("span", {
		className: `bui-christmas-action-host ${a}`,
		style: o,
		"data-enabled": r,
		onPointerEnter: l,
		onPointerDown: u,
		onFocus: f,
		children: [e, r && /* @__PURE__ */ t("span", {
			className: "bui-christmas-decoration bui-christmas-action",
			"aria-hidden": "true",
			children: /* @__PURE__ */ t(Mo, {
				id: `bui-action-${s.replace(/:/g, "")}`,
				registerTarget: c
			})
		})]
	});
}
function Uo({ children: e, enabled: r = !0, layout: i = "inline", attachment: a = "none", variant: o = "baubles", motion: s = "reactive", className: c = "", style: l }) {
	let u = d(), { registerTarget: f, onPointerEnter: p, onPointerDown: m, onFocus: h } = Lo(r ? s : "none", o === "star" ? Bo : zo), g = o === "star" ? Po : No;
	return /* @__PURE__ */ n("div", {
		className: `bui-christmas-indicator-host ${c}`,
		"data-layout": i,
		"data-attachment": a,
		style: l,
		"data-enabled": r,
		onPointerEnter: p,
		onPointerDown: m,
		onFocus: h,
		children: [e, r && /* @__PURE__ */ t("span", {
			className: `bui-christmas-decoration bui-christmas-indicator bui-christmas-${o}`,
			"aria-hidden": "true",
			children: /* @__PURE__ */ t(g, {
				id: `bui-indicator-${u.replace(/:/g, "")}`,
				registerTarget: f
			}, o)
		})]
	});
}
function Wo({ children: e, enabled: r = !0, anchorOffset: i = 86, placement: a = "top", motion: o = "reactive", className: s = "", style: c }) {
	let l = d(), { registerTarget: u, onPointerEnter: f, onPointerDown: p, onFocus: m } = Lo(r ? o : "none", a === "sides" ? [Vo[0], Vo[0]] : Vo), h = {
		...c,
		"--bui-candy-anchor": `${Number.isFinite(i) ? i : 86}px`
	};
	return /* @__PURE__ */ n("div", {
		className: `bui-christmas-candy-host ${s}`,
		"data-placement": a,
		"data-enabled": r,
		style: h,
		onPointerEnter: f,
		onPointerDown: p,
		onFocus: m,
		children: [
			e,
			r && /* @__PURE__ */ t("span", {
				className: "bui-christmas-decoration bui-christmas-candy",
				"aria-hidden": "true",
				children: /* @__PURE__ */ t(Fo, {
					id: `bui-candy-${l.replace(/:/g, "")}`,
					registerTarget: u
				})
			}),
			r && a === "sides" && /* @__PURE__ */ t("span", {
				className: "bui-christmas-decoration bui-christmas-candy bui-christmas-candy-right",
				"aria-hidden": "true",
				children: /* @__PURE__ */ t(Fo, {
					id: `bui-candy-right-${l.replace(/:/g, "")}`,
					registerTarget: (e, t) => u(1, t)
				})
			}),
			r && a === "top" && /* @__PURE__ */ t("span", {
				className: "bui-christmas-decoration bui-christmas-insertion",
				"aria-hidden": "true",
				children: /* @__PURE__ */ n("svg", {
					viewBox: "0 0 18 8",
					fill: "none",
					focusable: "false",
					children: [
						/* @__PURE__ */ t("ellipse", {
							cx: "6",
							cy: "4",
							rx: "5.6",
							ry: "1.8",
							fill: "var(--color-text, #172033)",
							opacity: ".22"
						}),
						/* @__PURE__ */ t("path", {
							d: "M0 4Q6 7 12 4H18V8H0Z",
							fill: "var(--color-surface, white)"
						}),
						/* @__PURE__ */ t("path", {
							d: "M0 4Q6 7 12 4",
							stroke: "var(--color-border, #dce3e8)",
							strokeWidth: ".6"
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Hr as AVATAR_DEFAULTS, Vr as AVATAR_GROUP_SPACING, zr as AVATAR_SHAPE_CLASSES, Lr as AVATAR_SIZE_CLASSES, Br as AVATAR_STATUS_COLORS, sn as ArrowRight, qe as ArrowRightIcon, Qa as AuditStatusDot, $r as Avatar, Jr as AvatarBadge, ei as AvatarGroup, Zr as AvatarMenu, Da as BarChart, Ke as BroomIcon, J as Button, Je as CalendarIcon, ln as CalendarVariant, Ye as CalendarVariantIcon, mi as Card, oo as CaseCarousel, Xe as ChartLineIcon, Ze as CheckIcon, hi as CheckboxCard, zn as CheckboxInput, Qe as ChevronDownIcon, $e as ChevronLeftIcon, et as ChevronRightIcon, X as Chip, Ho as ChristmasActionDecoration, Wo as ChristmasCandyCane, jo as ChristmasGarland, Uo as ChristmasIndicatorDecoration, tt as ClockIcon, rt as Close2Icon, nt as CloseIcon, cn as CloseX, it as ColumnsIcon, ho as CommentList, ot as Company2Icon, at as CompanyIcon, mo as ControlPointList, st as CoverChevronLeftIcon, ct as CoverChevronRightIcon, lt as CrosshairIcon, ut as CrosshairPlusIcon, Rn as DateInput, dt as DocumentFileIcon, pt as DocumentList2Icon, ft as DocumentListIcon, ki as Drawer, Ai as DrawerAuditItem, ji as DrawerAuditList, mt as EditIcon, ht as EqualsIcon, po as EvidenceViewer, gt as FarmIcon, kr as FilterToolbar, _t as FlowBranchesIcon, so as FlowTimeline, ea as GroupMove, vt as Icon021Icon, yt as Icon022Icon, bt as Icon024Icon, xt as Icon025Icon, St as Icon026Icon, Ct as Icon032Icon, wt as Icon033Icon, Tt as Icon035Icon, Et as Icon036Icon, Dt as Icon037Icon, Ot as Icon038Icon, kt as Icon042Icon, At as Icon043Icon, jt as Icon046Icon, Mt as Icon054Icon, Y as IconButton, Nt as IndicatorBalanceIcon, Pt as IndicatorLineIcon, Ft as InfoCircleIcon, co as KeyValueGrid, It as LayoutIcon, za as LineChart, Lt as LockIcon, zt as Menu2Icon, Bt as Menu3Icon, Rt as MenuIcon, Vt as MenuShortIcon, Ut as Moon2Icon, Ht as MoonIcon, wn as MultiSearchSelectInput, qn as Notice, Wt as NotificationIcon, Me as NumberInput, Hn as OtpInput, Ir as Pagination, Gt as PlusIcon, Kt as PortIcon, ci as ProfileDialog, oi as ProfileFarmCarousel, di as ProfileMenu, Un as RadioCard, _e as RibbonCode, ve as RibbonLabel, qt as SearchIcon, yn as SearchSelectInput, gn as SelectInput, Re as SialIcon, Ge as SialIsotype, Co as SialMascot, dr as Skeleton, hr as SkeletonCard, gr as SkeletonTable, mr as SkeletonText, wi as Slider, Ci as SliderFrame, Jt as SlidersIcon, Yt as SlidersVerticalIcon, sr as Spinner, gi as StatsCardGroup, Xt as StatusErrorCircleIcon, Qt as SunCompactIcon, Zt as SunIcon, Cr as Table, wr as TableEmpty, Er as TableRowActions, je as TextInput, Ka as Timeline, Zn as Toast, tr as ToastProvider, qa as Toggle, Ya as ToggleMixed, Or as Toolbar, Xi as TransferList, Ii as TreeList, $t as TruckIcon, tn as Users2Icon, en as UsersIcon, rn as View2Icon, nn as ViewIcon, ar as ViewMotion, an as WarningTriangleIcon, on as WarningTriangleSolidIcon, Di as WizardForm, Oi as WizardStep, Q as createSialIcon, Ie as sialIconNames, $n as useToast, Ei as useWizard };
