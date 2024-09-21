import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'

import connectMongoDB from './db/connectMongoDB.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json()) // to parse req.body
app.use(express.urlencoded({ extended: true })) //to parse form data(urlencoded)

app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
  connectMongoDB()
})
