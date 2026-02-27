import React from 'react';
import { motion } from 'framer-motion';
import TiltCard from './reactbits/TiltCard';
import AnimatedCounter from './reactbits/AnimatedCounter';

const StatsCards = ({ stats }) => {
    if (!stats) return null;

    const cards = [
        { icon: '🫀', label: 'Total Predictions', value: stats.total_predictions ?? 0, color: 'var(--heart-primary)', suffix: '' },
        { icon: '⚡', label: 'High Risk Cases', value: stats.positive_predictions ?? 0, color: 'var(--danger)', suffix: '' },
        { icon: '💚', label: 'Low Risk Cases', value: stats.negative_predictions ?? 0, color: 'var(--success)', suffix: '' },
        { icon: '📊', label: 'Avg Confidence', value: stats.average_confidence ? Math.round(stats.average_confidence * 100) : 0, color: 'var(--med-primary)', suffix: '%' },
    ];

    return (
        <div className="stats-grid">
            {cards.map((card, i) => (
                <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <TiltCard
                        className="glass-panel stat-card"
                        maxTilt={15}
                        scale={1.04}
                        style={{ position: 'relative' }}
                    >
                        <div className="stat-icon">{card.icon}</div>
                        <div className="stat-value" style={{ color: card.color }}>
                            <AnimatedCounter value={card.value} suffix={card.suffix} duration={1.5} />
                        </div>
                        <div className="stat-label">{card.label}</div>
                    </TiltCard>
                </motion.div>
            ))}
        </div>
    );
};

export default StatsCards;
