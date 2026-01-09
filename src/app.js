const express = require('express')
const app = express()

app.use('/test', (req, res) => {
  res.send('Hello World Testing!..')
})

app.listen(3000, () => {
  console.log('app is running on port 3000')
})
