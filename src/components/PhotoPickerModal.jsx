import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Check } from 'lucide-react';
import { useStory } from '../context/StoryContext';

export default function PhotoPickerModal({ isOpen, onClose, onSelectPhoto, title = 'Choose or Upload Photo' }) {
  const { storyData } = useStory();
  const [activeTab, setActiveTab] = useState('preset'); // 'preset' | 'upload' | 'url'
  const [customUrl, setCustomUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

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
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
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
        <div className="view-tabs" style={{ marginBottom: 20 }}>
          <button
            className={`view-tab ${activeTab === 'preset' ? 'active' : ''}`}
            onClick={() => setActiveTab('preset')}
          >
            Gallery Presets
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
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0 0 12px' }}>
              Select from existing photos in your expedition repository:
            </p>
            <div className="preset-photo-grid">
              {storyData.presetPhotos?.map((p, idx) => {
                const isSelected = selectedPhoto?.url === p.url;
                return (
                  <div
                    key={idx}
                    className={`preset-photo-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedPhoto(p)}
                    style={{
                      borderColor: isSelected ? 'var(--accent)' : 'transparent',
                      outline: isSelected ? '3px solid var(--accent-light)' : 'none'
                    }}
                  >
                    <img src={p.url} alt={p.name} loading="lazy" />
                    <div className="preset-photo-card-name">
                      {p.name}
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
                        display: 'flex'
                      }}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
                  <img src={selectedPhoto.url} alt="Upload preview" />
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
