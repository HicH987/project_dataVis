import React from "react";

import Picker from "./date-picker/picker";
import { IoToday, IoTime } from "react-icons/io5";
import "./form.scss";

export default function Form({ passData }) {
  const [data, setData] = React.useState({
    specialty: "IV",
    lvl: "M1",
    semester: "S1",
    day: "Dim",
    time: "08:00",
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setData((prevData) => {
      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  function setDay(day) {
    setData((prevData) => {
      return {
        ...prevData,
        day: day,
      };
    });
  }
  function setTime(time) {
    setData((prevData) => {
      return {
        ...prevData,
        time: time,
      };
    });
  }
  //----------------------------------------------------------------
  return (
    <div className="form">
      <div className="inputs">
        <fieldset className="radio-field">
          <legend>Specialties</legend>
          <div className="radio-input">
            <input
              id="IV"
              type="radio"
              name="specialty"
              value="IV"
              checked={data.specialty === "IV"}
              onChange={handleChange}
            />
            <label htmlFor="IV">IV</label>
          </div>
          <div className="radio-input">
            <input
              id="IL"
              type="radio"
              name="specialty"
              value="IL"
              checked={data.specialty === "IL"}
              onChange={handleChange}
            />
            <label htmlFor="IL">IL</label>
          </div>
        </fieldset>
        <fieldset className="radio-field">
          <legend>Level</legend>
          <div className="radio-input">
            <input
              id="M1"
              type="radio"
              name="lvl"
              value="M1"
              checked={data.lvl === "M1"}
              onChange={handleChange}
            />
            <label htmlFor="M1">M1</label>
          </div>
          <div className="radio-input">
            <input
              id="M2"
              type="radio"
              name="lvl"
              value="M2"
              checked={data.lvl === "M2"}
              onChange={handleChange}
            />
            <label htmlFor="M2">M2</label>
          </div>
        </fieldset>
        <fieldset className="radio-field">
          <legend>Semester</legend>
          <div className="radio-input">
            <input
              id="S1"
              type="radio"
              name="semester"
              value="S1"
              checked={data.semester === "S1"}
              onChange={handleChange}
            />
            <label htmlFor="S1">S1</label>
          </div>
          {data.lvl === "M1" ? (
            <div className="radio-input">
              <input
                id="S2"
                type="radio"
                name="semester"
                value="S2"
                checked={data.semester === "S2"}
                onChange={handleChange}
              />
              <label htmlFor="S2">S2</label>
            </div>
          ) : (
            <></>
          )}
        </fieldset>

        <Picker
          type={"days"}
          date={data.day}
          setDate={setDay}
          fieldsetLabel={"Day"}
          title={"Weekdays"}
          iconBtn={<IoToday />}
        />
        <Picker
          type={"times"}
          date={data.time}
          setDate={setTime}
          fieldsetLabel={"Time"}
          title={"Day's Times"}
          iconBtn={<IoTime />}
        />
      </div>
      <button className="btn-submit" onClick={() => passData(data)}>
        Submit
      </button>
    </div>
  );
}
 