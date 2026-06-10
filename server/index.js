import cors from 'cors'
import express from 'express'
import { appendFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const dataDir = path.join(__dirname, 'data')
const submissionsPath = path.join(dataDir, 'inquiries.jsonl')
const port = Number(process.env.PORT) || 3001

export const app = express()

app.use(cors())
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'kyles-grant-studio' })
})

app.post('/api/inquiries', async (request, response) => {
  const inquiry = normalizeInquiry(request.body)
  const errors = validateInquiry(inquiry)

  if (errors.length) {
    return response.status(400).json({
      message: 'Please check the highlighted details.',
      errors,
    })
  }

  const record = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...inquiry,
  }

  await mkdir(dataDir, { recursive: true })
  await appendFile(submissionsPath, `${JSON.stringify(record)}\n`, 'utf8')

  return response.status(201).json({
    message: 'Thank you. Your project details are on their way to Rebecca.',
    inquiryId: record.id,
  })
})

const distDir = path.join(rootDir, 'dist')
app.use(express.static(distDir))
app.get('/{*splat}', (_request, response) => {
  response.sendFile(path.join(distDir, 'index.html'))
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Kyles Grant Studio is running on http://localhost:${port}`)
  })
}

function normalizeInquiry(body = {}) {
  return {
    name: String(body.name || '').trim(),
    organization: String(body.organization || '').trim(),
    email: String(body.email || '').trim().toLowerCase(),
    support: String(body.support || '').trim(),
    timeline: String(body.timeline || '').trim(),
    message: String(body.message || '').trim(),
  }
}

function validateInquiry(inquiry) {
  const errors = []
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (inquiry.name.length < 2) errors.push({ field: 'name', message: 'Please enter your name.' })
  if (inquiry.organization.length < 2) {
    errors.push({ field: 'organization', message: 'Please enter your organization.' })
  }
  if (!emailPattern.test(inquiry.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' })
  }
  if (!inquiry.support) {
    errors.push({ field: 'support', message: 'Please choose the support you need.' })
  }
  if (inquiry.message.length < 20) {
    errors.push({ field: 'message', message: 'Tell us a little more about your funding goals.' })
  }

  return errors
}
