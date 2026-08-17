import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pg from 'pg'

const { Pool } = pg

dotenv.config()
const app = express()
app.use(cors())

app.get('/', (req, res) => {
  res.send('Backend fungerar!')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servern kör på port ${PORT}`))

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB-fel:', err)
  else console.log('DB ansluten:', res.rows[0])
})