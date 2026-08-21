import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pg from 'pg'

const { Pool } = pg

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB-fel:', err)
  else console.log('DB ansluten:', res.rows[0])
})

app.get('/', (req, res) => {
  res.send('E-handel API, servern kör')
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

app.post('/products', async (req, res) => {
  try {
    const { name, description, price, category, stock, image_url } = req.body

    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, stock, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING *`,
      [name, description, price, category, stock, image_url]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Kunde inte skapa produkten' })
  }
})

app.put('/products/:id', async (req, res) => {
  try {
    const { name, description, price, category, stock, image_url } = req.body

    const result = await pool.query(
      `UPDATE products
       SET name = $1, description = $2, price = $3, category = $4, stock = $5, image_url = $6
       WHERE id = $7
       RETURNING *`,
      [name, description, price, category, stock, image_url, req.params.id]
    )

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Produkten hittades inte' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Kunde inte uppdatera produkten' })
  }
})

app.delete('/products/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE products SET is_active = false WHERE id = $1 RETURNING *`,
      [req.params.id]
    )

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Produkten hittades inte' })
    }

    res.json({ message: 'Produkten togs bort', product: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Kunde inte ta bort produkten' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servern kör på port ${PORT}`))