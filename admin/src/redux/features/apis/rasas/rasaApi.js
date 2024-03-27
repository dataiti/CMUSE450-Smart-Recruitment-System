import axios from "axios";

const sendQuestionApi = async ({ data = {} }) => {
  const res = await axios.post(
    `${process.env.REACT_APP_RASA_SERVER_API_URL}/webhooks/rest/webhook`,
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
