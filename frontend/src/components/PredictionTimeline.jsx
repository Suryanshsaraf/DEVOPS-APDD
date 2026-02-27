import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const PredictionTimeline = ({ history }) => {
    if (!history || history.length === 0) return null;

    // Bucket predictions by minute
    const buckets = {};
    history.forEach(h => {
        const date = new Date(h.timestamp);
        const key = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        if (!buckets[key]) {
            buckets[key] = { time: key, highRisk: 0, lowRisk: 0, total: 0 };
        }
        if (h.prediction === 1) {
            buckets[key].highRisk += 1;
        } else {
            buckets[key].lowRisk += 1;
        }
        buckets[key].total += 1;
    });

    const data = Object.values(buckets).slice(-30); // Last 30 minutes

    return (
        <div className="glass-panel chart-container">
            <h3 className="chart-title">Prediction Timeline</h3>
            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                    <Tooltip
                        contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        labelStyle={{ color: '#f8fafc' }}
                    />
                    <Area type="monotone" dataKey="highRisk" stackId="1" stroke="#ef4444" fill="rgba(239, 68, 68, 0.3)" name="High Risk" />
                    <Area type="monotone" dataKey="lowRisk" stackId="1" stroke="#10b981" fill="rgba(16, 185, 129, 0.3)" name="Low Risk" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PredictionTimeline;
