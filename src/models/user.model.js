import mongoose from 'mongoose'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
const { Schema } = mongoose

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid Email :' + value)
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error('Enter Strong password :' + value)
        }
      },
    },
    address: {
      type: String,
    },
    dob: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.getJWT = async function () {
  const user = this
  const token = jwt.sign({ userId: user._id }, 'JWT_SECRET', {
    expiresIn: '1d',
  })

  return token
}

userSchema.methods.validatePassword = async function (enteredPassword) {
  const user = this
  const passwordHash = user.password
  const isValidPassword = await bcrypt.compare(enteredPassword, passwordHash)
  return isValidPassword
}

const User = mongoose.model('User', userSchema)
export default User
