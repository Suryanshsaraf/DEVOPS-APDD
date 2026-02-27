import React from 'react';

const StatsCards = ({ stats }) => {
    if (!stats) return null;

    const cards = [
        {
            label: 'Total Predictions',
            value: stats.total_predictions,
            icon: '🔬',
            color: 'var(--accent-primary)',
        },
        {
            label: 'High Risk',
            value: stats.high_risk_count,
            sub: stats.total_predictions > 0
                ? `${Math.round(stats.high_risk_rate * 100)}%`
                : '0%',
            icon: '⚠️',
            color: 'var(--danger)',
        },
        {
            label: 'Low Risk',
            value: stats.low_risk_count,
            icon: '✅',
            color: 'var(--success)',
        },
        {
            label: 'Avg Confidence',
            value: `${Math.round(stats.average_confidence * 100)}%`,
            icon: '📊',
            color: 'var(--accent-secondary)',
        },
    ];

    return (
        <div className="stats-grid">
            {cards.map((card, i) => (
                <div key={i} className="stat-card glass-panel">
                    <div className="stat-icon">{card.icon}</div>
                    <div className="stat-value" style={{ color: card.color }}>
                        {card.value}
                    </div>
                    <div className="stat-label">{card.label}</div>
                    {card.sub && <div className="stat-sub">{card.sub}</div>}
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
