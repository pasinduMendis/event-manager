import express, { Application, Request, Response } from "express";
const phonebookRoutes = express.Router();
const Phonebook = require("../schema/phoneBookSchema");

//add new contact
phonebookRoutes.post("/add", async (req: Request, res: Response) => {
  const { first_name, last_name, phone_number } = req.body;
  const alreadyExistName = await Phonebook.find({
    first_name: first_name,
    last_name: last_name,
  });
  if (alreadyExistName.length > 0) {
    res.json("this contact name already added");
    return 0;
  }
  const alreadyExistNum = await Phonebook.find({ phone_number: phone_number });
  if (alreadyExistNum.length > 0) {
    res.json("this phone number already added");
    return 0;
  }
  const newContact = new Phonebook(req.body);
  newContact.save();
  res.json("successfully added");
  return 0;
});

//get all contacts
phonebookRoutes.get("/", async (req: Request, res: Response) => {
  const contacts = await Phonebook.find({});

  res.send(contacts);
});

//get specific contact by last name
phonebookRoutes.get("/:lastName", async (req: Request, res: Response) => {
  const contacts = await Phonebook.find({
    last_name: req.params.lastName,
  });
  res.send(contacts);
});

//update contact info
phonebookRoutes.put("/:id", async (req: Request, res: Response) => {
  const contact = await Phonebook.findOne({
    _id: req.params.id,
  });
  if (!contact) {
    res.send("no user found");
    return 0;
  }
  const { first_name, last_name, phone_number } = req.body;
  const alreadyExistName = await Phonebook.find({
    $and: [
      { first_name: first_name },
      { last_name: last_name },
      { _id: { $ne: req.params.id } },
    ],
  });
  if (alreadyExistName.length > 0) {
    res.json("this contact name already added");
    return 0;
  }
  const alreadyExistNum = await Phonebook.find({
    $and: [{ phone_number: phone_number }, { _id: { $ne: req.params.id } }],
  });
  if (alreadyExistNum.length > 0) {
    res.json("this phone number already added");
    return 0;
  }
  await Phonebook.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      first_name: req.body.first_name
        ? req.body.first_name
        : contact.first_name,
      last_name: req.body.last_name ? req.body.last_name : contact.last_name,
      phone_number: req.body.phone_number
        ? req.body.phone_number
        : contact.phone_number,
    }
  );
  res.send("successfully updated");
});

//delete contact
phonebookRoutes.delete("/:id", async (req: Request, res: Response) => {
  const contact = await Phonebook.findOne({
    _id: req.params.id,
  });
  if (!contact) {
    res.send("no user found");
  }
  await Phonebook.deleteMany({
    _id: req.params.id,
  });
  res.send("successfully deleted");
});

module.exports = phonebookRoutes;
