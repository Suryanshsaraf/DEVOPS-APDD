import React, { useState } from 'react';

const HeartForm = ({ onSubmit }) => {
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
        // Convert necessary strings to numbers
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

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{
                display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem'
            }}>
                {/* Vitals */}
                <div className="input-group">
                    <label htmlFor="age">Age (years)</label>
                    <input type="number" id="age" name="age" className="glass-input" required min="1" max="120"
                        value={formData.age} onChange={handleChange} placeholder="e.g. 52" />
                </div>

                <div className="input-group">
                    <label htmlFor="sex">Biological Sex</label>
                    <select id="sex" name="sex" className="glass-input" value={formData.sex} onChange={handleChange}>
                        <option value="1">Male</option>
                        <option value="0">Female</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="trestbps">Resting Blood Pressure (mm Hg)</label>
                    <input type="number" id="trestbps" name="trestbps" className="glass-input" required min="50" max="250"
                        value={formData.trestbps} onChange={handleChange} placeholder="e.g. 125" />
                </div>

                <div className="input-group">
                    <label htmlFor="chol">Serum Cholestoral (mg/dl)</label>
                    <input type="number" id="chol" name="chol" className="glass-input" required min="100" max="600"
                        value={formData.chol} onChange={handleChange} placeholder="e.g. 212" />
                </div>

                <div className="input-group">
                    <label htmlFor="thalach">Max Heart Rate Achieved</label>
                    <input type="number" id="thalach" name="thalach" className="glass-input" required min="50" max="220"
                        value={formData.thalach} onChange={handleChange} placeholder="e.g. 168" />
                </div>

                {/* Clinical Types */}
                <div className="input-group">
                    <label htmlFor="cp">Chest Pain Type</label>
                    <select id="cp" name="cp" className="glass-input" value={formData.cp} onChange={handleChange}>
                        <option value="0">Typical Angina (0)</option>
                        <option value="1">Atypical Angina (1)</option>
                        <option value="2">Non-anginal Pain (2)</option>
                        <option value="3">Asymptomatic (3)</option>
                    </select>
                </div>

                {/* Binary Checks */}
                <div className="input-group">
                    <label htmlFor="fbs">Fasting Blood Sugar {'>'} 120 mg/dl</label>
                    <select id="fbs" name="fbs" className="glass-input" value={formData.fbs} onChange={handleChange}>
                        <option value="0">False</option>
                        <option value="1">True</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="restecg">Resting ECG Results</label>
                    <select id="restecg" name="restecg" className="glass-input" value={formData.restecg} onChange={handleChange}>
                        <option value="0">Normal (0)</option>
                        <option value="1">ST-T Wave Abnormality (1)</option>
                        <option value="2">Left Ventricular Hypertrophy (2)</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="exang">Exercise Induced Angina</label>
                    <select id="exang" name="exang" className="glass-input" value={formData.exang} onChange={handleChange}>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="oldpeak">ST Depression (Oldpeak)</label>
                    <input type="number" id="oldpeak" name="oldpeak" className="glass-input" required step="0.1" min="0" max="10"
                        value={formData.oldpeak} onChange={handleChange} placeholder="e.g. 1.0" />
                </div>

                <div className="input-group">
                    <label htmlFor="slope">Slope of Peak Exercise ST Segment</label>
                    <select id="slope" name="slope" className="glass-input" value={formData.slope} onChange={handleChange}>
                        <option value="0">Upsloping (0)</option>
                        <option value="1">Flat (1)</option>
                        <option value="2">Downsloping (2)</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="ca">Number of Major Vessels</label>
                    <select id="ca" name="ca" className="glass-input" value={formData.ca} onChange={handleChange}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>

                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="thal">Thalassemia Type</label>
                    <select id="thal" name="thal" className="glass-input" value={formData.thal} onChange={handleChange}>
                        <option value="1">Normal (1)</option>
                        <option value="2">Fixed Defect (2)</option>
                        <option value="3">Reversable Defect (3)</option>
                    </select>
                </div>
            </div>

            <button type="submit" className="btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Analyze Patient Data
            </button>
        </form>
    );
};

export default HeartForm;
