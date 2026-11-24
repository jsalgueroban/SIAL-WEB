import { Fragment as e, jsx as t, jsxs as n } from "react/jsx-runtime";
import { Suspense as r, lazy as i, useId as a, useMemo as o, useSyncExternalStore as s } from "react";
//#region src/components/Charts/ECharts/generic-data.ts
var c = new Set([
	"percent",
	"pie",
	"donut",
	"radar",
	"gauge",
	"stacked-area"
]), l = new Set([
	"percent",
	"pie",
	"donut",
	"radar",
	"gauge",
	"stacked-area"
]);
function u(e) {
	return [
		"columns",
		"horizontal",
		"area",
		"pie",
		"donut",
		"gauge"
	].includes(e);
}
function d(e, t) {
	return t.series.every((t) => t.values.every((t) => t === null ? !l.has(e) : Number.isFinite(t) && (!c.has(e) || t >= 0)));
}
function f(e) {
	return {
		...e,
		series: e.series.map((t) => ({
			...t,
			values: t.values.map((t, n) => {
				let r = e.series.reduce((e, t) => e + (t.values[n] ?? 0), 0);
				return r > 0 && t !== null ? t / r * 100 : 0;
			})
		}))
	};
}
//#endregion
//#region src/components/Charts/ECharts/proposal-style.ts
var p = {
	axisFontSize: 12,
	labelFontSize: 12,
	legendFontSize: 12,
	lineWidth: 3,
	pointSize: 10,
	barRadius: 4,
	horizontalBarSize: 18,
	entryDuration: 480,
	gridDash: [3, 4]
};
function m(e) {
	return e.palette ?? {
		primary: "#005ca8",
		info: "#0288d1",
		neutral: "#8c94a6",
		warning: "#d4a800",
		success: "#2e7d32",
		soft: "#f2f7fc",
		overlay: e.surface
	};
}
function h(e) {
	let t = m(e);
	return [
		t.neutral,
		t.primary,
		t.warning,
		t.success,
		t.info,
		t.neutral
	];
}
function g(e, t, n) {
	let r = m(t), i = {
		"--color-primary-500": r.primary,
		"--color-info-main": r.info,
		"--color-text-3": r.neutral
	}, a = e.match(/^var\((--[\w-]+)\)$/)?.[1];
	return a ? i[a] ?? [
		r.primary,
		r.info,
		r.neutral
	][n % 3] : e;
}
function _(e, t) {
	let n = (Array.isArray(e) ? e : [e]).filter((e) => typeof e == "object" && !!e), r = (e) => String(e ?? "").replace(/[&<>"']/g, (e) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[e] ?? e), i = (e) => typeof e == "number" && Number.isFinite(e) ? e.toLocaleString("es-CO", { maximumFractionDigits: 1 }) : "Sin dato";
	return `<div class="bui-echarts-tooltip"><strong>${r(n[0]?.axisValueLabel ?? n[0]?.name)}</strong>${n.map((e) => `<div><i style="background:${r(t.get(String(e.seriesId)) ?? "#005ca8")}"></i><span>${r(e.seriesName)}</span><b>${r(i(e.value))}</b></div>`).join("")}</div>`;
}
//#endregion
//#region src/components/Charts/ECharts/generic-options.ts
var v = {
	motion: !0,
	labels: !0,
	grid: !0,
	smooth: !1,
	zoom: !1,
	target: 500
};
function y(e, t, n, r) {
	let i = m(r), a = h(r), o = r.fontFamily || "Poppins, sans-serif", s = e.series.map((e, t) => ({
		...e,
		color: g(e.color, r, t)
	})), c = u(t) ? s.slice(0, 1) : s, l = {
		...e,
		series: c
	}, d = {
		animation: n.motion,
		animationDuration: n.motion ? p.entryDuration : 0,
		animationDurationUpdate: n.motion ? p.entryDuration : 0,
		animationEasing: "cubicOut",
		animationEasingUpdate: "cubicOut",
		textStyle: {
			fontFamily: o,
			color: r.text
		},
		color: c.map((e) => e.color),
		tooltip: {
			trigger: "item",
			renderMode: "html",
			backgroundColor: i.overlay,
			borderColor: r.border,
			borderWidth: 1,
			borderRadius: r.controlRadius ?? 8,
			padding: [12, 16],
			shadowBlur: 24,
			shadowOffsetY: 8,
			shadowColor: "rgba(16,24,40,.14)",
			textStyle: {
				color: r.text,
				fontFamily: o,
				fontSize: 13
			},
			confine: !0,
			extraCssText: "min-width:170px;font-variant-numeric:tabular-nums;"
		},
		aria: {
			enabled: !0,
			description: `${e.categories.length} categorías. ${c.map((t) => `${t.label}: ${t.values.map((t, n) => `${e.categories[n].label} ${t === null ? "sin dato" : t}`).join(", ")}`).join(". ")}. Valores disponibles en la tabla de datos de la gráfica.`
		},
		legend: [],
		xAxis: [],
		yAxis: [],
		grid: [],
		graphic: [],
		radar: [],
		visualMap: [],
		dataZoom: []
	}, v = {
		bottom: 0,
		selectedMode: !1,
		textStyle: {
			color: r.muted,
			fontFamily: o,
			fontSize: p.legendFontSize
		},
		icon: "roundRect",
		itemGap: 16,
		itemWidth: 8,
		itemHeight: 8
	}, y = c[0];
	if (!y || e.categories.length === 0) return {
		...d,
		series: []
	};
	let b = (t) => t.values.map((n, r) => ({
		id: e.categories[r].id,
		name: e.categories[r].label,
		value: n,
		categoryId: e.categories[r].id,
		seriesId: t.id
	}));
	if (t === "pie" || t === "donut") {
		let i = y.values.reduce((e, t) => e + (t ?? 0), 0);
		return {
			...d,
			legend: {
				...v,
				type: "scroll",
				formatter: (t) => {
					let r = e.categories.findIndex((e) => e.label === t), a = y.values[r] ?? 0;
					return n.labels ? `${t}  ${i ? (a / i * 100).toLocaleString("es-CO", { maximumFractionDigits: 1 }) : 0}%` : t;
				}
			},
			series: [{
				id: y.id,
				name: y.label,
				type: "pie",
				radius: t === "donut" ? ["57%", "81%"] : ["0%", "70%"],
				center: ["50%", "43%"],
				stillShowZeroSum: !1,
				universalTransition: { enabled: n.motion },
				label: {
					show: !1,
					position: "inside",
					formatter: "{d}%",
					color: "#fff",
					fontSize: 10
				},
				emphasis: {
					scaleSize: 3,
					focus: "self"
				},
				blur: { itemStyle: { opacity: .35 } },
				data: b(y).flatMap((e, t) => e.value === null ? [] : [{
					...e,
					value: e.value,
					itemStyle: {
						color: a[t % a.length],
						borderColor: r.surface,
						borderWidth: 0
					}
				}])
			}],
			graphic: t === "donut" ? [{
				type: "text",
				left: "center",
				top: "34%",
				style: {
					text: String(i),
					fill: r.text,
					font: `600 30px ${o}`
				}
			}, {
				type: "text",
				left: "center",
				top: "46%",
				style: {
					text: "total",
					fill: r.muted,
					font: `12px ${o}`
				}
			}] : []
		};
	}
	if (t === "gauge") {
		let e = y.values.reduce((e, t) => e + (t ?? 0), 0), t = Math.max(1, n.target), i = e / t * 100;
		return {
			...d,
			series: [{
				id: y.id,
				type: "gauge",
				name: y.label,
				min: 0,
				max: Math.max(100, Math.ceil(i / 25) * 25),
				center: ["50%", "55%"],
				radius: "83%",
				startAngle: 210,
				endAngle: -30,
				progress: {
					show: !0,
					width: 14
				},
				axisLine: { lineStyle: {
					width: 14,
					color: [[1, r.border]]
				} },
				pointer: {
					length: "55%",
					width: 5
				},
				anchor: {
					show: !0,
					size: 10
				},
				axisLabel: {
					color: r.muted,
					distance: 18,
					fontSize: 9
				},
				axisTick: { show: !1 },
				splitLine: {
					length: 8,
					lineStyle: { color: r.muted }
				},
				detail: {
					valueAnimation: n.motion,
					formatter: "{value}%",
					color: r.text,
					fontSize: 24,
					offsetCenter: [0, "45%"]
				},
				title: {
					offsetCenter: [0, "70%"],
					color: r.muted,
					fontSize: 11
				},
				data: [{
					name: `${e} / ${t} unidades`,
					value: Number(i.toFixed(1))
				}]
			}]
		};
	}
	if (t === "radar") {
		let t = Math.max(1, ...c.flatMap((e) => e.values.map((e) => e ?? 0))) * 1.15;
		return {
			...d,
			legend: v,
			radar: {
				center: ["50%", "43%"],
				radius: "58%",
				indicator: e.categories.map((e) => ({
					name: e.label.split(" · ")[0],
					max: t
				})),
				axisName: {
					color: r.muted,
					fontSize: 10
				},
				splitArea: { show: !1 },
				splitLine: { lineStyle: { color: r.border } },
				axisLine: { lineStyle: { color: r.border } }
			},
			series: [{
				id: "radar-profiles",
				type: "radar",
				areaStyle: { opacity: .07 },
				data: c.map((e) => ({
					id: e.id,
					name: e.label,
					value: e.values.map((e) => e ?? 0),
					seriesId: e.id,
					itemStyle: { color: e.color }
				}))
			}]
		};
	}
	let x = {
		axisLine: { show: !1 },
		axisTick: { show: !1 },
		axisLabel: {
			color: r.muted,
			fontSize: p.axisFontSize,
			width: 80,
			overflow: "truncate"
		},
		splitLine: {
			show: n.grid,
			lineStyle: {
				color: r.border,
				type: p.gridDash
			}
		}
	}, S = {
		left: 54,
		right: 25,
		top: 35,
		bottom: n.zoom ? 84 : 60
	};
	if (t === "heatmap") {
		let t = c.flatMap((e) => e.values.filter((e) => e !== null));
		return {
			...d,
			grid: {
				...S,
				left: 78,
				bottom: 72
			},
			xAxis: {
				...x,
				type: "category",
				data: e.categories.map((e) => e.label)
			},
			yAxis: {
				...x,
				type: "category",
				data: c.map((e) => e.label)
			},
			visualMap: {
				min: Math.min(0, ...t),
				max: Math.max(1, ...t),
				orient: "horizontal",
				left: "center",
				bottom: 0,
				calculable: !1,
				textStyle: { color: r.muted },
				inRange: { color: [
					i.soft,
					i.info,
					i.primary
				] }
			},
			series: [{
				id: "heatmap-values",
				type: "heatmap",
				label: {
					show: n.labels,
					color: "#10253d",
					textBorderColor: "#ffffff",
					textBorderWidth: 2,
					fontSize: 10
				},
				data: c.flatMap((t, n) => t.values.flatMap((r, i) => r === null ? [] : [{
					id: `${t.id}-${e.categories[i].id}`,
					value: [
						i,
						n,
						r
					],
					name: `${e.categories[i].label} · ${t.label}`,
					seriesId: t.id,
					categoryId: e.categories[i].id
				}]))
			}]
		};
	}
	if (t === "scatter") {
		let t = c[1];
		return t ? {
			...d,
			grid: S,
			xAxis: {
				...x,
				type: "value",
				name: y.label,
				nameTextStyle: { color: r.muted }
			},
			yAxis: {
				...x,
				type: "value",
				name: t.label,
				nameTextStyle: { color: r.muted }
			},
			series: [{
				id: "scatter-pairs",
				type: "scatter",
				symbolSize: 17,
				itemStyle: {
					color: y.color,
					opacity: .8
				},
				label: {
					show: n.labels,
					position: "top",
					color: r.muted,
					formatter: "{b}",
					fontSize: 9
				},
				data: y.values.flatMap((n, r) => n === null || t.values[r] === null ? [] : [{
					id: e.categories[r].id,
					name: e.categories[r].label.split(" · ")[0],
					value: [n, t.values[r]],
					categoryId: e.categories[r].id,
					seriesId: y.id
				}])
			}]
		} : {
			...d,
			series: []
		};
	}
	let C = t === "horizontal" || t === "stacked-horizontal", w = [
		"stacked",
		"stacked-horizontal",
		"percent",
		"stacked-area"
	].includes(t), T = t === "percent" ? f(l) : l, E = {
		...x,
		type: "category",
		data: e.categories.map((e) => e.label),
		axisLabel: {
			...x.axisLabel,
			interval: 0,
			width: C ? 95 : 60
		},
		inverse: C,
		splitLine: { show: !1 }
	}, D = {
		...x,
		type: "value",
		...t === "percent" ? {
			min: 0,
			max: 100,
			axisLabel: {
				...x.axisLabel,
				formatter: "{value}%"
			}
		} : {}
	}, O = T.series.map((e, i) => {
		let o = [
			"line",
			"area",
			"stacked-area"
		].includes(t) || t === "combo" && i > 0, s = b(e);
		return o ? {
			id: e.id,
			name: e.label,
			type: "line",
			data: s,
			smooth: n.smooth,
			connectNulls: !1,
			symbol: "circle",
			symbolSize: p.pointSize,
			lineStyle: {
				width: p.lineWidth,
				color: e.color
			},
			stack: w ? "total" : void 0,
			areaStyle: ["area", "stacked-area"].includes(t) ? {
				color: e.color,
				opacity: t === "area" ? .15 : .35
			} : void 0,
			emphasis: {
				focus: "series",
				scale: 1.4,
				itemStyle: { borderWidth: 3 }
			},
			label: {
				show: n.labels,
				color: r.text,
				fontSize: p.labelFontSize
			},
			itemStyle: {
				color: r.surface,
				borderColor: e.color,
				borderWidth: 2
			}
		} : {
			id: e.id,
			name: e.label,
			type: "bar",
			data: s.map((e, n) => u(t) ? {
				...e,
				itemStyle: { color: a[n % a.length] }
			} : e),
			stack: w ? "total" : void 0,
			barMaxWidth: C ? p.horizontalBarSize : 96,
			universalTransition: { enabled: n.motion && u(t) },
			emphasis: {
				focus: "series",
				itemStyle: {
					borderColor: r.surface,
					borderWidth: 2,
					opacity: .85
				}
			},
			label: {
				show: n.labels,
				position: w ? "inside" : C ? "right" : "top",
				color: w ? "#fff" : r.text,
				fontSize: C ? 11 : p.labelFontSize,
				formatter: t === "percent" ? (e) => `${Number(e.value).toFixed(0)}%` : void 0
			},
			itemStyle: {
				color: e.color,
				borderRadius: w ? 0 : C ? [
					0,
					p.barRadius,
					p.barRadius,
					0
				] : [
					p.barRadius,
					p.barRadius,
					0,
					0
				]
			}
		};
	});
	return {
		...d,
		tooltip: {
			...d.tooltip,
			trigger: "axis",
			formatter: (e) => _(e, new Map(c.map((e) => [e.id, e.color]))),
			axisPointer: {
				type: "shadow",
				shadowStyle: {
					color: i.soft,
					opacity: .65
				}
			}
		},
		legend: c.length > 1 ? {
			...v,
			data: c.map((e) => ({
				name: e.label,
				itemStyle: { color: e.color }
			}))
		} : [],
		grid: {
			...S,
			left: C ? 110 : 54
		},
		xAxis: C ? D : E,
		yAxis: C ? E : D,
		series: O,
		dataZoom: n.zoom ? [{
			type: "inside",
			...C ? { yAxisIndex: 0 } : { xAxisIndex: 0 },
			filterMode: "none"
		}, {
			type: "slider",
			...C ? {
				yAxisIndex: 0,
				orient: "vertical",
				right: 0,
				top: 35,
				bottom: 60
			} : {
				xAxisIndex: 0,
				bottom: 27,
				height: 16
			},
			filterMode: "none",
			textStyle: { color: r.muted }
		}] : []
	};
}
//#endregion
//#region src/components/Charts/ECharts/use-chart-environment.ts
function b() {
	let e = typeof document > "u" ? null : getComputedStyle(document.documentElement), t = (t, n) => e?.getPropertyValue(t).trim() || n;
	return {
		text: t("--color-text", "#1a1f36"),
		muted: t("--color-text-2", "#5b6475"),
		border: t("--color-border-subtle", "#e7eaf0"),
		surface: t("--color-surface", "#ffffff"),
		palette: {
			primary: t("--color-primary-500", "#005ca8"),
			info: t("--color-info-main", "#0288d1"),
			neutral: t("--color-text-3", "#8c94a6"),
			warning: t("--color-warning-main", "#d4a800"),
			success: t("--color-success-main", "#2e7d32"),
			soft: t("--color-primary-50", "#f2f7fc"),
			overlay: t("--color-surface-overlay", "#ffffff")
		},
		fontFamily: t("--font-primary", "Poppins, sans-serif"),
		controlRadius: Number.parseFloat(t("--radius-control", "8")) || 8
	};
}
function x(e) {
	let t = matchMedia("(prefers-color-scheme: dark)"), n = new MutationObserver(e);
	return n.observe(document.documentElement, {
		attributes: !0,
		attributeFilter: [
			"class",
			"style",
			"data-theme"
		]
	}), t.addEventListener("change", e), () => {
		n.disconnect(), t.removeEventListener("change", e);
	};
}
function S(e) {
	let t = matchMedia("(prefers-reduced-motion: reduce)");
	return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function C() {
	s(x, () => JSON.stringify(b()), () => "");
	let e = s(S, () => matchMedia("(prefers-reduced-motion: reduce)").matches, () => !0);
	return {
		theme: b(),
		reduced: e
	};
}
//#endregion
//#region src/components/Charts/ECharts/sial-chart.tsx
var w = i(() => import("./chart-canvas-DyFcO2ee.js"));
function T({ data: i, kind: s, label: c, height: l = 280, settings: u, status: f = "ready", errorMessage: p = "No fue posible cargar la gráfica.", replayKey: m, onSelect: h }) {
	let { theme: g, reduced: _ } = C(), b = a(), x = !d(s, i) || new Set(i.categories.map((e) => e.id)).size !== i.categories.length || new Set(i.series.map((e) => e.id)).size !== i.series.length || i.series.some((e) => e.values.length !== i.categories.length), S = o(() => x ? {} : y(i, s, {
		...v,
		...u,
		motion: !_ && (u?.motion ?? !0)
	}, g), [
		i,
		s,
		u,
		g,
		_,
		x
	]), T = i.categories.length === 0 || i.series.length === 0 || i.series.every((e) => e.values.every((e) => e === null)), E = f === "loading" ? "Cargando gráfica…" : f === "error" ? p : x ? "Los datos no son compatibles con esta gráfica." : T ? "Sin datos para mostrar." : null;
	return /* @__PURE__ */ t("figure", {
		className: "bui-sial-chart",
		"aria-label": c,
		"aria-busy": f === "loading",
		children: E ? /* @__PURE__ */ t("div", {
			className: "bui-sial-chart-state",
			style: { minHeight: l },
			role: "status",
			children: E
		}) : /* @__PURE__ */ n(e, { children: [/* @__PURE__ */ t(r, {
			fallback: /* @__PURE__ */ t("div", {
				className: "bui-sial-chart-state",
				style: { minHeight: l },
				children: "Preparando gráfica…"
			}),
			children: /* @__PURE__ */ t(w, {
				option: S,
				label: c,
				height: l,
				onSelect: h,
				replayKey: m
			})
		}), /* @__PURE__ */ n("details", {
			className: "bui-sial-chart-values",
			children: [/* @__PURE__ */ t("summary", {
				"aria-controls": b,
				children: "Consultar datos de la gráfica"
			}), /* @__PURE__ */ t("div", {
				className: "bui-sial-chart-table",
				id: b,
				children: /* @__PURE__ */ n("table", { children: [
					/* @__PURE__ */ t("caption", { children: c }),
					/* @__PURE__ */ t("thead", { children: /* @__PURE__ */ n("tr", { children: [/* @__PURE__ */ t("th", {
						scope: "col",
						children: "Categoría"
					}), i.series.map((e) => /* @__PURE__ */ t("th", {
						scope: "col",
						children: e.label
					}, e.id))] }) }),
					/* @__PURE__ */ t("tbody", { children: i.categories.map((e, r) => /* @__PURE__ */ n("tr", { children: [/* @__PURE__ */ t("th", {
						scope: "row",
						children: e.label
					}), i.series.map((n, i) => /* @__PURE__ */ t("td", { children: h ? /* @__PURE__ */ t("button", {
						type: "button",
						onClick: () => h({
							categoryId: e.id,
							seriesId: n.id,
							dataIndex: r,
							seriesIndex: i,
							name: e.label
						}),
						children: n.values[r] === null ? "Sin dato" : n.values[r]
					}) : n.values[r] === null ? "Sin dato" : n.values[r] }, n.id))] }, e.id)) })
				] })
			})]
		})] })
	});
}
//#endregion
export { T as SialChart };
