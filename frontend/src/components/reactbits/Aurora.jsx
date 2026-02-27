// ──── ReactBits-inspired: Aurora (animated gradient background) ────
import React from 'react';
import './Aurora.css';

const Aurora = ({ size = 800, speed = 6, opacity = 0.12 }) => (
    <div className="aurora-container" aria-hidden="true">
        <div
            className="aurora-blob aurora-1"
            style={{ '--aurora-size': `${size}px`, '--aurora-speed': `${speed}s`, opacity }}
        />
        <div
            className="aurora-blob aurora-2"
            style={{ '--aurora-size': `${size * 0.9}px`, '--aurora-speed': `${speed * 1.3}s`, opacity: opacity * 0.8 }}
        />
        <div
            className="aurora-blob aurora-3"
            style={{ '--aurora-size': `${size * 0.7}px`, '--aurora-speed': `${speed * 0.9}s`, opacity: opacity * 0.6 }}
        />
    </div>
);

export default Aurora;
