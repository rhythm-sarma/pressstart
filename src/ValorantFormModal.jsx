import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CONFIRMATION_ITEMS = [
  'I confirm that all information provided is accurate.',
  'I agree to follow tournament rules and decisions made by tournament admins.',
  'I understand that misconduct, cheating, or abusive behavior may result in disqualification.',
  'I consent to being photographed, recorded and featured in event livestreams and promotional content.',
]

const TOTAL_STEPS = 4

function ValorantFormModal({ onClose, onSubmit, isSubmitting }) {
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    // Step 1 — Team Info
    teamName: '',
    city: '',
    
    // Step 2 — Captain (Player 1)
    captainName: '',
    captainEmail: '',
    captainPhone: '',
    captainWhatsApp: '',
    
    // Step 3 — Team Roster
    player2: '',
    player3: '',
    player4: '',
    player5: '',
    player6: '', // optional
    
    // Step 4 — Additional Info & Confirmations
    additionalInfo: '',
    confirmations: [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const arr = prev[field]
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(v => v !== value) }
      } else {
        return { ...prev, [field]: [...arr, value] }
      }
    })
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateStep = (stepNum) => {
    const newErrors = {}

    if (stepNum === 1) {
      if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
    }

    if (stepNum === 2) {
      if (!formData.captainName.trim()) newErrors.captainName = 'Captain name is required'
      if (!formData.captainEmail.trim()) newErrors.captainEmail = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.captainEmail)) newErrors.captainEmail = 'Enter a valid email'
      if (!formData.captainPhone.trim()) newErrors.captainPhone = 'Contact number is required'
      else if (!/^\d{10}$/.test(formData.captainPhone.replace(/\s/g, ''))) newErrors.captainPhone = 'Enter a valid 10-digit number'
      if (!formData.captainWhatsApp.trim()) newErrors.captainWhatsApp = 'WhatsApp number is required'
      else if (!/^\d{10}$/.test(formData.captainWhatsApp.replace(/\s/g, ''))) newErrors.captainWhatsApp = 'Enter a valid 10-digit number'
    }

    if (stepNum === 3) {
      if (!formData.player2.trim()) newErrors.player2 = 'Player 2 name is required'
      if (!formData.player3.trim()) newErrors.player3 = 'Player 3 name is required'
      if (!formData.player4.trim()) newErrors.player4 = 'Player 4 name is required'
      if (!formData.player5.trim()) newErrors.player5 = 'Player 5 name is required'
    }

    if (stepNum === 4) {
      if (formData.confirmations.length !== CONFIRMATION_ITEMS.length) {
        newErrors.confirmations = 'Please agree to all terms to proceed'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, TOTAL_STEPS))
    }
  }

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateStep(step)) {
      onSubmit({
        name: formData.captainName,
        email: formData.captainEmail,
        phone: formData.captainPhone,
        game: 'valorant',
        teamName: formData.teamName,
        valorantData: {
          teamName: formData.teamName,
          city: formData.city,
          captainName: formData.captainName,
          captainEmail: formData.captainEmail,
          captainPhone: formData.captainPhone,
          captainWhatsApp: formData.captainWhatsApp,
          player2: formData.player2,
          player3: formData.player3,
          player4: formData.player4,
          player5: formData.player5,
          player6: formData.player6,
          additionalInfo: formData.additionalInfo,
        }
      })
    }
  }

  const stepLabels = ['Team Info', 'Captain Info', 'Team Roster', 'Confirmation']

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 80 : -80, opacity: 0 }),
  }

  const [slideDirection, setSlideDirection] = useState(1)

  const goNext = () => {
    setSlideDirection(1)
    handleNext()
  }

  const goBack = () => {
    setSlideDirection(-1)
    handleBack()
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="volunteer-modal" style={{ borderColor: 'var(--red)' }}>
        {/* Header */}
        <div className="volunteer-modal-header">
          <div className="volunteer-modal-header-text">
            <h3 style={{ color: 'var(--red)' }}>Valorant Registration</h3>
            <span className="volunteer-modal-free-tag" style={{ background: 'var(--red)', color: 'white' }}>₹300</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Progress Bar */}
        <div className="volunteer-progress">
          <div className="volunteer-progress-bar">
            <div 
              className="volunteer-progress-fill" 
              style={{ width: `${(step / TOTAL_STEPS) * 100}%`, background: 'var(--red)' }}
            />
          </div>
          <div className="volunteer-progress-steps">
            {stepLabels.map((label, i) => (
              <div 
                key={i} 
                className={`volunteer-progress-step ${i + 1 <= step ? 'active' : ''} ${i + 1 === step ? 'current' : ''}`}
              >
                <div className="volunteer-step-dot" style={i + 1 <= step ? { borderColor: 'var(--red)', background: i + 1 < step ? 'var(--red)' : 'transparent' } : {}}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className="volunteer-step-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="volunteer-modal-body">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait" custom={slideDirection}>
              {/* STEP 1: Team Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="volunteer-step-content"
                >
                  <div className="volunteer-step-title">
                    <span className="volunteer-step-number" style={{ color: 'var(--red)' }}>01</span>
                    Team Information
                  </div>

                  <div className="volunteer-form-grid">
                    <div className={`form-group ${errors.teamName ? 'has-error' : ''}`}>
                      <label htmlFor="teamName">Team Name <span className="required">*</span></label>
                      <input
                        type="text"
                        id="teamName"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleChange}
                        placeholder="Enter your team's name"
                      />
                      {errors.teamName && <span className="field-error">{errors.teamName}</span>}
                    </div>

                    <div className={`form-group ${errors.city ? 'has-error' : ''}`}>
                      <label htmlFor="city">City <span className="required">*</span></label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Your city"
                      />
                      {errors.city && <span className="field-error">{errors.city}</span>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Captain Info */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="volunteer-step-content"
                >
                  <div className="volunteer-step-title">
                    <span className="volunteer-step-number" style={{ color: 'var(--red)' }}>02</span>
                    Captain (Player 1)
                  </div>

                  <div className="volunteer-form-grid">
                    <div className={`form-group ${errors.captainName ? 'has-error' : ''}`}>
                      <label htmlFor="captainName">Full Name <span className="required">*</span></label>
                      <input
                        type="text"
                        id="captainName"
                        name="captainName"
                        value={formData.captainName}
                        onChange={handleChange}
                        placeholder="Captain's full name"
                      />
                      {errors.captainName && <span className="field-error">{errors.captainName}</span>}
                    </div>

                    <div className={`form-group ${errors.captainEmail ? 'has-error' : ''}`}>
                      <label htmlFor="captainEmail">Email Address <span className="required">*</span></label>
                      <input
                        type="email"
                        id="captainEmail"
                        name="captainEmail"
                        value={formData.captainEmail}
                        onChange={handleChange}
                        placeholder="captain@example.com"
                      />
                      {errors.captainEmail && <span className="field-error">{errors.captainEmail}</span>}
                    </div>

                    <div className="volunteer-form-row">
                      <div className={`form-group ${errors.captainPhone ? 'has-error' : ''}`}>
                        <label htmlFor="captainPhone">Contact Number <span className="required">*</span></label>
                        <input
                          type="tel"
                          id="captainPhone"
                          name="captainPhone"
                          value={formData.captainPhone}
                          onChange={handleChange}
                          placeholder="10-digit number"
                        />
                        {errors.captainPhone && <span className="field-error">{errors.captainPhone}</span>}
                      </div>

                      <div className={`form-group ${errors.captainWhatsApp ? 'has-error' : ''}`}>
                        <label htmlFor="captainWhatsApp">WhatsApp Number <span className="required">*</span></label>
                        <input
                          type="tel"
                          id="captainWhatsApp"
                          name="captainWhatsApp"
                          value={formData.captainWhatsApp}
                          onChange={handleChange}
                          placeholder="10-digit number"
                        />
                        {errors.captainWhatsApp && <span className="field-error">{errors.captainWhatsApp}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Team Roster */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="volunteer-step-content"
                >
                  <div className="volunteer-step-title">
                    <span className="volunteer-step-number" style={{ color: 'var(--red)' }}>03</span>
                    Team Roster
                  </div>

                  <div className="volunteer-form-grid">
                    <div className={`form-group ${errors.player2 ? 'has-error' : ''}`}>
                      <label htmlFor="player2">Player 2 Full Name <span className="required">*</span></label>
                      <input
                        type="text"
                        id="player2"
                        name="player2"
                        value={formData.player2}
                        onChange={handleChange}
                        placeholder="Full name"
                      />
                      {errors.player2 && <span className="field-error">{errors.player2}</span>}
                    </div>

                    <div className={`form-group ${errors.player3 ? 'has-error' : ''}`}>
                      <label htmlFor="player3">Player 3 Full Name <span className="required">*</span></label>
                      <input
                        type="text"
                        id="player3"
                        name="player3"
                        value={formData.player3}
                        onChange={handleChange}
                        placeholder="Full name"
                      />
                      {errors.player3 && <span className="field-error">{errors.player3}</span>}
                    </div>

                    <div className={`form-group ${errors.player4 ? 'has-error' : ''}`}>
                      <label htmlFor="player4">Player 4 Full Name <span className="required">*</span></label>
                      <input
                        type="text"
                        id="player4"
                        name="player4"
                        value={formData.player4}
                        onChange={handleChange}
                        placeholder="Full name"
                      />
                      {errors.player4 && <span className="field-error">{errors.player4}</span>}
                    </div>

                    <div className={`form-group ${errors.player5 ? 'has-error' : ''}`}>
                      <label htmlFor="player5">Player 5 Full Name <span className="required">*</span></label>
                      <input
                        type="text"
                        id="player5"
                        name="player5"
                        value={formData.player5}
                        onChange={handleChange}
                        placeholder="Full name"
                      />
                      {errors.player5 && <span className="field-error">{errors.player5}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="player6">Player 6 Full Name <span className="label-hint">(Optional Substitute)</span></label>
                      <input
                        type="text"
                        id="player6"
                        name="player6"
                        value={formData.player6}
                        onChange={handleChange}
                        placeholder="Full name"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Additional Info & Confirmations */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="volunteer-step-content"
                >
                  <div className="volunteer-step-title">
                    <span className="volunteer-step-number" style={{ color: 'var(--red)' }}>04</span>
                    Final Details
                  </div>

                  <div className="volunteer-form-grid">
                    <div className="form-group">
                      <label htmlFor="additionalInfo">Any additional information for the organizers?</label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        rows="3"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        placeholder="Let us know if you have any questions or special requests..."
                      />
                    </div>

                    <div className={`form-group ${errors.confirmations ? 'has-error' : ''}`}>
                      <label>Please confirm the following <span className="required">*</span></label>
                      <div className="confirmation-list">
                        {CONFIRMATION_ITEMS.map((item, idx) => (
                          <label key={idx} className={`confirmation-item ${formData.confirmations.includes(item) ? 'checked' : ''}`} style={formData.confirmations.includes(item) ? { borderColor: 'var(--red)' } : {}}>
                            <input
                              type="checkbox"
                              checked={formData.confirmations.includes(item)}
                              onChange={() => handleCheckboxChange('confirmations', item)}
                            />
                            <span className="confirmation-checkbox" style={formData.confirmations.includes(item) ? { background: 'var(--red)', borderColor: 'var(--red)' } : {}}>
                              {formData.confirmations.includes(item) ? '✓' : ''}
                            </span>
                            <span className="confirmation-text">{item}</span>
                          </label>
                        ))}
                      </div>
                      {errors.confirmations && <span className="field-error">{errors.confirmations}</span>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="volunteer-nav-buttons">
              {step > 1 && (
                <button type="button" className="btn btn-secondary volunteer-nav-btn" onClick={goBack}>
                  ← Back
                </button>
              )}
              <div className="volunteer-nav-spacer" />
              {step < TOTAL_STEPS ? (
                <button type="button" className="btn volunteer-nav-btn" style={{ background: 'var(--red)', color: '#fff' }} onClick={goNext}>
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn volunteer-nav-btn volunteer-submit-btn"
                  style={{ background: 'var(--red)', color: '#fff' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="submit-spinner" />
                      Processing...
                    </>
                  ) : (
                    'Pay ₹300 & Register 🎮'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ValorantFormModal
