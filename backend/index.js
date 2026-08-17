import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(cors())

app.get('/', (req, res) => {
  res.send('Backend fungerar!')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servern kör på port ${PORT}`))