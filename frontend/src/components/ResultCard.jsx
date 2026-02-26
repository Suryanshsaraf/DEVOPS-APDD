import React from 'react';

const ResultCard = ({ result, onReset }) => {
    const isDanger = result.hasDisease;

    return (
        <div className={`glass-panel result-card animate-fade-in ${isDanger ? 'result-danger' : 'result-success'
            }`} style={{ maxWidth: '600px', margin: '0 auto' }}>

            <div className="result-icon">
                {isDanger ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            </div>

            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{result.riskLevel}</h2>

            <div className="result-label">Confidence Score</div>
            <div className="result-value">
                {Math.round(result.probability * 100)}%
            </div>

            <p className="text-main" style={{ fontSize: '1.125rem', lineHeight: '1.6', marginBottom: '2.5rem', opacity: 0.9 }}>
                {result.message}
            </p>

            <button onClick={onReset} className="btn-primary" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Assess Another Patient
            </button>
        </div>
    );
};

export default ResultCard;
