import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeartbeat, FaChartLine, FaRegHeart, FaStethoscope } from 'react-icons/fa';

// ── ReactBits Components ─────────────────────────
import SplitText from './components/reactbits/SplitText';
import ShinyText from './components/reactbits/ShinyText';
import GradientText from './components/reactbits/GradientText';
import Aurora from './components/reactbits/Aurora';
import TiltCard from './components/reactbits/TiltCard';

// ── App Components ───────────────────────────────
import HeartForm from './components/HeartForm';
import ResultCard from './components/ResultCard';
import Dashboard from './components/Dashboard';
import EcgBackground from './components/EcgBackground';
import './index.css';

function App() {
    const [activeTab, setActiveTab] = useState('predict');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = useCallback(async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error(`API Error: ${res.status}`);
            const data = await res.json();
            setResult({
                hasDisease: data.prediction === 1,
                probability: data.probability,
                riskLevel: data.risk_level || (data.prediction === 1 ? 'High Risk' : 'Low Risk'),
                message: data.message || (data.prediction === 1
                    ? 'Clinical indicators suggest elevated cardiovascular risk. Recommend further evaluation.'
                    : 'Indicators are within normal ranges. Continue routine monitoring.'),
                isOutlier: data.is_outlier,
                anomalyScore: data.anomaly_score,
                featureContributions: data.feature_contributions || {},
            });
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    }, []);

    const handleReset = () => setResult(null);

    const tabs = [
        { id: 'predict', label: 'Predict', icon: <FaStethoscope /> },
        { id: 'dashboard', label: 'Dashboard', icon: <FaChartLine /> },
    ];

    return (
        <>
            {/* ── Background layers ──────────────── */}
            <Aurora size={900} speed={8} opacity={0.1} />
            <EcgBackground />

            <div className="container">
                {/* ════════ HEADER ════════════════════ */}
                <motion.header
                    className="app-header"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Shiny badge */}
                    <motion.div
                        className="header-badge"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                        <span className="pulse-dot" />
                        <ShinyText text="AI-POWERED CARDIAC ANALYSIS" speed={2.5} />
                    </motion.div>

                    {/* Animated gradient title */}
                    <h1 className="app-title">
                        <GradientText
                            colors={['#ff2d55', '#ff6b8a', '#c084fc', '#00d4ff', '#ff2d55']}
                            speed={4}
                        >
                            Cardio
                        </GradientText>
                        <SplitText text="Analytics" delay={0.4} staggerTime={0.045} yOffset={20} />
                    </h1>

                    <motion.p
                        className="app-subtitle"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                    >
                        Advanced heart disease prediction powered by machine learning.
                        Real-time analytics and intelligent risk assessment.
                    </motion.p>

                    {/* ── Navigation Tabs ──────────── */}
                    <motion.div
                        className="nav-tabs"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.4, duration: 0.5, type: 'spring' }}
                    >
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {tab.icon}
                                <span style={{ marginLeft: '0.4rem' }}>{tab.label}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                </motion.header>

                {/* ════════ MAIN CONTENT ══════════════ */}
                <AnimatePresence mode="wait">
                    {activeTab === 'predict' && (
                        <motion.div
                            key="predict"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {error && (
                                <motion.div
                                    className="glass-panel"
                                    style={{ borderLeft: '4px solid var(--danger)', marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto 1.5rem' }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <strong style={{ color: 'var(--danger)' }}>⚠️ Error:</strong> {error}
                                </motion.div>
                            )}

                            {!result ? (
                                <TiltCard
                                    className="glass-panel"
                                    style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}
                                    maxTilt={4}
                                    scale={1.005}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 1.2, repeat: Infinity }}
                                        >
                                            <FaHeartbeat style={{ fontSize: '1.5rem', color: 'var(--heart-primary)' }} />
                                        </motion.div>
                                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Patient Assessment</h2>
                                    </div>
                                    <HeartForm onSubmit={handleSubmit} loading={loading} />
                                </TiltCard>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, rotateY: -5 }}
                                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <ResultCard result={result} onReset={handleReset} />
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Dashboard />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ════════ FOOTER ════════════════════ */}
                <motion.footer
                    style={{ textAlign: 'center', padding: '3rem 0 2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
                        >
                            <FaRegHeart style={{ color: 'var(--heart-primary)', fontSize: '0.9rem' }} />
                        </motion.div>
                        <ShinyText text="CardioAnalytics v1.3 — ML-Powered Heart Disease Detection" speed={4} />
                    </div>
                </motion.footer>
            </div>
        </>
    );
}

export default App;
