import express from 'express'
import tokenCheckerMiddleware from '../middlewares/tokenChecker.middleware.js'
import User from '../models/user.model.js'
import Connection from '../models/connection.model.js'

const router = express.Router()

// get all the pending connection request for the logged in user.
router.get('/requests/received', tokenCheckerMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user._id
    const connections = await Connection.find({
      status: 'Interested',
      $or: [{ toUserId: loggedInUserId }],
    }).populate('fromUserId', ['firstName', 'lastName'])

    return res.status(200).send({
      count: connections.length,
      data: connections,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
})

// Fetch all ACCEPTED connections
router.get(
  '/requests/accepted',
  tokenCheckerMiddleware,
  async (req, res, next) => {
    try {
      const loggedInUserId = req.user._id
      const connections = await Connection.find({
        status: 'Accepted',
        $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
      })
        .populate('fromUserId', 'firstName lastName')
        .populate('toUserId', 'firstName lastName')

      const data = connections.map((connection) => {
        if (
          connection.fromUserId._id.toString() === loggedInUserId._id.toString()
        ) {
          return connection.toUserId
        }

        return connection.fromUserId
      })

      return res.status(200).send({
        count: data.length,
        data,
      })
    } catch (error) {
      next(error)
    }
  }
)

router.get('/feed', async (req, res) => {
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
