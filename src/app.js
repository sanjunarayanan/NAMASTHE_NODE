import express from 'express'
import cookieParser from 'cookie-parser'
import connectDb from './config/database.js'
import profileRoutes from './routes/profile.routes.js'
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import usersRoutes from './routes/users.routes.js'
import connectionRoutes from './routes/connections.routes.js'

const app = express()
app.use(express.json())
app.use(cookieParser())
await connectDb()

app.use('/v1', usersRoutes)
app.use('/v1/auth', authRoutes)
app.use('/v1/profile', profileRoutes)
app.use('/v1/user', userRoutes)

app.use('/v1/request', connectionRoutes)

app.listen(3000, () => {
  console.log('app is running on port 3000')
})
