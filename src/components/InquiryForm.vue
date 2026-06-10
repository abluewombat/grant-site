<script setup>
import { reactive, ref } from 'vue'
import ArrowIcon from './ArrowIcon.vue'

const initialForm = {
  name: '',
  organization: '',
  email: '',
  support: '',
  timeline: '',
  message: '',
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
      throw new Error(data.message || 'Please review your details and try again.')
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
    <div class="form-grid">
      <label>
        <span>Your name</span>
        <input v-model="form.name" type="text" autocomplete="name" placeholder="First and last name" />
        <small v-if="fieldErrors.name">{{ fieldErrors.name }}</small>
      </label>
      <label>
        <span>Organization</span>
        <input v-model="form.organization" type="text" autocomplete="organization" placeholder="Nonprofit or initiative" />
        <small v-if="fieldErrors.organization">{{ fieldErrors.organization }}</small>
      </label>
    </div>

    <label>
      <span>Email address</span>
      <input v-model="form.email" type="email" autocomplete="email" placeholder="you@organization.org" />
      <small v-if="fieldErrors.email">{{ fieldErrors.email }}</small>
    </label>

    <div class="form-grid">
      <label>
        <span>What support do you need?</span>
        <select v-model="form.support">
          <option value="" disabled>Select a service</option>
          <option>Grant strategy & research</option>
          <option>Proposal development</option>
          <option>Grant systems & compliance</option>
          <option>Development consulting</option>
          <option>Not sure yet</option>
        </select>
        <small v-if="fieldErrors.support">{{ fieldErrors.support }}</small>
      </label>
      <label>
        <span>Ideal timeline</span>
        <select v-model="form.timeline">
          <option value="" disabled>Select a timeline</option>
          <option>Within 30 days</option>
          <option>1-3 months</option>
          <option>3-6 months</option>
          <option>Ongoing support</option>
          <option>Exploring options</option>
        </select>
      </label>
    </div>

    <label>
      <span>Tell me about your funding goals</span>
      <textarea
        v-model="form.message"
        rows="5"
        placeholder="What are you building, and where does funding feel stuck?"
      />
      <small v-if="fieldErrors.message">{{ fieldErrors.message }}</small>
    </label>

    <button class="button button-coral form-submit" type="submit" :disabled="status === 'submitting'">
      {{ status === 'submitting' ? 'Sending...' : 'Start the conversation' }}
      <ArrowIcon v-if="status !== 'submitting'" />
    </button>

    <p v-if="responseMessage" class="form-status" :class="`is-${status}`" aria-live="polite">
      {{ responseMessage }}
    </p>
  </form>
</template>
