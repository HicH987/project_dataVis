import React from "react";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "./form.scss";

const year = {
  min: dayjs("2021-01-01"),
  max: dayjs("2022-12-31"),
};

export default function Form({ passData }) {
  //*---------------------STATES---------------------------------
  const [data, setData] = React.useState({
    specialty: "IV",
    lvl: "M1",
    date: dayjs(),
    time: dayjs(),
  });

  //*---------------------FUNCTIONS---------------------------------
  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setData((prevData) => {
      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
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

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            name="date"
            label="Date"
            openTo="year"
            minDate={year.min}
            maxDate={year.max}
            views={["year", "month", "day"]}
            value={data.date}
            onChange={(date) =>
              handleChange({
                target: { value: date, name: "date" },
              })
            }
            renderInput={(params) => <TextField {...params} sx={{}} />}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Time"
            ampm={false}
            value={data.time}
            onChange={(date) =>
              handleChange({
                target: { value: date, name: "time" },
              })
            }
            renderInput={(params) => <TextField {...params} sx={{}} />}
          />
        </LocalizationProvider>
      </div>
      <button className="btn-submit" onClick={() => passData(data)}>
        Submit
      </button>
    </div>
  );
}
