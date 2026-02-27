// ──── ReactBits-inspired: AnimatedCounter (rolling number) ────
import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

const AnimatedCounter = ({ value = 0, suffix = '', className = '', duration = 1.5 }) => {
    const motionVal = useMotionValue(0);
    const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });
    const [display, setDisplay] = useState('0');

    useEffect(() => {
        motionVal.set(value);
    }, [value, motionVal]);

    useEffect(() => {
        const unsubscribe = spring.on('change', (v) => {
            if (suffix === '%') {
                setDisplay(Math.round(v).toString());
            } else {
                setDisplay(Math.round(v).toLocaleString());
            }
        });
        return unsubscribe;
    }, [spring, suffix]);

    return (
        <motion.span className={className}>
            {display}{suffix}
        </motion.span>
    );
};

export default AnimatedCounter;
