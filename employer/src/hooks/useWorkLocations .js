import axiosClient from "../configs/axiosConfig";
import { useState, useEffect } from "react";

const useWorkLocations = (province, district) => {
  const [provincesValue, setProvincesValue] = useState([]);
  const [districtsValue, setDistrictsValue] = useState([]);
  const [wardsValue, setWardsValue] = useState([]);

  useEffect(() => {
    const fetchWorkLocationsApi = async () => {
      try {
        const provinceResponse = await axiosClient.get("/province");
        if (
          provinceResponse &&
          provinceResponse.data &&
          provinceResponse.data.results
        ) {
          const provinceNames = provinceResponse.data.results.map((item) => ({
            id: item.province_id,
            value: item.province_name,
          }));
          setProvincesValue(provinceNames);
        }

        if (JSON.parse(province).id) {
          const districtResponse = await axiosClient.get(
            `/province/district/${JSON.parse(province).id}`
          );
          if (
            districtResponse &&
            districtResponse.data &&
            districtResponse.data.results
          ) {
            const districtNames = districtResponse.data.results.map((item) => ({
              id: item.district_id,
              value: item.district_name,
            }));
            setDistrictsValue(districtNames);
          }
        }

        if (JSON.parse(district).id) {
          const wardResponse = await axiosClient.get(
            `/province/ward/${JSON.parse(district).id}`
          );
          if (wardResponse && wardResponse.data && wardResponse.data.results) {
            const wardNames = wardResponse.data.results.map((item) => ({
              id: item.ward_id,
              value: item.ward_name,
            }));
            setWardsValue(wardNames);
          }
        }
      } catch (error) {
        console.error("Error fetching work locations:", error);
      }
    };

    fetchWorkLocationsApi();
  }, [province, district]);

  return { provincesValue, districtsValue, wardsValue };
};

export default useWorkLocations;
