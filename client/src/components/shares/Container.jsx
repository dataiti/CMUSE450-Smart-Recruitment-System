import React from "react";

const Container = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-md p-4 ${className}`}>{children}</div>
  );
};

export default Container;
