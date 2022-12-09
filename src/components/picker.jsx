import React from "react";
import "./picker.scss";

const closeOpenMenu = (e, menu, show, setShow) => {
    if (menu.current && show && !menu.current.contains(e.target)) {
      setShow(false);
    }
  };


export default function Picker(props) {
    const menu = React.useRef(null);
    const [showDate, setShowPicker] = React.useState(false);
    document.addEventListener("mousedown",(e)=> closeOpenMenu(e,menu,showDate, setShowPicker));
  
    
  //----------------------------------------------------------------
  return (
        <div className="day">
          {showDate ? (
            <div className="day-picker" ref={menu}>
              <h3>{props.title}</h3>
              <ul className="days-lst">
                {props.dates.map((d) => (
                  <li
                    key={d}
                    style={
                      d === props.date
                        ? { color: "#fff", backgroundColor: "#1565c0" }
                        : {}
                    }
                    onClick={() => {
                        setShowPicker(false);
                      return props.setDate(d);
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

          <fieldset className="radio-field">
            <legend>{props.label}</legend>
            <div className="day-fieldset">
              <span className="day-label">{props.date}</span>
              <button
                className="day-btn"
                onClick={() => setShowPicker(true)}
              >
                {props.iconBtn}
              </button>
            </div>
          </fieldset>
        </div>





  );
}
