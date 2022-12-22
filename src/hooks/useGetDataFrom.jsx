import * as d3 from "d3";
import { useState, useEffect } from "react";

export function useGetDataFrom(jsonPath) {
  // store loaded map data in a state
  const [jsonData, setJsonData] = useState({
    data: {},
    loading: true,
  });

  // only fetch map data once and create a tooltip
  useEffect(() => {
    d3.json(jsonPath)
      .then((data) => {
        setJsonData((prevState) => {
          return { ...prevState, data: data, loading: false };
        });
      })
      .catch((err) => {
        console.log("error occurred with loading json", err);
      });
  }, []);

  return jsonData;
}
