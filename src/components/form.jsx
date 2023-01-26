import { isEmpty } from "lodash";
import React from "react";

import DaysPicker from "./days-picker/daysPicker";
import "./form.scss";

export default function Form({
  passData,
  freeDays,
  setShowSdBar,

  teachersList,
  selectedProf,
  handleChangeSelect,
  listSpec,
  isEmptySem
}) {
  const [data, setData] = React.useState({
    spec: "",
    lvl: "",
    sem: "",
  });
  const [day, setDay] = React.useState();

  function handleChange(event) {
    const { name, value } = event.target;

    setData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });

    passData([name, value]);
  }

  React.useEffect(() => {
    passData(["day", day]);
  }, [day]);

  //----------------------------------------------------------------
  return (
    <div className="forms">
      
      <fieldset className="form">
        <legend className="from-title">Event's Filtres</legend>
        <div className="inputs">
          <fieldset className="radio-field">
            <legend>Specialties</legend>
            <SpecRadioList  
              listSpec={listSpec}
              data={data}
              handleChange={handleChange}
            />
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
                name="sem"
                value="S1"
                checked={data.sem === "S1"}
                onChange={handleChange}
              />
              <label htmlFor="S1">S1</label>
            </div>
            {data.lvl === "M1" ? (
              <div className="radio-input">
                <input
                  id="S2"
                  type="radio"
                  name="sem"
                  value="S2"
                  checked={data.sem === "S2"}
                  onChange={handleChange}
                />
                <label htmlFor="S2">S2</label>
              </div>
            ) : (
              <></>
            )}
            {/* {isEmptySem? <span className="empty-s-msg">not yet available !</span>: <></>} */}
          </fieldset>
        </div>
        {!Object.values(data).includes("") && !isEmptySem ? (
          <DaysPicker
            fieldsetLabel={"Day"}
            day={day}
            setDay={setDay}
            freeDays={freeDays}
            setShowSdBar={setShowSdBar}
          />
        ) : (
          <></>
        )}
      </fieldset>

      <fieldset className="form">
        <legend className="from-title">Teachers Filtres</legend>
        <div className="inputs">
          <div className="select ">
            <label className="select-label">Select Teacher</label>
            <select
              id="selectedProf"
              value={selectedProf}
              onChange={(e) => {
                handleChangeSelect(e);
                setShowSdBar(true);
              }}
              name="selectedProf"
            >
              <option value="" disabled hidden>
                Teacher...
              </option>
              {teachersList.map((prof, i) => (
                <option key={i} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>
    </div>
  );
}

const SpecialtiesRadio = (props) => {
  return (
    
      <div className="radio-input spec-radio">
        <input
          id={props.specName}
          type="radio"
          name="spec"
          value={props.specName}
          checked={props.data.spec === props.specName}
          onChange={props.handleChange}
        />
        <label htmlFor={props.specName}>{props.specName}</label>
      </div>
  
  );
};

function SpecRadioList(props) {
  const specRadioEl = props.listSpec.map((spec) => (
    <SpecialtiesRadio
      key={spec}
      specName={spec}
      data={props.data}
      handleChange={props.handleChange}
    />
  ));
  return <div className="spec-radio-list">{specRadioEl}</div>;
}
