"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
type Contact{
    first_name:String,
    last_name:String,
    phone_number:String
}

type Query{
    getAll:[Contact]
}

input NewContact{
    first_name:String,
    last_name:String,
    phone_number:String
}
input ContactDbId{
    id:String
}
type Mutation{
    createNewContact(contact:NewContact):String!
    deleteContact(contact:ContactDbId):String!
    updateContact(id:String,contact:NewContact):String!
}
`;
module.exports = typeDefs;
