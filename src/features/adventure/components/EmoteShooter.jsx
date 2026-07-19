import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMOTES = ['🎉', '🏆', '⭐', '🎊', '🥳', '💖', '👍'];

export default function EmoteShooter() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    let idCounter = 0;
    // Spawn initial burst
    const initialParticles = Array.from({ length: 5 }).map(() => ({
      id: idCounter++,
      emoji: EMOTES[Math.floor(Math.random() * EMOTES.length)],
      left: 10 + Math.random() * 80,
      duration: 3 + Math.random() * 2,
      scale: 1 + Math.random() * 1.5,
      wiggle: (Math.random() - 0.5) * 150 
    }));
    setParticles(initialParticles);

    // Continuous spawn
    const interval = setInterval(() => {
      setParticles(prev => [
        ...prev,
        ...Array.from({ length: 3 }).map(() => ({
          id: idCounter++,
          emoji: EMOTES[Math.floor(Math.random() * EMOTES.length)],
          left: 10 + Math.random() * 80,
          duration: 3 + Math.random() * 2,
          scale: 1 + Math.random() * 1.5,
          wiggle: (Math.random() - 0.5) * 150 
        }))
      ]);
    }, 300);

    // Stop after 4 seconds
    setTimeout(() => clearInterval(interval), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99999 }}>
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ bottom: '-10vh', opacity: 1, scale: p.scale }}
            animate={{
              bottom: '110vh',
              x: [0, p.wiggle, -p.wiggle, 0],
              opacity: [1, 1, 0.8, 0]
            }}
            transition={{
              duration: p.duration,
              ease: "easeOut",
              x: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 1.5
              }
            }}
            onAnimationComplete={() => setParticles(prev => prev.filter(item => item.id !== p.id))}
            style={{ position: 'absolute', left: `${p.left}vw`, fontSize: '2.5rem' }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
