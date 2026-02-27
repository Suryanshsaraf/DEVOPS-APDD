// ──── ReactBits-inspired: GradientText (animated gradient) ────
import React from 'react';
import './GradientText.css';

const GradientText = ({
    children,
    className = '',
    colors = ['#ff2d55', '#c084fc', '#00d4ff', '#ff6b8a', '#ff2d55'],
    speed = 4,
    animateOnHover = false,
}) => {
    const gradientStyle = {
        backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
        backgroundSize: '300% 100%',
        animation: animateOnHover ? 'none' : `gradient-shift ${speed}s ease-in-out infinite`,
    };

    return (
        <span
            className={`gradient-text ${animateOnHover ? 'hover-animate' : ''} ${className}`}
            style={gradientStyle}
        >
            {children}
        </span>
    );
};

export default GradientText;
