'use client'

import React, { useEffect, useRef, useState } from 'react'

export default function ChatRoomSVG({ className = 'w-full h-auto' }) {
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const idRef = useRef(1)
  const timersRef = useRef([])

  // sequence of messages to show (you can customize text-lines widths / count)
  const sequence = [
    { side: 'in', lines: [140, 90] },
    { side: 'in', lines: [120, 100] },
    { side: 'out', lines: [160, 110] },
    { side: 'in', lines: [120] },
    { side: 'out', lines: [150, 70] },
  ]

  useEffect(() => {
    let mounted = true

    const clearPending = () => {
      timersRef.current.forEach((t) => clearTimeout(t))
      timersRef.current = []
    }

    const run = () => {
      if (!mounted) return
      clearPending()
      // Clear messages at start of each loop
      setMessages([])
      idRef.current = 1

      let accumulated = 0

      sequence.forEach((item, idx) => {
        const typingDelay = 600
        const appearDelay = accumulated + typingDelay

        const t1 = setTimeout(() => {
          if (!mounted) return
          setTyping(true)
        }, accumulated)
        timersRef.current.push(t1)

        const t2 = setTimeout(() => {
          if (!mounted) return
          setTyping(false)
          setMessages((s) => [
            ...s,
            { id: idRef.current++, side: item.side, lines: item.lines },
          ])
        }, appearDelay)
        timersRef.current.push(t2)

        accumulated = appearDelay + 800
      })

      const loopDelay = accumulated + 1400
      const tClear = setTimeout(() => {
        if (!mounted) return
        setTyping(false)
        run()
      }, loopDelay)
      timersRef.current.push(tClear)
    }

    run()

    return () => {
      mounted = false
      clearPending()
    }
  }, [])

  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 480 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated chat UI">
        <defs>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feColorMatrix type="matrix" values="1 0 0 0 0
                                                  0 1 0 0 0
                                                  0 0 1 0 0
                                                  0 0 0 0.2 0" />
            <feBlend in="SourceGraphic" in2="b" />
          </filter>
        </defs>

        {/* panel */}
        <rect x="20" y="20" width="440" height="520" rx="16" fill="#ffffff" opacity="0.98" />

        <g transform="translate(40,60)">
          {/* render last 5 messages only to prevent overflow - each at fixed vertical positions */}
          {messages.slice(-5).map((m, displayIndex) => {
            const y = displayIndex * 90 // vertical spacing between messages
            const translateX = m.side === 'out' ? 140 : 0
            const width = m.side === 'out' ? 210 : 240
            const fill = m.side === 'out' ? '#4F46E5' : '#F3F4F6'
            const textFill = m.side === 'out' ? '#C7B9FF' : '#E6E7EB'

            return (
              <g
                key={m.id}
                className="bubble"
                transform={`translate(${translateX},${y})`}
              >
                <rect x="0" y="0" rx="12" width={width} height="60" fill={fill} filter={m.side === 'out' ? 'url(#soft)' : undefined} />
                {m.lines.map((w, j) => (
                  <rect key={j} x="12" y={16 + j * 20} width={w} height="8" rx="4" fill={textFill} opacity={m.side === 'out' ? 0.95 : 1} />
                ))}
              </g>
            )
          })}

          {/* typing indicator - shown while waiting for next; position below visible messages */}
          {typing && (
            <g className="typing" transform={`translate(20,${messages.slice(-5).length * 90})`}>
              <rect x="0" y="0" rx="12" width="120" height="42" fill="#ffffff" opacity="0.0" />
              <g transform="translate(28,14)">
                <circle className="dot d1" cx="0" cy="0" r="4" fill="#9CA3AF" />
                <circle className="dot d2" cx="14" cy="0" r="4" fill="#9CA3AF" />
                <circle className="dot d3" cx="28" cy="0" r="4" fill="#9CA3AF" />
              </g>
            </g>
          )}
        </g>

        <style>{`
          /* entrance: run once and keep final state (forwards) */
          .bubble {
            opacity: 0;
            animation: popOnce 420ms cubic-bezier(.2,.9,.3,1) forwards;
          }

          @keyframes popOnce {
            0%   { opacity: 0; }
            60%  { opacity: 1; }
            100% { opacity: 1; }
          }

          /* typing dots animation - loops while typing visible */
          .dot { transform-origin: center; opacity: 0.5; }
          .d1 { animation: dots 1.2s infinite ease-in-out; animation-delay: 0s; }
          .d2 { animation: dots 1.2s infinite ease-in-out; animation-delay: 0.12s; }
          .d3 { animation: dots 1.2s infinite ease-in-out; animation-delay: 0.24s; }

          @keyframes dots {
            0%   { transform: translateY(0); opacity: 0.25; }
            30%  { transform: translateY(-4px); opacity: 1; }
            60%  { transform: translateY(0); opacity: 0.6; }
            100% { transform: translateY(0); opacity: 0.25; }
          }

          @media (prefers-reduced-motion: reduce) {
            .bubble, .dot { animation: none; opacity: 1; transform: none; }
          }
        `}</style>
      </svg>
    </div>
  )
}