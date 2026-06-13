<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ArrowIcon from './components/ArrowIcon.vue'
import InquiryForm from './components/InquiryForm.vue'

const menuOpen = ref(false)
const scrolled = ref(false)
const heroVisible = ref(true)
const contactVisible = ref(false)

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'How I help', href: '#services' },
  { label: 'Experience', href: '#experience' },
  { label: "Let's talk", href: '#contact' },
]

const missions = [
  'Survivor safety',
  'Housing & homelessness',
  'Youth & foster care',
  'Health & recovery',
  'Community support',
]

const services = [
  {
    title: 'Focus the opportunity',
    copy: 'Identify grants and fundraising priorities that fit your mission, capacity, and timing.',
  },
  {
    title: 'Build the fundable case',
    copy: 'Turn program knowledge, outcomes, and budgets into a story funders can trust.',
  },
  {
    title: 'Create lasting momentum',
    copy: 'Put practical grant, donor, and follow-through systems in place for your team.',
  },
]

const outcomes = [
  { value: '$2M+', label: 'new funding in one year' },
  { value: '59%', label: 'funding increase' },
  { value: '$7.7M', label: 'campaign leadership' },
]

const processSteps = [
  {
    number: '1',
    title: 'Start with the real challenge',
    copy: 'No grant jargon or polished materials required.',
  },
  {
    number: '2',
    title: 'Find the leverage point',
    copy: "I'll be direct about what will help and what can wait.",
  },
  {
    number: '3',
    title: 'Build funding momentum',
    copy: 'You stay close to the mission while I bring structure and funder perspective.',
  },
]

const partners = [
  {
    name: 'The Bridge Over Troubled Waters',
    logo: '/partners/the-bridge.png',
    url: 'https://tbotw.org/',
    className: 'partner-bridge',
  },
  {
    name: 'Jane Around the World',
    logo: '/partners/jane-around-the-world.jpg',
    url: 'https://janearoundtheworld.org/',
    className: 'partner-jane',
  },
  {
    name: 'Bay Area Turning Point',
    logo: '/partners/bay-area-turning-point.png',
    url: 'https://www.bayareaturningpoint.org/',
    className: 'partner-batp',
  },
  {
    name: 'The Wheelhouse',
    logo: '/partners/the-wheelhouse.png',
    url: 'https://thewheelhouse.org/',
    className: 'partner-wheelhouse',
  },
]

let heroObserver
let contactObserver
let handleScroll

onMounted(() => {
  heroObserver = new IntersectionObserver(
    ([entry]) => {
      heroVisible.value = entry.isIntersecting
    },
    { threshold: 0.08 },
  )
  contactObserver = new IntersectionObserver(
    ([entry]) => {
      contactVisible.value = entry.isIntersecting
    },
    { threshold: 0.05 },
  )

  const hero = document.querySelector('#home')
  const contact = document.querySelector('#contact')
  if (hero) heroObserver.observe(hero)
  if (contact) contactObserver.observe(contact)

  handleScroll = () => {
    scrolled.value = window.scrollY > 20
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  heroObserver?.disconnect()
  contactObserver?.disconnect()
  window.removeEventListener('scroll', handleScroll)
})

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <div class="site-shell">
    <header class="site-header" :class="{ 'is-scrolled': scrolled }">
      <a class="brand" href="#home" aria-label="The Funding Catalyst home" @click="closeMenu">
        <span class="brand-mark">FC</span>
        <span class="brand-copy">
          <strong>The Funding Catalyst</strong>
          <small>Grant Writing & Fundraising Strategy for Nonprofits</small>
        </span>
      </a>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <a v-for="item in navItems.slice(1)" :key="item.href" :href="item.href">
          {{ item.label }}
        </a>
      </nav>

      <a class="button button-dark header-cta" href="#contact">
        Start a conversation
        <ArrowIcon />
      </a>

      <button
        class="menu-button"
        type="button"
        :aria-expanded="menuOpen"
        aria-label="Toggle navigation"
        @click="menuOpen = !menuOpen"
      >
        <span />
        <span />
      </button>

      <nav v-if="menuOpen" class="mobile-menu" aria-label="Mobile navigation">
        <a v-for="item in navItems" :key="item.href" :href="item.href" @click="closeMenu">
          {{ item.label }}
        </a>
      </nav>
    </header>

    <main>
      <section id="home" class="hero section">
        <div class="hero-copy">
          <p class="eyebrow eyebrow-pill">Grant writing & fundraising strategy for nonprofits</p>
          <h1>Your mission has momentum. <em>I help funding catch up.</em></h1>
          <p class="hero-lede">
            I help small and growing nonprofits turn community knowledge into clear grant
            and fundraising strategies that move the right opportunities forward.
          </p>
          <div class="hero-actions">
            <a class="button button-coral" href="#contact">
              Tell me about your nonprofit
              <ArrowIcon />
            </a>
            <a class="text-link" href="#services">See how I can help <ArrowIcon /></a>
          </div>
        </div>

        <figure class="hero-art">
          <img
            src="/bridge-community-funding.webp"
            alt="An illustrated bridge connecting a neighborhood community center with a welcoming funding institution"
          />
          <figcaption>
            <strong>Community insight is the starting point. Funding momentum is the goal.</strong>
            <span>I help connect the two.</span>
          </figcaption>
        </figure>
      </section>

      <section class="missions section">
        <div class="missions-copy">
          <p class="eyebrow">Community work comes first</p>
          <h2>The best funding strategies start with the people closest to the work.</h2>
          <p>
            My career began in shelters and crisis programs. I understand urgent needs,
            limited staff, and the responsibility community organizations carry every day.
          </p>
          <div class="mission-tags">
            <span v-for="mission in missions" :key="mission">{{ mission }}</span>
          </div>
        </div>

        <div class="partner-wrap">
          <p>Organizations I've served</p>
          <div class="partner-grid">
            <a
              v-for="partner in partners"
              :key="partner.name"
              class="partner-card"
              :class="partner.className"
              :href="partner.url"
              target="_blank"
              rel="noreferrer"
              :aria-label="`Visit ${partner.name}`"
            >
              <img :src="partner.logo" :alt="partner.name" />
            </a>
          </div>
        </div>
      </section>

      <section id="services" class="services section">
        <div class="section-heading">
          <p class="eyebrow">How I help</p>
          <h2>Clear strategy turns good work into funding momentum.</h2>
        </div>

        <div class="service-list">
          <article v-for="(service, index) in services" :key="service.title">
            <span>0{{ index + 1 }}</span>
            <div>
              <h3>{{ service.title }}</h3>
              <p>{{ service.copy }}</p>
            </div>
          </article>
        </div>
      </section>

      <section id="experience" class="experience section">
        <div class="experience-copy">
          <p class="eyebrow">A practical catalyst, not another layer</p>
          <h2>Experience that helps the right ideas move.</h2>
          <p>
            Across 18+ years, I've worked in direct service, grant compliance,
            development leadership, donor strategy, and nonprofit operations.
            I bring large-system experience to smaller teams in a practical, personal way.
          </p>
          <a class="text-link" href="https://www.linkedin.com/in/beckykyles/" target="_blank" rel="noreferrer">
            View my experience <ArrowIcon />
          </a>
        </div>

        <div class="outcome-grid" aria-label="Selected funding results">
          <article v-for="outcome in outcomes" :key="outcome.value">
            <strong>{{ outcome.value }}</strong>
            <span>{{ outcome.label }}</span>
          </article>
        </div>
      </section>

      <section class="process section">
        <div class="section-heading">
          <p class="eyebrow">A simple process</p>
          <h2>Find the next step that moves funding forward.</h2>
        </div>

        <ol class="process-list">
          <li v-for="step in processSteps" :key="step.number">
            <span>{{ step.number }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.copy }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section id="contact" class="contact section">
        <div class="contact-copy">
          <p class="eyebrow">Start with the real challenge</p>
          <h2>A useful conversation can create momentum.</h2>
          <p>
            Share what your organization does and where funding feels stuck.
            I'll help identify a practical next step.
          </p>
          <ul>
            <li><span class="contact-bullet" aria-hidden="true" /> Come as you are</li>
            <li><span class="contact-bullet" aria-hidden="true" /> Plain language and practical next steps</li>
            <li><span class="contact-bullet" aria-hidden="true" /> A response directly from me</li>
          </ul>
          <a class="contact-email" href="mailto:RebbeccaKyles@gmail.com">
            RebbeccaKyles@gmail.com
          </a>
        </div>

        <div class="form-wrap">
          <InquiryForm />
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <a class="brand footer-brand" href="#home">
        <span class="brand-mark">FC</span>
        <span class="brand-copy">
          <strong>The Funding Catalyst</strong>
          <small>Grant Writing & Fundraising Strategy for Nonprofits</small>
        </span>
      </a>
      <p>Turning community insight into funding momentum.</p>
      <small>&copy; {{ new Date().getFullYear() }} The Funding Catalyst. Led by Rebbecca Kyles.</small>
    </footer>

    <a v-if="!heroVisible && !contactVisible" class="mobile-contact-bar" href="#contact">
      Tell me about your nonprofit
      <ArrowIcon />
    </a>
  </div>
</template>
