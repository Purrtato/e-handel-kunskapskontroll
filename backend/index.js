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

app.get('/orders', async (req, res) => {
  try {
    // Hämtar alla ordrar, senaste först
    const ordersResult = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    )

    // För varje order, hämta även vilka produkter som beställdes
    const orders = await Promise.all(
      ordersResult.rows.map(async order => {
        const itemsResult = await pool.query(
          'SELECT * FROM order_items WHERE order_id = $1',
          [order.id]
        )
        return { ...order, items: itemsResult.rows }
      })
    )

    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Kunde inte hämta ordrar' })
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

app.post('/orders', async (req, res) => {
  const { customer_name, customer_email, items } = req.body

  const client = await pool.connect()

  try {
    await client.query('BEGIN') // Starta en transaktion

    // Hämta aktuella priser och namn för varje produkt i korgen
    let total = 0
    const orderItemsData = []

    for (const item of items) {
      const productResult = await client.query(
        'SELECT name, price FROM products WHERE id = $1',
        [item.product_id]
      )

      if (!productResult.rows[0]) {
        throw new Error(`Produkt med id ${item.product_id} hittades inte`)
      }

      const { name, price } = productResult.rows[0]
      total += price * item.quantity

      orderItemsData.push({
        product_id: item.product_id,
        product_name: name,
        price_at_purchase: price,
        quantity: item.quantity
      })
    }

    // Skapa själva ordern
    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, customer_email, status, total)
       VALUES ($1, $2, 'Beställd', $3)
       RETURNING *`,
      [customer_name, customer_email, total]
    )
    const order = orderResult.rows[0]

    // Skapa en orderrad per produkt i korgen
    for (const item of orderItemsData) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price_at_purchase, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.product_id, item.product_name, item.price_at_purchase, item.quantity]
      )
    }

    await client.query('COMMIT') // Allt gick bra, spara på riktigt
    res.status(201).json({ ...order, items: orderItemsData })

  } catch (err) {
    await client.query('ROLLBACK') // Något gick fel, ångra allt
    console.error(err)
    res.status(500).json({ error: 'Kunde inte skapa ordern' })
  } finally {
    client.release() // Lämna tillbaka databaskopplingen till poolen
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