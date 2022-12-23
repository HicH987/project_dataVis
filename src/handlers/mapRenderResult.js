import * as d3 from "d3";
import { isEqual } from "lodash";

import { filtreMapDataBy } from "../handlers/filtreHandlers";
import { gClass } from "../global/const";
import { glob } from "../global/var";

let oldCourData = {};
let oldGroupsData = {};
let oldEventData = {};

const filtreMapByGResult = (currentMapData, groupsData) => {
  return Object.values(groupsData).filter(
    (o) =>
      o.bat === currentMapData.properties.bat &&
      o.loc === currentMapData.properties[o.floor]
  )[0];
};
const isCourData = (data) => (data.time ? true : false);

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

/*export function renderSchedule(mapData, courData, groupsData, from) {
  if (mapData.loading) return;

  const g = d3.select(`.${gClass}`);

  if (courData && !isEqual(courData, oldCourData)) {
    if (!from) g.selectAll(".toDlt").remove();

    var crMapData = filtreMapDataBy.cour(mapData, courData);
    g.append("g")
      .selectAll("path")
      .data(crMapData)
      .enter()
      .append("path")
      .attr("class", "toDlt")
      .attr("d", glob.path)
      .style("fill", "#4694DD")
      .style("stroke-width", "0.1")
      .style("stroke", "black")
      .on("mouseover", (_, d) => renderInfoBubble(d, courData))
      .on("mousemove", () => {
        d3.select(".classtip")
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 170 + "px");
      })
      .on("mouseout", () => {
        d3.select(".classtip").selectAll(".tip").remove();
        d3.select(".classtip").style("visibility", "hidden");
      });

    oldCourData = courData;
  }
  if (groupsData && !isEqual(groupsData, oldGroupsData)) {
    if (!from) g.selectAll(".toDlt").remove();
    var grMapData = filtreMapDataBy.groups(mapData, groupsData);

    g.append("g")
      .selectAll("path")
      .data(grMapData)
      .enter()
      .append("path")
      .attr("class", "toDlt")
      .attr("d", glob.path)
      .style("fill", "#4694DD")
      .style("stroke-width", "0.1")
      .style("stroke", "black")
      .on("mouseover", (_, d) => renderInfoBubble(d, groupsData))
      .on("mousemove", () => {
        d3.select(".classtip")
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 170 + "px");
      })
      .on("mouseout", () => {
        d3.select(".classtip").selectAll(".tip").remove();
        d3.select(".classtip").style("visibility", "hidden");
      });

    oldGroupsData = groupsData;
  }
}
*/
export function renderSchedule(mapData, eventData, from) {
  if (mapData.loading) return;

  const g = d3.select(`.${gClass}`);
  if (!isEqual(eventData, oldEventData)) {
    if (!from) g.selectAll(".toDlt").remove();

    var eventMapData = !isCourData(eventData)
      ? filtreMapDataBy.groups(mapData, eventData)
      : filtreMapDataBy.cour(mapData, eventData);

    g.append("g")
      .selectAll("path")
      .data(eventMapData)
      .enter()
      .append("path")
      .attr("class", "toDlt")
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
  }
}
