import React from "react";
import { Typography } from "@material-tailwind/react";

const Address = ({ province, district, ward, exactAddress }) => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <Typography className=" font-bold text-sm">
          {exactAddress}, {ward}, {district}, {province}
        </Typography>
      </div>
    </div>
  );
};

export default Address;
