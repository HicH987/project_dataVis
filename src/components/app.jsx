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

export default function App() {
  const [formData, setFormData] = React.useState({
    full: false,
  });
  const [scheduleData, setScheduleData] = React.useState(null);

  React.useEffect(() => {
    if (formData.full) {
      d3.json("../data/schedule.json").then((json) => {
        let week = json[formData.spec][formData.lvl][formData.sem];
        // console.log("week:\n", week);
        let day = week[formData.day];
        // console.log("day:\n", day);

        /*
        day.forEach((d) => {
          if (!isEmpty(d.cours)) console.log(d.cours.Time.substring(0, 5));

          if (!isEmpty(d.groups.G1))
            console.log(d.groups.G1.Time.substring(0, 5));
          if (!isEmpty(d.groups.G2))
            console.log(d.groups.G2.Time.substring(0, 5));
        });
        */
        /*
        var current = {};
        var currentDay = day.map((d) => {
          if (!isEmpty(d.cours) && formData.time === d.cours.Time.substring(0, 5))
            current.cours = d.cours;
          if (
            !isEmpty(d.groups.G1) &&
            formData.time === d.groups.G1.Time.substring(0, 5)
          )
            current.G1 = d.groups.G1;
          if (
            !isEmpty(d.groups.G2) &&
            formData.time === d.groups.G2.Time.substring(0, 5)
          )
            current.G2 = d.groups.G2;
          return current;
        });
        */

        var currentEvent = day.filter(
          (d) =>
            (!isEmpty(d.cours) &&
              formData.time === d.cours.Time.substring(0, 5)) ||
            (!isEmpty(d.groups.G1) &&
              formData.time === d.groups.G1.Time.substring(0, 5)) ||
            (!isEmpty(d.groups.G2) &&
              formData.time === d.groups.G2.Time.substring(0, 5))
        )[0];

        console.log(getObj(currentEvent));
        setScheduleData(currentEvent)
      });

      // console.log(formData);
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
      <Map scheduleData={scheduleData} />
      <Form passData={passData} />
    </div>
  );
}
