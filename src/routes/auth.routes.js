import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'

import validateSignupData from '../config/validator.js'

const router = express.Router()

router.post('/signup', async (req, res) => {
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
    console.error(error)
    return res.status(500).send(error.message)
  }
})

router.post('/login', async (req, res) => {
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
    const token = await user.getJWT()
    res.cookie('token', token)
    return res.status(201).send('Happy Login')
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
})

router.post('/logout', async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  })

  res.send('logout successfully!!!..')
})

export default router
