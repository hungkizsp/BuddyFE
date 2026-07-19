import React, { useRef, useState } from 'react';
import ColorToolbar from './ColorToolbar';

export default function HighlightableText({ text, highlights = [], field, onHighlightChange }) {
  const containerRef = useRef(null);
  const [toolbarPosition, setToolbarPosition] = useState(null);
  const [currentSelection, setCurrentSelection] = useState(null);

  if (!text) return null;

  // Helper to compute selection offsets relative to container plain text
  const getSelectionCharacterOffsets = (container) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return null;
    const range = selection.getRangeAt(0);
    
    // Ensure the selection is actually inside our container
    if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) {
      return null;
    }

    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(container);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;
    const end = start + range.toString().length;
    return { start, end, text: range.toString() };
  };

  const handleMouseUp = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const selection = window.getSelection();
    if (selection.isCollapsed) {
      setToolbarPosition(null);
      setCurrentSelection(null);
      return;
    }

    const offsets = getSelectionCharacterOffsets(container);
    if (!offsets || offsets.start === offsets.end) return;

    // Get selection client rect coordinates to position toolbar
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Position relative to container
    setToolbarPosition({
      top: rect.top - containerRect.top + container.scrollTop,
      left: rect.left - containerRect.left + rect.width / 2 + container.scrollLeft,
    });
    setCurrentSelection(offsets);
  };

  const handleSelectColor = (color) => {
    if (!currentSelection) return;

    const { start, end } = currentSelection;

    // Remove any overlapping highlights
    const filtered = highlights.filter(
      (h) => !(h.field === field && h.start < end && h.end > start)
    );

    const newHighlight = { field, start, end, color };
    const updated = [...filtered, newHighlight].sort((a, b) => a.start - b.start);

    onHighlightChange(updated);
    clearSelection();
  };

  const handleClearSelection = () => {
    if (!currentSelection) return;
    const { start, end } = currentSelection;

    // Filter out highlights that fall inside or overlap the selected range
    const updated = highlights.filter(
      (h) => !(h.field === field && h.start < end && h.end > start)
    );

    onHighlightChange(updated);
    clearSelection();
  };

  const clearSelection = () => {
    window.getSelection().removeAllRanges();
    setToolbarPosition(null);
    setCurrentSelection(null);
  };

  // Render text with highlight marks
  const renderHighlightedText = () => {
    const fieldHighlights = highlights
      .filter((h) => h.field === field)
      .sort((a, b) => a.start - b.start);

    const segments = [];
    let lastIndex = 0;

    fieldHighlights.forEach((h, index) => {
      // Add preceding normal text
      if (h.start > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}-${h.start}`}>
            {text.slice(lastIndex, h.start)}
          </span>
        );
      }
      // Add highlighted text
      segments.push(
        <mark
          key={`mark-${h.start}-${h.end}-${index}`}
          className="rounded px-0.5 transition-colors cursor-pointer select-text"
          style={{ backgroundColor: h.color, color: '#1e293b' }}
          onClick={(e) => {
            e.stopPropagation();
            // Allow easy removal on click
            const updated = highlights.filter((item) => !(item.field === field && item.start === h.start && item.end === h.end));
            onHighlightChange(updated);
          }}
          title="Click to remove highlight"
        >
          {text.slice(h.start, h.end)}
        </mark>
      );
      lastIndex = h.end;
    });

    // Add trailing normal text
    if (lastIndex < text.length) {
      segments.push(
        <span key={`text-${lastIndex}-${text.length}`}>
          {text.slice(lastIndex)}
        </span>
      );
    }

    return segments.length > 0 ? segments : text;
  };

  return (
    <div className="relative inline-block w-full select-text" ref={containerRef} onMouseUp={handleMouseUp}>
      <p className="whitespace-pre-wrap leading-relaxed select-text">
        {renderHighlightedText()}
      </p>

      <ColorToolbar
        position={toolbarPosition}
        onSelectColor={handleSelectColor}
        onClear={handleClearSelection}
        onClose={clearSelection}
      />
    </div>
  );
}
