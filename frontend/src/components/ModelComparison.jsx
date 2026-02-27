import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#38bdf8', '#818cf8', '#f59e0b'];
const METRICS = ['accuracy', 'precision', 'recall', 'f1_score', 'roc_auc'];

const ModelComparison = ({ performance }) => {
    if (!performance || !performance.models) return null;

    const modelNames = Object.keys(performance.models);
    const chartData = METRICS.map(metric => {
        const entry = { metric: metric === 'f1_score' ? 'F1' : metric === 'roc_auc' ? 'AUC' : metric.charAt(0).toUpperCase() + metric.slice(1) };
        modelNames.forEach(name => {
            entry[name] = performance.models[name][metric];
        });
        return entry;
    });

    return (
        <div className="glass-panel chart-container">
            <h3 className="chart-title">
                Model Performance Comparison
                {performance.best_model && (
                    <span className="badge-best">Best: {performance.best_model}</span>
                )}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 1]} />
                    <Tooltip
                        contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        labelStyle={{ color: '#f8fafc' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    {modelNames.map((name, i) => (
                        <Bar key={name} dataKey={name} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ModelComparison;
