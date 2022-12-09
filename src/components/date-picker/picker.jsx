import React from "react";
import Dates from "./dates";
import "./picker.scss";

const typeDate = {
  days: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Sam"],
  times: ["08:00", "09:40", "11:20", "13:00", "14:40", "16:10"],
};

const closeOpenMenu = (e, menu, show, setShow) => {
  if (menu.current && show && !menu.current.contains(e.target)) {
    setShow(false);
  }
};

export default function Picker(props) {
  const menu = React.useRef(null);
  const [showDate, setShowPicker] = React.useState(false);
  document.addEventListener("mousedown", (e) =>
    closeOpenMenu(e, menu, showDate, setShowPicker)
  );

  //----------------------------------------------------------------
  return (
    <div className="picker">
      {showDate ? (
        <div className="date-picker" ref={menu}>
          <h3>{props.title}</h3>
          <Dates
            date={props.date}
            setDate={props.setDate}
            dates={typeDate[props.type]}
            setShowPicker={setShowPicker}
          />
        </div>
      ) : (
        <></>
      )}

      <fieldset className="radio-field">
        <legend>{props.fieldsetLabel}</legend>
        <div className="date-fieldset">
          <span className="date-label">{props.date}</span>
          <button className="date-btn" onClick={() => setShowPicker(true)}>
            {props.iconBtn}
          </button>
        </div>
      </fieldset>
    </div>
  );
}
