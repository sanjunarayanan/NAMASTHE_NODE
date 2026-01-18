import express from 'express'
import tokenCheckerMiddleware from '../middlewares/tokenChecker.middleware.js'
import User from '../models/user.model.js'

const router = express.Router()

router.get('/users', tokenCheckerMiddleware, async (req, res) => {
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

export default router
