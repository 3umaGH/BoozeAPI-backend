const express = require('express')
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = 3001

app.use('/assets', express.static('assets'));
app.use(cors());




app.get('/api', (req, res) => {
  res.send(`Hello World from Express backend!`)
})

const searchRouter = require("./routes/search");
app.use("/search",searchRouter);



app.listen(port)