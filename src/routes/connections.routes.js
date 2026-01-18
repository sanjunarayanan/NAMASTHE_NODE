import express from 'express'
import tokenCheckerMiddleware from '../middlewares/tokenChecker.middleware.js'
import validateCreateConnection from '../validators/connection.validator.js'
import validateConnectionResponse from '../validators/connection-response.validator.js'
import User from '../models/user.model.js'
import Connection from '../models/connection.model.js'

const router = express.Router()


router.post(
  '/send/:toUserId',
  tokenCheckerMiddleware,
  validateCreateConnection,
  async (req, res) => {
    try {
      const fromUserId = req.user._id
      const { toUserId } = req.params
      const { status } = req.body

      const toUserExists = await User.exists({ _id: toUserId })
      if (!toUserExists) {
        return res.status(404).send({
          message: 'Target user does not exist',
        })
      }

      const existingConnectionRequest = await Connection.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      })

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: 'connection request already exist..!!' })
      }

      const connectionRequest = new Connection({
        fromUserId,
        toUserId,
        status,
      })

      await connectionRequest.save()

      return res.status(200).send({ message: 'connection send successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).send(error.message)
    }
  }
)


router.post(
  '/receive/:requestId',
  tokenCheckerMiddleware,
  validateConnectionResponse,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id
      const { requestId } = req.params
      const { status } = req.body

      const connection = await Connection.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: 'Interested',
      })

      if (!connection) {
        return res.status(404).send({
          message: 'Connection request not found',
        })
      }

      connection.status = status
      await connection.save()

      return res.send({
        message: `Connection ${status}`,
        data: connection,
      })

     

     
    } catch (error) {
      console.error(error)
      return res.status(500).send(error.message)
    }
  }
)

export default router
