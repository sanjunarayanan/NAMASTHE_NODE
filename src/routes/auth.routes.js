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

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password required',
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }
    const isValidPassword = await user.validatePassword(password)

    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }

    // add the cookie
    const token = await user.getJWT()
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })

    return res.status(200).json({
      message: 'Login successful',
      user,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Something went wrong',
    })
  }
})

router.post('/logout', async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
  })

  res.send('logout successfully!!!..')
})

export default router
