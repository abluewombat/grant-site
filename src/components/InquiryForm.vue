<script setup>
import { nextTick, reactive, ref } from 'vue'
import ArrowIcon from './ArrowIcon.vue'

const initialForm = {
  name: '',
  organization: '',
  email: '',
  support: '',
  message: '',
  website: '',
}

const form = reactive({ ...initialForm })
const fieldErrors = reactive({})
const status = ref('idle')
const responseMessage = ref('')

async function submitInquiry() {
  status.value = 'submitting'
  responseMessage.value = ''
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key])

  try {
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await response.json()

    if (!response.ok) {
      data.errors?.forEach((error) => {
        fieldErrors[error.field] = error.message
      })
      status.value = 'error'
      responseMessage.value = data.message || 'Please review your details and try again.'

      await nextTick()
      const firstInvalidField = data.errors?.[0]?.field
      document.querySelector(`[data-field="${firstInvalidField}"]`)?.focus()
      return
    }

    status.value = 'success'
    responseMessage.value = data.message
    Object.assign(form, initialForm)
  } catch (error) {
    if (status.value !== 'success') {
      status.value = 'error'
      responseMessage.value = error.message || 'Something went wrong. Please try again.'
    }
  }
}
</script>

<template>
  <form class="inquiry-form" novalidate @submit.prevent="submitInquiry">
    <label class="honeypot" aria-hidden="true">
      <span>Website</span>
      <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" />
    </label>

    <p
      v-if="responseMessage && status === 'error'"
      class="form-status is-error"
      role="alert"
    >
      {{ responseMessage }}
    </p>

    <div class="form-grid">
      <label>
        <span>Your name</span>
        <input
          v-model="form.name"
          data-field="name"
          type="text"
          autocomplete="name"
          placeholder="First and last name"
          required
          :aria-invalid="Boolean(fieldErrors.name)"
          aria-describedby="name-error"
        />
        <small v-if="fieldErrors.name" id="name-error">{{ fieldErrors.name }}</small>
      </label>
      <label>
        <span>Organization</span>
        <input
          v-model="form.organization"
          data-field="organization"
          type="text"
          autocomplete="organization"
          placeholder="Established nonprofit"
          required
          :aria-invalid="Boolean(fieldErrors.organization)"
          aria-describedby="organization-error"
        />
        <small v-if="fieldErrors.organization" id="organization-error">{{ fieldErrors.organization }}</small>
      </label>
    </div>

    <label>
      <span>Email address</span>
      <input
        v-model="form.email"
        data-field="email"
        type="email"
        autocomplete="email"
        placeholder="you@organization.org"
        required
        :aria-invalid="Boolean(fieldErrors.email)"
        aria-describedby="email-error"
      />
      <small v-if="fieldErrors.email" id="email-error">{{ fieldErrors.email }}</small>
    </label>

    <label>
      <span>What support do you need?</span>
      <select
        v-model="form.support"
        data-field="support"
        required
        :aria-invalid="Boolean(fieldErrors.support)"
        aria-describedby="support-error"
      >
        <option value="" disabled>Choose what sounds closest</option>
        <option>Not sure where to start</option>
        <option>Grant research and opportunity strategy</option>
        <option>Full proposal writing or editing</option>
        <option>Grant reporting, compliance, or renewals</option>
        <option>Major gifts and donor strategy</option>
        <option>Board fundraising support</option>
        <option>Capital campaign strategy</option>
        <option>Something else</option>
      </select>
      <small v-if="fieldErrors.support" id="support-error">{{ fieldErrors.support }}</small>
    </label>

    <label>
      <span>Tell me about your funding goals</span>
      <textarea
        v-model="form.message"
        data-field="message"
        rows="4"
        placeholder="What does your nonprofit do, and where does funding feel stuck?"
        required
        :aria-invalid="Boolean(fieldErrors.message)"
        aria-describedby="message-error"
      />
      <small v-if="fieldErrors.message" id="message-error">{{ fieldErrors.message }}</small>
    </label>

    <button class="button button-coral form-submit" type="submit" :disabled="status === 'submitting'">
      {{ status === 'submitting' ? 'Sending...' : 'Send Rebbecca a note' }}
      <ArrowIcon v-if="status !== 'submitting'" />
    </button>

    <p class="form-privacy">Rebbecca responds personally within 24 hours.</p>

    <p v-if="responseMessage && status === 'success'" class="form-status is-success" aria-live="polite">
      {{ responseMessage }}
    </p>
  </form>
</template>
