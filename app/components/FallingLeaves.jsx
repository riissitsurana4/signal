'use client';

import React, { useEffect, useState } from 'react';

export default function FallingLeaves() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    // Generate random values only on client-side to avoid hydration mismatch
    // Reduce leaves on mobile for performance
    const isMobile = window.innerWidth < 768;
    const leafCount = isMobile ? 8 : 15;
    const generatedLeaves = Array.from({ length: leafCount }, (_, i) => ({
      id: i,
      emoji: '🍂',
      left: Math.random() < 0.5 ? `${Math.random() * 30}%` : `${70 + Math.random() * 30}%`, // Avoid center to not overlap forms
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 5}s`,
    }));
    setLeaves(generatedLeaves);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute animate-fall text-5xl" // Even bigger leaves
          style={{
            left: leaf.left,
            animationDelay: leaf.delay,
            animationDuration: leaf.duration,
            top: '-10vh', // Start above viewport
          }}
        >
          {leaf.emoji}
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(360deg) scale(0.8);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
          font-size: 2rem; /* Bigger size */
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fall {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}