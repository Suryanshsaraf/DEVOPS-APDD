import React, { useState } from 'react';
import HeartForm from './components/HeartForm';
import ResultCard from './components/ResultCard';
import Dashboard from './components/Dashboard';
import EcgBackground from './components/EcgBackground';

const PAGES = [
    { id: 'predict', label: '🔬 Predict', icon: '🔬' },
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
];

function App() {
    const [page, setPage] = useState('predict');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePredict = async (formData) => {
        setLoading(true);
        setError(null);
        setPrediction(null);

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to get prediction from server');
            }

            const data = await response.json();
            setPrediction({
                hasDisease: data.prediction === 1,
                probability: data.probability,
                riskLevel: data.prediction === 1 ? 'High Risk' : 'Low Risk',
                message: data.prediction === 1
                    ? 'The model predicts a high likelihood of heart disease. Please consult a cardiologist.'
                    : 'The model predicts a low likelihood of heart disease. Maintain a healthy lifestyle!',
                isOutlier: data.is_outlier,
                anomalyScore: data.anomaly_score,
                featureContributions: data.feature_contributions || {},
            });
        } catch (err) {
            console.error('Prediction error:', err);
            setError('An error occurred while connecting to the prediction service. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setPrediction(null);
        setError(null);
    };

    return (
        <>
            {/* ECG heartbeat background */}
            <EcgBackground />

            {/* Background decoration */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            <div className="container">
                <header className="app-header animate-fade-in">
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>
                        <span className="text-gradient">Cardio</span>Analytics
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
                        Intelligent Heart Disease Prediction & Analytics Platform
                    </p>

                    {/* Navigation */}
                    <nav className="nav-tabs">
                        {PAGES.map(p => (
                            <button
                                key={p.id}
                                className={`nav-tab ${page === p.id ? 'active' : ''}`}
                                onClick={() => setPage(p.id)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </nav>
                </header>

                <main className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {page === 'predict' && (
                        <>
                            {error && (
                                <div className="glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--danger)' }}>
                                    <p style={{ color: 'var(--danger)', fontWeight: 500 }}>{error}</p>
                                </div>
                            )}

                            {!prediction && !loading && (
                                <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
                                    <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Patient Assessment Form</h2>
                                    <HeartForm onSubmit={handlePredict} />
                                </div>
                            )}

                            {loading && (
                                <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}>
                                    <div className="spinner" style={{ margin: '0 auto 1.5rem', width: '48px', height: '48px', borderWidth: '4px' }}></div>
                                    <h3 style={{ fontSize: '1.5rem' }}>Analyzing Patient Data</h3>
                                    <p className="text-muted" style={{ marginTop: '0.5rem' }}>Running deep ensemble models...</p>
                                </div>
                            )}

                            {prediction && !loading && (
                                <ResultCard result={prediction} onReset={handleReset} />
                            )}
                        </>
                    )}

                    {page === 'dashboard' && <Dashboard />}
                </main>
            </div>
        </>
    );
}

export default App;
