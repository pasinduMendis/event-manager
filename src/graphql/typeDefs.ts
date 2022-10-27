import { gql } from "apollo-server-express";

const typeDefs = gql`
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
`

module.exports=typeDefs