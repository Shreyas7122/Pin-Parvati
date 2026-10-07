import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Type,
  Heading as HeadingIcon,
  Quote,
  Layout,
  Eye,
  Save,
  Download,
  UploadCloud,
  RotateCcw,
  Sparkles,
  FileText,
  MapPin,
  Compass,
  Calendar,
  Layers,
  Copy,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useStory } from '../context/StoryContext';
import PhotoPickerModal from '../components/PhotoPickerModal';
import { assetUrl } from '../utils/assetUrl';

export default function WriteupEditorPage() {
  const {
    storyData,
    addSection,
    updateSection,
    deleteSection,
    moveSection,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    duplicateBlock,
    resetToDefault,
    exportJSON,
    importJSON,
    exportMarkdown,
    showToast
  } = useStory();

  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSecId = searchParams.get('section');

  const [selectedSectionId, setSelectedSectionId] = useState(
    requestedSecId || storyData.sections?.[0]?.id || ''
  );

  const [viewMode, setViewMode] = useState('edit'); // 'edit' | 'split' | 'preview'
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoTarget, setPhotoTarget] = useState(null); // { type: 'cover' | 'block' | 'insert', blockIndex?: number, sectionId?: string }

  // Sync selected section when URL query param or sections change
  useEffect(() => {
    if (requestedSecId && storyData.sections.some((s) => s.id === requestedSecId)) {
      setSelectedSectionId(requestedSecId);
    } else if (!selectedSectionId && storyData.sections.length > 0) {
      setSelectedSectionId(storyData.sections[0].id);
    }
  }, [requestedSecId, storyData.sections]);

  const activeSectionIndex = storyData.sections.findIndex((s) => s.id === selectedSectionId);
  const currentSection = storyData.sections[activeSectionIndex] || storyData.sections[0];

  // Helper for opening photo modal
  const openCoverPhotoPicker = () => {
    setPhotoTarget({ type: 'cover', sectionId: currentSection?.id });
    setIsPhotoModalOpen(true);
  };

  const openInsertPhotoModal = (insertIndex = null) => {
    setPhotoTarget({ type: 'insert', sectionId: currentSection?.id, insertIndex });
    setIsPhotoModalOpen(true);
  };

  const openReplacePhotoModal = (blockId) => {
    setPhotoTarget({ type: 'replace', sectionId: currentSection?.id, blockId });
    setIsPhotoModalOpen(true);
  };

  const handlePhotoSelected = (photoData) => {
    if (!photoTarget) return;

    if (photoTarget.type === 'cover') {
      updateSection(photoTarget.sectionId, { cover: photoData.url });
      showToast('📸 Cover photo updated');
    } else if (photoTarget.type === 'insert') {
      addBlock(
        photoTarget.sectionId,
        {
          type: 'photo',
          url: photoData.url,
          caption: photoData.caption || '',
          alt: photoData.alt || '',
          layout: 'detail'
        },
        photoTarget.insertIndex
      );
    } else if (photoTarget.type === 'replace') {
      updateBlock(photoTarget.sectionId, photoTarget.blockId, {
        url: photoData.url,
        caption: photoData.caption || undefined,
        alt: photoData.alt || undefined
      });
      showToast('📸 Photo updated');
    }
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (text) {
          importJSON(text);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div className="editor-header-bar">
        <div className="editor-header-inner">
          <div className="editor-title-group">
            <span className="editor-badge">
              <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
              Writeup Studio
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={15} color="#10b981" /> Auto-saved
            </span>
          </div>

          <div className="editor-actions">
            {/* View Mode Tabs */}
            <div className="view-tabs">
              <button
                className={`view-tab ${viewMode === 'edit' ? 'active' : ''}`}
                onClick={() => setViewMode('edit')}
              >
                Editor
              </button>
              <button
                className={`view-tab ${viewMode === 'split' ? 'active' : ''}`}
                onClick={() => setViewMode('split')}
              >
                Split Preview
              </button>
              <button
                className={`view-tab ${viewMode === 'preview' ? 'active' : ''}`}
                onClick={() => setViewMode('preview')}
              >
                Full Preview
              </button>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => exportMarkdown(currentSection?.id)}
              title="Download Section as Markdown"
            >
              <FileText size={14} />
              <span>Export MD</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={exportJSON}
              title="Export all story data as JSON"
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleImportClick}
              title="Import JSON story backup"
            >
              <UploadCloud size={14} />
              <span>Import</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={resetToDefault}
              title="Reset all sections to initial Pin Parvati story"
            >
              <RotateCcw size={14} />
            </button>

            <Link to="/" className="btn btn-primary">
              <Eye size={14} />
              <span>View Journal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Editor Main Content Area */}
      <div className={`editor-layout ${viewMode === 'split' ? 'view-split' : ''}`}>
        {/* Left Sidebar: Sections List */}
        <aside className="editor-sidebar">
          <div className="sidebar-heading">
            <h3>Story Sections ({storyData.sections.length})</h3>
            <button
              className="btn btn-primary"
              style={{ padding: '4px 8px', fontSize: '0.78rem' }}
              onClick={() => {
                const newId = addSection({ title: 'New Chapter ' + (storyData.sections.length + 1) });
                setSelectedSectionId(newId);
              }}
            >
              <Plus size={14} /> New Section
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {storyData.sections.map((sec, idx) => {
              const isSelected = sec.id === selectedSectionId;
              return (
                <div
                  key={sec.id}
                  className={`section-item-nav ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedSectionId(sec.id);
                    setSearchParams({ section: sec.id });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                    <span style={{ fontSize: '0.75rem', opacity: 0.6, width: 18, fontFamily: 'var(--font-mono)' }}>
                      #{idx + 1}
                    </span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sec.title || 'Untitled'}
                    </span>
                  </div>

                  <div className="section-reorder-btns" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn-icon-sm"
                      onClick={() => moveSection(idx, -1)}
                      disabled={idx === 0}
                      title="Move section up"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      className="btn-icon-sm"
                      onClick={() => moveSection(idx, 1)}
                      disabled={idx === storyData.sections.length - 1}
                      title="Move section down"
                    >
                      <ChevronDown size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div style={{ marginTop: 'auto', padding: 12, background: 'var(--border-light)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--muted)' }}>
            <strong>💡 Section Tip:</strong> Add photos anywhere inside the section by clicking <em>"+ Add Photo Here"</em> between paragraphs.
          </div>
        </aside>

        {/* Center / Main: Section Editor Workspace */}
        {viewMode !== 'preview' && currentSection && (
          <main className="editor-workspace">
            <div className="editor-section-card">
              {/* Section Top Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Layers size={18} color="var(--accent)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)' }}>
                    Editing Section #{activeSectionIndex + 1}
                  </span>
                </div>

                <button
                  className="btn btn-danger"
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  onClick={() => {
                    if (storyData.sections.length <= 1) {
                      alert('You must have at least one section.');
                      return;
                    }
                    if (window.confirm(`Delete section "${currentSection.title}"?`)) {
                      deleteSection(currentSection.id);
                      setSelectedSectionId(storyData.sections[0].id);
                    }
                  }}
                >
                  <Trash2 size={13} /> Delete Section
                </button>
              </div>

              {/* Metadata Fields */}
              <div className="section-meta-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Section Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentSection.title || ''}
                    onChange={(e) => updateSection(currentSection.id, { title: e.target.value })}
                    placeholder="e.g. Day 1 — The Climb to Khirganga"
                    style={{ fontSize: '1.2rem', fontWeight: 600 }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tag / Category</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentSection.tag || ''}
                    onChange={(e) => updateSection(currentSection.id, { tag: e.target.value })}
                    placeholder="e.g. Origin of Pin Parvati, Day 1, Summit"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date Display</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentSection.dateDisplay || ''}
                    onChange={(e) => updateSection(currentSection.id, { dateDisplay: e.target.value })}
                    placeholder="e.g. 15 August 2026"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentSection.location || ''}
                    onChange={(e) => updateSection(currentSection.id, { location: e.target.value })}
                    placeholder="e.g. Kasol, Chojh, Spiti"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Altitude</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentSection.altitude || ''}
                    onChange={(e) => updateSection(currentSection.id, { altitude: e.target.value })}
                    placeholder="e.g. 5,319 m"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Section Excerpt / Intro Summary</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={currentSection.excerpt || ''}
                    onChange={(e) => updateSection(currentSection.id, { excerpt: e.target.value })}
                    placeholder="Brief 1-2 sentence hook for this chapter..."
                  />
                </div>

                {/* Section Cover Photo */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Section Cover Photo</label>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                      onClick={openCoverPhotoPicker}
                    >
                      <ImageIcon size={13} /> Change Cover Photo
                    </button>
                  </div>
                  {currentSection.cover ? (
                    <div style={{ marginTop: 8, position: 'relative', borderRadius: 8, overflow: 'hidden', maxHeight: 200, border: '1px solid var(--border)' }}>
                      <img src={assetUrl(currentSection.cover)} alt="Cover" style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />
                      <button
                        onClick={() => updateSection(currentSection.id, { cover: '' })}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          borderRadius: '50%',
                          padding: 6
                        }}
                        title="Remove cover"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="dropzone"
                      style={{ display: 'block', padding: '16px', marginTop: 8 }}
                      onClick={openCoverPhotoPicker}
                    >
                      <ImageIcon size={20} color="var(--accent)" style={{ margin: '0 auto 4px' }} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Click to pick or upload a cover image</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Section Content & Photos Stream */}
              <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--ridge-1)' }}>
                    Section Content &amp; Photos Stream
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                    {currentSection.blocks?.length || 0} blocks
                  </span>
                </div>

                {/* Top Insert Bar (insert at beginning of section) */}
                <div className="insert-bar">
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Insert at top:</span>
                  <button
                    className="insert-pill-btn"
                    onClick={() => addBlock(currentSection.id, { type: 'text', content: '' }, 0)}
                  >
                    <Type size={12} /> + Text
                  </button>
                  <button
                    className="insert-pill-btn pill-photo"
                    onClick={() => openInsertPhotoModal(0)}
                  >
                    <ImageIcon size={12} /> + Photo
                  </button>
                  <button
                    className="insert-pill-btn"
                    onClick={() => addBlock(currentSection.id, { type: 'heading', level: 2, text: '' }, 0)}
                  >
                    <HeadingIcon size={12} /> + Heading
                  </button>
                  <button
                    className="insert-pill-btn"
                    onClick={() => addBlock(currentSection.id, { type: 'quote', text: '', author: '' }, 0)}
                  >
                    <Quote size={12} /> + Quote
                  </button>
                </div>

                {/* Blocks List */}
                <div className="blocks-stream">
                  {(currentSection.blocks || []).map((block, bIdx) => (
                    <React.Fragment key={block.id || bIdx}>
                      <div className="editor-block-card">
                        {/* Block Header Toolbar */}
                        <div className="block-header-controls">
                          <div className="block-type-badge">
                            {block.type === 'text' && <><Type size={13} /> Text Paragraph</>}
                            {block.type === 'heading' && <><HeadingIcon size={13} /> Heading (H{block.level || 2})</>}
                            {block.type === 'quote' && <><Quote size={13} /> Quote Callout</>}
                            {block.type === 'photo' && <><ImageIcon size={13} /> Photo Block</>}
                            {block.type === 'gallery' && <><ImageIcon size={13} /> Photo Gallery</>}
                          </div>

                          <div className="block-btn-group">
                            <button
                              className="btn-icon-sm"
                              onClick={() => moveBlock(currentSection.id, bIdx, -1)}
                              disabled={bIdx === 0}
                              title="Move up"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button
                              className="btn-icon-sm"
                              onClick={() => moveBlock(currentSection.id, bIdx, 1)}
                              disabled={bIdx === currentSection.blocks.length - 1}
                              title="Move down"
                            >
                              <ChevronDown size={14} />
                            </button>
                            <button
                              className="btn-icon-sm"
                              onClick={() => duplicateBlock(currentSection.id, bIdx)}
                              title="Duplicate block"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              className="btn-icon-sm"
                              onClick={() => deleteBlock(currentSection.id, block.id)}
                              title="Delete block"
                              style={{ color: '#ef4444' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Block Content Editor depending on type */}
                        {block.type === 'text' && (
                          <div style={{ width: '100%' }}>
                            <textarea
                              className="form-textarea"
                              rows={6}
                              style={{ width: '100%', minHeight: 160, display: 'block', boxSizing: 'border-box' }}
                              value={block.content || ''}
                              onChange={(e) => updateBlock(currentSection.id, block.id, { content: e.target.value })}
                              placeholder="Write your story text here... Use **bold** or *italic* if desired."
                            />
                          </div>
                        )}

                        {block.type === 'heading' && (
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <select
                              className="form-input"
                              style={{ width: 100 }}
                              value={block.level || 2}
                              onChange={(e) => updateBlock(currentSection.id, block.id, { level: Number(e.target.value) })}
                            >
                              <option value={2}>H2 (Large)</option>
                              <option value={3}>H3 (Medium)</option>
                            </select>
                            <input
                              type="text"
                              className="form-input"
                              style={{ flex: 1, fontWeight: 600 }}
                              value={block.text || ''}
                              onChange={(e) => updateBlock(currentSection.id, block.id, { text: e.target.value })}
                              placeholder="Enter subheading..."
                            />
                          </div>
                        )}

                        {block.type === 'quote' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <textarea
                              className="form-textarea"
                              rows={2}
                              value={block.text || ''}
                              onChange={(e) => updateBlock(currentSection.id, block.id, { text: e.target.value })}
                              placeholder="Quote text..."
                              style={{ fontStyle: 'italic' }}
                            />
                            <input
                              type="text"
                              className="form-input"
                              value={block.author || ''}
                              onChange={(e) => updateBlock(currentSection.id, block.id, { author: e.target.value })}
                              placeholder="Author / Attribution (e.g. Bhaiji, Dad, Guide)"
                            />
                          </div>
                        )}

                        {block.type === 'photo' && (
                          <div className="photo-editor-body">
                            <div className="photo-preview-box">
                              <img src={assetUrl(block.url)} alt={block.caption || 'Photo'} />
                            </div>

                            <div className="photo-controls-row">
                              <button
                                className="btn btn-secondary"
                                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                                onClick={() => openReplacePhotoModal(block.id)}
                              >
                                <ImageIcon size={13} /> Change Image
                              </button>

                              <div className="layout-selector">
                                <span>Layout:</span>
                                <select
                                  className="form-input"
                                  style={{ padding: '3px 8px', fontSize: '0.78rem' }}
                                  value={block.layout || 'detail'}
                                  onChange={(e) => updateBlock(currentSection.id, block.id, { layout: e.target.value })}
                                >
                                  <option value="detail">Centered Detail (with Caption)</option>
                                  <option value="full">Full Width Banner</option>
                                  <option value="card">Framed Card Box</option>
                                </select>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Caption / Description</label>
                              <input
                                type="text"
                                className="form-input"
                                value={block.caption || ''}
                                onChange={(e) => updateBlock(currentSection.id, block.id, { caption: e.target.value })}
                                placeholder="Caption explaining this photo..."
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Insertion point between blocks */}
                      <div className="insert-bar">
                        <button
                          className="insert-pill-btn"
                          onClick={() => addBlock(currentSection.id, { type: 'text', content: '' }, bIdx + 1)}
                        >
                          <Type size={12} /> + Text
                        </button>
                        <button
                          className="insert-pill-btn pill-photo"
                          onClick={() => openInsertPhotoModal(bIdx + 1)}
                        >
                          <ImageIcon size={12} /> + Photo Here
                        </button>
                        <button
                          className="insert-pill-btn"
                          onClick={() => addBlock(currentSection.id, { type: 'heading', level: 2, text: '' }, bIdx + 1)}
                        >
                          <HeadingIcon size={12} /> + Heading
                        </button>
                        <button
                          className="insert-pill-btn"
                          onClick={() => addBlock(currentSection.id, { type: 'quote', text: '', author: '' }, bIdx + 1)}
                        >
                          <Quote size={12} /> + Quote
                        </button>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </main>
        )}

        {/* Right Side / Full Preview: Live Story Preview */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div
            style={{
              padding: viewMode === 'preview' ? '40px 24px' : '24px',
              borderLeft: viewMode === 'split' ? '1px solid var(--border)' : 'none',
              background: 'var(--bg)',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 120px)'
            }}
          >
            <div style={{ maxWidth: 740, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, color: 'var(--muted)', fontSize: '0.82rem' }}>
                <Eye size={14} />
                <span>Live Reader Preview</span>
              </div>

              {currentSection ? (
                <article className="story-section" style={{ padding: 0 }}>
                  <div className="post-meta">
                    {currentSection.tag && <span className="tag">{currentSection.tag}</span>}
                    {currentSection.location && (
                      <span className="meta-item">
                        <MapPin size={13} /> {currentSection.location}
                      </span>
                    )}
                    {currentSection.altitude && (
                      <span className="meta-item">
                        <Compass size={13} /> {currentSection.altitude}
                      </span>
                    )}
                  </div>

                  <h2>{currentSection.title || 'Untitled Section'}</h2>
                  <time>{currentSection.dateDisplay || currentSection.date}</time>

                  {currentSection.cover && (
                    <div className="post-cover">
                      <img src={assetUrl(currentSection.cover)} alt={currentSection.title} />
                    </div>
                  )}

                  {currentSection.excerpt && (
                    <p className="post-excerpt">{currentSection.excerpt}</p>
                  )}

                  <div className="section-blocks-flow">
                    {(currentSection.blocks || []).map((block, idx) => {
                      if (block.type === 'text') {
                        return <p key={idx} className="block-text">{block.content}</p>;
                      }
                      if (block.type === 'heading') {
                        const Tag = block.level === 3 ? 'h3' : 'h2';
                        return <Tag key={idx} className={block.level === 3 ? 'block-heading-3' : 'block-heading-2'}>{block.text}</Tag>;
                      }
                      if (block.type === 'quote') {
                        return (
                          <blockquote key={idx} className="block-quote">
                            <p>"{block.text}"</p>
                            {block.author && <span className="block-quote-author">— {block.author}</span>}
                          </blockquote>
                        );
                      }
                      if (block.type === 'photo') {
                        return (
                          <figure key={idx} className={`block-photo layout-${block.layout || 'detail'}`}>
                            <div className="photo-frame">
                              <img src={assetUrl(block.url)} alt={block.caption || 'Photo'} />
                            </div>
                            {block.caption && <figcaption className="photo-caption">{block.caption}</figcaption>}
                          </figure>
                        );
                      }
                      return null;
                    })}
                  </div>
                </article>
              ) : (
                <p>No section selected.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Photo Picker Modal */}
      <PhotoPickerModal
        isOpen={isPhotoModalOpen}
        onClose={() => {
          setIsPhotoModalOpen(false);
          setPhotoTarget(null);
        }}
        onSelectPhoto={handlePhotoSelected}
        title={photoTarget?.type === 'cover' ? 'Select Section Cover Photo' : 'Insert Photo into Section'}
      />
    </div>
  );
}
