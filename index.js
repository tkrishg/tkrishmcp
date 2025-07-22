const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// MCP Route: Receives commands
app.post('/mcp', (req, res) => {
  console.log('🔧 Received MCP message:', req.body)
  res.json({ status: 'received', echo: req.body })
})

// SSE Stream: Keeps connection open
app.get('/mcp/stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  res.flushHeaders()

  // Send a ping every 15s to keep it alive
  const ping = setInterval(() => {
    res.write(':\n\n') // SSE comment/ping
  }, 15000)

  res.write(`event: init\ndata: Connected to MCP stream\n\n`)

  req.on('close', () => {
    clearInterval(ping)
  })
})

// Bind to correct port for Render
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ MCP Server running on port ${PORT}`)
})
