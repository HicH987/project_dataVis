import React from "react";
import Form from "./form";
import Map from "./map";
import "./app.scss";

import { useGetDataFrom } from "../hooks/useGetDataFrom";
import { updateDataStates } from "../handlers/appHandler";
import { getAllEvents, getAllTeachers } from "../handlers/filtreHandlers";

export default function App() {
  const scheduleData = useGetDataFrom("../../data/schedule.json");

  const [selectedProf, setSelectedProf] = React.useState("");
  const [teachersList, setTeachersList] = React.useState([]);
  const [allEventsList, setAllEventsList] = React.useState([]);

  const [teacherEvents, setTeacherEvents] = React.useState([]);
  
  const [specEvents, setSpecEvents] = React.useState([]);

  React.useEffect(() => {
    if (scheduleData.loading) return;
    const json = scheduleData.data;
    // console.log(getAllEvents(json));
    setAllEventsList(getAllEvents(json));
    setTeachersList(getAllTeachers(json));
  }, [scheduleData]);

  const [showSdBar, setShowSdBar] = React.useState(false);

  const [formData, setFormData] = React.useState({});

  const [freeDays, setFreeDays] = React.useState([]);
  const [dayData, setDayData] = React.useState(null);

  React.useEffect(() => {
    updateDataStates(scheduleData, formData, setDayData, setFreeDays);
  
    setSpecEvents(allEventsList.filter((e) => e.spc === formData.spec && e.lvl === formData.lvl))
  
  }, [formData]);

  function passData(data) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [data[0]]: data[1],
      };
    });
    // console.log(formData);
  }

  function handleChangeSelect(event) {
    const { name, value } = event.target;
    setSelectedProf(value);
  }

  React.useEffect(() => {
    if (selectedProf == "") return;
    setTeacherEvents(allEventsList.filter((e) => e.prof === selectedProf));
    console.log(allEventsList.filter((e) => e.prof === selectedProf));
  }, [selectedProf]);

  return (
    <div className="main-app">
      <Map
        dayData={dayData}
        day={formData.day}
        showSdBar={showSdBar}
        setShowSdBar={setShowSdBar}
        teacherEvents={teacherEvents}
        specEvents={specEvents}
      />
      <Form
        passData={passData}
        freeDays={freeDays}
        setShowSdBar={setShowSdBar}
        teachersList={teachersList}
        selectedProf={selectedProf}
        handleChangeSelect={handleChangeSelect}
      />
    </div>
  );
}
