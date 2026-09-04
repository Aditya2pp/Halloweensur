import React, { useRef, useState, useEffect, useCallback } from 'react';

interface VirtualJoystickProps {
  onMove: (vector: { x: number; y: number }) => void;
  className?: string;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ onMove, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const maxRadius = 42; // Maximum travel distance for knob

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let dx = clientX - centerX;
      let dy = clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
      }

      setKnobPos({ x: dx, y: dy });

      // Normalized output (-1 to 1)
      const nx = dx / maxRadius;
      const ny = dy / maxRadius;
      onMove({ x: nx, y: ny });
    },
    [maxRadius, onMove]
  );

  const resetJoystick = useCallback(() => {
    setKnobPos({ x: 0, y: 0 });
    setIsActive(false);
    touchIdRef.current = null;
    onMove({ x: 0, y: 0 });
  }, [onMove]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsActive(true);
    updatePosition(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updatePosition(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        resetJoystick();
        break;
      }
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsActive(true);
    updatePosition(e.clientX, e.clientY);

    const onMouseMove = (moveEvent: MouseEvent) => {
      updatePosition(moveEvent.clientX, moveEvent.clientY);
    };

    const onMouseUp = () => {
      resetJoystick();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Keyboard WASD / Arrow keys listener support
  useEffect(() => {
    const keys: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
      processKeys();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
      processKeys();
    };

    const processKeys = () => {
      let kx = 0;
      let ky = 0;

      if (keys['w'] || keys['arrowup']) ky -= 1;
      if (keys['s'] || keys['arrowdown']) ky += 1;
      if (keys['a'] || keys['arrowleft']) kx -= 1;
      if (keys['d'] || keys['arrowright']) kx += 1;

      if (kx !== 0 && ky !== 0) {
        // Normalize diagonal
        kx *= 0.7071;
        ky *= 0.7071;
      }

      if (kx !== 0 || ky !== 0) {
        setKnobPos({ x: kx * maxRadius, y: ky * maxRadius });
        onMove({ x: kx, y: ky });
      } else if (!isActive) {
        setKnobPos({ x: 0, y: 0 });
        onMove({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isActive, maxRadius, onMove]);

  return (
    <div
      ref={containerRef}
      id="gameplay-virtual-joystick"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center cursor-pointer select-none touch-none ${className}`}
      style={{
        background: 'radial-gradient(circle, rgba(16, 42, 28, 0.4) 0%, rgba(4, 18, 10, 0.7) 100%)',
        border: '3px solid rgba(134, 239, 172, 0.3)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.6), inset 0 0 10px rgba(16, 185, 129, 0.2)',
      }}
    >
      {/* Inner guide ring */}
      <div className="absolute w-18 h-18 rounded-full border border-emerald-500/20 pointer-events-none" />

      {/* Floating Thumb Knob */}
      <div
        className="w-14 h-14 rounded-full transition-transform duration-75 flex items-center justify-center pointer-events-none"
        style={{
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          background: 'radial-gradient(circle at 35% 35%, #86EFAC 0%, #10B981 50%, #064E3B 100%)',
          border: '2.5px solid #022c10',
          boxShadow: '0 4px 8px rgba(0,0,0,0.8), inset 0 2px 3px rgba(255,255,255,0.4)',
        }}
      >
        <div className="w-5 h-5 rounded-full border border-emerald-950/40 bg-emerald-300/20" />
      </div>
    </div>
  );
};
