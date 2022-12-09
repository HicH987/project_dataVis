import React from "react";
import Form from "./form";
import Map from "./map";
import * as d3 from "d3";
import "./app.scss";

const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export default function App() {
  const [formData, setFormData] = React.useState({
    full: false,
  });

  React.useEffect(() => {
    if (formData.full) {
      d3.json("../data/schedule.json").then((json) => {
        let week = json[formData.spec][formData.lvl][formData.sem];
        console.log("week:\n", week);
        let day = week[formData.day]
        console.log("day:\n", day);
        
      });
      console.log(formData);
    }
  }, [formData]);

  function passData(data) {
    let idx_day = data.date.get("day");

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        full: true,
        spec: data.specialty,
        lvl: data.lvl,
        sem: data.semester,
        day: days[idx_day],
        hour: data.time.get("hour"),
        min: data.time.get("minute"),
      };
    });
  }

  return (
    <div className="main-app">
      <Map />
      <Form passData={passData} />
    </div>
  );
}
