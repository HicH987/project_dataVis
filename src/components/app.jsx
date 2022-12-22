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
  const [dayData, setDayData] = React.useState(null);

  React.useEffect(() => {
    updateDataStates(
      scheduleData,
      formData,
      setDayData,
      setCourData,
      setGroupsData
    );
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
      <Map dayData={dayData} groupsData={groupsData} courData={courData} />
      <Form passData={passData} />
    </div>
  );
}
