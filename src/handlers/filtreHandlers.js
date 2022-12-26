import { isEmpty } from "lodash";

export const filtreMapDataBy = {
  cour: (mapData, courData) => {
    return mapData.data.features.filter(
      (d) =>
        d.properties.bat === courData.bat &&
        d.properties[courData.floor] == courData.loc
    );
  },
  groups: (mapData, groupsData) => {
    let data = [];
    for (const [key, value] of Object.entries(groupsData)) {
      data.push(
        mapData.data.features.filter(
          (d) =>
            value.bat === d.properties.bat &&
            value.loc === d.properties[value.floor]
        )[0]
      );
    }
    return data;
  },
};

// ----------------------PROF FILTERS---------------
export const getAllEvents = (json) => {
  let eventss = [];

  let spc_s = Object.keys(json);
  spc_s.forEach((s) => {
    let Sp = json[s];
    let lvl_s = Object.keys(Sp);

    lvl_s.forEach((l) => {
      let M = Sp[l];
      let sm_s = Object.keys(M);

      sm_s.forEach((sm) => {
        let W = M[sm];
        if (!isEmpty(W)) {
          let dys_s = Object.keys(W);

          dys_s.forEach((d) => {
            let D_evnt_s = W[d];
            D_evnt_s.forEach((evn) => {
              if (!isEmpty(evn.cours)) {
                evn.cours.day = d;
                evn.cours.spc = s;
                evn.cours.sem = sm;
                evn.cours.lvl = l;
                eventss.push(evn.cours);
              }
              if (!isEmpty(evn.groups)) {
                let grp_s = Object.keys(evn.groups);
                grp_s.forEach((g, i) => {
                  evn.groups[g].day = d;
                  evn.groups[g].spc = s;
                  evn.groups[g].sem = sm;
                  evn.groups[g].lvl = l;
                  evn.groups[g].grp = i + 1;
                  eventss.push(evn.groups[g]);
                });
              }
            });
          });
        }
      });
    });
  });

  return eventss;
};
export const getAllTeachers = (json) => {
  let arr = [...new Set(JSON.stringify(json).match(/(?<="prof":")\w+\s*\w*/g))];
  return arr.filter((p) => !p.includes("PROF"));
};
