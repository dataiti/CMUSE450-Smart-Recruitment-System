const authRouter = require("./auth");
const userRouter = require("./user");
const employerRouter = require("./employer");
const jobRouter = require("./job");
const addressRouter = require("./address");

const router = (app) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/employer", employerRouter);
  app.use("/api/v1/job", jobRouter);
  app.use("/api/v1/address", addressRouter);
};

module.exports = router;
