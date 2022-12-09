import React from "react";
import dayjs from "dayjs";
import { IoToday, IoTime } from "react-icons/io5";
import "./form.scss";
import { useRef } from "react";
import Picker from "./picker";

const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Sam"];
const times = ["08:00", "09:40", "11:20", "13:00", "14:40", "16:10"];
const year = {
  min: dayjs("2021-01-01"),
  max: dayjs("2022-12-31"),
};

const closeOpenMenu = (e, menu, show, setShow) => {
  if (menu.current && show && !menu.current.contains(e.target)) {
    setShow(false);
  }
};

export default function Form({ passData }) {
  const dayMenu = useRef(null);
  const [day, setDay] = React.useState("Dim");
  const [showDay, setShowDayPicker] = React.useState(false);
  document.addEventListener("mousedown", (e) =>
    closeOpenMenu(e, dayMenu, showDay, setShowDayPicker)
  );

  const timeMenu = useRef(null);
  const [time, setTime] = React.useState("08:00");
  const [showTime, setShowTimePicker] = React.useState(false);
  document.addEventListener("mousedown", (e) =>
    closeOpenMenu(e, timeMenu, showTime, setShowTimePicker)
  );

  //*---------------------STATES---------------------------------
  const [data, setData] = React.useState({
    specialty: "IV",
    lvl: "M1",
    semester: "S1",
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
        </fieldset>

        <div className="day">
          {showDay ? (
            <div className="day-picker" ref={dayMenu}>
              <h3>Weekdays</h3>
              <ul className="days-lst">
                {days.map((d) => (
                  <li
                    key={d}
                    style={
                      d === day
                        ? { color: "#fff", backgroundColor: "#1565c0" }
                        : {}
                    }
                    onClick={() => {
                      setShowDayPicker(false);
                      return setDay(d);
                    }}
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <></>
          )}
          <fieldset className="radio-field day-set">
            <legend>Day</legend>
            <div className="day-fieldset">
              <span className="day-label">{day}</span>
              <button
                className="day-btn"
                onClick={() => setShowDayPicker(true)}
              >
                <IoToday />
              </button>
            </div>
          </fieldset>
        </div>

        <div className="day time">
          {showTime ? (
            <div className="day-picker" ref={timeMenu}>
              <h3>Time</h3>
              <ul className="days-lst">
                {times.map((t) => (
                  <li
                    key={t}
                    style={
                      t === time
                        ? { color: "#fff", backgroundColor: "#1565c0" }
                        : {}
                    }
                    onClick={() => {
                      setShowTimePicker(false);
                      return setTime(t);
                    }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <></>
          )}
          <fieldset className="radio-field day-set">
            <legend>Time</legend>
            <div className="day-fieldset">
              <span className="day-label">{time}</span>
              <button
                className="day-btn"
                onClick={() => setShowTimePicker(true)}
              >
                <IoTime />
              </button>
            </div>
          </fieldset>
        </div>
      {/* <Picker
        dates={days}
        date={day}
        setDate={setDay}
        label={"qsdqsd"}
        title={"qsdqsd"}
        iconBtn={<IoTime />}
        /> */}
        </div>
      <button className="btn-submit" onClick={() => passData(data)}>
        Submit
      </button>
    </div>
  );
}
