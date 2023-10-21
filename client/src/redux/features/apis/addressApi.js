import axios from "axios";

const getPlaceMapApi = async ({ workRegion }) => {
  const res = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${workRegion?.exactAddress}, ${workRegion?.district}, ${workRegion?.ward}, ${workRegion?.province}.json?access_token=${process.env.REACT_APP_MAPBOX_KEY}`
  );

  if (res && res.data) {
    return res.data;
  }
};

export { getPlaceMapApi };
