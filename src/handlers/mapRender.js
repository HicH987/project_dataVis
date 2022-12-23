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
      if (!(size(d.properties) > 2 && glob.zoomScale > 3)) return;

      var dd = d.properties;
      d3
        .select(".tooltip")
        .style("visibility", "visible")
        .append("ul")
        .attr("class", "class-info").html(`
            <li class="class-info-header">
            <div><strong> Building </strong> </div> 
            <div>${dd.bat} </div> 
            </li>
            ${
              !isEmpty(dd.floor1)
                ? `<li> <div><strong> Floor 1</strong> </div> <div>${dd.floor1}</div></li>`
                : ""
            }
            ${
              !isEmpty(dd.floor2)
                ? `<li> <div><strong> Floor 2</strong> </div> <div>${dd.floor2}</div></li>`
                : ""
            }
          `);
    })
    .on("mousemove", () => {
      d3.select(".tooltip")
        .style("top", event.pageY - 80 + "px")
        .style("left", event.pageX + 120 + "px");
    })
    .on("mouseout", () => {
      d3.select(".tooltip").selectAll(".class-info").remove();
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
    .attr("fill", "#CCCCCC")
    .attr("text-anchor", "middle")
    .attr("font-size", `${maxFontSize}px`)
    .style("visibility", "hidden");
};
