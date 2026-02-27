import React from 'react';

const ConfusionMatrix = ({ performance }) => {
    if (!performance || !performance.models || !performance.best_model) return null;

    const bestModel = performance.best_model;
    const cm = performance.models[bestModel]?.confusion_matrix;
    if (!cm || cm.length < 2) return null;

    const tn = cm[0][0], fp = cm[0][1], fn = cm[1][0], tp = cm[1][1];
    const total = tn + fp + fn + tp;

    const cells = [
        { label: 'True Negative', value: tn, pct: Math.round((tn / total) * 100), cls: 'cm-tn' },
        { label: 'False Positive', value: fp, pct: Math.round((fp / total) * 100), cls: 'cm-fp' },
        { label: 'False Negative', value: fn, pct: Math.round((fn / total) * 100), cls: 'cm-fn' },
        { label: 'True Positive', value: tp, pct: Math.round((tp / total) * 100), cls: 'cm-tp' },
    ];

    return (
        <div className="glass-panel chart-container">
            <h3 className="chart-title">Confusion Matrix <span className="text-muted" style={{ fontSize: '0.8rem' }}>({bestModel})</span></h3>
            <div className="cm-grid">
                <div className="cm-labels-y">
                    <span>Actual Disease</span>
                    <span>Actual No Disease</span>
                </div>
                <div className="cm-matrix">
                    {cells.map((cell, i) => (
                        <div key={i} className={`cm-cell ${cell.cls}`}>
                            <div className="cm-value">{cell.value}</div>
                            <div className="cm-pct">{cell.pct}%</div>
                            <div className="cm-label">{cell.label}</div>
                        </div>
                    ))}
                </div>
                <div className="cm-labels-x">
                    <span>Predicted No Disease</span>
                    <span>Predicted Disease</span>
                </div>
            </div>
        </div>
    );
};

export default ConfusionMatrix;
