
import "./map.scss";
import * as d3 from "d3";
import React from "react";
import { useRef, useEffect } from "react";
import { useMapTools } from "../hooks/useMapTools";
import * as handlers from "../handlers/mapHandler";
import * as ai from "react-icons/ai";
import { isEqual } from "lodash";

// check if object is: "{}" OR "don't exist"
const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;

let margin;
let width, height;
let innerWidth, innerHeight;
let zoom;
let fontSize = 8;
let K;
let oldCourData = {};
let oldGroupsData = {};

const tip_style = {
  visibility: "hidden",
  position: "absolute",
  zindex: 10,
};

const zoomed = (event, refG) => {
  const g = d3.select(refG.current);

  d3.select("svg").selectAll("path").attr("transform", event.transform);
  d3.select("svg").selectAll("text").attr("transform", event.transform);

  let zoomK = event.transform.k;
  K = event.transform.k;

  let fSize = fontSize / (zoomK * 0.6);

  g.selectAll(".bat").attr(
    "font-size",
    fSize > fontSize ? `${fontSize}pt` : `${fSize}pt`
  );
};

const convertToNum = (listStr) => {
  const w = parseFloat(listStr[0]);
  const h = parseFloat(listStr[1]);
  return [w, h];
};

const initCanvasDim = (width, height) => {
  margin = { top: 10, right: 20, bottom: 10, left: 20 };
  innerWidth = width - (margin.left + margin.right);
  innerHeight = height - (margin.bottom + margin.top);
};

const initCanvas = (refSvg, refG) => {
  const svg = d3.select(refSvg.current).attr("class", "main-svg");

  [width, height] = convertToNum([svg.style("width"), svg.style("height")]);
  initCanvasDim(width, height);

  zoom = d3
    .zoom()
    .scaleExtent([1, 50])
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", (e) => zoomed(e, refG));
  svg.call(zoom);

  const g = d3
    .select(refG.current)
    .attr("class", "main-g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
};

const pathMap = (mapData) => {
  let projection = d3
    .geoIdentity()
    .angle([25])
    .reflectY(true)
    .fitSize([innerWidth, innerHeight], mapData.data);

  return d3.geoPath(projection);
};

const renderMap = (refG, mapData) => {
  const g = d3.select(refG.current);

  try {
    g.selectAll(".map").remove();
    g.selectAll(".bat").remove();
  } catch (err) {
    console.log(err);
  }

  if (!mapData.loading) {
    var path = pathMap(mapData);

    g.append("g")
      .selectAll("path")
      .data(mapData.data.features)
      .enter()
      .append("path")
      .attr("class", "map")
      .attr("d", path)
      .style("fill", (d) => {
        if (isEmpty(d.properties.fill)) return "#B5B09A";
        return d.properties.fill;
      })
      .style("stroke-width", "0.3")
      .style("stroke", "black")
      .style("vector-effect", "non-scaling-stroke")

      .on("mouseover", function (_, d) {
        if (Object.keys(d.properties).length > 2 && K > 3) {
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
      .on("mousemove", function () {
        d3.select(".tooltip")
          .style("top", event.pageY - 80 + "px")
          .style("left", event.pageX + 80 + "px");
      })
      .on("mouseout", function () {
        d3.select(".tooltip").selectAll(".item").remove();
        d3.select(".tooltip").style("visibility", "hidden");
      });

    g.append("g")
      .selectAll("text")
      .data(mapData.data.features)
      .enter()
      .append("text")
      .attr("class", "bat")
      .text((d) => {
        if (Object.keys(d.properties).length === 2 && !d.properties.floor1) {
          return d.properties.bat;
        }
      })
      .attr("x", (d) => path.centroid(d)[0])
      .attr("y", (d) => path.centroid(d)[1])
      .attr("text-anchor", "middle")
      .attr("font-size", `${fontSize}px`)
      .attr("font-weight", "bold")
      .attr("fill", "#fff")
      .style(
        "text-shadow",
        "0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black"
      );
  }
};

const courMapData = (mapData, courData) => {
  return mapData.data.features.filter(
    (d) =>
      d.properties.bat === courData.bat &&
      d.properties[courData.floor] == courData.loc
  );
};
const groupsMapData = (mapData, groupsData) => {
  let data = [];
  for (const [key, value] of Object.entries(groupsData)) {
    data.push(
      mapData.data.features.filter(
        (d) =>
          value.bat === d.properties.bat &&
          value.loc === d.properties[value.floor]
      )[0]
    );
  }
  return data;
};

const renderSchedule = (refG, mapData, courData, groupsData, from) => {
  const g = d3.select(refG.current);

  let path = pathMap(mapData);

  if (!mapData.loading) {
    if (courData && !isEqual(courData, oldCourData)) {
      // console.log("courDatacourData", courData);
      console.log("from", from);
      if (!from.component || !from.isClicked)
        g.selectAll(".toDlt").remove();
      // if (!from.component) g.selectAll(".toDlt").remove();
      // else if (!from.isClicked) {
      //   g.selectAll(".toDlt").remove();
      //   return;
      // }
      var crMapData = courMapData(mapData, courData);

      g.append("g")
        .selectAll("path")
        .data(crMapData)
        .enter()
        .append("path")
        .attr("class", "toDlt")
        .attr("d", path)
        .style("fill", (d) => (d.properties.floor1 ? "#0ebeff" : "#5e95e6"))
        .style("stroke-width", "0.1")
        .style("stroke", "black")
        .on("mouseover", function (_, d) {
          if (K > 3) {
            console.log("courrr", courData);
            console.log("courrr", courData.day);
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
            .style("top", event.pageY - 100 + "px")
            .style("left", event.pageX + 100 + "px");
        })
        .on("mouseout", function () {
          d3.select(".classtip").selectAll(".tip").remove();
          d3.select(".classtip").style("visibility", "hidden");
        });

      oldCourData = courData;
    }
    if (groupsData && !isEqual(groupsData, oldGroupsData)) {
      if (!from.component || !from.isClicked) g.selectAll(".toDlt").remove();
      // if (!from.component) g.selectAll(".toDlt").remove();
      // else if (!from.isClicked) {
      //   g.selectAll(".toDlt").remove();
      //   return;
      // }
      var grMapData = groupsMapData(mapData, groupsData);

      g.append("g")
        .selectAll("path")
        .data(grMapData)
        .enter()
        .append("path")
        .attr("class", "toDlt")
        .attr("d", path)
        .style("fill", (d) => (d.properties.floor1 ? "#0ebeff" : "#5e95e6"))
        .style("stroke-width", "0.1")
        .style("stroke", "black")
        .on("mouseover", function (_, d) {
          if (K > 3) {
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
            .style("top", event.pageY - 100 + "px")
            .style("left", event.pageX + 100 + "px");
        })
        .on("mouseout", function () {
          d3.select(".classtip").selectAll(".tip").remove();
          d3.select(".classtip").style("visibility", "hidden");
        });

      oldGroupsData = groupsData;
    }
  }
};
function CourEvent(props) {
  let [isClicked, setIsClicked] = React.useState(false);
  const isClicked_style = {
    color: "#fff",
    backgroundColor: "#000",
  };
  useEffect(
    () => {
      let iClick = isClicked ? true : false;
      console.log(iClick);
      renderSchedule(props.refG, props.mapData, props.c, null, {
        component: true,
        isClicked: iClick,
      });
    },
    [isClicked]
  );
  return (
    <div
      className="CourEvent btn"
      style={isClicked ? isClicked_style : {}}
      onClick={() => {
        // renderSchedule(props.refG, props.mapData, props.c, null, {
        //   component: true,
        //   isClicked: isClicked,
        // });
        return setIsClicked((prevIsClicked) => !prevIsClicked);
      }}
    >
      <li>Course: {props.c.sub}</li>
      <li>&nbsp;&nbsp;Time: {props.c.time}</li>
      {/* <li>Prof: {props.c.prof}</li> */}
      {/* <button className="eventExit">x</button> */}
    </div>
  );
}
function GroupEvent(props) {
  let [isClicked, setIsClicked] = React.useState(false);
  const isClicked_style = {
    color: "#fff",
    backgroundColor: "#000",
  };

  const group = `G${props.gIdx}`;
  return (
    <div
      className="GroupEvent btn"
      style={isClicked ? isClicked_style : {}}
      onClick={() => {
        renderSchedule(
          props.refG,
          props.mapData,
          null,
          { [group]: props.g },
          { component: true, isClicked: isClicked }
        );
        setIsClicked((prevIsClicked) => !prevIsClicked);
      }}
    >
      <span>{group}</span>
      <li>&nbsp;&nbsp;Time: {props.g.time}</li>
      <li>
        &nbsp;&nbsp;{props.g.e}: {props.g.sub}
      </li>
      {/* <li>Prof: {props.g.prof}</li> */}
    </div>
  );
}
function GroupsEvent(props) {
  let arr = Object.keys(props.groups).map((k) => props.groups[k]);
  const groupsEl = arr.map((g, idx) => {
    return (
      <GroupEvent
        refG={props.refG}
        mapData={props.mapData}
        key={idx}
        gIdx={idx + 1}
        g={g}
      />
    );
  });

  return <div className="GroupsEvent">{groupsEl}</div>;
}

function EventsDay(props) {
  const el = props.day.map((d, idx) => {
    if (!isEmpty(d.cours))
      return (
        <CourEvent
          refG={props.refG}
          mapData={props.mapData}
          key={idx}
          c={d.cours}
        />
      );
    if (!isEmpty(d.groups))
      return (
        <GroupsEvent
          refG={props.refG}
          mapData={props.mapData}
          key={idx}
          groups={d.groups}
        />
      );
  });
  return <div className="EventsDay">{el}</div>;
}

export default function Map(props) {
  const { mapData } = useMapTools("../../data/usthb-3.geojson");
  const refSvg = useRef();
  const refG = useRef();

  useEffect(() => initCanvas(refSvg, refG), []);
  useEffect(() => renderMap(refG, mapData), [mapData]);

  useEffect(
    () =>
      renderSchedule(refG, mapData, props.courData, props.groupsData, {
        component: false,
      }),
    [props.courData, props.groupsData]
  );

  return (
    <div className="map" id="wrapper">
      <div className="map-day">
        <svg ref={refSvg}>
          {" "}
          <g ref={refG}></g>
        </svg>
        {props.dayData ? (
          <EventsDay refG={refG} mapData={mapData} day={props.dayData} />
        ) : (
          <></>
        )}
      </div>
      <dir className="btns">
        <button className="btn-plus" onClick={() => handlers.btnZoomIn(zoom)}>
          <ai.AiOutlinePlus />
        </button>
        <button className="btn-minus" onClick={() => handlers.btnZoomOut(zoom)}>
          <ai.AiOutlineMinus />
        </button>
        <button className="btn-left" onClick={() => handlers.btnLeft(zoom)}>
          <ai.AiOutlineCaretLeft />
        </button>
        <button className="btn-right" onClick={() => handlers.btnRight(zoom)}>
          <ai.AiOutlineCaretRight />
        </button>
        <button className="btn-up" onClick={() => handlers.btnUp(zoom)}>
          <ai.AiOutlineCaretUp />
        </button>
        <button className="btn-down" onClick={() => handlers.btnDown(zoom)}>
          <ai.AiOutlineCaretDown />
        </button>
      </dir>
      <div className="tooltip" style={tip_style}></div>
      <div className="classtip" style={tip_style}></div>
    </div>
  );
}
