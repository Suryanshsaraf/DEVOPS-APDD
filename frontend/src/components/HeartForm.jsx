import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBurn, FaHeartbeat, FaVial, FaRunning } from 'react-icons/fa';

const HeartForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        age: '', sex: '1', cp: '0', trestbps: '', chol: '', fbs: '0',
        restecg: '0', thalach: '', exang: '0', oldpeak: '', slope: '0', ca: '0', thal: '2'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const processedData = {
            age: parseInt(formData.age, 10),
            sex: parseInt(formData.sex, 10),
            cp: parseInt(formData.cp, 10),
            trestbps: parseFloat(formData.trestbps),
            chol: parseFloat(formData.chol),
            fbs: parseInt(formData.fbs, 10),
            restecg: parseInt(formData.restecg, 10),
            thalach: parseFloat(formData.thalach),
            exang: parseInt(formData.exang, 10),
            oldpeak: parseFloat(formData.oldpeak),
            slope: parseInt(formData.slope, 10),
            ca: parseInt(formData.ca, 10),
            thal: parseInt(formData.thal, 10)
        };
        onSubmit(processedData);
    };

    const containerAnim = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.04, delayChildren: 0.1 }
        }
    };

    const itemAnim = {
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* ── Section: Vitals ─────────────────── */}
            <motion.div
                className="form-section-title"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <FaHeartbeat /> Patient Vitals
            </motion.div>

            <motion.div
                className="form-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}
                variants={containerAnim} initial="hidden" animate="show"
            >
                <motion.div className="input-group" variants={itemAnim}>
                    <label htmlFor="age">Age (years)</label>
                    <input type="number" id="age" name="age" className="glass-input" required min="1" max="120"
                        value={formData.age} onChange={handleChange} placeholder="e.g. 52" />
                </motion.div>

                <motion.div className="input-group" variants={itemAnim}>
                    <label htmlFor="sex">Biological Sex</label>
                    <select id="sex" name="sex" className="glass-input" value={formData.sex} onChange={handleChange}>
                        <option value="1">Male</option>
                        <option value="0">Female</option>
                    </select>
                </motion.div>

                <motion.div className="input-group" variants={itemAnim}>
                    <label htmlFor="trestbps">Resting Blood Pressure (mm Hg)</label>
                    <input type="number" id="trestbps" name="trestbps" className="glass-input" required min="50" max="250"
                        value={formData.trestbps} onChange={handleChange} placeholder="e.g. 125" />
                </motion.div>

                <motion.div className="input-group" variants={itemAnim}>
                    <label htmlFor="chol">Serum Cholesterol (mg/dl)</label>
                    <input type="number" id="chol" name="chol" className="glass-input" required min="100" max="600"
                        value={formData.chol} onChange={handleChange} placeholder="e.g. 212" />
                </motion.div>

                <motion.div className="input-group" variants={itemAnim}>
                    <label htmlFor="thalach">Max Heart Rate Achieved</label>
                    <input type="number" id="thalach" name="thalach" className="glass-input" required min="50" max="220"
                        value={formData.thalach} onChange={handleChange} placeholder="e.g. 168" />
                </motion.div>

                <motion.div className="input-group" variants={itemAnim}>
                    <label htmlFor="oldpeak">ST Depression (Oldpeak)</label>
                    <input type="number" id="oldpeak" name="oldpeak" className="glass-input" required step="0.1" min="0" max="10"
                        value={formData.oldpeak} onChange={handleChange} placeholder="e.g. 1.0" />
                </motion.div>
            </motion.div>

            {/* ── Section: Clinical Assessment ────── */}
            <motion.div
                className="form-section-title"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
            >
                <FaVial /> Clinical Assessment
            </motion.div>

            <motion.div
                className="form-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}
                variants={containerAnim} initial="hidden" animate="show"
            >
                <motion.div className="input-group" variants={itemAnim}>
                    <label htmlFor="cp">Chest Pain Type</label>
                    <select id="cp" name="cp" className="glass-input" value={formData.cp} onChange={handleChange}>
                        <option value="0">Typical Angina</option>
                        <option value="1">Atypical Angina</option>
                        <option value="2">Non-anginal Pain</option>
                        <option value="3">Asymptomatic</option>
                    </select>
                </motion.div>

                <motion.div className="input-group" variants={itemAnim}>
                    <label htmlFor="fbs">Fasting Blood Sugar {'>'} 120 mg/dl</label>
                    <select id="fbs" name="fbs" className="glass-input" value={formData.fbs} onChange={handleChange}>
                        <option value="0">Normal</option>
                        <option value="1">Elevated</option>
                    </select>
                </motion.div>

                <motion.div className="input-group" variants={itemAnim}>
                    <label htmlFor="restecg">Resting ECG Results</label>
                    <select id="restecg" name="restecg" className="glass-input" value={formData.restecg} onChange={handleChange}>
                        <option value="0">Normal</option>
                        <option value="1">ST-T Wave Abnormality</option>
                        <option value="2">Left Ventricular Hypertrophy</option>
                    </select>
                </motion.div>

                <motion.div className="input-group" variants={itemAnim}>
                    <label htmlFor="exang">Exercise Induced Angina</label>
                    <select id="exang" name="exang" className="glass-input" value={formData.exang} onChange={handleChange}>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
                </motion.div>
            </motion.div>

            {/* ── Section: Advanced ───────────────── */}
            <motion.div
                className="form-section-title"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
            >
                <FaRunning /> Exercise & Vascular
            </motion.div>

            <motion.div
                className="form-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}
                variants={containerAnim} initial="hidden" animate="show"
            >
                <motion.div className="input-group" variants={itemAnim}>
                    <label htmlFor="slope">ST Segment Slope</label>
                    <select id="slope" name="slope" className="glass-input" value={formData.slope} onChange={handleChange}>
                        <option value="0">Upsloping</option>
                        <option value="1">Flat</option>
                        <option value="2">Downsloping</option>
                    </select>
                </motion.div>

                <motion.div className="input-group" variants={itemAnim}>
                    <label htmlFor="ca">Major Vessels (0–4)</label>
                    <select id="ca" name="ca" className="glass-input" value={formData.ca} onChange={handleChange}>
                        <option value="0">0</option><option value="1">1</option>
                        <option value="2">2</option><option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </motion.div>

                <motion.div className="input-group" variants={itemAnim} style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="thal">Thalassemia Type</label>
                    <select id="thal" name="thal" className="glass-input" value={formData.thal} onChange={handleChange}>
                        <option value="1">Normal</option>
                        <option value="2">Fixed Defect</option>
                        <option value="3">Reversible Defect</option>
                    </select>
                </motion.div>
            </motion.div>

            {/* ── Submit Button ───────────────────── */}
            <motion.button
                type="submit"
                className="btn-primary"
                disabled={loading}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
            >
                {loading ? (
                    <>
                        <div className="spinner" />
                        Analyzing...
                    </>
                ) : (
                    <>
                        <FaBurn style={{ fontSize: '1.1rem' }} />
                        Run Cardiac Analysis
                    </>
                )}
            </motion.button>
        </form>
    );
};

export default HeartForm;
