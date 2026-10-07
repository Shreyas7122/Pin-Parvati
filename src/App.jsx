import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import JournalPage from './pages/JournalPage';
import WriteupEditorPage from './pages/WriteupEditorPage';
import AboutPage from './pages/AboutPage';
import { useStory } from './context/StoryContext';
import { Check } from 'lucide-react';

export default function App() {
  const { toastMessage } = useStory();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Root Routes */}
          <Route path="/" element={<JournalPage />} />
          <Route path="/writeup" element={<WriteupEditorPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Subpath Aliases (e.g. pin-parvati / Pin-Parvati) */}
          <Route path="/pin-parvati" element={<JournalPage />} />
          <Route path="/pin-parvati/writeup" element={<WriteupEditorPage />} />
          <Route path="/pin-parvati/about" element={<AboutPage />} />
          <Route path="/Pin-Parvati" element={<JournalPage />} />
          <Route path="/Pin-Parvati/writeup" element={<WriteupEditorPage />} />
          <Route path="/Pin-Parvati/about" element={<AboutPage />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <Lightbox />

      {/* Global Toast */}
      {toastMessage && (
        <div className="toast-container">
          <Check size={16} strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
