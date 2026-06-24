import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import ValorantFormModal from './ValorantFormModal'
import VolunteerFormModal from './VolunteerFormModal'
import './index.css'

/* ===== Animation Variants ===== */
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
}

const slideLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
}

const slideRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
}

/* ===== Countdown Hook ===== */
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const target = new Date(targetDate)
      const diff = target - now
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [targetDate])
  
  return timeLeft
}

/* ===== Navbar ===== */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const links = [
    { label: 'Tournaments', href: '#tournaments' },
    { label: 'Activities', href: '#activities' },
    { label: 'Venue', href: '#venue' },
    { label: 'Cosplay', href: '#cosplay' },
  ]
  
  return (
    <>
      <motion.nav 
        className="navbar" 
        initial={{ y: -100 }} 
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ 
          boxShadow: scrolled ? '0 4px 30px rgba(125, 57, 235, 0.3)' : 'none',
        }}
      >
        <img src="/images/logo.png" alt="PRESS START" className="navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        
        <ul className="navbar-links">
          {links.map(link => (
            <li key={link.href}><a href={link.href}>{link.label}</a></li>
          ))}
          <li><a href="#register" className="navbar-cta">Register Now</a></li>
        </ul>
        
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </motion.nav>
      
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>×</button>
            {links.map(link => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
            ))}
            <a href="#register" onClick={() => setMenuOpen(false)} style={{ color: '#C6FF33' }}>Register Now</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ===== Marquee Strip ===== */
function MarqueeStrip({ items, variant = 'lime' }) {
  const doubled = [...items, ...items]
  return (
    <div className={`marquee-strip marquee-strip-${variant}`}>
      <div className="marquee-content">
        {doubled.map((item, i) => (
          <span key={i}>
            {item} <span className="sep">//</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ===== Hero Section ===== */
function HeroSection() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, 200])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <section className="hero" id="hero">
      <div className="hero-bg-pattern" />
      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />
      <div className="hero-glow hero-glow-3" />
      
      {/* Floating geometric shapes */}
      <motion.div 
        className="floating-sticker floating-shape" 
        style={{ top: '15%', left: '8%' }}
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><polygon points="24,4 44,44 4,44" stroke="#C6FF33" strokeWidth="3" fill="none"/></svg>
      </motion.div>
      
      <motion.div 
        className="floating-sticker floating-shape" 
        style={{ top: '20%', right: '10%' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" stroke="#7D39EB" strokeWidth="3" fill="none" transform="rotate(45 20 20)"/></svg>
      </motion.div>
      
      <motion.div 
        className="floating-sticker floating-shape" 
        style={{ bottom: '25%', left: '5%' }}
        animate={{ y: [0, 15, 0], x: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="14" stroke="#C6FF33" strokeWidth="3" fill="none"/></svg>
      </motion.div>
      
      <motion.div 
        className="floating-sticker floating-shape" 
        style={{ bottom: '20%', right: '8%' }}
        animate={{ y: [0, -12, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><line x1="4" y1="16" x2="28" y2="16" stroke="#7D39EB" strokeWidth="3"/><line x1="16" y1="4" x2="16" y2="28" stroke="#7D39EB" strokeWidth="3"/></svg>
      </motion.div>
      
      <motion.div 
        className="floating-sticker floating-shape" 
        style={{ top: '40%', right: '15%' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><polygon points="14,2 17,11 27,11 19,17 22,26 14,21 6,26 9,17 1,11 11,11" stroke="#C6FF33" strokeWidth="2" fill="none"/></svg>
      </motion.div>

      <motion.div 
        className="hero-content" 
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="hero-badge">The Biggest Gaming Festival in Guwahati</span>
        </motion.div>
        
        <motion.img 
          src="/images/logo.png" 
          alt="PRESS START" 
          className="hero-logo"
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        />
        
        <motion.h1 
          className="hero-tagline"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <span className="highlight-lime">Game On.</span>{' '}
          <span className="highlight-purple">Level Up.</span>
        </motion.h1>
        
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          Tournaments · Free Activities · Cosplay · Live Streaming · Prizes & Giveaways
        </motion.p>
        
        <div className="hero-venue">
          City Center Mall, Guwahati
        </div>
        

      </motion.div>
    </section>
  )
}

/* ===== Stats Bar ===== */
function StatsBar() {
  const stats = [
    { number: '₹50K+', label: 'Prize Pool' },
    { number: '2', label: 'Major Tournaments' },
    { number: '5+', label: 'Free Activities' },
    { number: '1', label: 'Epic Day' },
  ]
  
  return (
    <div className="stats-bar">
      <motion.div 
        className="stats-inner"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
      >
        {stats.map((stat, i) => (
          <motion.div key={i} className="stat-item" variants={scaleIn}>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ===== Tournaments Section ===== */
function TournamentsSection() {
  return (
    <section className="tournaments section-padding" id="tournaments">
      <motion.div 
        className="section-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <span className="section-tag">Compete & Conquer</span>
        <h2 className="section-title">
          Main <span style={{ color: 'var(--violet)' }}>Tournaments</span>
        </h2>
        <p className="section-desc">
          Battle your way to the top in our premier esports tournaments. Online qualifiers, offline finals, live crowd — this is real competitive gaming.
        </p>
      </motion.div>
      
      <motion.div 
        className="tournaments-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        {/* Valorant Card */}
        <motion.div className="tournament-card" variants={fadeUp}>
          <div className="tournament-card-header valorant-header">
            <div className="tournament-game" style={{ color: '#ff4655' }}>Valorant</div>
            <div className="tournament-type">5v5 Championship</div>
          </div>
          <div className="tournament-card-body">
            <div className="tournament-detail">
              <span className="tournament-detail-icon">—</span>
              <div className="tournament-detail-text">
                <strong>Online Qualifiers</strong>
                Teams compete online to earn their spot in the semifinals
              </div>
            </div>
            <div className="tournament-detail">
              <span className="tournament-detail-icon">—</span>
              <div className="tournament-detail-text">
                <strong>Offline Semi-Finals & Grand Finals</strong>
                Top teams battle it out live at City Center Mall
              </div>
            </div>
            <div className="tournament-detail">
              <span className="tournament-detail-icon">—</span>
              <div className="tournament-detail-text">
                <strong>Prize Pool + Trophies</strong>
                Cash prizes, trophies, and bragging rights for the champions
              </div>
            </div>
            <div className="tournament-detail">
              <span className="tournament-detail-icon">—</span>
              <div className="tournament-detail-text">
                <strong>Live on Twitch</strong>
                Commentary, replays, and crowd reactions streamed live
              </div>
            </div>
          </div>
          <div className="tournament-card-footer">
            <span className="btn btn-valorant" style={{ opacity: 0.5, cursor: 'not-allowed' }}>Coming Soon</span>
          </div>
        </motion.div>
        
        {/* FC 26 Card */}
        <motion.div className="tournament-card" variants={fadeUp}>
          <div className="tournament-card-header fc-header">
            <div className="tournament-game">EA Sports FC 26</div>
            <div className="tournament-type">PS5 Tournament</div>
          </div>
          <div className="tournament-card-body">
            <div className="tournament-detail">
              <span className="tournament-detail-icon">—</span>
              <div className="tournament-detail-text">
                <strong>Play on PS5</strong>
                Experience FC 26 on next-gen hardware at the venue
              </div>
            </div>
            <div className="tournament-detail">
              <span className="tournament-detail-icon">—</span>
              <div className="tournament-detail-text">
                <strong>1v1 Knockout Format</strong>
                Single elimination — every match matters
              </div>
            </div>
            <div className="tournament-detail">
              <span className="tournament-detail-icon">—</span>
              <div className="tournament-detail-text">
                <strong>Prizes & Rewards</strong>
                Win prizes and exclusive merchandise
              </div>
            </div>
            <div className="tournament-detail">
              <span className="tournament-detail-icon">—</span>
              <div className="tournament-detail-text">
                <strong>Live Crowd Experience</strong>
                Play in front of a cheering audience
              </div>
            </div>
          </div>
          <div className="tournament-card-footer">
            <span className="btn btn-secondary" style={{ opacity: 0.5, cursor: 'not-allowed' }}>Coming Soon</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ===== Activities Section ===== */
function ActivitiesSection() {
  const activities = [
    { name: 'Spin The Wheel', desc: 'Test your luck! Spin and win exciting prizes, merch, and surprises.', free: true },
    { name: 'Score A Goal', desc: 'Show off your football skills and score to win rewards.', free: true },
    { name: 'Press Stop Challenge', desc: 'Can you stop the timer at exactly 10.00 seconds? Precision wins prizes!', free: true },
    { name: 'Photo Booth', desc: 'Strike a pose with gaming props, neon lights, and share your moments.', free: true },
    { name: 'Gaming Quizzes', desc: 'Prove your gaming knowledge and win rewards for top scores.', free: true },
    { name: 'Surprise Giveaways', desc: 'Random drops throughout the day — stay alert for free goodies!', free: true },
  ]
  
  return (
    <section className="activities section-padding" id="activities">
      <motion.div 
        className="section-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <span className="section-tag">Fun For Everyone</span>
        <h2 className="section-title">
          Free Mini Activities<br />& Prize Challenges
        </h2>
        <p className="section-desc">
          Not competing? No problem! Enjoy tons of free activities, win prizes, and have the time of your life.
        </p>
        <motion.div 
          className="free-badge"
          animate={{ rotate: [3, -2, 3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          100% Free Entry — No Tickets Needed!
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="activities-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
      >
        {activities.map((act, i) => (
          <motion.div 
            key={i} 
            className="activity-card" 
            variants={scaleIn}
            whileHover={{ scale: 1.03 }}
          >
            {act.free && <div className="activity-free-tag">Free</div>}
            <div className="activity-number">{String(i + 1).padStart(2, '0')}</div>
            <h3 className="activity-name">{act.name}</h3>
            <p className="activity-desc">{act.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ===== Live Experience Section ===== */
function LiveExperienceSection() {
  const experiences = [
    {
      title: 'Live Twitch Stream',
      text: 'Every match, every play, streamed live on Twitch with professional commentary, instant replays, and crowd reaction cams. Watch the hype unfold in real-time.'
    },
    {
      title: 'Commentary & Casting',
      text: 'Professional shoutcasters bringing the energy, breaking down plays, and keeping the crowd hyped throughout every tournament match.'
    },
    {
      title: 'Community Meetup',
      text: 'Connect with fellow gamers, content creators, and esports enthusiasts. This is where the gaming community of the Northeast comes together.'
    },
    {
      title: 'Music & Atmosphere',
      text: 'Gaming soundtracks, hype music, and an electric atmosphere that makes you feel like you\'re at a major esports arena.'
    }
  ]
  
  return (
    <section className="live-experience section-padding">
      <motion.div 
        className="section-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <span className="section-tag">Live Experience</span>
        <h2 className="section-title">
          More Than Just <span style={{ color: 'var(--violet)' }}>Tournaments</span>
        </h2>
        <p className="section-desc">
          PRESS START is a full-scale gaming experience. Live streaming, community, music, and unforgettable moments.
        </p>
      </motion.div>
      
      <motion.div 
        className="experience-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {experiences.map((exp, i) => (
          <motion.div key={i} className="experience-card" variants={fadeUp}>
            <div className="experience-number">{String(i + 1).padStart(2, '0')}</div>
            <h3 className="experience-title">{exp.title}</h3>
            <p className="experience-text">{exp.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ===== Venue Section ===== */
function VenueSection() {
  return (
    <section className="venue section-padding" id="venue">
      <div className="venue-inner">
        <motion.div 
          className="venue-text"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideLeft}
        >
          <div className="section-header" style={{ textAlign: 'left' }}>
            <span className="section-tag">Location Reveal</span>
            <div className="venue-detail-title">Location</div>
            <h2 className="section-title" style={{ textAlign: 'left' }}>
              City Center Mall<br />
              <span style={{ color: 'var(--lime)' }}>Guwahati</span>
            </h2>
          </div>
          
          <div className="venue-details">
            <div className="venue-detail-item">
              <span className="v-icon">›</span>
              <div>
                <span>Premium Venue</span>
                <p>One of the biggest malls in Guwahati — the perfect arena for gaming</p>
              </div>
            </div>
            <div className="venue-detail-item">
              <span className="v-icon">›</span>
              <div>
                <span>Easy Access & Parking</span>
                <p>Central location with ample parking and public transport connectivity</p>
              </div>
            </div>
            <div className="venue-detail-item">
              <span className="v-icon">›</span>
              <div>
                <span>Air-Conditioned Arena</span>
                <p>Beat the heat and game in comfort all day long</p>
              </div>
            </div>
            <div className="venue-detail-item">
              <span className="v-icon">›</span>
              <div>
                <span>Food & Beverages</span>
                <p>Food court and refreshments available at the mall</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="venue-image-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideRight}
        >
          <div className="venue-image-wrapper">
            <img src="/images/location-reveal.jpg" alt="City Center Mall - PRESS START Venue" className="venue-image" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ===== Cosplay Section ===== */
function CosplaySection() {
  return (
    <section className="cosplay section-padding" id="cosplay">
      <div className="cosplay-content">
        <motion.div 
          className="cosplay-info"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideLeft}
        >
          <div className="section-header">
            <span className="section-tag">Cosplay & Community</span>
            <h2 className="section-title">
              Dress Up.<br /><span style={{ color: 'var(--lime)' }}>Show Up. Stand Out.</span>
            </h2>
          </div>
          <p style={{ color: 'rgba(0,0,0,0.8)', lineHeight: 1.7, marginBottom: '1rem', fontWeight: 500 }}>
            Cosplayers bring the magic of gaming to life! Whether you're in full costume or just love the aesthetic, 
            the cosplay zone is where creativity meets community.
          </p>
          <ul className="cosplay-features">
            <li><span className="cosplay-bullet">→</span> <div><strong>Cosplay Appearances</strong> — Show off your best gaming character costumes</div></li>
            <li><span className="cosplay-bullet">→</span> <div><strong>Photo Opportunities</strong> — Dedicated photo zones with lighting and backdrops</div></li>
            <li><span className="cosplay-bullet">→</span> <div><strong>Community Interaction</strong> — Meet fellow fans, exchange ideas, and make memories</div></li>
            <li><span className="cosplay-bullet">→</span> <div><strong>Best Cosplay Recognition</strong> — Get featured on our social media and Twitch stream</div></li>
          </ul>
        </motion.div>
        
        <motion.div 
          className="cosplay-visual"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideRight}
        >
          <div className="cosplay-grid-preview">
            <motion.div className="cosplay-box" whileHover={{ rotate: 0, scale: 1.08 }}>
              <span className="cosplay-box-label">PLAY</span>
            </motion.div>
            <motion.div className="cosplay-box" whileHover={{ rotate: 0, scale: 1.08 }}>
              <span className="cosplay-box-label">COSPLAY</span>
            </motion.div>
            <motion.div className="cosplay-box" whileHover={{ rotate: 0, scale: 1.08 }}>
              <span className="cosplay-box-label">COMPETE</span>
            </motion.div>
            <motion.div className="cosplay-box" whileHover={{ rotate: 0, scale: 1.08 }}>
              <span className="cosplay-box-label">WIN</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ===== Registration Section ===== */
function RegistrationSection({ onRegister }) {
  const cards = [
    {
      key: 'valorant',
      type: 'card-valorant',
      accent: 'accent-red',
      title: 'Valorant 5v5 Championship',
      desc: 'Form your squad of 5, dominate the online qualifiers, and battle it out live on stage at City Center Mall. Are you ready to prove your team is the best?',
      features: [
        '5v5 team format',
        'Online qualifiers → Offline finals',
        'Cash prizes + trophies',
        'Live streamed on Twitch',
        'Professional casting & commentary',
      ],
      btnClass: 'btn-valorant',
      btnText: 'Coming Soon',
      disabled: true,
    },
    {
      key: 'fc26',
      type: 'card-fc',
      accent: 'accent-purple',
      title: 'FC 26 Registration',
      desc: 'Step up to the PS5 controller and show everyone why you\'re the best virtual footballer. 1v1 knockout format — no second chances.',
      features: [
        '1v1 on PS5',
        'Single elimination bracket',
        'Play at City Center Mall',
        'Prizes for top players',
        'Live crowd atmosphere',
      ],
      btnClass: 'btn-secondary',
      btnText: 'Coming Soon',
      disabled: true,
    },
    {
      key: 'volunteer',
      type: 'card-volunteer',
      accent: 'accent-lime',
      title: 'Volunteer Application',
      desc: 'Be part of the team that makes PRESS START happen! Help run tournaments, manage activities, assist with streaming, and create an unforgettable experience.',
      features: [
        'Behind-the-scenes access',
        'PRESS START volunteer badge',
        'Free merch & refreshments',
        'Networking with organizers',
        'Certificate of participation',
      ],
      btnClass: 'btn-primary',
      btnText: 'Apply to Volunteer',
      disabled: false,
    }
  ]
  
  return (
    <section className="registration section-padding" id="register">
      <motion.div 
        className="section-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <span className="section-tag">Join The Action</span>
        <h2 className="section-title glitch" data-text="Register Now">
          Register <span style={{ color: 'var(--lime)' }}>Now</span>
        </h2>
        <p className="section-desc">
          Whether you're a competitor, a casual gamer, or someone who wants to help — there's a spot for you at PRESS START.
        </p>
      </motion.div>
      
      <motion.div 
        className="reg-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {cards.map((card, i) => (
          <motion.div 
            key={i} 
            className={`reg-card ${card.type}`} 
            variants={fadeUp}
            whileHover={{ y: -8 }}
          >
            <div className={`reg-card-accent ${card.accent}`} />
            <div className="reg-card-content">
              <h3 className="reg-title">{card.title}</h3>
              <p className="reg-desc">{card.desc}</p>
              <ul className="reg-features">
                {card.features.map((feat, j) => (
                  <li key={j}><span className="check">+</span> {feat}</li>
                ))}
              </ul>
              <button 
                onClick={(e) => { e.preventDefault(); if (!card.disabled) onRegister(card.key); }} 
                className={`btn ${card.btnClass}${card.disabled ? ' btn-disabled' : ''}`}
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={card.disabled}
              >
                {card.btnText}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ===== Countdown Section ===== */
function CountdownSection() {
  // Set a target date ~30 days from now for demo
  const timeLeft = useCountdown('2026-07-13T10:00:00')
  
  return (
    <div className="countdown-banner">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="countdown-title">Event Starts In</div>
        <div className="countdown-grid">
          {[
            { value: timeLeft.days, label: 'Days' },
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Minutes' },
            { value: timeLeft.seconds, label: 'Seconds' },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              className="countdown-item"
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="countdown-number">{String(item.value).padStart(2, '0')}</div>
              <div className="countdown-label">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* ===== Footer ===== */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/images/logo.png" alt="PRESS START" className="footer-logo" />
          <p>
            The biggest gaming festival in Guwahati. Tournaments, free activities, cosplay, 
            live streaming, giveaways, and an unforgettable community experience.
          </p>
        </div>
        <div className="footer-col">
          <h4>Event</h4>
          <ul>
            <li><a href="#tournaments">Tournaments</a></li>
            <li><a href="#activities">Activities</a></li>
            <li><a href="#venue">Venue</a></li>
            <li><a href="#cosplay">Cosplay</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Register</h4>
          <ul>
            <li><a href="#register">Valorant</a></li>
            <li><a href="#register">FC 26</a></li>
            <li><a href="#register">Volunteer</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Connect</h4>
          <ul>
            <li><a href="https://www.twitch.tv/pressstartxo" target="_blank" rel="noopener noreferrer">Twitch</a></li>
            <li><a href="https://www.instagram.com/pressstartxo/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 PRESS START. All rights reserved.</p>
        <div className="footer-socials">
          <a href="https://www.twitch.tv/pressstartxo" target="_blank" rel="noopener noreferrer" aria-label="Twitch">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2H3v16h5v4l4-4h5l4-4V2z"/><path d="M11 11V7"/><path d="M16 11V7"/></svg>
          </a>
          <a href="https://www.instagram.com/pressstartxo/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ===== Registration Modal Component ===== */
function RegistrationModal({ game, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    teamName: '',
    teamMembers: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPrice = () => {
    if (game === 'valorant') return '₹500';
    if (game === 'fc26') return '₹100';
    return 'FREE';
  };

  const getTitle = () => {
    if (game === 'valorant') return 'Valorant Team Registration';
    if (game === 'fc26') return 'FC 26 Registration';
    return 'Volunteer Application';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{getTitle()}</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-game-info">
            <span className="modal-game-label">Entry Fee</span>
            <span className="modal-game-price">{getPrice()}</span>
          </div>
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                value={formData.name} 
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                value={formData.email} 
                onChange={handleChange}
                placeholder="your.email@gmail.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                required 
                value={formData.phone} 
                onChange={handleChange}
                placeholder="10-digit mobile number"
              />
            </div>

            {game === 'valorant' && (
              <>
                <div className="form-group">
                  <label htmlFor="teamName">Team Name</label>
                  <input 
                    type="text" 
                    id="teamName" 
                    name="teamName" 
                    required 
                    value={formData.teamName} 
                    onChange={handleChange}
                    placeholder="Enter your squad's name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="teamMembers">Team Members (Include IGNs, 1 per line)</label>
                  <textarea 
                    id="teamMembers" 
                    name="teamMembers" 
                    rows="4"
                    required 
                    value={formData.teamMembers} 
                    onChange={handleChange}
                    placeholder="Player 2 (IGN)&#10;Player 3 (IGN)&#10;Player 4 (IGN)&#10;Player 5 (IGN)"
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="btn btn-primary form-submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : game === 'volunteer' ? 'Submit Application' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ===== Main App ===== */
function App() {
  const [activeRegGame, setActiveRegGame] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'checking', 'SUCCESS', 'FAILED', null
  const [statusOrderId, setStatusOrderId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    if (orderId) {
      setPaymentStatus('checking');
      setStatusOrderId(orderId);
      
      const checkStatus = async () => {
        try {
          const res = await fetch(`/api/order-status/${orderId}`);
          const data = await res.json();
          if (data.status) {
            setPaymentStatus(data.status);
          } else {
            setPaymentStatus('FAILED');
          }
        } catch (e) {
          console.error(e);
          setPaymentStatus('FAILED');
        }
      };

      checkStatus();
    }
  }, []);

  const handleRegisterSubmit = async (formData) => {
    setIsSubmitting(true);

    // Volunteer — send directly to Google Sheets (no backend needed)
    if (activeRegGame === 'volunteer') {
      const vd = formData.volunteerData || {};
      const sheetData = {
        Timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        Name: formData.name || "",
        Email: formData.email || "",
        Phone: formData.phone || "",
        Age: vd.age || "",
        Gender: vd.gender || "",
        City: vd.city || "",
        Instagram: vd.instagram || "",
        "Available Full Duration": vd.availableFullDuration || "",
        "Available Briefing": vd.availableBriefing || "",
        "Volunteered Before": vd.volunteeredBefore || "",
        "Previous Events": vd.previousEvents || "",
        "Other Experiences": vd.otherExperiences || "",
        "Interested Roles": Array.isArray(vd.interestedRoles) ? vd.interestedRoles.join(", ") : "",
        "Why Volunteer": vd.whyVolunteer || "",
        "Emergency Contact": vd.emergencyContact || "",
        "Followed Instagram": vd.followedInstagram || "",
        "Followed Twitch": vd.followedTwitch || ""
      };

      try {
        await fetch("https://script.google.com/macros/s/AKfycbwsDmv7oMJec4C5Ro7lquoLwbdm7oGLyXbaT3FdIyyLO05tZSLaUyra-yg9q4E7Cai3/exec", {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sheetData)
        });
        setPaymentStatus('SUCCESS');
        setActiveRegGame(null);
      } catch (err) {
        console.error("Google Sheets error:", err);
        alert('Something went wrong submitting your application. Please try again.');
      }
      setIsSubmitting(false);
      return;
    }

    // Paid registrations — use backend
    try {
      const response = await fetch(`/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, game: activeRegGame })
      });
      const data = await response.json();
      
      if (data.free) {
        setPaymentStatus('SUCCESS');
        setIsSubmitting(false);
        setActiveRegGame(null);
        return;
      }

      if (data.order_id) {
        if (typeof window.Razorpay === 'undefined') {
          alert('Razorpay SDK failed to load. Please check your internet connection.');
          setIsSubmitting(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: "PRESS START",
          description: "Tournament Registration",
          order_id: data.order_id,
          handler: async function (response) {
            try {
              setPaymentStatus('checking');
              const verifyRes = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature
                })
              });
              const verifyData = await verifyRes.json();
              
              if (verifyData.success) {
                setPaymentStatus('SUCCESS');
                setStatusOrderId(data.order_id);
              } else {
                setPaymentStatus('FAILED');
                setStatusOrderId(data.order_id);
              }
              setActiveRegGame(null);
            } catch (err) {
              console.error("Verification error:", err);
              setPaymentStatus('FAILED');
              setStatusOrderId(data.order_id);
              setActiveRegGame(null);
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: "#6d28d9"
          },
          modal: {
            ondismiss: function() {
              setIsSubmitting(false);
            }
          }
        };
        
        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response){
          alert("Payment failed: " + response.error.description);
          setPaymentStatus('FAILED');
          setStatusOrderId(data.order_id);
          setActiveRegGame(null);
        });
        rzp1.open();
      } else {
        alert('Failed to initialize payment: ' + (data.error || 'Unknown error'));
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend server.');
      setIsSubmitting(false);
    }
  };

  const marqueeItems1 = [
    'VALORANT CHAMPIONSHIP',
    'FC 26 TOURNAMENT',
    'FREE ACTIVITIES',
    'COSPLAY',
    'LIVE STREAMING',
    'GIVEAWAYS',
    'CITY CENTER MALL',
  ]
  
  const marqueeItems2 = [
    'PRESS START',
    'SPIN THE WHEEL',
    'SCORE A GOAL',
    'PRESS STOP CHALLENGE',
    'PHOTO BOOTH',
    'GAMING QUIZZES',
    'SURPRISE GIVEAWAYS',
  ]

  const clearStatus = () => {
    setPaymentStatus(null);
    setStatusOrderId('');
    // Remove query params from url without reloading
    window.history.replaceState({}, document.title, window.location.pathname);
  };
  
  return (
    <>
      <div className="noise-overlay" />
      <Navbar />
      <HeroSection />
      
      <MarqueeStrip items={marqueeItems1} variant="lime" />
      <StatsBar />
      
      <TournamentsSection />
      <MarqueeStrip items={marqueeItems2} variant="purple" />
      
      <ActivitiesSection />
      
      <LiveExperienceSection />
      
      <VenueSection />
      
      <CosplaySection />
      
      <CountdownSection />
      
      <RegistrationSection onRegister={(gameKey) => setActiveRegGame(gameKey)} />
      
      <MarqueeStrip items={marqueeItems1} variant="lime" />
      <Footer />

      {/* Registration Modal — Volunteer uses dedicated multi-step form */}
      {activeRegGame === 'volunteer' && (
        <VolunteerFormModal
          onClose={() => setActiveRegGame(null)}
          onSubmit={handleRegisterSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Registration Modal — Valorant uses its dedicated multi-step form */}
      {activeRegGame === 'valorant' && (
        <ValorantFormModal
          onClose={() => setActiveRegGame(null)}
          onSubmit={handleRegisterSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Registration Modal — FC26 uses the existing simple form */}
      {activeRegGame && activeRegGame !== 'volunteer' && activeRegGame !== 'valorant' && (
        <RegistrationModal 
          game={activeRegGame}
          onClose={() => setActiveRegGame(null)}
          onSubmit={handleRegisterSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Transaction Status Overlay */}
      {paymentStatus && (
        <div className="status-overlay">
          <div className="status-card">
            {paymentStatus === 'checking' && (
              <>
                <div className="status-title">Verifying Payment</div>
                <div className="status-desc">Please wait while we confirm your transaction...</div>
              </>
            )}

            {paymentStatus === 'SUCCESS' && (
              <>
                <div className="status-icon success">✓</div>
                <div className="status-title">Registration Successful!</div>
                <div className="status-desc">
                  GG! Your registration has been confirmed. We've saved your details under transaction ID: <br />
                  <strong style={{ color: 'var(--violet)' }}>{statusOrderId || 'Free Ticket'}</strong>.
                </div>
                <button className="btn btn-primary status-btn" onClick={clearStatus}>
                  Back to Event Home
                </button>
              </>
            )}

            {paymentStatus === 'FAILED' && (
              <>
                <div className="status-icon failed">✗</div>
                <div className="status-title">Registration Failed</div>
                <div className="status-desc">
                  Oops! We couldn't verify your payment. If money was debited, it will be refunded. 
                  Please try registering again or contact support.
                </div>
                <button className="btn btn-secondary status-btn" onClick={clearStatus}>
                  Try Again
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default App;
