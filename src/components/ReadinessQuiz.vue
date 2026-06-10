<script setup>
import { computed, ref } from 'vue'
import CheckIcon from './CheckIcon.vue'

const questions = [
  {
    title: 'Do you have a clearly defined program and population?',
    detail: 'Funders need to understand who is served, how, and why the work matters now.',
  },
  {
    title: 'Can you name the outcomes you will measure?',
    detail: 'Strong proposals connect activities to specific, credible signs of change.',
  },
  {
    title: 'Is your program budget current and complete?',
    detail: 'A fundable story and a defensible budget should reinforce one another.',
  },
  {
    title: 'Do you have the capacity to report on a grant?',
    detail: 'Post-award stewardship starts before the application is submitted.',
  },
]

const step = ref(0)
const answers = ref([])
const complete = computed(() => step.value >= questions.length)
const score = computed(() => answers.value.filter(Boolean).length)

const result = computed(() => {
  if (score.value === 4) return {
    label: 'Grant ready',
    copy: 'Your foundation is strong. The next move is matching your work to the right funders and sharpening the narrative.',
  }
  if (score.value >= 2) return {
    label: 'Nearly ready',
    copy: 'You have important pieces in place. A focused readiness sprint can close the gaps before deadlines arrive.',
  }
  return {
    label: 'Build the foundation',
    copy: 'The best first step is a clear case for support, outcomes framework, and realistic grant plan.',
  }
})

function answer(value) {
  answers.value.push(value)
  step.value += 1
}

function reset() {
  step.value = 0
  answers.value = []
}
</script>

<template>
  <div class="quiz-card">
    <div class="quiz-topline">
      <span>Grant readiness check</span>
      <span v-if="!complete">{{ step + 1 }} / {{ questions.length }}</span>
      <span v-else>Complete</span>
    </div>

    <div v-if="!complete" class="quiz-body">
      <div class="quiz-progress" aria-hidden="true">
        <span :style="{ width: `${(step / questions.length) * 100}%` }" />
      </div>
      <p class="eyebrow">A quick pulse check</p>
      <h3>{{ questions[step].title }}</h3>
      <p>{{ questions[step].detail }}</p>
      <div class="quiz-actions">
        <button type="button" class="button button-dark" @click="answer(true)">
          <CheckIcon />
          Yes, we do
        </button>
        <button type="button" class="button button-quiet" @click="answer(false)">
          Not yet
        </button>
      </div>
    </div>

    <div v-else class="quiz-body quiz-result" aria-live="polite">
      <div class="result-mark"><CheckIcon /></div>
      <p class="eyebrow">Your result</p>
      <h3>{{ result.label }}</h3>
      <p>{{ result.copy }}</p>
      <a href="#contact" class="button button-coral">Talk through the next step</a>
      <button type="button" class="text-button" @click="reset">Retake check</button>
    </div>
  </div>
</template>
