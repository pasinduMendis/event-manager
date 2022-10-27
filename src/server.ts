import express, { Application, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
const EventRoutes = require("./routes/event");
require("dotenv").config();

const app: Application = express();
const PORT: String = process.env.POPRT || "5000";

  mongoose.Promise = global.Promise;
  mongoose
    .connect(
      process.env.MONGO_URI ||
        "mongodb://localhost:27017/Event" /*  { useNewUrlParser: true, useUnifiedTopology: true } */
    )
    .then(
      () => {
        console.log("Database is successfully connected");
      },
      (err) => {
        console.log("cannont connect to the database" + err);
      }
    );

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(cors());
  app.get("/", (req: Request, res: Response) => {
    res.send("welcome to Event Management");
  });
  app.use("/event", EventRoutes);

  app.listen(PORT, function () {
    console.log("saver is running on :", PORT);
  });
