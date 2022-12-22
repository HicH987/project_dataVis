import * as d3 from "d3";
import { isEqual } from "lodash";

import { filtreMapDataBy } from "../handlers/filtreHandlers";
import { gClass } from "../global/const";
import { glob } from "../global/var";

let oldCourData = {};
let oldGroupsData = {};

export function renderSchedule(mapData, courData, groupsData, from) {
  const g = d3.select(`.${gClass}`);

  if (!mapData.loading) {
    if (courData && !isEqual(courData, oldCourData)) {
      if (!from) g.selectAll(".toDlt").remove();

      var crMapData = filtreMapDataBy.cour(mapData, courData);
      console.log("crMapDatadddd", crMapData);
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
        .on("mouseover", function (_, d) {
          if (glob.zoomScale > 3) {
            d3
              .select(".classtip")
              .style("visibility", "visible")
              .append("div")
              .attr("class", "tip").html(`
              <table class='tab'>
              <tbody>
                <tr>
                  <td>Course</td>
                  <td>${courData.sub}</td>
                </tr>
                <tr>
                  <td>Prof</td>
                  <td>${courData.prof}</td>
                </tr>
                <tr>
                  <td>Time</td>
                  <td>${courData.time}</td>
                </tr>
                <tr>
                  <td>Day</td>
                  <td>${courData.day}</td>
                </tr>
                <tr>
                  <td>Building</td>
                  <td>${courData.bat}</td>
                </tr>
                <tr>
                  <td>Floor ${courData.floor.charAt(
                    courData.floor.length - 1
                  )} </td>
                  <td>
                    ${courData.loc}
                  </td>
                </tr>
              </tbody>
            </table>
              `);
          }
        })
        .on("mousemove", function () {
          d3.select(".classtip")
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 170 + "px");
        })
        .on("mouseout", function () {
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
        .on("mouseover", function (_, d) {
          if (glob.zoomScale > 3) {
            let arr = Object.keys(groupsData).map((k) => groupsData[k]);
            let currentD = arr.filter(
              (o) =>
                o.bat === d.properties.bat && o.loc === d.properties[o.floor]
            )[0];
            console.log("currentD", currentD);
            d3.select(".classtip")
              .style("visibility", "visible")
              .append("div")
              .attr("class", "tip")
              .html(
                `
              <table>
              <tbody>
                <tr>
                  <td>${currentD.e}</td>
                  <td>${currentD.sub}</td>
                </tr>
                <tr>
                  <td>Prof</td>
                  <td>${currentD.prof}</td>
                </tr>
                <tr>
                  <td>Time</td>
                  <td>${currentD.time}</td>
                </tr>
                <tr>
                  <td>Day</td>
                  <td>${currentD.day}</td>
                </tr>
                <tr>
                  <td>Building</td>
                  <td>${currentD.bat}</td>
                </tr>
                <tr>
                  <td>Floor ${currentD.floor.substr(
                    currentD.floor.length - 1
                  )} </td>
                  <td>
                    ${currentD.loc}
                  </td>
                </tr>
              </tbody>
            </table>
              `
              );
          }
        })
        .on("mousemove", function () {
          d3.select(".classtip")
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 170 + "px");
        })
        .on("mouseout", function () {
          d3.select(".classtip").selectAll(".tip").remove();
          d3.select(".classtip").style("visibility", "hidden");
        });

      oldGroupsData = groupsData;
    }
  }
}
