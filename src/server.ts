import express, { Application, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { ApolloServer, gql } from "apollo-server-express";
const phonebookRoutes = require("./routes/phoneBookRoute");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
require("dotenv").config();

const startServer = async () => {
  const app: Application = express();
  const PORT: String = process.env.POPRT || "5000";

  mongoose.Promise = global.Promise;
  mongoose
    .connect(
      process.env.MONGO_URI ||
        "mongodb://localhost:27017/Phone" /*  { useNewUrlParser: true, useUnifiedTopology: true } */
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
    res.send("welcome to phoneBook");
  });
  app.use("/phonebook", phonebookRoutes);

  const apolloserver = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloserver.start();
  apolloserver.applyMiddleware({ app: app });

  app.listen(PORT, function () {
    console.log("saver is running on :", PORT);
  });
};
startServer();
