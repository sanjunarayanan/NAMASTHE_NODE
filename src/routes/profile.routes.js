import express from 'express'
import tokenCheckerMiddleware from '../middlewares/tokenChecker.middleware.js'
import bcrypt from 'bcryptjs'

const router = express.Router()

router.get('/view', tokenCheckerMiddleware, async (req, res) => {
  try {
    res.send(req.user)
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
})

router.patch('/edit', tokenCheckerMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user
    const updates = Object.keys(req.body)
    const ALLOWED_UPDATES = ['firstName', 'lastName', 'address', 'dob']
    const isValidOperation = updates.every((field) =>
      ALLOWED_UPDATES.includes(field)
    )
    if (!isValidOperation) {
      return res.status(400).send('Invalid update fields')
    }

    updates.forEach((update) => {
      loggedInUser[update] = req.body[update]
    })
    await loggedInUser.save()

    return res.status(200).json({
      message: 'Profile updated successfully',
      loggedInUser,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
})

router.patch('/change-password', tokenCheckerMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = req.user
    const isValid = await user.validatePassword(oldPassword)
    if (!isValid) {
      return res.status(400).send('Old password is incorrect')
    }
    user.password = await bcrypt.hash(newPassword, 10)
    user.save()
    return res.send('Password updated successfully')
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
})

export default router
