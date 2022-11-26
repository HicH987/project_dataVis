import * as d3 from "d3";

// -------------------ONZOOM-HANDLERS---------------------------------
export const zoomed = (event) => {
  d3.select("svg").selectAll("path").attr("transform", event.transform);
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
  d3.select("svg")
    .transition()
    .call(zoom.translateTo, 0.5 * innerWidth, 0.5 * innerHeight);
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
