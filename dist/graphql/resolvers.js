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
const Phonebook = require("../schema/phoneBookSchema");
const resolvers = {
    Query: {
        //get all contact
        getAll: () => __awaiter(void 0, void 0, void 0, function* () {
            const contacts = yield Phonebook.find({});
            return contacts;
        }),
    },
    Mutation: {
        //create new contact
        createNewContact: (params, args, contex, info) => __awaiter(void 0, void 0, void 0, function* () {
            const { first_name, last_name, phone_number } = args.contact;
            const alreadyExistName = yield Phonebook.find({
                first_name: first_name,
                last_name: last_name,
            });
            if (alreadyExistName.length > 0) {
                return "this contact name already added";
            }
            const alreadyExistNum = yield Phonebook.find({
                phone_number: phone_number,
            });
            if (alreadyExistNum.length > 0) {
                return "this phone number already added";
            }
            const newContact = new Phonebook({ first_name, last_name, phone_number });
            newContact.save();
            return "successfully added";
        }),
        //delete contact
        deleteContact: (params, args, contex, info) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = args.contact;
            const iscontact = yield Phonebook.findOne({
                _id: id,
            });
            if (!iscontact) {
                return "no user found";
            }
            yield Phonebook.deleteMany({
                _id: id,
            });
            return "deleted";
        }),
        //update contact
        updateContact: (params, args, contex, info) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = args;
            const { first_name, last_name, phone_number } = args.contact;
            const iscontact = yield Phonebook.findOne({
                _id: id,
            });
            if (!iscontact) {
                return "no user found";
            }
            const alreadyExistName = yield Phonebook.find({
                $and: [
                    { first_name: first_name },
                    { last_name: last_name },
                    { _id: { $ne: id } },
                ],
            });
            if (alreadyExistName.length > 0) {
                return "this contact name already added";
            }
            const alreadyExistNum = yield Phonebook.find({
                $and: [{ phone_number: phone_number }, { _id: { $ne: id } }],
            });
            if (alreadyExistNum.length > 0) {
                return "this phone number already added";
            }
            yield Phonebook.findOneAndUpdate({
                _id: id,
            }, {
                first_name: first_name,
                last_name: last_name,
                phone_number: phone_number,
            });
            return "successfully updated";
        }),
    },
};
module.exports = resolvers;
