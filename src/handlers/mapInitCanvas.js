import * as d3 from "d3";
import { margin, svgClass, gClass } from "../global/const";
import { glob } from "../global/var";
import { zoomed } from "../handlers/mapZoomHandler";

export function initCanvas(refSvg, refG) {
  const svg = d3.select(refSvg.current).attr("class", svgClass);
  const g = d3.select(refG.current).attr("class", gClass);

  const width = parseFloat(svg.style("width"));
  const height = parseFloat(svg.style("height"));

  glob.innerWidth = width - (margin.left + margin.right);
  glob.innerHeight = height - (margin.bottom + margin.top);
  g.attr("transform", `translate(${margin.left},${margin.top})`);

  glob.zoom = d3
    .zoom()
    .scaleExtent([1, 50])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", (e) => zoomed(e));
  svg.call(glob.zoom);
}
