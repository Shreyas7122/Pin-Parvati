import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useStory } from '../context/StoryContext';
import { assetUrl } from '../utils/assetUrl';

export default function Lightbox() {
  const { activeLightboxImg, setActiveLightboxImg } = useStory();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveLightboxImg(null);
      }
    };
    if (activeLightboxImg) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [activeLightboxImg, setActiveLightboxImg]);

  if (!activeLightboxImg) return null;

  return (
    <div
      className="lightbox-overlay"
      onClick={() => setActiveLightboxImg(null)}
    >
      <button
        className="lightbox-close-btn"
        onClick={() => setActiveLightboxImg(null)}
        aria-label="Close Lightbox"
      >
        <X size={20} />
      </button>

      <div className="lightbox-img-wrapper" onClick={(e) => e.stopPropagation()}>
        <img
          src={assetUrl(activeLightboxImg.url)}
          alt={activeLightboxImg.caption || activeLightboxImg.alt || 'Pin Parvati Photo'}
        />
        {activeLightboxImg.caption && (
          <p className="lightbox-caption">{activeLightboxImg.caption}</p>
        )}
      </div>
    </div>
  );
}
