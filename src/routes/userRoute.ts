import express, { Application, Request, Response } from 'express'
const userRoutes = express.Router()
const User = require('../schema/userSchema')

//add a new user
userRoutes.post('/add', async (req: Request, res: Response) => {
  const { email, phone_number } = req.body

  const alreadyExistEmail = await User.find({ email: email })
  if (alreadyExistEmail.length > 0) {
    res.json('this email already added')
    return 0
  }
  const alreadyExistNum = await User.find({ phone_number: phone_number })
  if (alreadyExistNum.length > 0) {
    res.json('this phone number already added')
    return 0
  }
  const newUser = new User(req.body)
  newUser.save()
  res.json('--successfully added--')
  return 0
})

//get all users
userRoutes.get('/', async (req: Request, res: Response) => {
  const users = await User.find({})

  res.send(users)
  return 0
})

//get specific user by id

userRoutes.get('/:id', async (req: Request, res: Response) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.send('invalid id')
    return 0
  }
  const users = await User.findOne({
    _id: req.params.id,
  })
  if (!users) {
    res.send('no user found')
    return 0
  }
  res.send(users)
  return 0
})

//update user info
userRoutes.put('/:id', async (req: Request, res: Response) => {
  const user = await User.findOne({
    _id: req.params.id,
  })
  if (!user) {
    res.send('no user found')
    return 0
  }
  const { email, phone_number } = req.body
  const alreadyExistEmail = await User.find({
    $and: [{ email: email }, { _id: { $ne: req.params.id } }],
  })
  if (alreadyExistEmail.length > 0) {
    res.json('this email already added')
    return 0
  }
  const alreadyExistNum = await User.find({
    $and: [{ phone_number: phone_number }, { _id: { $ne: req.params.id } }],
  })
  if (alreadyExistNum.length > 0) {
    res.json('this phone number already added')
    return 0
  }
  await User.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      first_name: req.body.first_name ? req.body.first_name : user.first_name,
      last_name: req.body.last_name ? req.body.last_name : user.last_name,
      email: req.body.email ? req.body.email : user.email,
      phone_number: req.body.phone_number
        ? req.body.phone_number
        : user.phone_number,
    }
  )
  res.send('successfully updated')
  return 0
})

//delete user
userRoutes.delete('/:id', async (req: Request, res: Response) => {
  const user = await User.findOne({
    _id: req.params.id,
  })
  if (!user) {
    res.send('no user found')
    return 0
  }
  await User.deleteMany({
    _id: req.params.id,
  })
  res.send('successfully deleted')
  return 0
})

module.exports = userRoutes
