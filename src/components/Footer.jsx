import React from 'react';
import { Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap-wide">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Mountain size={16} color="var(--accent)" />
          <span>
            <strong>Pin Parvati Pass Expedition</strong> — 5,319 m / 17,450 ft • Parvati Valley to Spiti
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link to="/" style={{ color: 'var(--muted)' }}>
            Journal
          </Link>
          <Link to="/about" style={{ color: 'var(--muted)' }}>
            About
          </Link>
          <span>•</span>
          <span>By Shreyas</span>
        </div>
      </div>
    </footer>
  );
}
