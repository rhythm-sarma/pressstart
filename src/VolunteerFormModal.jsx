import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VOLUNTEER_ROLES = [
  'Registration Desk',
  'Participant Check-In',
  'Tournament Administration',
  'Match Referee',
  'Stage Management',
  'Crowd Management',
  'Creator & Guest Assistance',
  'Social Media Team',
  'Photography Team',
  'Videography Team',
  'Livestream Production',
  'Technical Support',
  'Brand & Sponsor Assistance',
  'Merchandise & Stall Support',
  'General Event Operations',
]

const CONFIRMATION_ITEMS = [
  'I understand that submitting this form does not guarantee selection.',
  'I agree to follow instructions from event organizers and team leads.',
  'I will behave professionally and respectfully during the event.',
  'I understand that misconduct may result in removal from the volunteer team.',
  'I agree to arrive on time and fulfill my assigned responsibilities.',
  'The information provided in this application is accurate.',
]

const TOTAL_STEPS = 4

function VolunteerFormModal({ onClose, onSubmit, isSubmitting }) {
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    // Step 1 — Personal Info
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    city: '',
    instagram: '',
    // Step 2 — Availability / Skills & Experience
    availableFullDuration: '',
    availableBriefing: '',
    volunteeredBefore: '',
    previousEvents: '',
    otherExperiences: '',
    // Step 3 — Roles & Motivation
    interestedRoles: [],
    whyVolunteer: '',
    emergencyContact: '',
    // Step 4 — Community & Confirmations
    followedInstagram: '',
    followedTwitch: '',
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
      if (!formData.name.trim()) newErrors.name = 'Full name is required'
      if (!formData.age) newErrors.age = 'Age is required'
      else if (parseInt(formData.age) < 18) newErrors.age = 'You must be 18 or older'
      if (!formData.gender) newErrors.gender = 'Please select your gender'
      if (!formData.phone.trim()) newErrors.phone = 'Mobile number is required'
      else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Enter a valid 10-digit number'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email'
      if (!formData.city.trim()) newErrors.city = 'City is required'
    }

    if (stepNum === 2) {
      if (!formData.availableFullDuration) newErrors.availableFullDuration = 'Please select an option'
      if (!formData.availableBriefing) newErrors.availableBriefing = 'Please select an option'
      if (!formData.volunteeredBefore) newErrors.volunteeredBefore = 'Please select an option'
      if (!formData.otherExperiences.trim()) newErrors.otherExperiences = 'This field is required'
    }

    if (stepNum === 3) {
      if (formData.interestedRoles.length === 0) newErrors.interestedRoles = 'Select at least 1 role'
      else if (formData.interestedRoles.length > 3) newErrors.interestedRoles = 'Select at most 3 roles'
      if (!formData.whyVolunteer.trim()) newErrors.whyVolunteer = 'This field is required'
      if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required'
    }

    if (stepNum === 4) {
      if (!formData.followedInstagram) newErrors.followedInstagram = 'Please confirm'
      if (!formData.followedTwitch) newErrors.followedTwitch = 'Please confirm'
      if (formData.confirmations.length !== CONFIRMATION_ITEMS.length) {
        newErrors.confirmations = 'Please check all boxes to proceed'
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
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        game: 'volunteer',
        volunteerData: {
          age: parseInt(formData.age),
          gender: formData.gender,
          city: formData.city,
          instagram: formData.instagram,
          availableFullDuration: formData.availableFullDuration,
          availableBriefing: formData.availableBriefing,
          volunteeredBefore: formData.volunteeredBefore,
          previousEvents: formData.previousEvents,
          otherExperiences: formData.otherExperiences,
          interestedRoles: formData.interestedRoles,
          whyVolunteer: formData.whyVolunteer,
          emergencyContact: formData.emergencyContact,
          followedInstagram: formData.followedInstagram,
          followedTwitch: formData.followedTwitch,
        }
      })
    }
  }

  const stepLabels = ['Personal Info', 'Skills & Availability', 'Roles & Motivation', 'Community & Confirm']

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
      <div className="volunteer-modal">
        {/* Header */}
        <div className="volunteer-modal-header">
          <div className="volunteer-modal-header-text">
            <h3>Volunteer Application</h3>
            <span className="volunteer-modal-free-tag">FREE</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Progress Bar */}
        <div className="volunteer-progress">
          <div className="volunteer-progress-bar">
            <div 
              className="volunteer-progress-fill" 
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <div className="volunteer-progress-steps">
            {stepLabels.map((label, i) => (
              <div 
                key={i} 
                className={`volunteer-progress-step ${i + 1 <= step ? 'active' : ''} ${i + 1 === step ? 'current' : ''}`}
              >
                <div className="volunteer-step-dot">
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
              {/* STEP 1: Personal Info */}
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
                    <span className="volunteer-step-number">01</span>
                    Personal Information
                  </div>

                  <div className="volunteer-form-grid">
                    <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                      <label htmlFor="vol-name">Full Name <span className="required">*</span></label>
                      <input
                        type="text"
                        id="vol-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>

                    <div className="volunteer-form-row">
                      <div className={`form-group ${errors.age ? 'has-error' : ''}`}>
                        <label htmlFor="vol-age">Age <span className="required">*</span></label>
                        <input
                          type="number"
                          id="vol-age"
                          name="age"
                          min="18"
                          max="99"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="18+"
                        />
                        {errors.age && <span className="field-error">{errors.age}</span>}
                      </div>

                      <div className={`form-group ${errors.gender ? 'has-error' : ''}`}>
                        <label htmlFor="vol-gender">Gender <span className="required">*</span></label>
                        <select
                          id="vol-gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        {errors.gender && <span className="field-error">{errors.gender}</span>}
                      </div>
                    </div>

                    <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                      <label htmlFor="vol-phone">Mobile Number <span className="required">*</span></label>
                      <input
                        type="tel"
                        id="vol-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                      />
                      {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>

                    <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                      <label htmlFor="vol-email">Email Address <span className="required">*</span></label>
                      <input
                        type="email"
                        id="vol-email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@gmail.com"
                      />
                      {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>

                    <div className="volunteer-form-row">
                      <div className={`form-group ${errors.city ? 'has-error' : ''}`}>
                        <label htmlFor="vol-city">City <span className="required">*</span></label>
                        <input
                          type="text"
                          id="vol-city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Your city"
                        />
                        {errors.city && <span className="field-error">{errors.city}</span>}
                      </div>

                      <div className="form-group">
                        <label htmlFor="vol-instagram">Instagram Handle</label>
                        <input
                          type="text"
                          id="vol-instagram"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleChange}
                          placeholder="@yourhandle"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Availability / Skills & Experience */}
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
                    <span className="volunteer-step-number">02</span>
                    Availability / Skills & Experience
                  </div>

                  <div className="volunteer-form-grid">
                    <div className={`form-group ${errors.availableFullDuration ? 'has-error' : ''}`}>
                      <label>Will you be available for the full event duration? <span className="required">*</span></label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="availableFullDuration"
                            value="Yes"
                            checked={formData.availableFullDuration === 'Yes'}
                            onChange={handleChange}
                          />
                          <span className="radio-custom" />
                          Yes
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="availableFullDuration"
                            value="No"
                            checked={formData.availableFullDuration === 'No'}
                            onChange={handleChange}
                          />
                          <span className="radio-custom" />
                          No
                        </label>
                      </div>
                      {errors.availableFullDuration && <span className="field-error">{errors.availableFullDuration}</span>}
                    </div>

                    <div className={`form-group ${errors.availableBriefing ? 'has-error' : ''}`}>
                      <label>Are you available for volunteer briefing/orientation before the event? <span className="required">*</span></label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="availableBriefing"
                            value="Yes"
                            checked={formData.availableBriefing === 'Yes'}
                            onChange={handleChange}
                          />
                          <span className="radio-custom" />
                          Yes
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="availableBriefing"
                            value="No"
                            checked={formData.availableBriefing === 'No'}
                            onChange={handleChange}
                          />
                          <span className="radio-custom" />
                          No
                        </label>
                      </div>
                      {errors.availableBriefing && <span className="field-error">{errors.availableBriefing}</span>}
                    </div>

                    <div className={`form-group ${errors.volunteeredBefore ? 'has-error' : ''}`}>
                      <label>Have you volunteered at events before? <span className="required">*</span></label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="volunteeredBefore"
                            value="Yes"
                            checked={formData.volunteeredBefore === 'Yes'}
                            onChange={handleChange}
                          />
                          <span className="radio-custom" />
                          Yes
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="volunteeredBefore"
                            value="No"
                            checked={formData.volunteeredBefore === 'No'}
                            onChange={handleChange}
                          />
                          <span className="radio-custom" />
                          No
                        </label>
                      </div>
                      {errors.volunteeredBefore && <span className="field-error">{errors.volunteeredBefore}</span>}
                    </div>

                    {formData.volunteeredBefore === 'Yes' && (
                      <div className="form-group">
                        <label htmlFor="vol-previousEvents">If yes, please mention the events</label>
                        <textarea
                          id="vol-previousEvents"
                          name="previousEvents"
                          rows="3"
                          value={formData.previousEvents}
                          onChange={handleChange}
                          placeholder="List any events you've volunteered at..."
                        />
                      </div>
                    )}

                    <div className={`form-group ${errors.otherExperiences ? 'has-error' : ''}`}>
                      <label htmlFor="vol-otherExperiences">Mention other previous experiences <span className="required">*</span></label>
                      <textarea
                        id="vol-otherExperiences"
                        name="otherExperiences"
                        rows="3"
                        value={formData.otherExperiences}
                        onChange={handleChange}
                        placeholder="Any relevant experience — organizing events, tech skills, etc."
                      />
                      {errors.otherExperiences && <span className="field-error">{errors.otherExperiences}</span>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Roles & Motivation */}
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
                    <span className="volunteer-step-number">03</span>
                    Roles & Motivation
                  </div>

                  <div className="volunteer-form-grid">
                    <div className={`form-group ${errors.interestedRoles ? 'has-error' : ''}`}>
                      <label>Which roles are you interested in? <span className="required">*</span> <span className="label-hint">(Choose up to 3)</span></label>
                      <div className="checkbox-grid">
                        {VOLUNTEER_ROLES.map((role) => (
                          <label
                            key={role}
                            className={`checkbox-card ${formData.interestedRoles.includes(role) ? 'selected' : ''} ${formData.interestedRoles.length >= 3 && !formData.interestedRoles.includes(role) ? 'disabled' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.interestedRoles.includes(role)}
                              onChange={() => {
                                if (formData.interestedRoles.length >= 3 && !formData.interestedRoles.includes(role)) return
                                handleCheckboxChange('interestedRoles', role)
                              }}
                            />
                            <span className="checkbox-custom">
                              {formData.interestedRoles.includes(role) ? '✓' : ''}
                            </span>
                            <span className="checkbox-card-text">{role}</span>
                          </label>
                        ))}
                      </div>
                      {errors.interestedRoles && <span className="field-error">{errors.interestedRoles}</span>}
                    </div>

                    <div className={`form-group ${errors.whyVolunteer ? 'has-error' : ''}`}>
                      <label htmlFor="vol-whyVolunteer">Why do you want to volunteer for PRESS START? <span className="required">*</span></label>
                      <textarea
                        id="vol-whyVolunteer"
                        name="whyVolunteer"
                        rows="3"
                        value={formData.whyVolunteer}
                        onChange={handleChange}
                        placeholder="Tell us what motivates you to be part of the team..."
                      />
                      {errors.whyVolunteer && <span className="field-error">{errors.whyVolunteer}</span>}
                    </div>

                    <div className={`form-group ${errors.emergencyContact ? 'has-error' : ''}`}>
                      <label htmlFor="vol-emergencyContact">Emergency Contact Number (Along with Full Name) <span className="required">*</span></label>
                      <input
                        type="text"
                        id="vol-emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        placeholder="e.g. Amit Sharma — 9876543210"
                      />
                      {errors.emergencyContact && <span className="field-error">{errors.emergencyContact}</span>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Community & Confirmations */}
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
                    <span className="volunteer-step-number">04</span>
                    Community & Socials
                  </div>

                  <div className="volunteer-form-grid">
                    {/* Social Links */}
                    <div className="volunteer-socials-banner">
                      <div className="volunteer-socials-title">Follow Our Official Pages</div>
                      <div className="volunteer-social-links">
                        <a href="https://www.instagram.com/pressstartxo/" target="_blank" rel="noopener noreferrer" className="volunteer-social-link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                          Instagram
                        </a>
                        <a href="https://www.twitch.tv/pressstartxo" target="_blank" rel="noopener noreferrer" className="volunteer-social-link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2H3v16h5v4l4-4h5l4-4V2z"/><path d="M11 11V7"/><path d="M16 11V7"/></svg>
                          Twitch
                        </a>
                      </div>
                    </div>

                    <div className={`form-group ${errors.followedInstagram ? 'has-error' : ''}`}>
                      <label>Have you followed our Instagram page? <span className="required">*</span></label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="followedInstagram"
                            value="Yes"
                            checked={formData.followedInstagram === 'Yes'}
                            onChange={handleChange}
                          />
                          <span className="radio-custom" />
                          Yes
                        </label>
                      </div>
                      {errors.followedInstagram && <span className="field-error">{errors.followedInstagram}</span>}
                    </div>

                    <div className={`form-group ${errors.followedTwitch ? 'has-error' : ''}`}>
                      <label>Have you followed us on Twitch? <span className="required">*</span></label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="followedTwitch"
                            value="Yes"
                            checked={formData.followedTwitch === 'Yes'}
                            onChange={handleChange}
                          />
                          <span className="radio-custom" />
                          Yes
                        </label>
                      </div>
                      {errors.followedTwitch && <span className="field-error">{errors.followedTwitch}</span>}
                    </div>

                    <div className={`form-group ${errors.confirmations ? 'has-error' : ''}`}>
                      <label>Please confirm the following <span className="required">*</span> <span className="label-hint">(check all boxes)</span></label>
                      <div className="confirmation-list">
                        {CONFIRMATION_ITEMS.map((item, idx) => (
                          <label key={idx} className={`confirmation-item ${formData.confirmations.includes(item) ? 'checked' : ''}`}>
                            <input
                              type="checkbox"
                              checked={formData.confirmations.includes(item)}
                              onChange={() => handleCheckboxChange('confirmations', item)}
                            />
                            <span className="confirmation-checkbox">
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
                <button type="button" className="btn btn-primary volunteer-nav-btn" onClick={goNext}>
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary volunteer-nav-btn volunteer-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="submit-spinner" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application 🎮'
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

export default VolunteerFormModal
