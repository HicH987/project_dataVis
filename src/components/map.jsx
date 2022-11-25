import * as d3 from "d3";
import React, { useRef, useEffect } from "react";
import { useMapTools } from "../hooks/useMapTools";

const width = 600;
const height = 600;
// G groupe (of main SVG) dimensions
const margin = { top: 10, right: 30, bottom: 10, left: 30 };
const innerWidth = width - (margin.left + margin.right);
const innerHeight = height - (margin.bottom + margin.top);

export default function Map() {
  const { mapData } = useMapTools("../../data/elhamma.geojson");

  console.log(mapData);
  const ref = useRef();

  useEffect(() => {
    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .style("border", "2px solid black")
      .style("margin-right", "10px");

    var zoom = d3.zoom().on("zoom", (event) => {
      svg.selectAll("path").attr("transform", event.transform);
    });

    svg.call(zoom);
  }, []);

  useEffect(() => {
    draw();
    // }, [mapData]);
  }, [mapData]);

  const draw = () => {
    const svg = d3.select(ref.current);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    console.log(mapData.data);
    if (!mapData.loading) {
      var projection = d3
        .geoIdentity()
        .angle([25])
        .reflectY(true)
        .fitSize([innerWidth, innerHeight], mapData.data);

      var path = d3.geoPath(projection);
      g.append("g")
        .selectAll("path")
        .data(mapData.data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", (d) => {
          if (d.properties.type === "eau") return "#75cff0";
          if (d.properties.type === "batiment") return "#e5e3df";
          if (d.properties.type === "garden") return "#aae08f";
          if (d.properties.type === "road") return "#ffffff";
          return "none";
        })
        .style("stroke-width", "1")
        .style("stroke", "black");
      /*
        g.append("g")
        .selectAll("text")
        .data(mapData.data.features)
        .enter()
        .append("text")
        .text((d) => {
          if (d.properties.name != null) return d.properties.name;
        })
        .attr("text-anchor", "middle")
        .attr("x", (d) => path.centroid(d)[0])
        .attr("y", (d) => path.centroid(d)[1])
        .attr("font-size", "7px")
        .attr("font-weight", "bold")
        .attr("fill", "#fff")
        .style(
          "text-shadow",
          "0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black"
          );
*/
    }
  };
  return (
    <div className="map">
      <svg ref={ref}></svg>
    </div>
  );
  // } else {
  //   return <h1>Loading...</h1>;
  // }
}
