// ──── ReactBits-inspired: TiltCard (3D perspective tilt on hover) ────
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TiltCard = ({ children, className = '', style = {}, maxTilt = 12, scale = 1.02, perspective = 1200 }) => {
    const ref = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -maxTilt;
        const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * maxTilt;
        setTilt({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{
                ...style,
                perspective: `${perspective}px`,
                transformStyle: 'preserve-3d',
            }}
            animate={{
                rotateX: tilt.x,
                rotateY: tilt.y,
                scale: isHovered ? scale : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {/* Glare overlay */}
            {isHovered && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        background: `radial-gradient(circle at ${50 + tilt.y * 3}% ${50 + tilt.x * 3}%, rgba(255,255,255,0.06), transparent 60%)`,
                        pointerEvents: 'none',
                    }}
                />
            )}
        </motion.div>
    );
};

export default TiltCard;
