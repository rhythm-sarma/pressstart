import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CONFIRMATION_ITEMS = [
  'I confirm that all information provided is accurate.',
  'I agree to follow tournament rules and decisions made by tournament admins.',
  'I understand that misconduct, cheating, or abusive behavior may result in disqualification.',
  'I consent to being photographed, recorded and featured in event livestreams and promotional content.',
]

const TOTAL_STEPS = 3

function Fc26FormModal({ onClose, onSubmit, isSubmitting }) {
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    // Step 1
    playerName: '',
    city: '',
    email: '',
    phone: '',
    whatsapp: '',
    instagramFollowed: '',
    
    // Step 2
    additionalInfo: '',
    confirmations: [],
    
    // Step 3
    paymentCompleted: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
      if (!formData.playerName.trim()) newErrors.playerName = 'Player name is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email'
      if (!formData.phone.trim()) newErrors.phone = 'Contact number is required'
      else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Enter a valid 10-digit number'
      if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required'
      else if (!/^\d{10}$/.test(formData.whatsapp.replace(/\s/g, ''))) newErrors.whatsapp = 'Enter a valid 10-digit number'
      if (!formData.instagramFollowed) newErrors.instagramFollowed = 'Please select Yes or No'
    }

    if (stepNum === 2) {
      if (formData.confirmations.length !== CONFIRMATION_ITEMS.length) {
        newErrors.confirmations = 'Please agree to all terms to proceed'
      }
    }

    if (stepNum === 3) {
      if (!formData.paymentCompleted) newErrors.paymentCompleted = 'Please confirm if payment is completed'
      else if (formData.paymentCompleted !== 'Yes') newErrors.paymentCompleted = 'Payment must be completed to register'
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
        name: formData.playerName,
        email: formData.email,
        phone: formData.phone,
        game: 'fc26',
        fc26Data: {
          playerName: formData.playerName,
          city: formData.city,
          email: formData.email,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          instagramFollowed: formData.instagramFollowed,
          additionalInfo: formData.additionalInfo,
          confirmations: formData.confirmations,
          paymentCompleted: formData.paymentCompleted,
        }
      })
    }
  }

  const stepLabels = ['Player Info', 'Confirmation', 'Payment']

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
      <div className="volunteer-modal" style={{ borderColor: 'var(--cyan)' }}>
        {/* Header */}
        <div className="volunteer-modal-header">
          <div className="volunteer-modal-header-text">
            <h3 style={{ color: 'var(--cyan)' }}>FC 26 Registration</h3>
            <span className="volunteer-modal-free-tag" style={{ background: 'var(--cyan)', color: 'var(--black)' }}>₹100</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Progress Bar */}
        <div className="volunteer-progress">
          <div className="volunteer-progress-bar">
            <div 
              className="volunteer-progress-fill" 
              style={{ width: `${(step / TOTAL_STEPS) * 100}%`, background: 'var(--cyan)' }}
            />
          </div>
          <div className="volunteer-progress-steps">
            {stepLabels.map((label, i) => (
              <div 
                key={i} 
                className={`volunteer-progress-step ${i + 1 <= step ? 'active' : ''} ${i + 1 === step ? 'current' : ''}`}
              >
                <div className="volunteer-step-dot" style={i + 1 <= step ? { borderColor: 'var(--cyan)', background: i + 1 < step ? 'var(--cyan)' : 'transparent' } : {}}>
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
              {/* STEP 1 */}
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
                    <span className="volunteer-step-number" style={{ color: 'var(--cyan)' }}>01</span>
                    Player Details
                  </div>
                  
                  <div className="form-row">
                    <div className={`form-group ${errors.playerName ? 'has-error' : ''}`}>
                      <label htmlFor="playerName">Player Name <span className="required">*</span></label>
                      <input type="text" id="playerName" name="playerName" value={formData.playerName} onChange={handleChange} placeholder="Enter your full name" />
                      {errors.playerName && <span className="field-error">{errors.playerName}</span>}
                    </div>
                    <div className={`form-group ${errors.city ? 'has-error' : ''}`}>
                      <label htmlFor="city">City <span className="required">*</span></label>
                      <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Your city" />
                      {errors.city && <span className="field-error">{errors.city}</span>}
                    </div>
                  </div>

                  <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                    <label htmlFor="email">Email Address <span className="required">*</span></label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>

                  <div className="form-row">
                    <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                      <label htmlFor="phone">Contact Number <span className="required">*</span></label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" />
                      {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>
                    <div className={`form-group ${errors.whatsapp ? 'has-error' : ''}`}>
                      <label htmlFor="whatsapp">WhatsApp Number <span className="required">*</span></label>
                      <input type="tel" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="10-digit number" />
                      {errors.whatsapp && <span className="field-error">{errors.whatsapp}</span>}
                    </div>
                  </div>

                  <div className={`form-group ${errors.instagramFollowed ? 'has-error' : ''}`}>
                    <label>Have you followed our Instagram page? <span className="required">*</span></label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input type="radio" name="instagramFollowed" value="Yes" checked={formData.instagramFollowed === 'Yes'} onChange={handleChange} />
                        <span className="radio-custom"></span> Yes
                      </label>
                      <label className="radio-label">
                        <input type="radio" name="instagramFollowed" value="No" checked={formData.instagramFollowed === 'No'} onChange={handleChange} />
                        <span className="radio-custom"></span> No
                      </label>
                    </div>
                    {errors.instagramFollowed && <span className="field-error">{errors.instagramFollowed}</span>}
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
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
                    <span className="volunteer-step-number" style={{ color: 'var(--cyan)' }}>02</span>
                    Consent & Agreement
                  </div>

                  <div className={`form-group ${errors.confirmations ? 'has-error' : ''}`}>
                    <label className="mb-2">Terms and Conditions <span className="required">*</span></label>
                    <div className="confirmation-list">
                      {CONFIRMATION_ITEMS.map((item, idx) => (
                        <label key={idx} className={`confirmation-item ${formData.confirmations.includes(item) ? 'checked' : ''}`} style={formData.confirmations.includes(item) ? { borderColor: 'var(--cyan)' } : {}}>
                          <input
                            type="checkbox"
                            checked={formData.confirmations.includes(item)}
                            onChange={() => handleCheckboxChange('confirmations', item)}
                          />
                          <span className="confirmation-checkbox" style={formData.confirmations.includes(item) ? { background: 'var(--cyan)', borderColor: 'var(--cyan)' } : {}}>
                            {formData.confirmations.includes(item) ? '✓' : ''}
                          </span>
                          <span className="confirmation-text">{item}</span>
                        </label>
                      ))}
                    </div>
                    {errors.confirmations && <span className="field-error">{errors.confirmations}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="additionalInfo">Any additional information for the organizers?</label>
                    <textarea id="additionalInfo" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} placeholder="Optional notes..."></textarea>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
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
                  style={{ textAlign: 'center' }}
                >
                  <div className="volunteer-step-title" style={{ textAlign: 'left' }}>
                    <span className="volunteer-step-number" style={{ color: 'var(--cyan)' }}>03</span>
                    Payment
                  </div>

                  <p style={{ marginBottom: '1rem', color: '#000' }}>Scan the QR code below to pay <strong>₹100</strong></p>
                  
                  <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '8px', marginBottom: '10px', border: '3px solid var(--black)', boxShadow: '4px 4px 0px var(--black)' }}>
                    <img src="/images/QRcode.jpg" alt="Payment QR Code" style={{ width: '200px', height: '200px', display: 'block' }} />
                  </div>
                  
                  <p style={{ fontWeight: '900', marginBottom: '20px', fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--violet)' }}>UPI ID: rhythmsarma66@okaxis</p>

                  <div className={`form-group ${errors.paymentCompleted ? 'has-error' : ''}`} style={{ textAlign: 'left' }}>
                    <label>Payment completed? <span className="required">*</span></label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input type="radio" name="paymentCompleted" value="Yes" checked={formData.paymentCompleted === 'Yes'} onChange={handleChange} />
                        <span className="radio-custom"></span> Yes
                      </label>
                      <label className="radio-label">
                        <input type="radio" name="paymentCompleted" value="No" checked={formData.paymentCompleted === 'No'} onChange={handleChange} />
                        <span className="radio-custom"></span> No
                      </label>
                    </div>
                    {errors.paymentCompleted && <span className="field-error">{errors.paymentCompleted}</span>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="volunteer-nav-buttons">
              {step > 1 ? (
                <button type="button" className="btn btn-ghost" onClick={goBack}>
                  ← Back
                </button>
              ) : <div></div>}
              
              {step < TOTAL_STEPS ? (
                <button type="button" className="btn btn-primary" onClick={goNext} style={{ background: 'var(--cyan)', color: 'var(--black)' }}>
                  Next →
                </button>
              ) : (
                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ background: 'var(--cyan)', color: 'var(--black)' }}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Processing...
                    </>
                  ) : (
                    'Submit Application ⚽'
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

export default Fc26FormModal
