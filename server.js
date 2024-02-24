const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5001;
dotenv.config();
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const {errorHandler} = require("./handlers/error/errorHandlers");

app.set("trust proxy", 1);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};


const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");


app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(cors());


app.use("/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);


app.use(errorHandler);


app.listen(port, () => {
  connect();
  console.log(`Server is running on port ${port}`);
});
