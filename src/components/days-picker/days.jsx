import React from "react";
import "./days.scss";

export default function Days(props) {
  const datesEl = props.days.map((currentDay) => (
    <Day
      key={currentDay}
      currentDay={currentDay}
      day={props.day}
      setDay={props.setDay}
      freeDays={props.freeDays}
      setShowPicker={props.setShowPicker}
    />
  ));
  return <div className="days-el">{datesEl}</div>;
}

const Day = ({ currentDay, day, setDay, freeDays, setShowPicker }) => {
  const selectedStyle = { color: "#fff", backgroundColor: "#1565c0" };
  const click = () => {
    if (!freeDays.includes(currentDay)) {
      setShowPicker(false);
      return setDay(currentDay);
    }
  };
  return (
    <li
      className={freeDays.includes(currentDay) ? "disabled-day-el" : "day-el"}
      key={currentDay}
      style={currentDay === day ? selectedStyle : {}}
      onClick={() => click()}
      disabled={freeDays.includes(currentDay)}
    >
      {currentDay}
    </li>
  );
};
