import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { watchContracts } from "./watchContracts.js";

import usersRoutes from '../routes/users.js'
import buyerContractsRoutes from "../routes/buyerContracts.js";
import offersRoutes from "../routes/offers.js"
import buyerProfileRoutes from "../routes/buyerProfile.js"
import counterContractRoutes from "../routes/counterContract.js"
import farmerProfileRoutes from "../routes/farmerProfile.js"
import counterOfferRoutes from "../routes/counterOfferRoutes.js"
import counterCheckRoutes from "../routes/counterCheck.js"
import { connectMongo } from "../config/mongodb.js";
import testMongoRoute from "../routes/testMongo.js"
import getbp from "../routes/getbp.js"
import contracts from "../routes/contracts.js"
import userCoreProfileRoutes from "../routes/userCoreProfile.js";
import farmersRoutes from "../routes/farmers.routes.js";
import contractAuditRoutes from "../routes/contractAudit.routes.js";
import mongoose from 'mongoose';

const app = express()
connectMongo();

///
mongoose.connection.once("open", () => { watchContracts(); });

///

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
app.use("/api", buyerContractsRoutes);
app.use('/api/offers', offersRoutes)
app.use("/api/getbp", getbp);
app.use('/api/buyer-profile', buyerProfileRoutes)
app.use('/api', counterContractRoutes)
app.use('/api', farmerProfileRoutes)
app.use('/api', counterOfferRoutes)
app.use('/api', counterCheckRoutes)
app.use("/api", testMongoRoute);
app.use("/api", contracts);
app.use("/api", userCoreProfileRoutes);
app.use("/api", farmersRoutes);
app.use("/api/contract-audit", contractAuditRoutes);



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
