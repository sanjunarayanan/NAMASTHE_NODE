import mongoose from 'mongoose'

const ALLOWED_STATUS = ['Ignored', 'Interested']

export const validateCreateConnection = (req, res, next) => {
  const { toUserId } = req.params
  const { status } = req.body
  const fromUserId = req.user?._id

  // validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(toUserId)) {
    return res.status(400).send({ message: 'Invalid user id' })
  }

  // prevent self connection
  if (fromUserId && fromUserId.toString() === toUserId) {
    return res.status(400).send({ message: 'Cannot send request to yourself' })
  }

  // validate status
  if (!ALLOWED_STATUS.includes(status)) {
    return res.status(400).send({
      message: `Status '${status}' is not allowed`,
    })
  }

  next()
}



export default validateCreateConnection;
