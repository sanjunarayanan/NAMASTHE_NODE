import express from 'express'
import connectDb from './config/database.js'
import User from './models/user.model.js'
const app = express()
app.use(express.json())
await connectDb()

app.post('/user', async (req, res) => {
  try {
    const user = new User(req.body)
    if (user) {
      await user.save()
      res.send('user added successful')
    }
    res.status(404).send('user is not found..!')
  } catch (error) {
    res.status(400).send('something went wrong..!')
  }
})

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({})
    if (users.length) {
      res.send(users)
    }
    res.status(404).send('user is not found..!')
  } catch (error) {
    res.status(400).send('something went wrong..!')
  }
})

app.listen(3000, () => {
  console.log('app is running on port 3000')
})
