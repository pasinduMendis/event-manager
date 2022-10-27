import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    first_name: String,
    last_name: String,
    email: String,
    phone_number: String,
})

  
module.exports = mongoose.model('User', userSchema)