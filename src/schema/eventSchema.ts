const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  title:{ type: String, required: true },
  url:{ type: String, required: true },
  startTime:{ type: String, required: true },
  endTime:{ type: String, required: true },
 participant:[{
  user_id: { type: String, required: true },
  accept_status: { type: Boolean, default:false },
  isHost: { type: Boolean, default:false },
  isRequired:{ type: Boolean, default:false },
}]
})

module.exports = mongoose.model('Event', eventSchema)
