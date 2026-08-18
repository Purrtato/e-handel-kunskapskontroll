import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pg from 'pg'

const { Pool } = pg

dotenv.config()
const app = express()
app.use(cors())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB-fel:', err)
  else console.log('DB ansluten:', res.rows[0])
})

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE is_active = true ORDER BY id'
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Kunde inte hämta produkter' })
  }
})

app.get('/products/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [req.params.id]
    )

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Produkten hittades inte' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Kunde inte hämta produkten' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servern kör på port ${PORT}`))