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

router.get('/feed', tokenCheckerMiddleware, async (req, res) => {
  try {
    // Users I have NOT yet interacted with
    // ❌ no sent request,
    // ❌ no received request,
    // ❌ no accepted,
    // ❌ no rejected,
    // ❌ not myself)
    // Feed = All users − (users in connection collection with me)

    const loggedInUserId = req.user._id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Step 1: find all interactions

    const connections = await Connection.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).select('fromUserId toUserId')

    const excludedUserIds = new Set()

    connections.forEach((conn) => {
      excludedUserIds.add(conn.fromUserId.toString())
      excludedUserIds.add(conn.toUserId.toString())
    })

    // exclude myself
    excludedUserIds.add(loggedInUserId.toString())

    // Step 2: fetch feed users
    // It filters documents where a field value is NOT inside a given array.
    const users = await User.find({
      _id: { $nin: [...excludedUserIds] },
    })
      .select('firstName lastName email')
      .skip(skip)
      .limit(limit)

    if (!users.length) {
      return res.status(404).send('User is not found..!')
    }
    return res.status(200).json({
      page,
      limit,
      count: users.length,
      data: users,
    })
  } catch (error) {
    return res.status(400).send('Something went wrong..!')
  }
})

export default router
