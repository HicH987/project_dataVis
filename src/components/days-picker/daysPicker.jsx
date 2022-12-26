import React from "react";
import Days from "./days";
import "./daysPicker.scss";

const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Sam"];

export default function DaysPicker(props) {
  const [showDate, setShowPicker] = React.useState(false);

  React.useEffect(()=>{
    props.setShowSdBar(showDate)
  },[showDate])
  //----------------------------------------------------------------
  return (
    <div className="picker">
      <fieldset className="form">
        <legend>{props.fieldsetLabel}</legend>
        <div className="days-picker-list">
          <Days
            day={props.day}
            setDay={props.setDay}
            freeDays={props.freeDays}
            
            days={days}
            setShowPicker={setShowPicker}
            // setShowSdBar={props.setShowSdBar}
          />
        </div>
      </fieldset>
    </div>
  );
}
