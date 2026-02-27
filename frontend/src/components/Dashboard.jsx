import React, { useState, useEffect, useCallback } from 'react';
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
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        }
        setLoading(false);
    }, []);

    const fetchModelData = useCallback(async () => {
        try {
            const [perfRes, fiRes] = await Promise.all([
                fetch('/model/performance'),
                fetch('/model/feature-importance'),
            ]);
            if (perfRes.ok) setPerformance(await perfRes.json());
            if (fiRes.ok) {
                const data = await fiRes.json();
                setFeatureImportance(data.features);
            }
        } catch (err) {
            console.error('Model data fetch error:', err);
        }
    }, []);

    useEffect(() => {
        fetchData();
        fetchModelData();
        // Poll analytics every 5 seconds
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [fetchData, fetchModelData]);

    if (loading) {
        return (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="spinner" style={{ margin: '0 auto 1rem', width: '40px', height: '40px' }}></div>
                <p className="text-muted">Loading Dashboard…</p>
            </div>
        );
    }

    return (
        <div className="dashboard animate-fade-in">
            {/* Dashboard Tabs */}
            <div className="dash-tabs">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`dash-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="dash-section">
                    <StatsCards stats={stats} />
                    <SpikeAlert spikeData={spikeData} spikeAnalysis={spikeAnalysis} />
                    <PredictionTimeline history={history} />
                </div>
            )}

            {/* Model Performance Tab */}
            {activeTab === 'models' && (
                <div className="dash-section">
                    <div className="chart-row">
                        <ModelComparison performance={performance} />
                        <ROCCurve performance={performance} />
                    </div>
                    <div className="chart-row">
                        <ConfusionMatrix performance={performance} />
                        <FeatureImportance features={featureImportance} />
                    </div>
                </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
                <div className="dash-section">
                    <StatsCards stats={stats} />
                    <div className="chart-row">
                        <PredictionTimeline history={history} />
                    </div>
                    <SpikeAlert spikeData={spikeData} spikeAnalysis={spikeAnalysis} />
                    <FeatureImportance features={featureImportance} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
