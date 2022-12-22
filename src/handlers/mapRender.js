import * as d3 from "d3";
import { isEmpty, size } from "lodash";
import { gClass, maxFontSize } from "../global/const";
import { glob } from "../global/var";

export const renderMap = (mapData) => {
  if (mapData.loading) return [null, null];

  const g = d3.select(`.${gClass}`);
  g.selectAll(".map").remove();
  g.selectAll(".bat-txt").remove();

  const projection = d3
    .geoIdentity()
    .angle([25])
    .reflectY(true)
    .fitSize([glob.innerWidth, glob.innerHeight], mapData.data);
  glob.path = d3.geoPath(projection);

  g.append("g")
    .selectAll("path")
    .data(mapData.data.features)
    .enter()
    .append("path")
    .attr("class", "map")
    .attr("d", glob.path)
    .style("fill", (d) => {
      //--FAC
      if (d.properties.id == "Fac") return "#C6C6C6";
      //--BAT
      if (!isEmpty(d.properties.fill)) return "#AAAAAA";
      //--SALLE
      else return "#8E8E8E";
    })
    .style("stroke-width", "0.3")
    .style("stroke", "black")
    .style("vector-effect", "non-scaling-stroke")

    .on("mouseover", (_, d) => {
      if (size(d.properties) > 2 && glob.zoomScale > 3) {
        let obj = Object.fromEntries(Object.entries(d.properties).sort());
        let arr = Object.keys(obj).map((k) => ({
          [k]: obj[k],
        }));

        d3.select(".tooltip")
          .style("visibility", "visible")
          .selectAll("li")
          .data(arr)
          .enter()
          .append("li")
          .attr("class", "item")
          .html((d) => {
            if (d.floor1)
              return "↘️ Floor 1: <strong>" + d.floor1 + "</strong>";
            if (d.floor2)
              return "↖️ Floor 2: <strong>" + d.floor2 + "</strong>";
            if (d.bat) return "🏢 Building: " + d.bat;
          });
      }
    })
    .on("mousemove", () => {
      d3.select(".tooltip")
        .style("top", event.pageY - 80 + "px")
        .style("left", event.pageX + 80 + "px");
    })
    .on("mouseout", () => {
      d3.select(".tooltip").selectAll(".item").remove();
      d3.select(".tooltip").style("visibility", "hidden");
    });

  g.append("g")
    .selectAll("text")
    .data(mapData.data.features)
    .enter()
    .append("text")
    .attr("class", "bat-txt")
    .text((d) => {
      if (size(d.properties) <= 2 && !d.properties.floor1) {
        return d.properties.bat;
      }
    })
    .attr("x", (d) => glob.path.centroid(d)[0])
    .attr("y", (d) => glob.path.centroid(d)[1])
    .attr("fill", "#fff")
    .attr("text-anchor", "middle")
    .attr("font-size", `${maxFontSize}px`);
};
