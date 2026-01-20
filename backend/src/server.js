import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import usersRoutes from '../routes/users.js'
import offersRoutes from "../routes/offers.js"
import buyerProfileRoutes from "../routes/buyerProfile.js"
import counterContractRoutes from "../routes/counterContract.js"
import farmerProfileRoutes from "../routes/farmerProfile.js"
import counterOfferRoutes from "../routes/counterOfferRoutes.js"
import counterCheckRoutes from "../routes/counterCheck.js"
import { connectMongo } from "../config/mongodb.js";
import testMongoRoute from "../routes/testMongo.js"

const app = express()
connectMongo();

/* =====================
   Global error handlers
===================== */
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason)
})

/* =====================
   Middlewares
===================== */
app.use(cors())
app.use(express.json())

/* =====================
   Health check
===================== */
app.get('/', (req, res) => {
  res.send('Backend running 🚀')
})

/* =====================
   Routes
===================== */
app.use('/api/users', usersRoutes)
app.use('/api/offers', offersRoutes)
app.use('/api/buyer-profile', buyerProfileRoutes)
app.use('/api', counterContractRoutes)
app.use('/api', farmerProfileRoutes)
app.use('/api', counterOfferRoutes)
app.use('/api', counterCheckRoutes)
app.use("/api", testMongoRoute);

/* =====================
   404 handler
===================== */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

/* =====================
   Error middleware
===================== */
app.use((err, req, res, next) => {
  console.error('🔥 Express Error:', err)
  res.status(500).json({ message: 'Internal server error' })
})







/* =====================
   Server start
===================== */
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
})
