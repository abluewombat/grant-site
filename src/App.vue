<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ArrowIcon from './components/ArrowIcon.vue'
import CheckIcon from './components/CheckIcon.vue'
import InquiryForm from './components/InquiryForm.vue'
import ReadinessQuiz from './components/ReadinessQuiz.vue'

const menuOpen = ref(false)
const activeSection = ref('home')
const scrolled = ref(false)
const contactVisible = ref(false)
const heroVisible = ref(true)

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'How I help', href: '#services' },
  { label: 'About me', href: '#about' },
  { label: 'Let’s talk', href: '#contact' },
]

const familiarMoments = [
  {
    title: 'You found a grant, but the application feels like another language.',
    label: 'The opportunity is there',
  },
  {
    title: 'Your team is already doing three jobs each, and deadlines keep moving.',
    label: 'Capacity is tight',
  },
  {
    title: 'You know the work matters, but worry larger nonprofits sound more “fundable.”',
    label: 'Your story needs room',
  },
]

const services = [
  {
    question: 'Not sure where to begin?',
    title: 'Find a practical funding path',
    copy: 'I’ll help you understand what is grant-ready now, what needs attention, and which opportunities are worth your limited time.',
    tags: ['Readiness review', 'Funder research', 'Grant roadmap'],
  },
  {
    question: 'Found a grant you want to pursue?',
    title: 'Turn your work into a clear proposal',
    copy: 'I’ll help shape your program knowledge, outcomes, budget, and community impact into a proposal funders can understand and trust.',
    tags: ['Narrative', 'Budget alignment', 'Submission support'],
  },
  {
    question: 'Tired of chasing deadlines?',
    title: 'Build systems your team can keep using',
    copy: 'I’ll create a manageable approach to grant calendars, reporting, compliance, and post-award follow-through.',
    tags: ['Grant calendar', 'Reporting', 'Compliance'],
  },
  {
    question: 'Ready to grow beyond one grant?',
    title: 'Strengthen your development strategy',
    copy: 'I bring grant, donor, campaign, and board experience together so funding becomes more stable and less reactive.',
    tags: ['Major gifts', 'Board support', 'Campaign planning'],
  },
]

const processSteps = [
  {
    number: '01',
    title: 'You tell me what’s going on',
    copy: 'Tell me what your organization does, where funding feels stuck, and what your team can realistically take on.',
  },
  {
    number: '02',
    title: 'I recommend a useful next step',
    copy: 'No oversized package. I’ll be honest about what I think will help, what can wait, and where your effort is best spent.',
  },
  {
    number: '03',
    title: 'I help you build what you need',
    copy: 'You stay connected to the work while I bring structure, funder perspective, and momentum to the process.',
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

const outcomes = [
  { value: '$2M+', label: 'new funding secured in one year' },
  { value: '59%', label: 'increase in overall funding' },
  { value: '$7.7M', label: 'capital campaign leadership' },
]

let observer
let contactObserver
let heroObserver
let handleScroll

onMounted(() => {
  const sections = document.querySelectorAll('main section[id]')
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) activeSection.value = visible.target.id
    },
    { rootMargin: '-25% 0px -60% 0px', threshold: [0.1, 0.4, 0.7] },
  )
  sections.forEach((section) => observer.observe(section))

  const contactSection = document.querySelector('#contact')
  contactObserver = new IntersectionObserver(
    ([entry]) => {
      contactVisible.value = entry.isIntersecting
    },
    { threshold: 0.05 },
  )
  if (contactSection) contactObserver.observe(contactSection)

  const heroSection = document.querySelector('#home')
  heroObserver = new IntersectionObserver(
    ([entry]) => {
      heroVisible.value = entry.isIntersecting
    },
    { threshold: 0.08 },
  )
  if (heroSection) heroObserver.observe(heroSection)

  handleScroll = () => {
    scrolled.value = window.scrollY > 20
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  contactObserver?.disconnect()
  heroObserver?.disconnect()
  window.removeEventListener('scroll', handleScroll)
})

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <div class="site-shell">
    <header class="site-header" :class="{ 'is-scrolled': scrolled }">
      <a class="brand" href="#home" aria-label="Rebbecca Kyles home" @click="closeMenu">
        <span class="brand-mark">RK</span>
        <span class="brand-copy">
          <strong>Rebbecca Kyles</strong>
          <small>Grant writing & nonprofit development</small>
        </span>
      </a>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <a v-for="item in navItems.slice(1)" :key="item.href" :href="item.href">
          {{ item.label }}
        </a>
      </nav>

      <a class="button button-dark header-cta" href="#contact">
        Tell me what’s going on
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
          <p class="eyebrow eyebrow-pill">Grant help for small and growing nonprofits</p>
          <h1>Your work matters. <em>I help funders see why.</em></h1>
          <p class="hero-lede">
            I help grassroots and growing nonprofits navigate grants, tell their story
            clearly, and approach larger funding opportunities with confidence.
          </p>
          <div class="hero-actions">
            <a class="button button-coral" href="#contact">
              Tell me about your nonprofit
              <ArrowIcon />
            </a>
            <a class="text-link" href="#services">See how I can help <ArrowIcon /></a>
          </div>
          <div class="hero-reassurance">
            <CheckIcon />
            <p>
              You do not need a development department, polished grant materials,
              or years of fundraising experience to start.
            </p>
          </div>
        </div>

        <figure class="hero-art">
          <img
            src="/bridge-community-funding.webp"
            alt="An illustrated bridge connecting a neighborhood community center with a welcoming funding institution"
          />
          <figcaption>
            <span class="caption-kicker">The bridge between</span>
            <strong>the work your community knows</strong>
            <span>and the story funders need to understand.</span>
          </figcaption>
          <div class="direct-badge">
            <span class="direct-initials">RK</span>
            <p><strong>You work directly with me.</strong> No agency handoff.</p>
          </div>
        </figure>
      </section>

      <section class="welcome-strip" aria-label="How Rebbecca works">
        <span>Plain-language guidance</span>
        <i />
        <span>Support scaled to your capacity</span>
        <i />
        <span>No grant experience required</span>
      </section>

      <section class="familiar section">
        <div class="section-heading centered-heading">
          <p class="eyebrow">If funding feels out of reach</p>
          <h2>You may be doing strong work with a very small team.</h2>
          <p>
            Grant writing can make capable organizations feel unprepared. That does
            not mean you are behind. It usually means you need a clear next step.
          </p>
        </div>

        <div class="familiar-grid">
          <article v-for="moment in familiarMoments" :key="moment.label">
            <span>{{ moment.label }}</span>
            <h3>{{ moment.title }}</h3>
          </article>
        </div>

        <p class="reassurance-note">
          I’ll meet you where you are, explain what funders are asking for,
          and help you move forward without pretending your organization has unlimited time or staff.
        </p>
      </section>

      <section class="bridge-story section">
        <div class="bridge-story-copy">
          <p class="eyebrow">I know both sides of the bridge</p>
          <h2>Community work and institutional funding should not feel worlds apart.</h2>
          <p>
            I began my career in shelters and crisis programs, working directly
            alongside people in vulnerable moments. Later, I led development teams,
            managed government grants, supported multimillion-dollar budgets, and
            built relationships with major donors and foundations.
          </p>
          <p>
            That means I understand the work as well as the funding systems around it.
            My role is to translate between the two without losing the heart of your mission.
          </p>
        </div>

        <div class="translation-card">
          <div>
            <span>Your organization knows</span>
            <strong>The people, the need, and what actually works.</strong>
          </div>
          <div class="translation-bridge" aria-hidden="true">
            <span />
            <small>I help connect the two</small>
          </div>
          <div>
            <span>Funders need to see</span>
            <strong>A clear plan, credible outcomes, and responsible stewardship.</strong>
          </div>
        </div>
      </section>

      <section id="services" class="services section">
        <div class="section-heading">
          <p class="eyebrow">How I can help</p>
          <h2>Start with the problem in front of you.</h2>
          <p>
            You do not need to know which service to request. Find the situation
            that sounds familiar, and I can help identify the next step.
          </p>
        </div>

        <div class="service-list">
          <article v-for="service in services" :key="service.question" class="service-card">
            <p class="service-question">{{ service.question }}</p>
            <h3>{{ service.title }}</h3>
            <p>{{ service.copy }}</p>
            <div class="service-tags">
              <span v-for="tag in service.tags" :key="tag">{{ tag }}</span>
            </div>
          </article>
        </div>
      </section>

      <section class="process section">
        <div class="section-heading">
          <p class="eyebrow">A low-pressure process</p>
          <h2>First, you tell me what’s going on. Then I’ll tell you what I think will help.</h2>
          <p>
            Good support should make the work feel clearer, not add another layer of complexity.
          </p>
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

      <section id="readiness" class="readiness section">
        <div class="readiness-copy">
          <p class="eyebrow">Not sure if you’re ready?</p>
          <h2>Take a quick, no-pressure readiness check.</h2>
          <p>
            Four questions can help identify whether your next step is pursuing
            opportunities or strengthening the foundation first.
          </p>
          <p class="readiness-note">
            There is no failing result. Knowing what needs attention is useful progress.
          </p>
        </div>
        <ReadinessQuiz />
      </section>

      <section id="about" class="about section">
        <div class="about-letter">
          <span class="letter-label">A note from me</span>
          <p class="letter-greeting">Hi, I’m Rebbecca.</p>
          <blockquote>
            “I believe smaller nonprofits deserve access to the same funding knowledge
            and opportunities as organizations with large development departments.”
          </blockquote>
          <p class="signature">Rebbecca</p>
        </div>

        <div class="about-copy">
          <p class="eyebrow">Experience without the intimidation</p>
          <h2>I’ve sat beside clients, led nonprofit teams, and answered to funders.</h2>
          <p class="large-copy">
            For more than 18 years, I have worked across direct service, grant compliance,
            fundraising, executive leadership, donor strategy, and organizational growth.
          </p>
          <p>
            I know what it is like when the mission is urgent, the staff is stretched,
            and the funding language does not sound like the real work. I also know how
            government agencies, foundations, corporate partners, and major donors make decisions.
          </p>
          <p>
            I use that experience to help smaller organizations compete with clarity and
            confidence, while staying honest about their capacity and close to their community.
          </p>
          <a class="text-link" href="https://www.linkedin.com/in/beckykyles/" target="_blank" rel="noreferrer">
            See my experience on LinkedIn <ArrowIcon />
          </a>
        </div>
      </section>

      <section class="proof section">
        <div class="proof-intro">
          <p class="eyebrow">Big-system experience, brought to smaller teams</p>
          <h2>I know what strong funding infrastructure looks like.</h2>
          <p>
            These results are not here to make your organization feel small.
            They show the level of experience I bring to your next decision.
          </p>
        </div>
        <div class="outcome-grid">
          <article v-for="outcome in outcomes" :key="outcome.value">
            <strong>{{ outcome.value }}</strong>
            <span>{{ outcome.label }}</span>
          </article>
        </div>
      </section>

      <section class="partners section">
        <div class="section-heading">
          <p class="eyebrow">Organizations I’ve served</p>
          <h2>Work grounded in community-based missions.</h2>
          <p>
            My experience includes survivor services, homelessness, foster youth,
            recovery, healthcare, and community development.
          </p>
        </div>
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
      </section>

      <section id="contact" class="contact section">
        <div class="contact-copy">
          <p class="eyebrow">Tell me what’s going on</p>
          <h2>You do not need to have the right words yet.</h2>
          <p>
            Tell me about your nonprofit, the funding challenge in front of you,
            and what would feel different if you had the right support.
          </p>
          <ul>
            <li><CheckIcon /> No pressure to choose a package</li>
            <li><CheckIcon /> No grant jargon required</li>
            <li><CheckIcon /> A practical response from me</li>
          </ul>
          <div class="contact-direct">
            <span>Prefer email?</span>
            <a href="mailto:RebbeccaKyles@gmail.com">RebbeccaKyles@gmail.com</a>
          </div>
        </div>
        <div class="form-wrap">
          <p class="form-intro">A few details will help me understand where to start.</p>
          <InquiryForm />
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <a class="brand footer-brand" href="#home">
        <span class="brand-mark">RK</span>
        <span class="brand-copy">
          <strong>Rebbecca Kyles</strong>
          <small>Grant writing & nonprofit development</small>
        </span>
      </a>
      <p>Bridging meaningful work and the funding to sustain it.</p>
      <div class="footer-links">
        <a href="#services">How I help</a>
        <a href="#about">About me</a>
        <a href="#contact">Let’s talk</a>
      </div>
      <small>© {{ new Date().getFullYear() }} Rebbecca Kyles</small>
    </footer>

    <a v-if="!heroVisible && !contactVisible" class="mobile-contact-bar" href="#contact">
      Tell me about your nonprofit
      <ArrowIcon />
    </a>
  </div>
</template>
