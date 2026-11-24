import { jsx as e } from "react/jsx-runtime";
import { useEffect as t, useRef as n } from "react";
import { init as r, use as i } from "echarts/core";
import { BarChart as a, GaugeChart as o, HeatmapChart as s, LineChart as c, PieChart as l, RadarChart as u, ScatterChart as d } from "echarts/charts";
import { AriaComponent as f, DataZoomComponent as p, GraphicComponent as m, GridComponent as h, LegendComponent as g, TooltipComponent as _, VisualMapComponent as v } from "echarts/components";
import { SVGRenderer as y } from "echarts/renderers";
import { UniversalTransition as b } from "echarts/features";
//#region src/components/Charts/ECharts/chart-canvas.tsx
i([
	a,
	l,
	c,
	d,
	u,
	s,
	o,
	h,
	_,
	f,
	m,
	g,
	v,
	p,
	y,
	b
]);
function x({ option: i, label: a, height: o = 260, onSelect: s, replayKey: c = 0 }) {
	let l = n(null), u = n(null), d = n(c);
	return t(() => {
		if (!l.current) return;
		let e = r(l.current, void 0, { renderer: "svg" });
		u.current = e;
		let t = new ResizeObserver(() => {
			e.isDisposed() || e.resize();
		});
		return t.observe(l.current), () => {
			t.disconnect(), e.dispose(), u.current = null;
		};
	}, []), t(() => {
		d.current !== c && (u.current?.clear(), d.current = c), u.current?.setOption(i, { replaceMerge: [
			"series",
			"xAxis",
			"yAxis",
			"grid",
			"graphic",
			"legend",
			"radar",
			"visualMap",
			"dataZoom"
		] });
	}, [i, c]), t(() => {
		let e = u.current;
		if (!e || !s) return;
		let t = (e) => {
			if (!(!e || typeof e != "object") && "dataIndex" in e && typeof e.dataIndex == "number" && "seriesIndex" in e && typeof e.seriesIndex == "number") {
				let t = "data" in e && typeof e.data == "object" && e.data !== null ? e.data : null;
				s({
					dataIndex: e.dataIndex,
					seriesIndex: e.seriesIndex,
					name: "name" in e && typeof e.name == "string" ? e.name : "",
					categoryId: t && "categoryId" in t && typeof t.categoryId == "string" ? t.categoryId : void 0,
					seriesId: t && "seriesId" in t && typeof t.seriesId == "string" ? t.seriesId : void 0
				});
			}
		};
		return e.on("click", t), () => {
			e.isDisposed() || e.off("click", t);
		};
	}, [s]), /* @__PURE__ */ e("div", {
		ref: l,
		className: "bui-echarts-preview",
		style: { height: o },
		role: "img",
		"aria-label": a
	});
}
//#endregion
export { x as default };
