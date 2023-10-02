const mongoose = require("mongoose");

const connectDatabase = async () => {
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
      console.log("✅ Connect DB successfully !");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDatabase;
