import React, { useState, useEffect, useCallback } from 'react';
import { safeApiRequest } from '../utils/apiClient';
import {
  X,
  Lock,
  Key,
  ShieldCheck,
  Search,
  Download,
  RotateCw,
  LogOut,
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  Eye,
  CheckCircle2,
  Copy,
  Check,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StudentRegistration {
  id: number;
  ref_id: string;
  name: string;
  sic_no: string;
  branch: string;
  tenth_percentage: number;
  twelfth_percentage: number;
  interested_subject: string;
  declaration_accepted: number;
  created_at: string;
}

interface StatsData {
  total: number;
  todayCount: number;
  branchCounts: Record<string, number>;
  subjectCounts: Record<string, number>;
  recentCount: number;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('sqc_admin_token');
  });

  // Login form state
  const [passkey, setPasskey] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Dashboard data state
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [dbStatus, setDbStatus] = useState<string>('');
  const [isCloudDb, setIsCloudDb] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState<'date' | 'percentage' | 'name'>('date');

  // Selected student for detailed dossier inspection
  const [selectedStudent, setSelectedStudent] = useState<StudentRegistration | null>(null);
  const [isRefCopied, setIsRefCopied] = useState(false);

  const fetchRegistrations = useCallback(
    async (authToken: string) => {
      setIsLoadingData(true);
      setFetchError('');
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery.trim()) queryParams.set('search', searchQuery.trim());
        if (selectedBranch !== 'ALL') queryParams.set('branch', selectedBranch);
        if (selectedSubject !== 'ALL') queryParams.set('subject', selectedSubject);
        if (selectedSort) queryParams.set('sort', selectedSort);

        const apiResult = await safeApiRequest(`/api/admin/registrations?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        if (apiResult.status === 401) {
          setToken(null);
          sessionStorage.removeItem('sqc_admin_token');
          setLoginError('Admin session expired. Please authenticate again.');
          return;
        }

        if (!apiResult.ok || !apiResult.data?.success) {
          throw new Error(apiResult.error || 'Failed to fetch registrations.');
        }

        setRegistrations(apiResult.data.registrations || []);
        setStats(apiResult.data.stats || null);
        if (apiResult.data.dbStatus) setDbStatus(apiResult.data.dbStatus);
        if (typeof apiResult.data.isCloudDatabase === 'boolean') setIsCloudDb(apiResult.data.isCloudDatabase);
      } catch (err: any) {
        setFetchError(err.message || 'Error loading registration records');
      } finally {
        setIsLoadingData(false);
      }
    },
    [searchQuery, selectedBranch, selectedSubject, selectedSort]
  );

  // Auto-fetch data whenever filters change or when modal is opened and token is valid
  useEffect(() => {
    if (isOpen && token) {
      fetchRegistrations(token);
    }
  }, [isOpen, token, fetchRegistrations]);

  if (!isOpen) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) {
      setLoginError('Please enter administrator passkey.');
      sound.playIncorrect();
      return;
    }

    setIsAuthenticating(true);
    setLoginError('');
    sound.playClick();

    try {
      const apiResult = await safeApiRequest('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkey.trim() })
      });

      if (!apiResult.ok || !apiResult.data?.success) {
        throw new Error(apiResult.error || apiResult.data?.message || 'Invalid administrator passkey.');
      }

      sound.playSuccessCelebration();
      setToken(apiResult.data.token);
      sessionStorage.setItem('sqc_admin_token', apiResult.data.token);
      setPasskey('');
      fetchRegistrations(apiResult.data.token);
    } catch (err: any) {
      sound.playIncorrect();
      setLoginError(err.message || 'Authentication failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    sound.playClick();
    if (token) {
      try {
        await safeApiRequest('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        // safe
      }
    }
    setToken(null);
    sessionStorage.removeItem('sqc_admin_token');
    setRegistrations([]);
    setStats(null);
    setSelectedStudent(null);
  };

  const [isClearing, setIsClearing] = useState(false);

  const handleExportCSV = () => {
    if (!token) return;
    sound.playClick();
    window.location.href = `/api/admin/export-csv?token=${encodeURIComponent(token)}`;
  };

  const handleClearAll = async () => {
    if (!token) return;
    const confirmed = window.confirm(
      'Are you sure you want to remove ALL registered student records? This will clear all entries from the system.'
    );
    if (!confirmed) return;

    setIsClearing(true);
    sound.playClick();
    try {
      const res = await safeApiRequest('/api/admin/clear', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok && res.data?.success) {
        setRegistrations([]);
        setStats(null);
        setSelectedStudent(null);
        alert('All registrations have been removed successfully.');
      } else {
        alert(res.error || res.data?.message || 'Failed to clear registrations.');
      }
    } catch (err: any) {
      alert(err.message || 'Error clearing registrations.');
    } finally {
      setIsClearing(false);
      fetchRegistrations(token);
    }
  };

  const handleCopyRef = (refId: string) => {
    navigator.clipboard.writeText(refId);
    setIsRefCopied(true);
    sound.playClick();
    setTimeout(() => setIsRefCopied(false), 2000);
  };

  const formatDateTime = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  // Branch badge color helper
  const getBranchBadgeStyle = (branch: string) => {
    const b = branch.toUpperCase();
    if (b.includes('CSE')) return { bg: 'rgba(0, 242, 254, 0.12)', border: 'rgba(0, 242, 254, 0.35)', color: '#00f2fe' };
    if (b.includes('ECE')) return { bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.35)', color: '#38bdf8' };
    if (b.includes('ME')) return { bg: 'rgba(251, 191, 36, 0.12)', border: 'rgba(251, 191, 36, 0.35)', color: '#fbbf24' };
    if (b.includes('CE')) return { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.35)', color: '#c084fc' };
    if (b.includes('EE')) return { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.35)', color: '#10b981' };
    return { bg: 'rgba(255, 255, 255, 0.08)', border: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' };
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-dialog-title"
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
        padding: 'calc(14px + var(--sat)) calc(14px + var(--sar)) calc(14px + var(--sab)) calc(14px + var(--sal))',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={() => {
        sound.playClick();
        onClose();
      }}
    >
      <div
        className="admin-modal-container"
        style={{
          width: '100%',
          maxWidth: token ? '1120px' : '480px',
          maxHeight: '94dvh',
          overflowY: 'auto',
          borderRadius: '24px',
          padding: token ? '28px 24px' : '36px 28px',
          position: 'relative',
          backgroundColor: 'var(--form-card-bg)',
          border: '1px solid var(--form-card-border)',
          boxShadow: 'var(--shadow-elevated)',
          color: 'var(--text-primary)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          aria-label="Close Admin Portal"
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
            zIndex: 30,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <X size={18} />
        </button>

        {/* =======================================================================
           VIEW 1: ADMIN AUTHENTICATION
           ======================================================================= */}
        {!token ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'rgba(0, 242, 254, 0.1)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  boxShadow: '0 0 24px rgba(0, 242, 254, 0.25)'
                }}
              >
                <Lock size={22} color="var(--accent-cyan)" />
              </div>

              <span
                className="font-mono"
                style={{
                  display: 'block',
                  fontSize: '0.68rem',
                  color: 'var(--accent-cyan)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '6px'
                }}
              >
                SILICON INSTITUTE OF TECHNOLOGY, SAMBALPUR, ODISHA
              </span>

              <h2
                id="admin-dialog-title"
                className="font-display"
                style={{
                  fontSize: 'clamp(1.4rem, 4vw, 1.85rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: '8px'
                }}
              >
                CLUB ADMIN ACCESS
              </h2>

              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Authorized administrator console for student registration verification, applicant analytics, and placement
                curation.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label
                  htmlFor="admin-passkey-input"
                  className="form-field-label"
                >
                  ADMINISTRATOR PASSKEY *
                </label>
                <div
                  className={`form-input-container ${loginError ? 'error' : ''}`}
                >
                  <Key size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  <input
                    id="admin-passkey-input"
                    type="password"
                    placeholder="Enter admin security passkey"
                    value={passkey}
                    onChange={(e) => {
                      setPasskey(e.target.value);
                      setLoginError('');
                    }}
                    autoFocus
                    className="form-text-input font-mono"
                  />
                </div>

                {loginError && (
                  <p style={{ color: '#f43f5e', fontSize: '0.75rem', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                    {loginError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="btn-cyan"
                style={{
                  padding: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700
                }}
                onMouseEnter={() => sound.playHover()}
              >
                <ShieldCheck size={16} />
                <span>{isAuthenticating ? 'VERIFYING SECURITY CREDENTIALS...' : 'ACCESS ADMIN CONSOLE'}</span>
              </button>
            </form>

            <div
              style={{
                marginTop: '20px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--text-muted)'
              }}
            >
              Default Admin Key: <code>Silicon@Quiz2026</code>
            </div>
          </div>
        ) : (
          /* =======================================================================
             VIEW 2: FULL ADMIN MANAGEMENT CONSOLE
             ======================================================================= */
          <div>
            {/* Top Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                paddingBottom: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '20px'
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--accent-cyan)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '4px'
                  }}
                >
                  <ShieldCheck size={13} />
                  <span>SILICON INSTITUTE OF TECHNOLOGY · SAMBALPUR, ODISHA</span>
                </div>
                <h2
                  id="admin-dialog-title"
                  className="font-display"
                  style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.75rem)', fontWeight: 800, color: '#ffffff' }}
                >
                  REGISTRATION MANAGEMENT CONSOLE
                </h2>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleExportCSV}
                  className="btn-cyan"
                  style={{ padding: '8px 14px', fontSize: '0.78rem', gap: '6px' }}
                  title="Download registrations in CSV format"
                  onMouseEnter={() => sound.playHover()}
                >
                  <Download size={14} />
                  <span>EXPORT CSV</span>
                </button>

                <button
                  onClick={handleClearAll}
                  disabled={isClearing || (registrations.length === 0 && (!stats || stats.total === 0))}
                  className="btn-secondary"
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.78rem',
                    gap: '6px',
                    borderColor: 'rgba(239, 68, 68, 0.35)',
                    color: '#ef4444',
                    opacity: (registrations.length === 0 && (!stats || stats.total === 0)) ? 0.5 : 1
                  }}
                  title="Remove all registration entries"
                  onMouseEnter={() => sound.playHover()}
                >
                  <Trash2 size={14} />
                  <span>{isClearing ? 'CLEARING...' : 'CLEAR ALL'}</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    if (token) fetchRegistrations(token);
                  }}
                  disabled={isLoadingData}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.78rem', gap: '6px' }}
                  title="Refresh registration data"
                  onMouseEnter={() => sound.playHover()}
                >
                  <RotateCw size={14} className={isLoadingData ? 'spin' : ''} />
                  <span>REFRESH</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.78rem',
                    gap: '6px',
                    borderColor: 'rgba(244, 63, 94, 0.3)',
                    color: '#f87171'
                  }}
                  title="Sign out of Admin Session"
                  onMouseEnter={() => sound.playHover()}
                >
                  <LogOut size={14} />
                  <span>LOGOUT</span>
                </button>
              </div>
            </div>

            {/* Metrics Overview Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginBottom: '24px'
              }}
            >
              <div
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  background: 'rgba(0, 242, 254, 0.05)',
                  border: '1px solid rgba(0, 242, 254, 0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                  <Users size={16} />
                  <span className="font-mono" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                    TOTAL REGISTRATIONS
                  </span>
                </div>
                <div className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {stats ? stats.total : registrations.length}
                </div>
                <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isCloudDb ? '#10b981' : '#f59e0b', display: 'inline-block' }} />
                  <span style={{ color: isCloudDb ? '#10b981' : 'var(--text-muted)' }}>
                    {dbStatus || (isCloudDb ? 'PostgreSQL Cloud Connected' : 'Serverless Storage')}
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '8px' }}>
                  <Calendar size={16} />
                  <span className="font-mono" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                    TODAY'S INTAKE
                  </span>
                </div>
                <div className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {stats ? stats.todayCount : 0}
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  background: 'rgba(251, 191, 36, 0.05)',
                  border: '1px solid rgba(251, 191, 36, 0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', marginBottom: '8px' }}>
                  <GraduationCap size={16} />
                  <span className="font-mono" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                    ENGINEERING BRANCHES
                  </span>
                </div>
                <div className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {stats ? Object.keys(stats.branchCounts).length : 5}
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  background: 'rgba(168, 85, 247, 0.05)',
                  border: '1px solid rgba(168, 85, 247, 0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', marginBottom: '8px' }}>
                  <BookOpen size={16} />
                  <span className="font-mono" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                    PLACEMENTS FOCUS
                  </span>
                </div>
                <div className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  100%
                </div>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                alignItems: 'center',
                padding: '14px',
                borderRadius: '14px',
                background: 'var(--form-section-bg)',
                border: '1px solid var(--form-section-border)',
                marginBottom: '20px'
              }}
            >
              {/* Search input */}
              <div
                className="form-input-container"
                style={{ flex: '1 1 240px', padding: '9px 12px' }}
              >
                <Search size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search student name, SIC No., or Ref ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-text-input"
                  style={{ fontSize: '14px' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Branch Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  BRANCH:
                </span>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--form-select-bg)',
                    border: '1px solid var(--input-border)',
                    color: 'var(--form-select-option-text)',
                    fontSize: '13px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ALL" style={{ background: 'var(--form-select-option-bg)', color: 'var(--form-select-option-text)' }}>All Branches</option>
                  <option value="CSE" style={{ background: 'var(--form-select-option-bg)', color: 'var(--form-select-option-text)' }}>CSE</option>
                  <option value="ECE" style={{ background: 'var(--form-select-option-bg)', color: 'var(--form-select-option-text)' }}>ECE</option>
                  <option value="ME" style={{ background: 'var(--form-select-option-bg)', color: 'var(--form-select-option-text)' }}>ME</option>
                  <option value="CE" style={{ background: 'var(--form-select-option-bg)', color: 'var(--form-select-option-text)' }}>CE</option>
                  <option value="EE" style={{ background: 'var(--form-select-option-bg)', color: 'var(--form-select-option-text)' }}>EE</option>
                </select>
              </div>

              {/* Subject Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  SUBJECT:
                </span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--form-select-bg)',
                    border: '1px solid var(--input-border)',
                    color: 'var(--form-select-option-text)',
                    fontSize: '13px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ALL" style={{ background: 'var(--form-select-option-bg)', color: 'var(--form-select-option-text)' }}>All Subjects</option>
                  <option value="Physics" style={{ background: 'var(--form-select-option-bg)', color: 'var(--form-select-option-text)' }}>Physics</option>
                  <option value="Chemistry" style={{ background: 'var(--form-select-option-bg)', color: 'var(--form-select-option-text)' }}>Chemistry</option>
                  <option value="Mathematics" style={{ background: 'var(--form-select-option-bg)', color: 'var(--form-select-option-text)' }}>Mathematics</option>
                  <option value="Other" style={{ background: 'var(--form-select-option-bg)', color: 'var(--form-select-option-text)' }}>Other</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  SORT:
                </span>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value as any)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--form-select-bg)',
                    border: '1px solid var(--input-border)',
                    color: 'var(--form-select-option-text)',
                    fontSize: '13px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="date" style={{ background: 'var(--form-select-option-bg)', color: 'var(--form-select-option-text)' }}>Newest First</option>
                  <option value="percentage" style={{ background: 'var(--form-select-option-bg)', color: 'var(--form-select-option-text)' }}>Highest Marks</option>
                  <option value="name" style={{ background: 'var(--form-select-option-bg)', color: 'var(--form-select-option-text)' }}>Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Error state */}
            {fetchError && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#f87171',
                  marginBottom: '16px',
                  fontSize: '0.85rem'
                }}
              >
                {fetchError}
              </div>
            )}

            {/* Registrations Data Table */}
            <div
              style={{
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.015)'
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <th className="font-mono" style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                        REF ID
                      </th>
                      <th className="font-mono" style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                        STUDENT NAME
                      </th>
                      <th className="font-mono" style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                        SIC NO.
                      </th>
                      <th className="font-mono" style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                        BRANCH
                      </th>
                      <th className="font-mono" style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                        10TH / 12TH (%)
                      </th>
                      <th className="font-mono" style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                        INTEREST
                      </th>
                      <th className="font-mono" style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                        REGISTERED AT
                      </th>
                      <th className="font-mono" style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.7rem', textAlign: 'right' }}>
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          {isLoadingData ? (
                            'Fetching institutional registrations...'
                          ) : (
                            <div>
                              <FileSpreadsheet size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                              <p>No matching student registrations found in database.</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    ) : (
                      registrations.map((student) => {
                        const badge = getBranchBadgeStyle(student.branch);
                        return (
                          <tr
                            key={student.ref_id}
                            style={{
                              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <td style={{ padding: '12px 16px' }}>
                              <code
                                className="font-mono"
                                style={{
                                  color: 'var(--accent-cyan)',
                                  fontSize: '0.78rem',
                                  fontWeight: 600
                                }}
                              >
                                {student.ref_id}
                              </code>
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {student.name}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {student.sic_no}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  background: badge.bg,
                                  border: `1px solid ${badge.border}`,
                                  color: badge.color,
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  fontFamily: 'var(--font-mono)'
                                }}
                              >
                                {student.branch.split('—')[0].trim()}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {student.tenth_percentage}% / {student.twelfth_percentage}%
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  color: 'var(--text-secondary)'
                                }}
                              >
                                {student.interested_subject}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {formatDateTime(student.created_at)}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  setSelectedStudent(student);
                                }}
                                className="btn-secondary"
                                style={{ padding: '5px 10px', fontSize: '0.72rem', gap: '4px' }}
                                title="View Full Student Dossier"
                              >
                                <Eye size={13} />
                                <span>DOSSIER</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total count indicator */}
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Showing {registrations.length} student records</span>
              <span>Silicon Institute of Technology, Sambalpur, Odisha</span>
            </div>
          </div>
        )}

        {/* =======================================================================
           VIEW 3: INDIVIDUAL STUDENT DOSSIER MODAL
           ======================================================================= */}
        {selectedStudent && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100000,
              backgroundColor: 'var(--form-modal-backdrop)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setSelectedStudent(null)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '540px',
                borderRadius: '20px',
                padding: '28px',
                backgroundColor: 'var(--form-card-bg)',
                border: '1px solid var(--form-card-border)',
                color: 'var(--text-primary)',
                position: 'relative',
                boxShadow: 'var(--shadow-elevated)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedStudent(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--form-modal-close-bg)',
                  border: '1px solid var(--form-modal-close-border)',
                  color: 'var(--form-modal-close-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>

              <div style={{ marginBottom: '20px' }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--accent-cyan)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase'
                  }}
                >
                  INDIVIDUAL STUDENT ONBOARDING DOSSIER
                </span>
                <h3 className="font-display" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {selectedStudent.name}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SIC NUMBER</span>
                    <p className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700, marginTop: '2px' }}>{selectedStudent.sic_no}</p>
                  </div>
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'var(--form-section-bg)', border: '1px solid var(--form-section-border)' }}>
                    <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>REFERENCE ID</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{selectedStudent.ref_id}</p>
                      <button
                        onClick={() => handleCopyRef(selectedStudent.ref_id)}
                        style={{ background: 'none', border: 'none', color: isRefCopied ? 'var(--accent-emerald)' : 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        {isRefCopied ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '10px', borderRadius: '10px', background: 'var(--form-section-bg)', border: '1px solid var(--form-section-border)' }}>
                  <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ACADEMIC BRANCH</span>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>{selectedStudent.branch}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'var(--form-section-bg)', border: '1px solid var(--form-section-border)' }}>
                    <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>10TH RESULT</span>
                    <p className="font-mono" style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 800, marginTop: '2px' }}>{selectedStudent.tenth_percentage}%</p>
                  </div>
                  <div style={{ padding: '10px', borderRadius: '10px', background: 'var(--form-section-bg)', border: '1px solid var(--form-section-border)' }}>
                    <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>12TH RESULT</span>
                    <p className="font-mono" style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 800, marginTop: '2px' }}>{selectedStudent.twelfth_percentage}%</p>
                  </div>
                </div>

                <div style={{ padding: '10px', borderRadius: '10px', background: 'var(--form-section-bg)', border: '1px solid var(--form-section-border)' }}>
                  <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>INTERESTED SUBJECT</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: 600, marginTop: '2px' }}>{selectedStudent.interested_subject}</p>
                </div>

                <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', marginBottom: '4px' }}>
                    <CheckCircle2 size={14} />
                    <span className="font-mono" style={{ fontSize: '0.68rem', fontWeight: 700 }}>DECLARATION ACCEPTED & CONFIRMED</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Student agreed to prepare for placements with Placement Club support, participate actively in Quiz Club events, and pay any minimal activity fee.
                  </p>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  Recorded on: {formatDateTime(selectedStudent.created_at)}
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '10px' }}
                >
                  CLOSE DOSSIER
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
