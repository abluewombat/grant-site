<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ArrowIcon from './components/ArrowIcon.vue'
import CheckIcon from './components/CheckIcon.vue'
import InquiryForm from './components/InquiryForm.vue'
import ReadinessQuiz from './components/ReadinessQuiz.vue'
import SparkIcon from './components/SparkIcon.vue'

const menuOpen = ref(false)
const activeSection = ref('home')
const scrolled = ref(false)

const navItems = [
  { label: 'Home', href: '#home', icon: 'home' },
  { label: 'Services', href: '#services', icon: 'grid' },
  { label: 'About', href: '#about', icon: 'person' },
  { label: 'Contact', href: '#contact', icon: 'mail' },
]

const services = [
  {
    number: '01',
    title: 'Grant strategy & research',
    copy: 'Build a practical funding roadmap around the opportunities most aligned with your mission, capacity, and timing.',
    tags: ['Prospect research', 'Grant calendars', 'Readiness reviews'],
  },
  {
    number: '02',
    title: 'Proposal development',
    copy: 'Turn program expertise into clear, funder-ready narratives, budgets, attachments, and submission packages.',
    tags: ['Government', 'Foundation', 'Corporate'],
  },
  {
    number: '03',
    title: 'Systems & compliance',
    copy: 'Create reliable workflows for deadlines, reporting, post-award documentation, and audit-ready grant management.',
    tags: ['Reporting', 'Workflows', 'Post-award support'],
  },
  {
    number: '04',
    title: 'Development counsel',
    copy: 'Strengthen donor strategy, board engagement, stewardship, and campaign planning with an experienced partner.',
    tags: ['Major gifts', 'Campaigns', 'Board partnership'],
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
  { value: '$2M+', label: 'New funding secured in one year' },
  { value: '59%', label: 'Increase in overall funding' },
  { value: '$7.7M', label: 'Capital campaign led' },
]

let observer

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

  const handleScroll = () => {
    scrolled.value = window.scrollY > 24
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll))
})

onBeforeUnmount(() => observer?.disconnect())

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <div class="site-shell">
    <header class="site-header" :class="{ 'is-scrolled': scrolled }">
      <a class="brand" href="#home" aria-label="Kyles Grant Studio home" @click="closeMenu">
        <span class="brand-mark">K</span>
        <span class="brand-copy">
          <strong>Kyles</strong>
          <small>Grant Studio</small>
        </span>
      </a>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <a v-for="item in navItems.slice(1)" :key="item.href" :href="item.href">
          {{ item.label }}
        </a>
      </nav>

      <a class="button button-dark header-cta" href="#contact">
        Start a project
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

      <div
        v-if="menuOpen"
        class="mobile-menu"
        :class="{ 'is-open': menuOpen }"
      >
        <a v-for="item in navItems" :key="item.href" :href="item.href" @click="closeMenu">
          {{ item.label }}
        </a>
      </div>
    </header>

    <main>
      <section id="home" class="hero section">
        <div class="hero-orbit orbit-one" />
        <div class="hero-orbit orbit-two" />
        <div class="hero-copy">
          <p class="eyebrow eyebrow-pill"><SparkIcon /> Grant strategy for meaningful work</p>
          <h1>
            Your mission deserves
            <em>funding that lasts.</em>
          </h1>
          <p class="hero-lede">
            Kyles Grant Studio helps nonprofits turn powerful work into clear strategy,
            compelling proposals, and trusted funder relationships.
          </p>
          <div class="hero-actions">
            <a class="button button-coral" href="#contact">
              Tell me what you're building
              <ArrowIcon />
            </a>
            <a class="text-link" href="#services">Explore services <ArrowIcon /></a>
          </div>
          <div class="hero-proof">
            <div class="avatar-stack" aria-hidden="true">
              <span>RK</span><span>18+</span><span>$</span>
            </div>
            <p><strong>18+ years</strong> helping mission-driven organizations grow.</p>
          </div>
        </div>

        <div class="hero-visual" aria-label="Grant strategy overview">
          <div class="hero-card main-card">
            <div class="card-topline">
              <span>Funding roadmap</span>
              <span class="status-dot">In progress</span>
            </div>
            <div class="roadmap-graphic">
              <span class="roadmap-line" />
              <div class="roadmap-point is-complete"><CheckIcon /><small>Discover</small></div>
              <div class="roadmap-point is-complete"><CheckIcon /><small>Align</small></div>
              <div class="roadmap-point is-active"><span>3</span><small>Develop</small></div>
              <div class="roadmap-point"><span>4</span><small>Steward</small></div>
            </div>
            <div class="funding-match">
              <div>
                <small>Strongest opportunity</small>
                <strong>Community impact grant</strong>
              </div>
              <span>94% match</span>
            </div>
          </div>

          <div class="float-card float-card-top">
            <span class="mini-icon"><SparkIcon /></span>
            <div><strong>Story + strategy</strong><small>Built to reinforce each other</small></div>
          </div>
          <div class="float-card float-card-bottom">
            <strong>$2M+</strong>
            <span>new funding secured in one year</span>
          </div>
        </div>
      </section>

      <section class="trust-strip" aria-label="Core strengths">
        <span>Grant writing</span>
        <i />
        <span>Funder research</span>
        <i />
        <span>Compliance</span>
        <i />
        <span>Major gifts</span>
        <i />
        <span>Campaign strategy</span>
      </section>

      <section id="services" class="services section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Ways to work together</p>
            <h2>Good funding work starts <em>before</em> the application.</h2>
          </div>
          <p>
            From first funder list to final report, every engagement is designed to leave
            your organization clearer, stronger, and more sustainable.
          </p>
        </div>

        <div class="service-grid">
          <article v-for="service in services" :key="service.number" class="service-card">
            <div class="service-number">{{ service.number }}</div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.copy }}</p>
            <div class="service-tags">
              <span v-for="tag in service.tags" :key="tag">{{ tag }}</span>
            </div>
          </article>
        </div>
      </section>

      <section id="approach" class="approach section">
        <div class="approach-copy">
          <p class="eyebrow">A grounded approach</p>
          <h2>Clarity for your team. Confidence for your funders.</h2>
          <p class="approach-lede">
            The strongest applications are an honest reflection of strong programs.
            We work across the full picture: mission, outcomes, finances, people, and proof.
          </p>
          <ul class="check-list">
            <li><CheckIcon /><span><strong>Listen first.</strong> Understand the work before shaping the pitch.</span></li>
            <li><CheckIcon /><span><strong>Build together.</strong> Keep your team close to the strategy and story.</span></li>
            <li><CheckIcon /><span><strong>Leave capacity behind.</strong> Create tools and systems your organization can keep using.</span></li>
          </ul>
        </div>
        <ReadinessQuiz />
      </section>

      <section class="impact section">
        <div class="impact-intro">
          <p class="eyebrow">Experience that translates</p>
          <h2>Strategy backed by the realities of nonprofit leadership.</h2>
        </div>
        <div class="outcome-grid">
          <article v-for="outcome in outcomes" :key="outcome.value">
            <strong>{{ outcome.value }}</strong>
            <span>{{ outcome.label }}</span>
          </article>
        </div>
        <blockquote>
          <SparkIcon />
          <p>
            “Behind every gift is a story, a value, and a hope for the world.
            My work is to honor those stories and connect them to a mission that matters.”
          </p>
          <footer>Rebbecca Kyles, Founder</footer>
        </blockquote>
      </section>

      <section id="partners" class="partners section">
        <div class="section-heading partners-heading">
          <div>
            <p class="eyebrow">Partners served</p>
            <h2>Rooted in community. Trusted across missions.</h2>
          </div>
          <p>
            Experience spans survivor services, homelessness, foster youth,
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

      <section id="about" class="about section">
        <div class="about-portrait" aria-label="Rebbecca Kyles">
          <div class="portrait-initials">RK</div>
          <div class="portrait-note">
            <span>Nonprofit leader</span>
            <strong>Fundraiser. Strategist. Partner.</strong>
          </div>
        </div>
        <div class="about-copy">
          <p class="eyebrow">Meet Rebbecca</p>
          <h2>Fundraising that begins with dignity and ends with possibility.</h2>
          <p class="large-copy">
            Rebbecca Kyles is a nonprofit development leader and grant consultant
            with more than 18 years of experience helping organizations translate
            urgent missions into sustainable support.
          </p>
          <p>
            Her career began in shelters and crisis programs, alongside children and
            families in vulnerable moments. That experience still shapes her approach:
            fundraising is not a transaction, but a relationship built through listening,
            trust, stewardship, and a clear invitation to make change possible.
          </p>
          <p>
            She has led development for an $8 million human services organization,
            helped secure more than $2 million in new funding in one year, guided a
            $7.7 million capital campaign, and served as an interim executive director.
          </p>
          <a class="text-link" href="https://www.linkedin.com/in/beckykyles/" target="_blank" rel="noreferrer">
            Connect on LinkedIn <ArrowIcon />
          </a>
        </div>
      </section>

      <section id="contact" class="contact section">
        <div class="contact-copy">
          <p class="eyebrow">Start a conversation</p>
          <h2>What could stronger funding make possible?</h2>
          <p>
            Share where your organization is headed, what is getting in the way,
            and what kind of support would feel most useful.
          </p>
          <div class="contact-direct">
            <span>Prefer email?</span>
            <a href="mailto:RebbeccaKyles@gmail.com">RebbeccaKyles@gmail.com</a>
          </div>
        </div>
        <InquiryForm />
      </section>
    </main>

    <footer class="site-footer">
      <a class="brand footer-brand" href="#home">
        <span class="brand-mark">K</span>
        <span class="brand-copy"><strong>Kyles</strong><small>Grant Studio</small></span>
      </a>
      <p>Thoughtful strategy for organizations doing necessary work.</p>
      <div class="footer-links">
        <a href="#services">Services</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>
      <small>© {{ new Date().getFullYear() }} Kyles Grant Studio</small>
    </footer>

    <nav class="mobile-dock" aria-label="Mobile navigation">
      <a
        v-for="item in navItems"
        :key="item.href"
        :href="item.href"
        :class="{ active: activeSection === item.href.slice(1) }"
      >
        <svg v-if="item.icon === 'home'" viewBox="0 0 24 24"><path d="m4 11 8-7 8 7v9h-6v-6h-4v6H4Z" /></svg>
        <svg v-else-if="item.icon === 'grid'" viewBox="0 0 24 24"><path d="M4 4h6v6H4Zm10 0h6v6h-6ZM4 14h6v6H4Zm10 0h6v6h-6Z" /></svg>
        <svg v-else-if="item.icon === 'person'" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M5 21c.7-4.5 3-7 7-7s6.3 2.5 7 7" /></svg>
        <svg v-else viewBox="0 0 24 24"><path d="M3 5h18v14H3Z" /><path d="m4 6 8 7 8-7" /></svg>
        <span>{{ item.label }}</span>
      </a>
    </nav>
  </div>
</template>
