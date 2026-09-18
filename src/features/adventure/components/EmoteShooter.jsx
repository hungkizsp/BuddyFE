import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EMOTES = ['🎉', '🏆', '⭐', '🎊', '🥳', '💖', '👍'];

export default function EmoteShooter() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate a fixed burst of 16 lightweight particles for smooth 60fps animation
    const burst = Array.from({ length: 16 }).map((_, index) => ({
      id: index,
      emoji: EMOTES[index % EMOTES.length],
      left: 5 + Math.random() * 90,
      duration: 2.2 + Math.random() * 1.5,
      delay: Math.random() * 0.6,
      scale: 0.9 + Math.random() * 0.8,
      xMove: (Math.random() - 0.5) * 80
    }));

    setParticles(burst);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        overflow: 'hidden'
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '100vh', x: 0, opacity: 0, scale: 0.5 }}
          animate={{
            y: '-10vh',
            x: p.xMove,
            opacity: [0, 1, 1, 0],
            scale: [0.5, p.scale, p.scale, 0.8]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
            times: [0, 0.15, 0.8, 1]
          }}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            bottom: 0,
            fontSize: '2rem',
            willChange: 'transform, opacity'
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}
