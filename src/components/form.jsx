import React from "react";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "./form.scss";

export default function Form() {
  const year = {
    min: dayjs("2021-01-01"),
    max: dayjs("2022-12-31"),
  };
  //*---------------------STATES---------------------------------
  const [formData, setFormData] = React.useState({
    specialty: "IV",
    date: dayjs(),
    time: dayjs(),
  });
  //*---------------------FUNCTIONS---------------------------------
  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData.specialty);
    console.log(formData.date.format("DD/MM/YYYY"));
    console.log(formData.time.get("hour"), formData.time.get("minute"));
  }
  //----------------------------------------------------------------
  return (
    <div className="form">
      <div className="input-radio">
        <fieldset className="field">
          
          <legend>Specialties</legend>
          {/* Radio Button 1 */}
          <input
            id="IV"
            type="radio"
            name="specialty"
            value="IV"
            checked={formData.specialty === "IV"}
            onChange={handleChange}
          />
          <label htmlFor="IV">IV</label>
          {/* <br /> */}
          <input
            id="IL"
            type="radio"
            name="specialty"
            value="IL"
            checked={formData.specialty === "IL"}
            onChange={handleChange}
          />
          <label htmlFor="IL">IL</label>
          {/* <br /> */}
        </fieldset>
      </div>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="date-picker"
            // disableFuture
            name="date"
            label="Responsive"
            openTo="year"
            minDate={year.min}
            maxDate={year.max}
            views={["year", "month", "day"]}
            value={formData.date}
            onChange={(date) =>
              handleChange({
                target: { value: date, name: "date" },
              })
            }
            renderInput={(params) => <TextField {...params} />}
          />

          <TimePicker
            className="time-picker"
            ampm={false}
            value={formData.time}
            onChange={(date) =>
              handleChange({
                target: { value: date, name: "time" },
              })
            }
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
      <button className="btn-submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
