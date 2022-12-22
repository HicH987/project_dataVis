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
