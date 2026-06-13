import assert from 'node:assert/strict'
import test from 'node:test'
import inquiryHandler from '../api/inquiries.js'
import {
  buildInquiryEmail,
  normalizeInquiry,
  validateInquiry,
} from '../server/inquiry.js'

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

test('shared inquiry validation accepts a complete submission', () => {
  const inquiry = normalizeInquiry({
    name: 'Rebbecca Kyles',
    organization: 'Community Impact Network',
    email: 'rebbecca@example.org',
    support: 'Proposal development',
    timeline: '1-3 months',
    message: 'We need a funding strategy for a new community-based program.',
  })

  assert.deepEqual(validateInquiry(inquiry), [])
  assert.equal(inquiry.email, 'rebbecca@example.org')
})

test('email content escapes visitor-provided HTML', () => {
  const email = buildInquiryEmail({
    name: '<Rebbecca>',
    organization: 'Community & Co.',
    email: 'rebecca@example.org',
    support: 'Proposal development',
    timeline: '1-3 months',
    message: '<script>alert("no")</script>',
    createdAt: '2026-06-10T00:00:00.000Z',
  })

  assert.ok(email.html.includes('&lt;script&gt;'))
  assert.ok(!email.html.includes('<script>'))
})

test('Vercel inquiry function reports missing email configuration', async () => {
  const originalEnvironment = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    INQUIRY_TO_EMAIL: process.env.INQUIRY_TO_EMAIL,
    INQUIRY_FROM_EMAIL: process.env.INQUIRY_FROM_EMAIL,
  }

  delete process.env.RESEND_API_KEY
  delete process.env.INQUIRY_TO_EMAIL
  delete process.env.INQUIRY_FROM_EMAIL

  const request = {
    method: 'POST',
    body: {
      name: 'Rebbecca Kyles',
      organization: 'Community Impact Network',
      email: 'rebecca@example.org',
      support: 'Proposal development',
      timeline: '1-3 months',
      message: 'We need a funding strategy for a new community-based program.',
    },
  }
  const result = {}
  const response = {
    status(code) {
      result.status = code
      return this
    },
    json(body) {
      result.body = body
      return this
    },
  }

  await inquiryHandler(request, response)
  assert.equal(result.status, 503)
  assert.match(result.body.message, /temporarily unavailable/i)

  Object.entries(originalEnvironment).forEach(([key, value]) => {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  })
})

test('Vercel inquiry function hands a valid inquiry to Resend', async () => {
  const originalFetch = globalThis.fetch
  const originalEnvironment = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    INQUIRY_TO_EMAIL: process.env.INQUIRY_TO_EMAIL,
    INQUIRY_FROM_EMAIL: process.env.INQUIRY_FROM_EMAIL,
  }
  let resendRequest

  process.env.RESEND_API_KEY = 're_test'
  process.env.INQUIRY_TO_EMAIL = 'rebecca@example.org'
  process.env.INQUIRY_FROM_EMAIL = 'The Funding Catalyst <inquiries@example.org>'
  globalThis.fetch = async (url, options) => {
    resendRequest = { url, options }
    return new Response(JSON.stringify({ id: 'email_test' }), { status: 200 })
  }

  const request = {
    method: 'POST',
    body: {
      name: 'Jordan Lee',
      organization: 'Community Impact Network',
      email: 'jordan@example.org',
      support: 'Grant strategy & research',
      timeline: '1-3 months',
      message: 'We need a durable funding strategy for a new community program.',
    },
  }
  const result = {}
  const response = {
    setHeader() {},
    status(code) {
      result.status = code
      return this
    },
    json(body) {
      result.body = body
      return this
    },
  }

  try {
    await inquiryHandler(request, response)
    const resendBody = JSON.parse(resendRequest.options.body)

    assert.equal(result.status, 201)
    assert.equal(resendRequest.url, 'https://api.resend.com/emails')
    assert.equal(resendBody.reply_to, 'jordan@example.org')
    assert.deepEqual(resendBody.to, ['rebecca@example.org'])
  } finally {
    globalThis.fetch = originalFetch
    Object.entries(originalEnvironment).forEach(([key, value]) => {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    })
  }
})
