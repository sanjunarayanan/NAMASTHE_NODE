import express from 'express'
const app = express()

app.get('/error', (req, res, next) => {
  next(new Error('Boom 💥'))
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

app.listen(3000, () => {
  console.log('app is running on port 3000')
})
