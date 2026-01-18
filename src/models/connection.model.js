import mongoose from 'mongoose'
import validator from 'validator'
const { Schema } = mongoose

const connectionSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['Ignored', 'Interested', 'Accepted', 'Rejected'],
        message: '{VALUE} is not supported',
      },
    },
  },
  {
    timestamps: true,
  }
)

const Connection = mongoose.model('Connection', connectionSchema)
export default Connection
