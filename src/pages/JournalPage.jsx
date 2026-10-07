import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Compass, Edit3, ArrowRight, Mountain, Tag, Share2 } from 'lucide-react';
import { useStory } from '../context/StoryContext';

export default function JournalPage() {
  const { storyData, setActiveLightboxImg } = useStory();
  const [activeSectionId, setActiveSectionId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.story-section');
      const scrollPos = window.scrollY + 200;

      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSectionId(id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [storyData]);

  const { sections = [] } = storyData;

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge-row">
          <p className="eyebrow">{storyData.siteSubtitle || 'Himachal Pradesh, India'}</p>
          <span className="hero-chip">5,319 m / 17,450 ft</span>
          <span className="hero-chip">100+ km</span>
          <span className="hero-chip">10 Days</span>
        </div>

        <h1>{storyData.siteTitle || 'Pin Parvati Pass'}</h1>
        
        <p className="hero-description">
          {storyData.siteDescription ||
            'A trail journal from the Pin Parvati Pass expedition — day-by-day notes, altitude, weather, and the photos that came with it.'}
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-val">10 Days</span>
            <span className="hero-stat-lbl">Expedition Duration</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-val">5,319 m</span>
            <span className="hero-stat-lbl">Peak Pass Altitude</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-val">{sections.length}</span>
            <span className="hero-stat-lbl">Journal Chapters</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-val">Parvati → Spiti</span>
            <span className="hero-stat-lbl">Trail Route</span>
          </div>
        </div>
      </section>

      {/* Right Desktop Dot Navigation */}
      {sections.length > 0 && (
        <nav className="index-nav" aria-label="Journal sections navigation">
          {sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.slug || sec.id}`}
              className={`index-dot ${activeSectionId === (sec.slug || sec.id) ? 'is-active' : ''}`}
            >
              <span className="dot"></span>
              <span className="index-label">{sec.title}</span>
            </a>
          ))}
        </nav>
      )}

      {/* Mobile Horizontal Chapter Navigation */}
      {sections.length > 0 && (
        <nav className="index-nav-mobile" aria-label="Mobile sections navigation">
          {sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.slug || sec.id}`}
              className={activeSectionId === (sec.slug || sec.id) ? 'is-active' : ''}
            >
              {sec.title}
            </a>
          ))}
        </nav>
      )}

      {/* Story Stream */}
      <div className="story-container">
        {sections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Mountain size={48} color="var(--muted)" style={{ margin: '0 auto 16px' }} />
            <p className="empty">The trail hasn't started yet — no sections created yet.</p>
            <Link to="/writeup" className="btn btn-primary" style={{ marginTop: 12 }}>
              <Edit3 size={16} /> Open Writeup Editor &amp; Add First Section
            </Link>
          </div>
        ) : (
          sections.map((section, sIndex) => (
            <article
              key={section.id}
              id={section.slug || section.id}
              className="story-section"
            >
              <div className="section-top-bar">
                <div className="post-meta">
                  {section.tag && <span className="tag">{section.tag}</span>}
                  {section.location && (
                    <span className="meta-item">
                      <MapPin size={13} />
                      {section.location}
                    </span>
                  )}
                  {section.altitude && (
                    <span className="meta-item">
                      <Compass size={13} />
                      {section.altitude}
                    </span>
                  )}
                </div>
              </div>

              <h2>{section.title}</h2>
              <time dateTime={section.date}>{section.dateDisplay || section.date}</time>

              {/* Cover Photo */}
              {section.cover && (
                <div
                  className="post-cover"
                  onClick={() =>
                    setActiveLightboxImg({
                      url: section.cover,
                      caption: section.title,
                      alt: section.title
                    })
                  }
                >
                  <img src={section.cover} alt={section.title} loading="lazy" />
                </div>
              )}

              {/* Excerpt */}
              {section.excerpt && (
                <p className="post-excerpt">{section.excerpt}</p>
              )}

              {/* Dynamic Blocks: Texts, Headings, Quotes, and Photos anywhere */}
              <div className="section-blocks-flow">
                {(section.blocks || []).map((block, bIndex) => {
                  if (block.type === 'text') {
                    return (
                      <p key={block.id || bIndex} className="block-text">
                        {block.content}
                      </p>
                    );
                  }

                  if (block.type === 'heading') {
                    const HeadingTag = block.level === 3 ? 'h3' : 'h2';
                    return (
                      <HeadingTag
                        key={block.id || bIndex}
                        className={block.level === 3 ? 'block-heading-3' : 'block-heading-2'}
                      >
                        {block.text}
                      </HeadingTag>
                    );
                  }

                  if (block.type === 'quote') {
                    return (
                      <blockquote key={block.id || bIndex} className="block-quote">
                        <p>"{block.text}"</p>
                        {block.author && (
                          <span className="block-quote-author">— {block.author}</span>
                        )}
                      </blockquote>
                    );
                  }

                  if (block.type === 'photo') {
                    const layoutClass = block.layout || 'detail';
                    return (
                      <figure
                        key={block.id || bIndex}
                        className={`block-photo layout-${layoutClass}`}
                      >
                        <div
                          className="photo-frame"
                          onClick={() =>
                            setActiveLightboxImg({
                              url: block.url,
                              caption: block.caption,
                              alt: block.alt || block.caption
                            })
                          }
                        >
                          <img
                            src={block.url}
                            alt={block.alt || block.caption || 'Trail photograph'}
                            loading="lazy"
                          />
                        </div>
                        {block.caption && (
                          <figcaption className="photo-caption">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }

                  if (block.type === 'gallery') {
                    return (
                      <div key={block.id || bIndex} className="block-gallery">
                        {(block.photos || []).map((p, pIdx) => (
                          <div
                            key={pIdx}
                            className="gallery-photo-item"
                            onClick={() =>
                              setActiveLightboxImg({
                                url: p.url,
                                caption: p.caption,
                                alt: p.caption || 'Gallery photo'
                              })
                            }
                          >
                            <img src={p.url} alt={p.caption || 'Gallery image'} loading="lazy" />
                          </div>
                        ))}
                      </div>
                    );
                  }

                  if (block.type === 'callout') {
                    return (
                      <div
                        key={block.id || bIndex}
                        style={{
                          background: 'var(--paper)',
                          borderLeft: '4px solid var(--ridge-1)',
                          padding: '16px 20px',
                          borderRadius: '0 8px 8px 0',
                          margin: '24px 0',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <p style={{ margin: 0, fontSize: '0.95rem' }}>{block.text}</p>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
