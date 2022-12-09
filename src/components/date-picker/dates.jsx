import React from "react";
import "./dates.scss";

const Date = ({ d, date, setDate, setShowPicker }) => (
  <li
    className="date-el"
    key={d}
    style={d === date ? { color: "#fff", backgroundColor: "#1565c0" } : {}}
    onClick={() => {
      setShowPicker(false);
      return setDate(d);
    }}
  >
    {d}
  </li>
);

export default function Dates({ date, setDate, dates, setShowPicker }) {
  const datesEl = dates.map((d) => (
    <Date
      key={d}
      d={d}
      date={date}
      setDate={setDate}
      setShowPicker={setShowPicker}
    />
  ));
  return <ul className="dates-el">{datesEl}</ul>;
}
