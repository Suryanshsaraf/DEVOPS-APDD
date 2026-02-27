import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#38bdf8', '#818cf8', '#f59e0b'];

const ROCCurve = ({ performance }) => {
    if (!performance || !performance.models) return null;

    const modelNames = Object.keys(performance.models);

    // Find the model with most data points to create unified x-axis
    const allData = [];
    modelNames.forEach(name => {
        const roc = performance.models[name]?.roc_curve;
        if (roc && roc.fpr && roc.tpr) {
            roc.fpr.forEach((fpr, i) => {
                const existing = allData.find(d => Math.abs(d.fpr - fpr) < 0.001);
                if (existing) {
                    existing[name] = roc.tpr[i];
                } else {
                    const entry = { fpr: fpr };
                    entry[name] = roc.tpr[i];
                    allData.push(entry);
                }
            });
        }
    });

    allData.sort((a, b) => a.fpr - b.fpr);

    // Add diagonal line
    const withDiagonal = allData.map(d => ({ ...d, Random: d.fpr }));

    return (
        <div className="glass-panel chart-container">
            <h3 className="chart-title">ROC Curve</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={withDiagonal} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="fpr" stroke="#94a3b8" fontSize={12} label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                    <YAxis stroke="#94a3b8" fontSize={12} label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip
                        contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        labelStyle={{ color: '#f8fafc' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    {modelNames.map((name, i) => (
                        <Line
                            key={name}
                            type="monotone"
                            dataKey={name}
                            stroke={COLORS[i % COLORS.length]}
                            strokeWidth={2}
                            dot={false}
                            name={`${name} (AUC: ${performance.models[name]?.roc_auc?.toFixed(3) || '?'})`}
                        />
                    ))}
                    <Line type="monotone" dataKey="Random" stroke="#475569" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Random (0.500)" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ROCCurve;
