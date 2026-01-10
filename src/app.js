import express from 'express'
import connectDb from './config/database.js'
import User from './models/user.model.js'
const app = express()

await connectDb()

app.post('/signup', async (req,res) => {
  const sanju = new User({
    firstName: 'sachin',
    lastName: 'tendulkar',
    address: 'India House',
  })
  await sanju.save()
  res.send('user successfully added')
})

app.listen(3000, () => {
  console.log('app is running on port 3000')
})
