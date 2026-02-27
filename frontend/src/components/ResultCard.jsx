import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaCheckCircle, FaRedo, FaRegHeart, FaHeart } from 'react-icons/fa';

const ResultCard = ({ result, onReset }) => {
    const isDanger = result.hasDisease;
    const pct = Math.round(result.probability * 100);

    return (
        <motion.div
            className={`glass-panel result-card ${isDanger ? 'result-danger' : 'result-success'}`}
            style={{ maxWidth: '700px', margin: '0 auto' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* ── Animated Icon ───────── */}
            <motion.div
                className="result-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
            >
                {isDanger ? (
                    <FaHeart style={{ fontSize: '2.5rem' }} />
                ) : (
                    <FaCheckCircle style={{ fontSize: '2.5rem' }} />
                )}
            </motion.div>

            {/* ── Risk Level ─────────── */}
            <motion.h2
                style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
            >
                {result.riskLevel}
            </motion.h2>

            {/* ── Probability ────────── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
            >
                <div className="result-label">Confidence Score</div>
                <div className="result-value">{pct}%</div>
            </motion.div>

            {/* ── Outlier Alert ───────── */}
            {result.isOutlier && (
                <motion.div
                    className="outlier-badge"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 }}
                >
                    ⚡ Outlier Detected
                    <span className="outlier-sub">This input deviates from typical patient data</span>
                </motion.div>
            )}

            {/* ── Message ────────────── */}
            <motion.p
                className="text-main"
                style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem', color: 'var(--text-secondary)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {result.message}
            </motion.p>

            {/* ── Feature Contributions ─ */}
            {result.featureContributions && Object.keys(result.featureContributions).length > 0 && (
                <motion.div
                    className="shap-section"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                        Key Contributing Factors
                    </h4>
                    <div className="shap-bars">
                        {Object.entries(result.featureContributions)
                            .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                            .slice(0, 5)
                            .map(([name, value], i) => (
                                <motion.div
                                    key={name}
                                    className="shap-bar-item"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + i * 0.08 }}
                                >
                                    <span className="shap-name">{name}</span>
                                    <div className="shap-bar-container">
                                        <motion.div
                                            className={`shap-bar-fill ${value > 0 ? 'shap-positive' : 'shap-negative'}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(Math.abs(value) * 500, 100)}%` }}
                                            transition={{ delay: 0.8 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                                        />
                                    </div>
                                    <span className={`shap-value ${value > 0 ? 'shap-pos-text' : 'shap-neg-text'}`}>
                                        {value > 0 ? '+' : ''}{value.toFixed(3)}
                                    </span>
                                </motion.div>
                            ))}
                    </div>
                </motion.div>
            )}

            {/* ── Reset Button ───────── */}
            <motion.button
                onClick={onReset}
                className="btn-ghost"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <FaRedo />
                Assess Another Patient
            </motion.button>
        </motion.div>
    );
};

export default ResultCard;
