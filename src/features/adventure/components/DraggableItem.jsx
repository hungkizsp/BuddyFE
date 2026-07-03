import { useState, useRef, useEffect } from 'react';

export default function DraggableItem({ item, onDropOnBuddy, onDropOnItem, onDropOnPot, disabled, position }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const itemRef = useRef(null);

  const handlePointerDown = (e) => {
    if (disabled || isBouncing) return;

    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    dragStartRef.current = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    };
    setIsDragging(true);
    setIsBouncing(false);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setOffset({ x: deltaX, y: deltaY });

    const buddyTarget = document.querySelector('.buddy-drop-target');
    const potTarget = document.querySelector('.pot-drop-zone');

    if (buddyTarget) {
      const rect = buddyTarget.getBoundingClientRect();
      const inside = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      buddyTarget.classList.toggle('drag-over', inside);
    }

    if (potTarget) {
      const rect = potTarget.getBoundingClientRect();
      const inside = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      potTarget.classList.toggle('drag-over', inside);
    }
  };

  const getDropTargetItemId = (x, y) => {
    const elements = document.elementsFromPoint(x, y);
    const target = elements.find((el) => el.dataset?.itemId && el.dataset.itemId !== item.id);
    return target ? target.dataset.itemId : null;
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const buddyTarget = document.querySelector('.buddy-drop-target');
    let handled = false;

    if (buddyTarget) {
      const rect = buddyTarget.getBoundingClientRect();
      const insideBuddy = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      if (insideBuddy) {
        buddyTarget.classList.remove('drag-over');
        onDropOnBuddy(item.id);
        handled = true;
      }
    }

    if (!handled) {
      const potTarget = document.elementsFromPoint(e.clientX, e.clientY)
        .find((el) => el.classList.contains('pot-drop-zone'));
      if (potTarget && onDropOnPot) {
        const combined = onDropOnPot(item.id);
        if (combined) {
          handled = true;
        }
      }
    }

    if (!handled) {
      const targetItemId = getDropTargetItemId(e.clientX, e.clientY);
      if (targetItemId && onDropOnItem) {
        const combined = onDropOnItem(item.id, targetItemId);
        if (combined) {
          handled = true;
        }
      }
    }

    if (handled) {
      setOffset({ x: 0, y: 0 });
    } else {
      setIsBouncing(true);
      setOffset({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    if (isBouncing) {
      const timer = setTimeout(() => {
        setIsBouncing(false);
      }, 600);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isBouncing]);

  const wrapperStyle = {
    left: position?.left || '50%',
    top: position?.top || '50%',
    transform: `translate(-50%, -50%) translate3d(${offset.x}px, ${offset.y}px, 0)`,
    touchAction: 'none'
  };

  return (
    <div
      ref={itemRef}
      className={`kitchen-food-item ${isDragging ? 'dragging' : ''}`}
      style={wrapperStyle}
      data-item-id={item.id}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img
        src={item.image}
        alt={item.alt}
        className={`food-image ${isDragging ? 'dragging' : ''} ${isBouncing ? 'bounce-back' : ''}`}
        draggable={false}
      />
    </div>
  );
}
