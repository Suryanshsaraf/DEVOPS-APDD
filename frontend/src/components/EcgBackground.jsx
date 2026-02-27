import React from 'react';

const ECG_PATH = "M0,30 L30,30 L35,30 L40,10 L45,30 L50,30 L55,30 L60,5 L65,55 L70,30 L75,30 L105,30 L110,30 L115,10 L120,30 L125,30 L130,30 L135,5 L140,55 L145,30 L150,30 L180,30 L185,30 L190,10 L195,30 L200,30 L205,30 L210,5 L215,55 L220,30 L225,30 L255,30 L260,30 L265,10 L270,30 L275,30 L280,30 L285,5 L290,55 L295,30 L300,30";

const lines = [
    { top: '10%', opacity: 0.03, speed: '16s', color: '#ff2d55' },
    { top: '25%', opacity: 0.04, speed: '14s', color: '#ff6b8a' },
    { top: '40%', opacity: 0.03, speed: '18s', color: '#00d4ff' },
    { top: '55%', opacity: 0.025, speed: '20s', color: '#818cf8' },
    { top: '70%', opacity: 0.035, speed: '15s', color: '#ff2d55' },
    { top: '85%', opacity: 0.02, speed: '22s', color: '#00d4ff' },
];

const EcgBackground = () => (
    <div className="ecg-bg">
        {lines.map((line, i) => (
            <div
                key={i}
                className="ecg-line-wrapper"
                style={{
                    top: line.top,
                    animationDuration: line.speed,
                    animationDelay: `${-i * 2.5}s`,
                }}
            >
                <svg className="ecg-svg" viewBox="0 0 300 60" preserveAspectRatio="none">
                    <path
                        d={ECG_PATH}
                        fill="none"
                        stroke={line.color}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity={line.opacity}
                    />
                </svg>
                <svg className="ecg-svg" viewBox="0 0 300 60" preserveAspectRatio="none">
                    <path
                        d={ECG_PATH}
                        fill="none"
                        stroke={line.color}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity={line.opacity}
                    />
                </svg>
            </div>
        ))}
    </div>
);

export default EcgBackground;
