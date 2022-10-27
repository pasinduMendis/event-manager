"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const apollo_server_express_1 = require("apollo-server-express");
const phonebookRoutes = require("./routes/phoneBookRoute");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
require("dotenv").config();
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const PORT = process.env.POPRT || "5000";
    mongoose_1.default.Promise = global.Promise;
    mongoose_1.default
        .connect(process.env.MONGO_URI ||
        "mongodb://localhost:27017/Phone" /*  { useNewUrlParser: true, useUnifiedTopology: true } */)
        .then(() => {
        console.log("Database is successfully connected");
    }, (err) => {
        console.log("cannont connect to the database" + err);
    });
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(body_parser_1.default.json());
    app.use((0, cors_1.default)());
    app.get("/", (req, res) => {
        res.send("welcome to phoneBook");
    });
    app.use("/phonebook", phonebookRoutes);
    const apolloserver = new apollo_server_express_1.ApolloServer({
        typeDefs,
        resolvers,
    });
    yield apolloserver.start();
    apolloserver.applyMiddleware({ app: app });
    app.listen(PORT, function () {
        console.log("saver is running on :", PORT);
    });
});
startServer();
