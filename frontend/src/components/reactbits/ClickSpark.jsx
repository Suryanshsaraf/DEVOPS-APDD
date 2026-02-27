// ──── ReactBits-inspired: ClickSpark (medical heart burst on click) ────
import React, { useCallback, useRef } from 'react';

// Anatomical heart SVG path (medical, not romantic)
const HEART_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
  <path d="M32 58c-1 0-2-.4-2.7-1.1C26 53.7 8 38 5.5 27.5 3.5 19 6 12 13 9c4.5-2 9.5-1 13.2 1.8L32 15l5.8-4.2C41.5 8 46.5 7 51 9c7 3 9.5 10 7.5 18.5C56 38 38 53.7 34.7 56.9 34 57.6 33 58 32 58z"/>
  <path d="M20 16c-1.5 0-3 .3-4.3.9-3.8 1.6-5.7 5.2-5 9.6.5 3 2.5 6.5 5 10l1.5-1.5c-2.2-3.2-3.8-6.2-4.2-8.8-.5-3.3.8-5.8 3.5-7 1-.4 2-.6 3-.6" fill="rgba(255,255,255,0.15)"/>
  <path d="M32 52c5-5 15-15 18-22" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" fill="none"/>
  <path d="M24 20c-2 0-4 1.5-4.5 3.5" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>`;

const ClickSpark = ({ children, sparkCount = 6, duration = 900 }) => {
    const containerRef = useRef(null);

    const createSpark = useCallback((e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = 0; i < sparkCount; i++) {
            const spark = document.createElement('div');
            const angle = (360 / sparkCount) * i + (Math.random() * 30 - 15);
            const distance = 35 + Math.random() * 50;
            const size = 16 + Math.random() * 14;
            const rotation = Math.random() * 40 - 20;

            // Shades of red/crimson for medical realism
            const colors = [
                '#c41e3a', // crimson
                '#8b0000', // dark red
                '#b22234', // arterial red
                '#dc143c', // medical red
                '#a52a2a', // deep tissue
                '#cc0000', // bright blood
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];

            spark.innerHTML = HEART_SVG;
            spark.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                color: ${color};
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%) rotate(${rotation}deg);
                animation: medical-heart-fly ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
                --fly-x: ${Math.cos(angle * Math.PI / 180) * distance}px;
                --fly-y: ${Math.sin(angle * Math.PI / 180) * distance}px;
                --rot: ${rotation + (Math.random() * 60 - 30)}deg;
                filter: drop-shadow(0 0 4px rgba(180, 30, 50, 0.5));
            `;
            containerRef.current.appendChild(spark);
            setTimeout(() => spark.remove(), duration);
        }
    }, [sparkCount, duration]);

    return (
        <div ref={containerRef} onClick={createSpark} style={{ position: 'relative' }}>
            <style>{`
                @keyframes medical-heart-fly {
                    0% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
                    }
                    30% {
                        opacity: 1;
                        transform: translate(
                            calc(-50% + var(--fly-x) * 0.3),
                            calc(-50% + var(--fly-y) * 0.3)
                        ) scale(1.1) rotate(calc(var(--rot) * 0.3));
                    }
                    100% {
                        opacity: 0;
                        transform: translate(
                            calc(-50% + var(--fly-x)),
                            calc(-50% + var(--fly-y) + 20px)
                        ) scale(0.5) rotate(var(--rot));
                    }
                }
            `}</style>
            {children}
        </div>
    );
};

export default ClickSpark;
