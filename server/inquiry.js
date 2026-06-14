export function normalizeInquiry(body = {}) {
  return {
    name: String(body.name || '').trim(),
    organization: String(body.organization || '').trim(),
    email: String(body.email || '').trim().toLowerCase(),
    support: String(body.support || '').trim(),
    timeline: String(body.timeline || '').trim(),
    message: String(body.message || '').trim(),
    website: String(body.website || '').trim(),
  }
}

export function validateInquiry(inquiry) {
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
  if (!inquiry.message) {
    errors.push({ field: 'message', message: 'Please tell us briefly about your funding goals.' })
  }

  return errors
}

export function createInquiryRecord(inquiry) {
  const { website: _website, ...details } = inquiry

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...details,
  }
}

export function buildInquiryEmail(inquiry) {
  const subject = `New grant inquiry from ${inquiry.organization}`
  const fields = [
    ['Name', inquiry.name],
    ['Organization', inquiry.organization],
    ['Email', inquiry.email],
    ['Support needed', inquiry.support],
    ['Timeline', inquiry.timeline || 'Not provided'],
    ['Submitted', inquiry.createdAt],
  ]
  const rows = fields
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:8px 14px 8px 0">${escapeHtml(label)}</th><td style="padding:8px 0">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  return {
    subject,
    text: [
      subject,
      '',
      ...fields.map(([label, value]) => `${label}: ${value}`),
      '',
      'Funding goals:',
      inquiry.message,
    ].join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;color:#142f2a;line-height:1.6">
        <h1 style="font-size:24px">${escapeHtml(subject)}</h1>
        <table style="border-collapse:collapse">${rows}</table>
        <h2 style="margin-top:28px;font-size:18px">Funding goals</h2>
        <p style="white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>
      </div>
    `,
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
