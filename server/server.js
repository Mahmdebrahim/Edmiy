import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'

import {clerkWebhooks} from './controllers/webhooks.js'



//** Init exprss app
const app = express()

//** connect DB
await connectDB()

//** Middlewares
app.use(cors())
app.use(express.json())

//** Routes
app.get('/', (req, res) => {
  res.send('Hello Api!')
})
app.post("/clerk", clerkWebhooks);


//** Listen
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})


