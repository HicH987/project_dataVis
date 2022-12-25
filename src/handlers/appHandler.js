import { each, isEmpty } from "lodash";


// -------EXPORT---------
export function updateDataStates(
  scheduleData,
  formData,
  
  setDayData,
  setFreeDays,


) {
  if (isEmpty(formData) || scheduleData.loading) return;
  if(!formData.spec || !formData.lvl || !formData.sem) return;

  const json = scheduleData.data;

  let week = json[formData.spec][formData.lvl][formData.sem];

  setFreeDays(Object.keys(week).filter((k) => week[k].length == 0))

  if(!formData.day)return;
  let day = week[formData.day].map((e) => addDayToEvent(e, formData.day));
  setDayData(day);

}
// ---------------------------
const filtreDayBy = (time, dayEvent) =>
  dayEvent.filter(
    (d) =>
      (!isEmpty(d.cours) && time === d.cours.time.substring(0, 5)) ||
      (!isEmpty(d.groups.G1) && time === d.groups.G1.time.substring(0, 5)) ||
      (!isEmpty(d.groups.G2) && time === d.groups.G2.time.substring(0, 5)) ||
      (!isEmpty(d.groups.G3) && time === d.groups.G3.time.substring(0, 5)) ||
      (!isEmpty(d.groups.G4) && time === d.groups.G4.time.substring(0, 5))
  )[0];

const addDayToEvent = (event, dayName) =>
  !isEmpty(event.cours)
    ? { ...event, cours: { ...event.cours, day: dayName } }
    : {
        ...event,
        groups: each(event.groups, (o) => {
          o.day = dayName;
        }),
      };
