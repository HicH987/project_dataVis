import React from "react";
import Form from "./form";
import Map from "./map";
import * as d3 from "d3";
import "./app.scss";

// check if object is: "{}" OR "don't exist"
const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;
// get the no empty object from list of objects
const getObj = (arrObj) =>
  Object.values(arrObj).filter((obj) => !isEmpty(obj))[0];
function objectMap(object, mapFn) {
  return Object.keys(object).reduce(function (result, key) {
    result[key] = mapFn(object[key]);
    return result;
  }, {});
}

export default function App() {
  const [formData, setFormData] = React.useState({
    full: false,
  });
  const [courData, setCourData] = React.useState(null);
  const [groupsData, setGroupsData] = React.useState(null);

  React.useEffect(() => {
    if (formData.full) {
      d3.json("../data/schedule.json").then((json) => {
        let week = json[formData.spec][formData.lvl][formData.sem];
        let day = week[formData.day];

        // console.log("day", day);

        var currentEvent = day.filter(
          (d) =>
            (!isEmpty(d.cours) &&
              formData.time === d.cours.time.substring(0, 5)) ||
            (!isEmpty(d.groups.G1) &&
              formData.time === d.groups.G1.time.substring(0, 5)) ||
            (!isEmpty(d.groups.G2) &&
              formData.time === d.groups.G2.time.substring(0, 5)) ||
            (!isEmpty(d.groups.G3) &&
              formData.time === d.groups.G3.time.substring(0, 5)) ||
            (!isEmpty(d.groups.G4) &&
              formData.time === d.groups.G4.time.substring(0, 5))
        )[0];
        if (currentEvent) {
          if (!isEmpty(currentEvent.cours)) {
            let tmp = { ...currentEvent.cours, day: formData.day };
            setCourData((p) => tmp);
          } else {
            console.log(currentEvent.groups);
            let tmp =objectMap(currentEvent.groups, (o)=> ({...o, day: formData.day }));
            setGroupsData((p) => tmp);
          }
        }
      });
    }
  }, [formData]);

  function passData(data) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        full: true,
        spec: data.specialty,
        lvl: data.lvl,
        sem: data.semester,
        day: data.day,
        time: data.time,
      };
    });
  }

  return (
    <div className="main-app">
      <Map groupsData={groupsData} courData={courData} />
      <Form passData={passData} />
    </div>
  );
}
