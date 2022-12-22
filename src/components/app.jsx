import React from "react";
import Form from "./form";
import Map from "./map";
import "./app.scss";

import { useGetDataFrom } from "../hooks/useGetDataFrom";
import { updateDataStates } from "../handlers/appHandler";


export default function App() {
  const scheduleData  = useGetDataFrom("../../data/schedule.json");

  const [formData, setFormData] = React.useState({});
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
