import * as d3 from "d3";
import { glob } from "../global/var";
import { gClass, maxFontSize } from "../global/const";

// -------------------ONZOOM-HANDLERS---------------------------------
export const zoomed = (event) => {
  d3.select("svg").selectAll("path").attr("transform", event.transform);
  d3.select("svg").selectAll("text").attr("transform", event.transform);

  glob.zoomScale = event.transform.k;

  let fSize = maxFontSize / (glob.zoomScale * 0.6);

  d3.select(`.${gClass}`)
    .selectAll("text")
    .attr("font-size", fSize > maxFontSize ? `${maxFontSize}pt` : `${fSize}pt`);
};

// -------------------BUTTON-HANDLERS---------------------------------
export function btnZoomIn(zoom) {
  d3.select("svg").transition().call(zoom.scaleBy, 2);
}
export function btnZoomOut(zoom) {
  d3.select("svg").transition().call(zoom.scaleBy, 0.5);
}

export function btnResetZoom(zoom) {
  d3.select("svg").transition().call(zoom.scaleTo, 1);
}

export function btnCenter(zoom) {
  const w = parseFloat(d3.select("svg").style("width"));
  const h = parseFloat(d3.select("svg").style("height"));
  d3.select("svg")
    .transition()
    .call(zoom.translateTo, 0.5 * w, 0.5 * h);
}

export function btnRight(zoom) {
  d3.select("svg").transition().call(zoom.translateBy, -50, 0);
}

export function btnLeft(zoom) {
  d3.select("svg").transition().call(zoom.translateBy, 50, 0);
}

export function btnDown(zoom) {
  d3.select("svg").transition().call(zoom.translateBy, 0, -50);
}

export function btnUp(zoom) {
  d3.select("svg").transition().call(zoom.translateBy, 0, 50);
}
