import * as d3 from "d3";
import { isEqual } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { filtreMapDataBy } from "../handlers/filtreHandlers";
import { gClass } from "../global/const";
import { glob } from "../global/var";

let oldEventData = {};
var toDltClass
var toDltID 

export function renderSchedule(mapData, eventData, from) {
  if (mapData.loading) return;

  const g = d3.select(`.${gClass}`);
  if (from || !isEqual(eventData, oldEventData)) {
    toDltClass = "toDlt";
    toDltID = `ID--${uuidv4()}`;

    if (!from) g.selectAll(`.${toDltClass}`).remove();


    var eventMapData = !isCourData(eventData)
      ? filtreMapDataBy.groups(mapData, eventData)
      : filtreMapDataBy.cour(mapData, eventData);

    g.append("g")
      .selectAll("path")
      .data(eventMapData)
      .enter()
      .append("path")
      .attr("class", toDltClass)
      .attr("id", from? toDltID: "")
      .attr("d", glob.path)
      .style("fill", "#4694DD")
      .style("stroke-width", "0.1")
      .style("stroke", "black")
      .on("mouseover", (_, d) => renderInfoBubble(d, eventData))
      .on("mousemove", () => {
        d3.select(".classtip")
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 170 + "px");
      })
      .on("mouseout", () => {
        d3.select(".classtip").selectAll(".tip").remove();
        d3.select(".classtip").style("visibility", "hidden");
      });

    oldEventData = eventData;

    return toDltID
  }
}

export function deleteAllResult() {
  try {
    d3.select(`.${gClass}`).selectAll(`.${toDltClass}`).remove();
    d3.select(`.${gClass}`).selectAll(`.${toDltID}`).remove();
  } catch (error) {
    
  }
}

export const onZoomResult = (mapData, courData) => {
  let d = filtreMapDataBy.cour(mapData, courData)[0];
  var centroid = glob.path.centroid(d);

  const width = parseFloat(d3.select(`svg`).style("width"));
  const height = parseFloat(d3.select(`svg`).style("height"));

  let k = 8;
  let x = width / 2 - centroid[0] * k;
  let y = height / 2 - centroid[1] * k;

  let transform = d3.zoomIdentity.translate(x, y).scale(k);

  d3.select(`svg`)
    .transition()
    .duration(700)
    .call(glob.zoom.transform, transform);
};


// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
const isCourData = (data) => (data.time ? true : false);
const filtreMapByGResult = (currentMapData, groupsData) => {
  return Object.values(groupsData).filter(
    (o) =>
      o.bat === currentMapData.properties.bat &&
      o.loc === currentMapData.properties[o.floor]
  )[0];
};
const renderInfoBubble = (currentData, eventData) => {
  if (glob.zoomScale <= 3) return;

  let data = eventData;
  let evnt = "Course";

  if (!isCourData(eventData)) {
    data = filtreMapByGResult(currentData, eventData);
    evnt = data.e;
  }

  d3
    .select(".classtip")
    .style("visibility", "visible")
    .append("div")
    .attr("class", "tip").html(`
              <table class='tab'>
              <tbody>
                <tr>
                  <td>${evnt}</td>
                  <td>${data.sub}</td>
                </tr>
                <tr>
                  <td>Prof</td>
                  <td>${data.prof}</td>
                </tr>
                <tr>
                  <td>Time</td>
                  <td>${data.time}</td>
                </tr>
                <tr>
                  <td>Day</td>
                  <td>${data.day}</td>
                </tr>
                <tr>
                  <td>Building</td>
                  <td>${data.bat}</td>
                </tr>
                <tr>
                  <td>Floor ${data.floor.charAt(data.floor.length - 1)} </td>
                  <td>
                    ${data.loc}
                  </td>
                </tr>
              </tbody>
            </table>
              `);
};
