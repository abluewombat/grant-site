import assert from 'node:assert/strict'
import test from 'node:test'

process.env.NODE_ENV = 'test'
const { app } = await import('../server/index.js')

test('health endpoint reports the service is available', async () => {
  const server = app.listen(0)
  const address = server.address()
  const response = await fetch(`http://127.0.0.1:${address.port}/api/health`)
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.equal(body.status, 'ok')
  server.close()
})

test('inquiry endpoint rejects incomplete submissions', async () => {
  const server = app.listen(0)
  const address = server.address()
  const response = await fetch(`http://127.0.0.1:${address.port}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'R' }),
  })
  const body = await response.json()

  assert.equal(response.status, 400)
  assert.ok(body.errors.length >= 4)
  server.close()
})
