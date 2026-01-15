import express from 'express'
import bcrypt from 'bcryptjs'
import cookieParser from 'cookie-parser'
import connectDb from './config/database.js'
import User from './models/user.model.js'
import validateSignupData from './config/validator.js'
import tokenCheckerMiddleware from './middlewares/tokenChecker.middleware.js'

const app = express()
app.use(express.json())
app.use(cookieParser())
await connectDb()

app.post('/signup', async (req, res) => {
  try {
    validateSignupData(req)
    const { password } = req.body
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
      ...req.body,
      password: passwordHash,
    })
    await user.save()
    return res.status(201).send('User added successfully')
  } catch (error) {
    return res.status(400).send(`Error saving the user : ${error.message}`)
  }
})

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error('Email Id is not matched..!')
    }
    const isValidPassword = await user.validatePassword(password)
    if (!isValidPassword) {
      throw new Error('Password is not correct..!')
    }
    // add the cookie
    const token = await user.getJWT();
    res.cookie('token', token)
    return res.status(201).send('Happy Login')
  } catch (error) {
    return res
      .status(400)
      .send(`Error while fetching the user : ${error.message}`)
  }
})

app.get('/profile', tokenCheckerMiddleware, async (req, res) => {
  try {
    res.send(`Hello ${req.user.firstName} ${req.user.lastName}`)
  } catch (error) {
    return res.status(400).send(`Error : ${error.message}`)
  }
})

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({})
    if (!users.length) {
      return res.status(404).send('User is not found..!')
    }
    return res.send(users)
  } catch (error) {
    return res.status(400).send('Something went wrong..!')
  }
})

app.listen(3000, () => {
  console.log('app is running on port 3000')
})
