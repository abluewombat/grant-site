import cors from 'cors'
import express from 'express'
import { appendFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createInquiryRecord,
  normalizeInquiry,
  validateInquiry,
} from './inquiry.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const dataDir = path.join(__dirname, 'data')
const submissionsPath = path.join(dataDir, 'inquiries.jsonl')
const port = Number(process.env.PORT) || 3001

export const app = express()

app.use(cors())
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'missionward' })
})

app.post('/api/inquiries', async (request, response) => {
  const inquiry = normalizeInquiry(request.body)
  const errors = validateInquiry(inquiry)

  if (inquiry.website) {
    return response.status(201).json({
      message: 'Thank you. Your project details are on their way to Rebbecca.',
    })
  }

  if (errors.length) {
    return response.status(400).json({
      message: 'Please check the highlighted details.',
      errors,
    })
  }

  const record = createInquiryRecord(inquiry)

  await mkdir(dataDir, { recursive: true })
  await appendFile(submissionsPath, `${JSON.stringify(record)}\n`, 'utf8')

  return response.status(201).json({
    message: 'Thank you. Your project details are on their way to Rebbecca.',
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
    console.log(`Missionward is running on http://localhost:${port}`)
  })
}
