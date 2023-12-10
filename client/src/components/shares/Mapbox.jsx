import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { icons } from "../../utils/icons";
import "mapbox-gl/dist/mapbox-gl.css";
import { getPlaceMapApi } from "../../redux/features/apis/addressApi";

const Mapbox = ({ workRegion }) => {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "400px",
    latitude: 0,
    longitude: 0,
    zoom: 13,
  });

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const data = await getPlaceMapApi({ workRegion });
        if (data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;
          setViewport((prevViewport) => ({
            ...prevViewport,
            latitude,
            longitude,
          }));
        }
      } catch (error) {}
    };
    fetchApi();
  }, [workRegion]);

  return (
    <ReactMapGL
      {...viewport}
      attributionControl={false}
      mapboxAccessToken="pk.eyJ1IjoiZGF0YWl0aTI0IiwiYSI6ImNsbmttcTJzYjA5b3MyamxrdjVsaWtic3AifQ.UWLyDIStMSh6knLilI8fOQ"
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onViewportChange={(newViewport) => setViewport(newViewport)}
    >
      <Marker latitude={viewport.latitude} longitude={viewport.longitude}>
        <icons.IoLocationSharp size={28} color="red" />
      </Marker>
    </ReactMapGL>
  );
};

export default Mapbox;
