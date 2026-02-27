import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCards from './StatsCards';
import ModelComparison from './ModelComparison';
import ConfusionMatrix from './ConfusionMatrix';
import ROCCurve from './ROCCurve';
import PredictionTimeline from './PredictionTimeline';
import SpikeAlert from './SpikeAlert';
import FeatureImportance from './FeatureImportance';

const TABS = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'models', label: '🧠 Model Performance' },
    { id: 'analytics', label: '📈 Analytics' },
];

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [spikeData, setSpikeData] = useState(null);
    const [spikeAnalysis, setSpikeAnalysis] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [featureImportance, setFeatureImportance] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [statsRes, historyRes, spikeRes, spikeAnalysisRes] = await Promise.all([
                fetch('/analytics/stats'),
                fetch('/analytics/history?limit=200'),
                fetch('/analytics/spikes'),
                fetch('/analytics/spike-analysis'),
            ]);
            if (statsRes.ok) setStats(await statsRes.json());
            if (historyRes.ok) setHistory(await historyRes.json());
            if (spikeRes.ok) setSpikeData(await spikeRes.json());
            if (spikeAnalysisRes.ok) setSpikeAnalysis(await spikeAnalysisRes.json());
        } catch (err) { console.error('Dashboard:', err); }
        setLoading(false);
    }, []);

    const fetchModelData = useCallback(async () => {
        try {
            const [perfRes, fiRes] = await Promise.all([
                fetch('/model/performance'),
                fetch('/model/feature-importance'),
            ]);
            if (perfRes.ok) setPerformance(await perfRes.json());
            if (fiRes.ok) { const d = await fiRes.json(); setFeatureImportance(d.features); }
        } catch (err) { console.error('Model data:', err); }
    }, []);

    useEffect(() => {
        fetchData();
        fetchModelData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [fetchData, fetchModelData]);

    if (loading) {
        return (
            <motion.div
                className="glass-panel"
                style={{ textAlign: 'center', padding: '4rem 2rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="heart-loader">🫀</div>
                <p className="text-muted" style={{ marginTop: '1rem' }}>Loading Dashboard…</p>
            </motion.div>
        );
    }

    const tabContent = {
        overview: (
            <motion.div className="dash-section" key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <StatsCards stats={stats} />
                <SpikeAlert spikeData={spikeData} spikeAnalysis={spikeAnalysis} />
                <PredictionTimeline history={history} />
            </motion.div>
        ),
        models: (
            <motion.div className="dash-section" key="models" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <div className="chart-row">
                    <ModelComparison performance={performance} />
                    <ROCCurve performance={performance} />
                </div>
                <div className="chart-row">
                    <ConfusionMatrix performance={performance} />
                    <FeatureImportance features={featureImportance} />
                </div>
            </motion.div>
        ),
        analytics: (
            <motion.div className="dash-section" key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <StatsCards stats={stats} />
                <div className="chart-row">
                    <PredictionTimeline history={history} />
                </div>
                <SpikeAlert spikeData={spikeData} spikeAnalysis={spikeAnalysis} />
                <FeatureImportance features={featureImportance} />
            </motion.div>
        ),
    };

    return (
        <div className="dashboard">
            <div className="dash-tabs">
                {TABS.map(tab => (
                    <motion.button
                        key={tab.id}
                        className={`dash-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {tab.label}
                    </motion.button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {tabContent[activeTab]}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
