import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mountain, BookOpen, Sun, Moon, Info } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('pin_parvati_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('pin_parvati_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('pin_parvati_theme', 'light');
    }
  };

  const isAbout = location.pathname.includes('about');
  const isJournal = !isAbout && !location.pathname.includes('writeup');

  return (
    <header className="site-header">
      <div className="wrap-wide">
        <Link to="/" className="brand-wrapper">
          <div className="brand-icon">
            <Mountain size={18} />
          </div>
          <div className="brand">
            Pin Parvati
            <span className="brand-sub">Trail Journal &amp; Stories</span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${isJournal ? 'active' : ''}`}
            >
              <BookOpen size={16} />
              <span>Journal</span>
            </Link>

            <Link
              to="/about"
              className={`nav-link ${isAbout ? 'active' : ''}`}
            >
              <Info size={16} />
              <span>About</span>
            </Link>
          </div>

          <button
            onClick={toggleTheme}
            className="btn-icon-sm"
            style={{ padding: 8 }}
            aria-label="Toggle dark mode"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
