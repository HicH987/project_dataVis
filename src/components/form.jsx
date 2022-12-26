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
    // console.log(data);
  }

  React.useEffect(() => {
    passData(["day", day]);
  }, [day]);


  // const [selectedProf, setSelectedProf] = React.useState("");


  //----------------------------------------------------------------
  return (
    <div className="forms">
      <fieldset className="form">
        <legend className="from-title">Event's Filtres</legend>
        <div className="inputs">
          <fieldset className="radio-field">
            <legend>Specialties</legend>
            <div className="radio-input">
              <input
                id="IV"
                type="radio"
                name="spec"
                value="IV"
                checked={data.spec === "IV"}
                onChange={handleChange}
              />
              <label htmlFor="IV">IV</label>
            </div>
            <div className="radio-input">
              <input
                id="IL"
                type="radio"
                name="spec"
                value="IL"
                checked={data.spec === "IL"}
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
          </fieldset>
        </div>
        {!Object.values(data).includes("") ? (
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
              onChange={(e)=>{handleChangeSelect(e); setShowSdBar(true)}}
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

          {/* <button className="search-btn" onClick={() => selectedProf}>
            Search
          </button> */}
        </div>
      </fieldset>
    </div>
  );
}
