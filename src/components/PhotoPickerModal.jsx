import React, { useState, useMemo } from 'react';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Check, Search, Folder } from 'lucide-react';
import { useStory } from '../context/StoryContext';
import { assetUrl } from '../utils/assetUrl';
import { photosAtLocation } from '../data/photos.generated';

export default function PhotoPickerModal({ isOpen, onClose, onSelectPhoto, title = 'Choose or Upload Photo' }) {
  const { storyData } = useStory();
  const [activeTab, setActiveTab] = useState('preset'); // 'preset' | 'upload' | 'url'
  const [customUrl, setCustomUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'photos' | 'covers'

  const allPresetPhotos = useMemo(() => {
    const list = [...(photosAtLocation || [])];
    const seenUrls = new Set(list.map((p) => p.url));
    (storyData.presetPhotos || []).forEach((p) => {
      if (!seenUrls.has(p.url)) {
        list.push(p);
        seenUrls.add(p.url);
      }
    });
    return list;
  }, [storyData.presetPhotos]);

  const filteredPresets = useMemo(() => {
    return allPresetPhotos.filter((p) => {
      if (filterCategory === 'photos' && !p.url.startsWith('/Photos/')) return false;
      if (filterCategory === 'covers' && p.url.startsWith('/Photos/')) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(q);
        const matchesFile = (p.filename || p.url || '').toLowerCase().includes(q);
        return matchesName || matchesFile;
      }
      return true;
    });
  }, [allPresetPhotos, filterCategory, searchQuery]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setSelectedPhoto({
          url: dataUrl,
          name: file.name
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    let finalUrl = '';
    let defaultAlt = 'Pin Parvati expedition photo';

    if (activeTab === 'preset' && selectedPhoto) {
      finalUrl = selectedPhoto.url;
      defaultAlt = selectedPhoto.name || 'Expedition photo';
    } else if (activeTab === 'upload' && selectedPhoto) {
      finalUrl = selectedPhoto.url;
      defaultAlt = selectedPhoto.name || 'Uploaded photo';
    } else if (activeTab === 'url' && customUrl.trim()) {
      finalUrl = customUrl.trim();
      defaultAlt = 'Online image';
    }

    if (!finalUrl) {
      alert('Please select or upload a photo first');
      return;
    }

    onSelectPhoto({
      url: finalUrl,
      caption: caption.trim(),
      alt: defaultAlt
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 740, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ImageIcon size={20} color="var(--accent)" />
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{title}</h3>
          </div>
          <button className="btn-icon-sm" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="view-tabs" style={{ marginBottom: 16 }}>
          <button
            className={`view-tab ${activeTab === 'preset' ? 'active' : ''}`}
            onClick={() => setActiveTab('preset')}
          >
            Gallery Presets ({allPresetPhotos.length})
          </button>
          <button
            className={`view-tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload From Device
          </button>
          <button
            className={`view-tab ${activeTab === 'url' ? 'active' : ''}`}
            onClick={() => setActiveTab('url')}
          >
            Paste Image URL
          </button>
        </div>

        {/* Tab 1: Presets */}
        {activeTab === 'preset' && (
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
            {/* Filter and search bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setFilterCategory('all')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: '0.78rem',
                    border: '1px solid var(--border)',
                    background: filterCategory === 'all' ? 'var(--accent)' : 'transparent',
                    color: filterCategory === 'all' ? '#fff' : 'var(--muted)',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  All ({allPresetPhotos.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCategory('photos')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: '0.78rem',
                    border: '1px solid var(--border)',
                    background: filterCategory === 'photos' ? 'var(--accent)' : 'transparent',
                    color: filterCategory === 'photos' ? '#fff' : 'var(--muted)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Folder size={12} /> /Photos ({photosAtLocation.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCategory('covers')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: '0.78rem',
                    border: '1px solid var(--border)',
                    background: filterCategory === 'covers' ? 'var(--accent)' : 'transparent',
                    color: filterCategory === 'covers' ? '#fff' : 'var(--muted)',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Covers & Gear ({allPresetPhotos.length - photosAtLocation.length})
                </button>
              </div>

              <div style={{ position: 'relative', minWidth: 200, flex: '1 1 200px', maxWidth: 280 }}>
                <Search size={14} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '5px 8px 5px 28px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: 'var(--input-bg, #1a1a1a)',
                    color: 'var(--text)',
                    fontSize: '0.82rem'
                  }}
                />
              </div>
            </div>

            <div className="preset-photo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: 10, maxHeight: 340, overflowY: 'auto', padding: 2 }}>
              {filteredPresets.map((p, idx) => {
                const isSelected = selectedPhoto?.url === p.url;
                const filenameOnly = p.filename || p.url.split('/').pop();
                return (
                  <div
                    key={p.url + idx}
                    className={`preset-photo-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedPhoto(p)}
                    style={{
                      position: 'relative',
                      borderRadius: 8,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: 'var(--card-bg, #1e1e1e)',
                      transition: 'transform 0.15s ease, border-color 0.15s ease',
                      transform: isSelected ? 'scale(1.02)' : 'none'
                    }}
                  >
                    <div style={{ aspectRatio: '4/3', width: '100%', background: '#0a0a0a', overflow: 'hidden' }}>
                      <img
                        src={assetUrl(p.url)}
                        alt={p.name}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="preset-photo-card-name" style={{ padding: '6px 8px', fontSize: '0.78rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {filenameOnly}
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        background: 'var(--accent)',
                        color: '#fff',
                        borderRadius: '50%',
                        padding: 3,
                        display: 'flex',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                      }}>
                        <Check size={13} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {filteredPresets.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', margin: '24px 0' }}>
                No photos found matching &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Tab 2: Upload */}
        {activeTab === 'upload' && (
          <div>
            <label className="dropzone" style={{ display: 'block' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <Upload size={32} color="var(--accent)" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)' }}>
                Click to browse or drop an image file
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 4 }}>
                Supports JPG, PNG, WEBP, GIF
              </div>
            </label>

            {selectedPhoto && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600 }}>
                  Selected: {selectedPhoto.name}
                </p>
                <div style={{ maxWidth: 200, margin: '8px auto', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={assetUrl(selectedPhoto.url)} alt="Upload preview" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: URL */}
        {activeTab === 'url' && (
          <div className="form-group" style={{ margin: '16px 0' }}>
            <label className="form-label">Image Web URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/... or /Photos/..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
            />
          </div>
        )}

        {/* Optional Caption Field */}
        <div className="form-group" style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
          <label className="form-label">Photo Caption (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Walking towards the glacier pass in the morning mist"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            Insert Photo
          </button>
        </div>
      </div>
    </div>
  );
}
