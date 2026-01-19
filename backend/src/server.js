import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import usersRoutes from '../routes/users.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('Backend running 🚀'))

// Routes
app.use('/api/users', usersRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
