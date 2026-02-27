// ──── ReactBits-inspired: SplitText (letter-by-letter reveal) ────
import React from 'react';
import { motion } from 'framer-motion';

const SplitText = ({
    text = '',
    className = '',
    delay = 0,
    duration = 0.05,
    ease = [0.16, 1, 0.3, 1],
    staggerTime = 0.03,
    yOffset = 30,
}) => {
    const letters = text.split('');

    const container = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: staggerTime,
                delayChildren: delay,
            },
        },
    };

    const child = {
        hidden: { opacity: 0, y: yOffset, filter: 'blur(6px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: duration + 0.3, ease },
        },
    };

    return (
        <motion.span
            className={className}
            style={{ display: 'inline-flex', overflow: 'hidden' }}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {letters.map((letter, i) => (
                <motion.span
                    key={i}
                    variants={child}
                    style={{ display: 'inline-block', whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
                >
                    {letter}
                </motion.span>
            ))}
        </motion.span>
    );
};

export default SplitText;
