const express = require('express')
const cors = require('cors')
const app = express()

const PORT = process.env.PORT || 3000
const clients = []

app.use(cors())
app.use(express.json())

app.get('/mcp', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const client = { id: Date.now(), res }
  clients.push(client)

  req.on('close', () => {
    const i = clients.findIndex(c => c.id === client.id)
    if (i !== -1) clients.splice(i, 1)
  })
})

app.post('/mcp/control', (req, res) => {
  const data = req.body
  for (const client of clients) {
    client.res.write(`event: control\ndata: ${JSON.stringify(data)}\n\n`)
  }
  res.json({ ok: true })
})

app.listen(PORT, () => console.log(`MCP running on port ${PORT}`))
