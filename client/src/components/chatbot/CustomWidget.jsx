import React from "react";
import Widget from "rasa-webchat";

const CustomWidget = () => {
  return (
    <Widget
      initPayload={"/get_all_users"}
      socketUrl={"http://localhost:5005"}
      socketPath={"/socket.io/"}
      customData={{ language: "en" }} // arbitrary custom data. Stay minimal as this will be added to the socket
      title={"Title"}
    />
  );
};

export default CustomWidget;
