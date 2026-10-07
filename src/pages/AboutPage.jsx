import React from 'react';
import { Mountain, MapPin, Compass, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 740, margin: '0 auto', padding: '60px 24px 100px' }}>
      <div className="post-meta" style={{ marginBottom: 12 }}>
        <span className="tag">The Expedition</span>
        <span>Himachal Pradesh, India</span>
      </div>

      <h1 style={{ fontSize: '2.6rem', marginBottom: 16 }}>About Pin Parvati Pass</h1>

      <p className="post-excerpt">
        Pin Parvati Pass is a legendary 5,319-metre (17,450 ft) crossing in the Indian Himalayas, bridging the lush, green forests of the Parvati Valley with the stark, cold high-altitude desert of Spiti.
      </p>

      <div style={{ margin: '32px 0', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <img src="/assets/images/spiti-2025/cover.jpg" alt="Pin Parvati Mountains" style={{ width: '100%' }} />
      </div>

      <div className="post-content">
        <h2>The Story Behind the Trail</h2>
        <p className="block-text">
          This site is a day-by-day expedition journal written on the trail, arranged here with high-resolution photography, altitude logs, and personal reflections.
        </p>
        <p className="block-text">
          From the initial decision in Pune to months of stair-climbing with 15 kg backpacks, shared cab rides with local drivers singing Himachali songs, and crossing dangerous mountain rivers — every moment is preserved here.
        </p>

        <div style={{ marginTop: 40 }}>
          <Link to="/" className="btn btn-primary">
            <BookOpen size={16} /> Read Full Journal
          </Link>
        </div>
      </div>
    </div>
  );
}
