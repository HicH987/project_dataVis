import React from "react";
import Form from "./form";
import Map from "./map";
import "./app.scss";

import { useGetDataFrom } from "../hooks/useGetDataFrom";
import { updateDataStates } from "../handlers/appHandler";


export default function App() {
  const scheduleData  = useGetDataFrom("../../data/schedule.json");

  const [formData, setFormData] = React.useState({});
  const [firstDay, setFirstDay] = React.useState("");

  const [freeDays, setFreeDays] = React.useState([]);

  const [dayData, setDayData] = React.useState(null);

  React.useEffect(() => {
    updateDataStates(
      scheduleData,
      formData,

      setDayData,
      setFreeDays,
    );
  }, [formData]);


  
  function passData(data) {

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [data[0]]: data[1],
      };
    });
    console.log(formData);
  }

  return (
    <div className="main-app">
      <Map dayData={dayData} day = {formData.day}/>
      <Form passData={passData} freeDays={freeDays} scheduleData={scheduleData} />
    </div>
  );
}
