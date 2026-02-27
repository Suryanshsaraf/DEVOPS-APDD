// ──── ReactBits-inspired: ShinyText (gradient shimmer effect) ────
import React from 'react';
import './ShinyText.css';

const ShinyText = ({ text, className = '', speed = 3, disabled = false }) => (
    <span
        className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
        style={{ '--shimmer-speed': `${speed}s` }}
    >
        {text}
    </span>
);

export default ShinyText;
