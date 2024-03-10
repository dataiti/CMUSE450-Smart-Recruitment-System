import React, { useEffect, useState } from "react";

import { YamlEditor } from "../../components/rasas";

const ChatbotDashboard = () => {
  return (
    <div style={{ height: 400, textAlign: "left" }}>
      <YamlEditor />
    </div>
  );
};

export default ChatbotDashboard;
