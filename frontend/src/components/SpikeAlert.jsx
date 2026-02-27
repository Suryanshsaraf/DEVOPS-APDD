import React from 'react';

const SpikeAlert = ({ spikeData, spikeAnalysis }) => {
    if (!spikeData) return null;

    const { spike_detected, spike_score, message, recent_high_risk_rate, baseline_high_risk_rate } = spikeData;

    if (!spike_detected && (!spikeData.message || spikeData.message.includes('Insufficient'))) {
        return null;
    }

    return (
        <div className={`spike-alert glass-panel ${spike_detected ? 'spike-active' : 'spike-normal'}`}>
            <div className="spike-header">
                <span className="spike-icon">{spike_detected ? '🚨' : '✅'}</span>
                <div>
                    <h3 className="spike-title">
                        {spike_detected ? 'Spike Detected!' : 'No Spike Detected'}
                    </h3>
                    <p className="spike-message">{message}</p>
                </div>
                {spike_detected && (
                    <div className="spike-score">
                        <span className="spike-score-value">{spike_score?.toFixed(1)}×</span>
                        <span className="spike-score-label">baseline</span>
                    </div>
                )}
            </div>

            {spike_detected && spikeAnalysis && spikeAnalysis.shifting_features?.length > 0 && (
                <div className="spike-analysis">
                    <h4>Why is there a spike?</h4>
                    <p className="spike-explanation">{spikeAnalysis.explanation}</p>
                    <div className="spike-features">
                        {spikeAnalysis.shifting_features.slice(0, 3).map((f, i) => (
                            <div key={i} className="spike-feature-item">
                                <span className="spike-feature-name">{f.feature}</span>
                                <span className="spike-feature-dir">{f.direction}</span>
                                <div className="spike-feature-bar">
                                    <div
                                        className="spike-feature-fill"
                                        style={{ width: `${Math.min(f.shift_magnitude * 25, 100)}%` }}
                                    />
                                </div>
                                <span className="spike-feature-mag">{f.shift_magnitude.toFixed(2)}σ</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {spike_detected && recent_high_risk_rate !== undefined && (
                <div className="spike-rates">
                    <div className="spike-rate">
                        <span className="spike-rate-label">Current Rate</span>
                        <span className="spike-rate-value" style={{ color: 'var(--danger)' }}>
                            {Math.round(recent_high_risk_rate * 100)}%
                        </span>
                    </div>
                    <div className="spike-rate">
                        <span className="spike-rate-label">Baseline Rate</span>
                        <span className="spike-rate-value" style={{ color: 'var(--text-muted)' }}>
                            {Math.round(baseline_high_risk_rate * 100)}%
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpikeAlert;
