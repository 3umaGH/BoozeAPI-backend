const express = require('express')
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = 3001

app.use(cors());

app.get('/api', (req, res) => {
  res.send(`Hello World from Express backend!`)
})

app.listen(port, () => {
  console.log(`CocktailDB Api is running on ${port} port.`)
})