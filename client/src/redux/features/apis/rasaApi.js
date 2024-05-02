import axios from "axios";

const sendQuestionApi = async ({ data = {} }) => {
  const res = await axios.post(
    "http://localhost:5005/webhooks/rest/webhook",
    data,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        charset: "UTF-8",
      },
      withCredentials: true,
    }
  );

  if (res && res.data) {
    return res.data;
  }
};

export { sendQuestionApi };
