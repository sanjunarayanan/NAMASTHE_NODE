import express from 'express'
import { auth } from './middlewares/auth.middleware.js'
const app = express()

app.get('/user', (req, res) => {
  res.send('Hello Hai')
})

app.get('/admin/getAllUSers', auth, (req, res) => {
  res.json([
    {
      firstName: 'sanju',
      lastName: 'v',
    },
    {
      firstName: 'yuvaan',
      lastName: 'Madhav',
    },
  ])
})

app.listen(3000, () => {
  console.log('app is running on port 3000')
})
