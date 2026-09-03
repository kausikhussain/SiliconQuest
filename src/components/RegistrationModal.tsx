import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Send,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  GraduationCap,
  Percent,
  BookOpen,
  User,
  Hash,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/soundEngine';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  sicNo: string;
  branch: string;
  tenthPercentage: string;
  twelfthPercentage: string;
  interestedSubject: string;
  otherSubject: string;
  declarationAccepted: boolean;
}

interface FormErrors {
  name?: string;
  sicNo?: string;
  branch?: string;
  tenthPercentage?: string;
  twelfthPercentage?: string;
  interestedSubject?: string;
  otherSubject?: string;
  declarationAccepted?: string;
  general?: string;
}

const BRANCHES = [
  { value: 'CSE — Computer Science and Engineering', label: 'CSE — Computer Science and Engineering' },
  { value: 'ECE — Electronics and Communication Engineering', label: 'ECE — Electronics and Communication Engineering' },
  { value: 'ME — Mechanical Engineering', label: 'ME — Mechanical Engineering' },
  { value: 'CE — Civil Engineering', label: 'CE — Civil Engineering' },
  { value: 'EE — Electrical Engineering', label: 'EE — Electrical Engineering' }
];

const SUBJECT_OPTIONS = ['Physics', 'Chemistry', 'Mathematics', 'Other'];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    sicNo: '',
    branch: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    interestedSubject: '',
    otherSubject: '',
    declarationAccepted: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const validateField = (name: keyof FormState, value: any): string | undefined => {
    switch (name) {
      case 'name':
        if (!value || typeof value !== 'string' || value.trim().length < 2) {
          return 'Full Name is required (minimum 2 characters).';
        }
        break;
      case 'sicNo':
        if (!value || typeof value !== 'string' || value.trim().length < 3) {
          return 'Student Identification / SIC No. cannot be empty.';
        }
        break;
      case 'branch':
        if (!value || value.trim() === '') {
          return 'Please select your engineering branch.';
        }
        break;
      case 'tenthPercentage': {
        const num = Number(value);
        if (value === '' || isNaN(num)) {
          return '10th percentage is required.';
        }
        if (num < 0 || num > 100) {
          return '10th percentage must be between 0 and 100.';
        }
        break;
      }
      case 'twelfthPercentage': {
        const num = Number(value);
        if (value === '' || isNaN(num)) {
          return '12th percentage is required.';
        }
        if (num < 0 || num > 100) {
          return '12th percentage must be between 0 and 100.';
        }
        break;
      }
      case 'interestedSubject':
        if (!value || value.trim() === '') {
          return 'Please select your interested subject.';
        }
        break;
      case 'otherSubject':
        if (formData.interestedSubject === 'Other' && (!value || value.trim().length < 2)) {
          return 'Please specify your subject of interest.';
        }
        break;
      case 'declarationAccepted':
        if (!value) {
          return 'You must accept the declaration to register.';
        }
        break;
      default:
        break;
    }
    return undefined;
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormState>).forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) {
        newErrors[field] = err;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof FormState, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'interestedSubject' && value !== 'Other') {
        next.otherSubject = '';
      }
      return next;
    });

    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched: Record<string, boolean> = {};
    (Object.keys(formData) as Array<keyof FormState>).forEach((k) => {
      allTouched[k] = true;
    });
    setTouched(allTouched);

    if (!validateAll()) {
      sound.playIncorrect();
      return;
    }

    setIsSubmitting(true);
    sound.playClick();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          sicNo: formData.sicNo,
          branch: formData.branch,
          tenthPercentage: parseFloat(formData.tenthPercentage),
          twelfthPercentage: parseFloat(formData.twelfthPercentage),
          interestedSubject: formData.interestedSubject,
          otherSubject: formData.otherSubject,
          declarationAccepted: formData.declarationAccepted
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || result.errors?.[0] || 'Registration submission failed.');
      }

      sound.playSuccessCelebration();
      setSubmittedRefId(result.refId || 'SQC-2026-REGISTERED');
      try {
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.55 },
          colors: ['#00f2fe', '#38bdf8', '#10b981', '#ffffff']
        });
      } catch {
        // Safe fallback
      }
    } catch (err: any) {
      sound.playIncorrect();
      setErrors((prev) => ({
        ...prev,
        general: err.message || 'Unable to connect to server. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (submittedRefId) {
      navigator.clipboard.writeText(submittedRefId);
      setIsCopied(true);
      sound.playClick();
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleClose = () => {
    sound.playClick();
    onClose();
    setTimeout(() => {
      setSubmittedRefId(null);
      setFormData({
        name: '',
        sicNo: '',
        branch: '',
        tenthPercentage: '',
        twelfthPercentage: '',
        interestedSubject: '',
        otherSubject: '',
        declarationAccepted: false
      });
      setErrors({});
      setTouched({});
    }, 300);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'var(--form-modal-backdrop)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(16px + var(--sat)) calc(16px + var(--sar)) calc(16px + var(--sab)) calc(16px + var(--sal))',
        animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={handleClose}
    >
      <div
        className="reg-modal-container"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92dvh',
          overflowY: 'auto',
          borderRadius: '24px',
          padding: '32px 24px',
          position: 'relative',
          backgroundColor: 'var(--form-card-bg)',
          border: '1px solid var(--form-card-border)',
          boxShadow: 'var(--shadow-elevated)',
          color: 'var(--text-primary)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close Registration Window"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--form-modal-close-bg)',
            border: '1px solid var(--form-modal-close-border)',
            color: 'var(--form-modal-close-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            sound.playHover();
            e.currentTarget.style.opacity = '0.8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <X size={18} />
        </button>

        {!submittedRefId ? (
          <div>
            {/* Header Identity */}
            <div style={{ marginBottom: '24px', paddingRight: '40px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--accent-cyan)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}
              >
                <Sparkles size={12} />
                <span>SILICON INSTITUTE OF TECHNOLOGY, SAMBALPUR, ODISHA</span>
              </div>

              <h2
                id="registration-modal-title"
                className="font-display"
                style={{
                  fontSize: 'clamp(1.5rem, 4.2vw, 2.1rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: '10px'
                }}
              >
                QUIZ CLUB REGISTRATION
              </h2>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                  maxWidth: '560px'
                }}
              >
                Join the Silicon Institute of Technology Quiz Club and become part of a community focused on aptitude,
                reasoning, problem-solving and competitive preparation.
              </p>
            </div>

            {/* General Server Error Banner */}
            {errors.general && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  color: 'var(--accent-rose)',
                  fontSize: '0.825rem',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 1. Student Identity Section */}
                <div
                  style={{
                    background: 'var(--form-section-bg)',
                    border: '1px solid var(--form-section-border)',
                    borderRadius: '16px',
                    padding: '18px 16px'
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      display: 'block',
                      fontSize: '0.68rem',
                      color: 'var(--accent-cyan)',
                      letterSpacing: '0.1em',
                      marginBottom: '14px',
                      textTransform: 'uppercase',
                      fontWeight: 700
                    }}
                  >
                    01 · STUDENT IDENTITY & BRANCH
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Full Name */}
                    <div>
                      <label htmlFor="reg-full-name" className="form-field-label">
                        NAME *
                      </label>
                      <div
                        className={`form-input-container ${errors.name && touched.name ? 'error' : ''}`}
                      >
                        <User size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        <input
                          id="reg-full-name"
                          type="text"
                          required
                          placeholder="Full Name (e.g. Kausik Hussain)"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          onBlur={() => handleBlur('name')}
                          className="form-text-input"
                        />
                      </div>
                      {errors.name && touched.name && (
                        <p style={{ color: 'var(--input-error-border)', fontSize: '0.72rem', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* SIC Number & Branch Grid */}
                    <div style={{ display: 'grid', gap: '12px' }} className="reg-row-2">
                      {/* SIC No. */}
                      <div>
                        <label htmlFor="reg-sic-no" className="form-field-label">
                          SIC NO. *
                        </label>
                        <div
                          className={`form-input-container ${errors.sicNo && touched.sicNo ? 'error' : ''}`}
                        >
                          <Hash size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                          <input
                            id="reg-sic-no"
                            type="text"
                            required
                            placeholder="Student ID / SIC No."
                            value={formData.sicNo}
                            onChange={(e) => handleChange('sicNo', e.target.value)}
                            onBlur={() => handleBlur('sicNo')}
                            className="form-text-input font-mono"
                          />
                        </div>
                        {errors.sicNo && touched.sicNo && (
                          <p style={{ color: 'var(--input-error-border)', fontSize: '0.72rem', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                            {errors.sicNo}
                          </p>
                        )}
                      </div>

                      {/* Branch Dropdown */}
                      <div>
                        <label htmlFor="reg-branch" className="form-field-label">
                          BRANCH *
                        </label>
                        <div
                          className={`form-input-container ${errors.branch && touched.branch ? 'error' : ''}`}
                        >
                          <GraduationCap size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                          <select
                            id="reg-branch"
                            required
                            value={formData.branch}
                            onChange={(e) => handleChange('branch', e.target.value)}
                            onBlur={() => handleBlur('branch')}
                            className="form-select-element"
                          >
                            <option value="" disabled>
                              Select Engineering Branch
                            </option>
                            {BRANCHES.map((b) => (
                              <option key={b.value} value={b.value}>
                                {b.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.branch && touched.branch && (
                          <p style={{ color: 'var(--input-error-border)', fontSize: '0.72rem', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                            {errors.branch}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Academic Scores Section */}
                <div
                  style={{
                    background: 'var(--form-section-bg)',
                    border: '1px solid var(--form-section-border)',
                    borderRadius: '16px',
                    padding: '18px 16px'
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      display: 'block',
                      fontSize: '0.68rem',
                      color: 'var(--accent-cyan)',
                      letterSpacing: '0.1em',
                      marginBottom: '14px',
                      textTransform: 'uppercase',
                      fontWeight: 700
                    }}
                  >
                    02 · ACADEMIC METRICS (PERCENTAGE: 0 – 100)
                  </span>

                  <div style={{ display: 'grid', gap: '14px' }} className="reg-row-2">
                    {/* 10th Result */}
                    <div>
                      <label htmlFor="reg-tenth-result" className="form-field-label">
                        10TH RESULT (%) *
                      </label>
                      <div
                        className={`form-input-container ${errors.tenthPercentage && touched.tenthPercentage ? 'error' : ''}`}
                      >
                        <Percent size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        <input
                          id="reg-tenth-result"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          required
                          placeholder="e.g. 92.50"
                          value={formData.tenthPercentage}
                          onChange={(e) => handleChange('tenthPercentage', e.target.value)}
                          onBlur={() => handleBlur('tenthPercentage')}
                          className="form-text-input font-mono"
                        />
                      </div>
                      {errors.tenthPercentage && touched.tenthPercentage && (
                        <p style={{ color: 'var(--input-error-border)', fontSize: '0.72rem', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                          {errors.tenthPercentage}
                        </p>
                      )}
                    </div>

                    {/* 12th Result */}
                    <div>
                      <label htmlFor="reg-twelfth-result" className="form-field-label">
                        12TH RESULT (%) *
                      </label>
                      <div
                        className={`form-input-container ${errors.twelfthPercentage && touched.twelfthPercentage ? 'error' : ''}`}
                      >
                        <Percent size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        <input
                          id="reg-twelfth-result"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          required
                          placeholder="e.g. 89.40"
                          value={formData.twelfthPercentage}
                          onChange={(e) => handleChange('twelfthPercentage', e.target.value)}
                          onBlur={() => handleBlur('twelfthPercentage')}
                          className="form-text-input font-mono"
                        />
                      </div>
                      {errors.twelfthPercentage && touched.twelfthPercentage && (
                        <p style={{ color: 'var(--input-error-border)', fontSize: '0.72rem', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                          {errors.twelfthPercentage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Subject of Interest Section */}
                <div
                  style={{
                    background: 'var(--form-section-bg)',
                    border: '1px solid var(--form-section-border)',
                    borderRadius: '16px',
                    padding: '18px 16px'
                  }}
                >
                  <label id="subject-group-label" className="form-field-label">
                    03 · INTERESTED SUBJECT *
                  </label>

                  <div
                    role="radiogroup"
                    aria-labelledby="subject-group-label"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '10px'
                    }}
                  >
                    {SUBJECT_OPTIONS.map((sub) => {
                      const isSelected = formData.interestedSubject === sub;
                      return (
                        <button
                          key={sub}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => {
                            sound.playClick();
                            handleChange('interestedSubject', sub);
                          }}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '10px',
                            background: isSelected ? 'var(--form-radio-card-active-bg)' : 'var(--form-radio-card-bg)',
                            border: `1px solid ${isSelected ? 'var(--form-radio-card-active-border)' : 'var(--form-radio-card-border)'}`,
                            color: isSelected ? 'var(--form-radio-card-active-text)' : 'var(--text-secondary)',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={() => sound.playHover()}
                        >
                          <BookOpen size={14} color={isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                          <span>{sub}</span>
                        </button>
                      );
                    })}
                  </div>

                  {errors.interestedSubject && touched.interestedSubject && (
                    <p style={{ color: 'var(--input-error-border)', fontSize: '0.72rem', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                      {errors.interestedSubject}
                    </p>
                  )}

                  {/* Conditionally reveal "Specify Subject" if "Other" is selected */}
                  {formData.interestedSubject === 'Other' && (
                    <div style={{ marginTop: '14px', animation: 'fadeIn 0.25s ease' }}>
                      <label htmlFor="reg-other-subject" className="form-field-label">
                        SPECIFY SUBJECT *
                      </label>
                      <div
                        className={`form-input-container ${errors.otherSubject && touched.otherSubject ? 'error' : ''}`}
                      >
                        <input
                          id="reg-other-subject"
                          type="text"
                          required
                          placeholder="e.g. Computer Algorithms, Astronomy, History"
                          value={formData.otherSubject}
                          onChange={(e) => handleChange('otherSubject', e.target.value)}
                          onBlur={() => handleBlur('otherSubject')}
                          className="form-text-input"
                        />
                      </div>
                      {errors.otherSubject && touched.otherSubject && (
                        <p style={{ color: 'var(--input-error-border)', fontSize: '0.72rem', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                          {errors.otherSubject}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 4. Mandatory Institutional Declaration */}
                <div
                  style={{
                    background: 'var(--form-declaration-bg)',
                    border: `1px solid ${errors.declarationAccepted && touched.declarationAccepted ? 'var(--input-error-border)' : 'var(--form-declaration-border)'}`,
                    borderRadius: '16px',
                    padding: '16px',
                    transition: 'border-color 0.2s ease, background-color 0.2s ease'
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <input
                      type="checkbox"
                      required
                      checked={formData.declarationAccepted}
                      onChange={(e) => handleChange('declarationAccepted', e.target.checked)}
                      onBlur={() => handleBlur('declarationAccepted')}
                      style={{
                        width: '18px',
                        height: '18px',
                        marginTop: '3px',
                        accentColor: 'var(--accent-cyan)',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.8rem',
                        lineHeight: 1.5,
                        color: 'var(--text-primary)'
                      }}
                    >
                      "Through the Quiz Club, we are preparing for placements with the support of the Placement Club by
                      enhancing skills like aptitude, reasoning, and problem-solving. I am willing to pay any minimal fee
                      required for the club’s activities and will actively participate in all its events."
                    </span>
                  </label>
                  {errors.declarationAccepted && touched.declarationAccepted && (
                    <p style={{ color: 'var(--input-error-border)', fontSize: '0.72rem', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                      {errors.declarationAccepted}
                    </p>
                  )}
                </div>

                {/* Submit Action */}
                <div style={{ marginTop: '4px' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-cyan"
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      fontSize: '0.9rem',
                      letterSpacing: '0.04em',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: isSubmitting ? 0.7 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={() => sound.playHover()}
                  >
                    <Send size={16} />
                    <span>{isSubmitting ? 'VERIFYING & RECORDING DOSSIER...' : 'COMPLETE REGISTRATION'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* =======================================================================
             SUCCESS STATE
             ======================================================================= */
          <div style={{ textAlign: 'center', padding: '24px 8px 12px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid var(--accent-emerald)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)'
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--accent-emerald)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                marginBottom: '12px'
              }}
            >
              SILICON INSTITUTE OF TECHNOLOGY · ADMISSION CONFIRMED
            </div>

            <h3
              className="font-display"
              style={{
                fontSize: 'clamp(1.6rem, 4.5vw, 2.2rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '8px',
                letterSpacing: '-0.02em'
              }}
            >
              REGISTRATION COMPLETE
            </h3>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--accent-cyan)',
                fontWeight: 600,
                marginBottom: '20px'
              }}
            >
              Welcome to the Silicon Institute of Technology Quiz Club.
            </p>

            {/* Reference ID Card */}
            <div
              style={{
                maxWidth: '420px',
                margin: '0 auto 24px',
                padding: '16px 20px',
                borderRadius: '14px',
                background: 'var(--form-section-bg)',
                border: '1px solid var(--border-accent)',
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              <span
                className="font-mono"
                style={{
                  display: 'block',
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.12em',
                  marginBottom: '6px',
                  textTransform: 'uppercase'
                }}
              >
                OFFICIAL REGISTRATION REFERENCE ID
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}
              >
                <code
                  className="font-mono"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--accent-cyan)',
                    letterSpacing: '0.08em'
                  }}
                >
                  {submittedRefId}
                </code>

                <button
                  type="button"
                  onClick={handleCopyRef}
                  title="Copy Reference ID"
                  aria-label="Copy Reference ID"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: isCopied ? 'rgba(16, 185, 129, 0.2)' : 'var(--btn-secondary-bg)',
                    border: `1px solid ${isCopied ? 'var(--accent-emerald)' : 'var(--border-subtle)'}`,
                    color: isCopied ? 'var(--accent-emerald)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{isCopied ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
            </div>

            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                maxWidth: '480px',
                margin: '0 auto 28px'
              }}
            >
              Your onboarding details and declaration for placement aptitude enhancement have been recorded in the
              institutional archives.
            </p>

            <button
              onClick={handleClose}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 28px',
                fontSize: '0.85rem',
                letterSpacing: '0.06em'
              }}
              onMouseEnter={() => sound.playHover()}
            >
              <span>BACK TO QUIZ CLUB</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .reg-row-2 {
          grid-template-columns: 1fr;
        }
        @media (min-width: 560px) {
          .reg-modal-container {
            padding: 40px 36px !important;
            border-radius: 28px !important;
          }
          .reg-row-2 {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};
