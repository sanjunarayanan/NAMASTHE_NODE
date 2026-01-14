import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const tokenCheckerMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies
    if (!token) {
      return res.status(401).send('Authentication required')
    }

    const decoded = jwt.verify(token, 'JWT_SECRET')

    console.log('decoded :', decoded)
    const user = await User.findById(decoded.userId)
    console.log('userFound :', user)
    if (!user) {
      return res.status(401).send('User not found')
    }
    req.user = user
    next()
  } catch (error) {
    return res.status(401).send('Invalid or expired token')
  }
}

export default tokenCheckerMiddleware
