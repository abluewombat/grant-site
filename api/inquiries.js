import {
  buildInquiryEmail,
  createInquiryRecord,
  normalizeInquiry,
  validateInquiry,
} from '../server/inquiry.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ message: 'Method not allowed.' })
  }

  const inquiry = normalizeInquiry(request.body)

  if (inquiry.website) {
    return response.status(201).json({
      message: 'Thank you. Your project details are on their way to Rebbecca.',
    })
  }

  const errors = validateInquiry(inquiry)

  if (errors.length) {
    console.warn('Inquiry validation failed:', errors.map(({ field }) => field).join(', '))
    return response.status(400).json({
      message: 'Please check the highlighted details.',
      errors,
    })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.INQUIRY_TO_EMAIL
  const from = process.env.INQUIRY_FROM_EMAIL

  if (!apiKey || !to || !from) {
    console.error('Inquiry email environment variables are not configured.')
    return response.status(503).json({
      message: 'The inquiry form is temporarily unavailable. Please email Rebbecca directly.',
    })
  }

  const record = createInquiryRecord(inquiry)
  const email = buildInquiryEmail(record)
  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: record.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  })

  if (!resendResponse.ok) {
    const errorBody = await resendResponse.text()
    console.error('Resend inquiry delivery failed:', resendResponse.status, errorBody)
    return response.status(502).json({
      message: 'The inquiry could not be delivered. Please email Rebbecca directly.',
    })
  }

  return response.status(201).json({
    message: 'Thank you. Your project details are on their way to Rebbecca.',
    inquiryId: record.id,
  })
}
