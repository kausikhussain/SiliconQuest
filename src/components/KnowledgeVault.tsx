import React, { useState } from 'react';
import { Download, Check, Clock } from 'lucide-react';
import { KNOWLEDGE_RESOURCES } from '../data/clubData';
import { sound } from '../utils/soundEngine';

export const KnowledgeVault: React.FC = () => {
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  const handleDownload = (id: string, name: string) => {
    sound.playClick();
    setDownloadedIds((prev) => [...prev, id]);
    alert(`Acquiring blueprint: ${name}\nGenerating validated Silicon Quiz Club PDF packet...`);
  };

  return (
    <section
      id="vault"
      style={{
        padding: '80px 0',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
        borderTop: '1px solid var(--border-subtle)'
      }}
      className="vault-main-section"
    >
      <div className="section-container">
        {/* Section Header */}
        <div style={{ marginBottom: '40px' }} className="vault-header">
          <div className="section-tagline">09 · KNOWLEDGE REPOSITORY</div>
          <h2 className="section-title">
            THE ARCHIVAL <span style={{ color: 'var(--accent-cyan)' }}>VAULT</span>
          </h2>
          <p className="section-subtitle">
            Curated playbooks, speed-aptitude formulas, and question-setting frameworks compiled by senior club quizmasters.
          </p>
        </div>

        {/* Resource Cards Grid */}
        <div
          style={{
            display: 'grid',
            gap: '20px'
          }}
          className="vault-cards-grid"
        >
          {KNOWLEDGE_RESOURCES.map((res) => {
            const isDownloaded = downloadedIds.includes(res.id);
            return (
              <div
                key={res.id}
                className="glass-panel"
                style={{
                  padding: '24px 20px',
                  borderRadius: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '280px',
                  border: '1px solid var(--border-subtle)'
                }}
                onMouseEnter={() => sound.playHover()}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}
                  >
                    <span className="badge-tag">{res.category}</span>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <Clock size={11} />
                      <span>{res.readTime}</span>
                    </div>
                  </div>

                  <h3
                    className="font-display"
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '10px',
                      lineHeight: 1.3
                    }}
                  >
                    {res.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      lineHeight: 1.55,
                      color: 'var(--text-secondary)',
                      marginBottom: '20px'
                    }}
                  >
                    {res.description}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '5px',
                      marginBottom: '18px'
                    }}
                  >
                    {res.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.65rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-muted)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: 'var(--btn-secondary-bg)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Download CTA */}
                  <button
                    onClick={() => handleDownload(res.id, res.downloadName)}
                    className={isDownloaded ? 'btn-secondary' : 'btn-primary'}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '0.75rem'
                    }}
                  >
                    {isDownloaded ? (
                      <>
                        <Check size={14} color="var(--accent-emerald)" />
                        <span>BLUEPRINT DOWNLOADED</span>
                      </>
                    ) : (
                      <>
                        <Download size={14} />
                        <span>GET {res.format.toUpperCase()}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .vault-cards-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 600px) {
          .vault-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .vault-main-section {
            padding: 120px 0;
          }
          .vault-header {
            margin-bottom: 64px;
          }
          .vault-cards-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
          }
        }
      `}</style>
    </section>
  );
};
