import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
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
        
        <motion.div 
          className="hero-venue"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          City Centre Mall, Guwahati
        </motion.div>
        
        <motion.div 
          className="hero-buttons"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <a href="#register" className="btn btn-primary">Register for Valorant</a>
          <a href="#register" className="btn btn-secondary">Register for FC 26</a>
          <a href="#register" className="btn btn-outline">Become a Volunteer</a>
        </motion.div>
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
                Top teams battle it out live at City Centre Mall
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
            <a href="#register" className="btn btn-valorant">Register Your Team →</a>
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
            <a href="#register" className="btn btn-secondary">Register for FC 26 →</a>
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
    { name: 'Aim Challenge', desc: 'Test your precision in our aim training arcade booth.', free: true },
    { name: 'Trading Card Zone', desc: 'Trade, collect, and show off rare gaming cards with fellow gamers.', free: true },
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
            <h2 className="section-title" style={{ textAlign: 'left' }}>
              City Centre Mall<br />
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
          <img src="/images/location-reveal.jpg" alt="City Centre Mall - PRESS START Venue" className="venue-image" />
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
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '1rem' }}>
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
function RegistrationSection() {
  const cards = [
    {
      type: 'card-valorant',
      accent: 'accent-red',
      title: 'Valorant Team Registration',
      desc: 'Form your squad of 5, dominate the online qualifiers, and battle it out live on stage at City Centre Mall. Are you ready to prove your team is the best?',
      features: [
        '5v5 team format',
        'Online qualifiers → Offline finals',
        'Cash prizes + trophies',
        'Live streamed on Twitch',
        'Professional casting & commentary',
      ],
      btnClass: 'btn-valorant',
      btnText: 'Register Team',
      btnLink: '#'
    },
    {
      type: 'card-fc',
      accent: 'accent-purple',
      title: 'FC 26 Registration',
      desc: 'Step up to the PS5 controller and show everyone why you\'re the best virtual footballer. 1v1 knockout format — no second chances.',
      features: [
        '1v1 on PS5',
        'Single elimination bracket',
        'Play at City Centre Mall',
        'Prizes for top players',
        'Live crowd atmosphere',
      ],
      btnClass: 'btn-secondary',
      btnText: 'Register Now',
      btnLink: '#'
    },
    {
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
      btnLink: '#'
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
              <a href={card.btnLink} className={`btn ${card.btnClass}`}>{card.btnText}</a>
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
            <li><a href="https://twitch.tv/pressstartxo" target="_blank" rel="noopener noreferrer">Twitch</a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">Discord</a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">Twitter / X</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 PRESS START. All rights reserved.</p>
        <div className="footer-socials">
          <a href="https://twitch.tv/pressstartxo" target="_blank" rel="noopener noreferrer" aria-label="Twitch">TV</a>
          <a href="#" aria-label="Instagram">IG</a>
          <a href="#" aria-label="Discord">DC</a>
          <a href="#" aria-label="Twitter">X</a>
        </div>
      </div>
    </footer>
  )
}

/* ===== Main App ===== */
function App() {
  const marqueeItems1 = [
    'VALORANT CHAMPIONSHIP',
    'FC 26 TOURNAMENT',
    'FREE ACTIVITIES',
    'COSPLAY',
    'LIVE STREAMING',
    'GIVEAWAYS',
    'CITY CENTRE MALL',
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
      
      <RegistrationSection />
      
      <MarqueeStrip items={marqueeItems1} variant="lime" />
      <Footer />
    </>
  )
}

export default App
