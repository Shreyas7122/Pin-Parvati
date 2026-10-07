import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialStoryData } from '../data/defaultStory';

const StoryContext = createContext(null);
const STORAGE_KEY = 'pin_parvati_story_data_v1';

export function StoryProvider({ children }) {
  const [storyData, setStoryData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved story from localStorage:', e);
    }
    return initialStoryData;
  });

  const [activeLightboxImg, setActiveLightboxImg] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(Date.now());
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storyData));
      setLastSavedTime(Date.now());
    } catch (e) {
      console.error('Error saving story to localStorage:', e);
    }
  }, [storyData]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // --- Section Operations ---
  const addSection = (customMeta = {}) => {
    const newId = 'sec-' + Date.now();
    const newSection = {
      id: newId,
      slug: customMeta.slug || 'new-section-' + Date.now().toString().slice(-4),
      title: customMeta.title || 'Untitled Section',
      tag: customMeta.tag || 'Trek Journal',
      day: customMeta.day || '',
      date: customMeta.date || new Date().toISOString().split('T')[0],
      dateDisplay: customMeta.dateDisplay || 'New Entry',
      location: customMeta.location || 'Himachal Pradesh',
      altitude: customMeta.altitude || '',
      cover: customMeta.cover || '/assets/images/spiti-2025/cover.jpg',
      excerpt: customMeta.excerpt || '',
      blocks: [
        {
          id: 'blk-' + Date.now() + '-1',
          type: 'text',
          content: 'Write your story here... Add paragraphs, headings, and insert photos anywhere in between.'
        }
      ]
    };

    setStoryData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    showToast('✨ New section created!');
    return newId;
  };

  const updateSection = (sectionId, updates) => {
    setStoryData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, ...updates } : sec
      )
    }));
  };

  const deleteSection = (sectionId) => {
    setStoryData((prev) => ({
      ...prev,
      sections: prev.sections.filter((sec) => sec.id !== sectionId)
    }));
    showToast('🗑️ Section deleted');
  };

  const moveSection = (index, direction) => {
    setStoryData((prev) => {
      const newSecs = [...prev.sections];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newSecs.length) return prev;
      const temp = newSecs[index];
      newSecs[index] = newSecs[targetIndex];
      newSecs[targetIndex] = temp;
      return { ...prev, sections: newSecs };
    });
  };

  // --- Block Operations (Text, Photo, Heading, Quote, Gallery) ---
  const addBlock = (sectionId, blockData, targetIndex = null) => {
    const newBlockId = 'blk-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const newBlock = {
      id: newBlockId,
      ...blockData
    };

    setStoryData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const currentBlocks = sec.blocks || [];
        let updatedBlocks;
        if (targetIndex === null || targetIndex === undefined || targetIndex >= currentBlocks.length) {
          updatedBlocks = [...currentBlocks, newBlock];
        } else {
          updatedBlocks = [
            ...currentBlocks.slice(0, targetIndex),
            newBlock,
            ...currentBlocks.slice(targetIndex)
          ];
        }
        return { ...sec, blocks: updatedBlocks };
      })
    }));
    showToast(`Added ${blockData.type || 'block'} to section`);
    return newBlockId;
  };

  const updateBlock = (sectionId, blockId, updates) => {
    setStoryData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          blocks: (sec.blocks || []).map((blk) =>
            blk.id === blockId ? { ...blk, ...updates } : blk
          )
        };
      })
    }));
  };

  const deleteBlock = (sectionId, blockId) => {
    setStoryData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          blocks: (sec.blocks || []).filter((blk) => blk.id !== blockId)
        };
      })
    }));
    showToast('Block removed');
  };

  const moveBlock = (sectionId, blockIndex, direction) => {
    setStoryData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const blocks = [...(sec.blocks || [])];
        const targetIndex = blockIndex + direction;
        if (targetIndex < 0 || targetIndex >= blocks.length) return sec;
        const temp = blocks[blockIndex];
        blocks[blockIndex] = blocks[targetIndex];
        blocks[targetIndex] = temp;
        return { ...sec, blocks };
      })
    }));
  };

  const duplicateBlock = (sectionId, blockIndex) => {
    setStoryData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const blocks = [...(sec.blocks || [])];
        const original = blocks[blockIndex];
        const copy = {
          ...JSON.parse(JSON.stringify(original)),
          id: 'blk-' + Date.now()
        };
        blocks.splice(blockIndex + 1, 0, copy);
        return { ...sec, blocks };
      })
    }));
    showToast('Block duplicated');
  };

  // --- Reset & Export/Import ---
  const resetToDefault = () => {
    if (window.confirm('Reset all sections and edits back to the initial Pin Parvati story?')) {
      setStoryData(initialStoryData);
      localStorage.removeItem(STORAGE_KEY);
      showToast('🔄 Reset to default story');
    }
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(storyData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `pin_parvati_story_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    showToast('📥 Story exported as JSON');
  };

  const importJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.sections && Array.isArray(parsed.sections)) {
        setStoryData(parsed);
        showToast('✅ Story loaded successfully!');
        return true;
      } else {
        alert('Invalid story format: Missing sections array.');
        return false;
      }
    } catch (err) {
      alert('Error parsing JSON: ' + err.message);
      return false;
    }
  };

  const exportMarkdown = (sectionId = null) => {
    const targetSections = sectionId
      ? storyData.sections.filter((s) => s.id === sectionId)
      : storyData.sections;

    let md = '';
    targetSections.forEach((sec) => {
      md += `---
title: "${sec.title}"
tag: "${sec.tag || ''}"
date: ${sec.date || ''}
date_display: "${sec.dateDisplay || ''}"
location: "${sec.location || ''}"
altitude: "${sec.altitude || ''}"
cover: ${sec.cover || ''}
excerpt: "${sec.excerpt || ''}"
---

`;
      (sec.blocks || []).forEach((blk) => {
        if (blk.type === 'text') {
          md += `${blk.content}\n\n`;
        } else if (blk.type === 'heading') {
          const hashes = '#'.repeat(blk.level || 2);
          md += `${hashes} ${blk.text}\n\n`;
        } else if (blk.type === 'quote') {
          md += `> "${blk.text}"\n`;
          if (blk.author) md += `> — *${blk.author}*\n`;
          md += `\n`;
        } else if (blk.type === 'photo') {
          md += `<figure class="detail-photo">\n  <img src="${blk.url}" alt="${blk.alt || ''}">\n  <figcaption>${blk.caption || ''}</figcaption>\n</figure>\n\n`;
        } else if (blk.type === 'callout') {
          md += `> [!NOTE]\n> ${blk.text}\n\n`;
        }
      });
      md += `\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const dlAnchor = document.createElement('a');
    dlAnchor.href = url;
    dlAnchor.download = sectionId ? `${targetSections[0].slug}.md` : 'pin_parvati_full_journal.md';
    dlAnchor.click();
    URL.revokeObjectURL(url);
    showToast('📝 Exported as Markdown');
  };

  return (
    <StoryContext.Provider
      value={{
        storyData,
        setStoryData,
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
        activeLightboxImg,
        setActiveLightboxImg,
        isPlayingAudio,
        setIsPlayingAudio,
        lastSavedTime,
        toastMessage,
        showToast
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error('useStory must be used within a StoryProvider');
  return ctx;
}
