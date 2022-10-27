const mongoose = require('mongoose')

const phonebookSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  first_name: String,
  last_name: String,
  phone_number: String,
})

module.exports = mongoose.model('PhoneBook', phonebookSchema)
