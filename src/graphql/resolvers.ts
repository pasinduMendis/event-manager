const Phonebook = require("../schema/phoneBookSchema");
const resolvers = {
  Query: {
    //get all contact
    getAll: async () => {
      const contacts = await Phonebook.find({});
      return contacts;
    },
  },
  Mutation: {
    //create new contact
    createNewContact: async (
      params: any,
      args: any,
      contex: any,
      info: any
    ) => {
      const { first_name, last_name, phone_number } = args.contact;
      const alreadyExistName = await Phonebook.find({
        first_name: first_name,
        last_name: last_name,
      });
      if (alreadyExistName.length > 0) {
        return "this contact name already added";
      }
      const alreadyExistNum = await Phonebook.find({
        phone_number: phone_number,
      });
      if (alreadyExistNum.length > 0) {
        return "this phone number already added";
      }
      const newContact = new Phonebook({ first_name, last_name, phone_number });
      newContact.save();
      return "successfully added";
    },

    //delete contact
    deleteContact: async (params: any, args: any, contex: any, info: any) => {
      const { id } = args.contact;
      const iscontact = await Phonebook.findOne({
        _id: id,
      });
      if (!iscontact) {
        return "no user found";
      }
      await Phonebook.deleteMany({
        _id: id,
      });
      return "deleted";
    },

    //update contact
    updateContact: async (params: any, args: any, contex: any, info: any) => {
      const { id } = args;
      const { first_name, last_name, phone_number } = args.contact;
      const iscontact = await Phonebook.findOne({
        _id: id,
      });
      if (!iscontact) {
        return "no user found";
      }

      const alreadyExistName = await Phonebook.find({
        $and: [
          { first_name: first_name },
          { last_name: last_name },
          { _id: { $ne: id } },
        ],
      });
      if (alreadyExistName.length > 0) {
        return "this contact name already added";
      }
      const alreadyExistNum = await Phonebook.find({
        $and: [{ phone_number: phone_number }, { _id: { $ne: id } }],
      });
      if (alreadyExistNum.length > 0) {
        return "this phone number already added";
      }

      await Phonebook.findOneAndUpdate(
        {
          _id: id,
        },
        {
          first_name: first_name,
          last_name: last_name,
          phone_number: phone_number,
        }
      );
      return "successfully updated";
    },
  },
};

module.exports = resolvers;
