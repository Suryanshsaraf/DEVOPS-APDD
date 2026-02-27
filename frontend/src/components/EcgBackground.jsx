import React from 'react';

/**
 * Animated ECG / heartbeat line background.
 * Renders multiple SVG paths that scroll continuously from right to left,
 * creating a living cardiac-monitor look behind the app content.
 */
const ECG_PATH =
    'M0,50 L30,50 L35,50 L38,20 L42,80 L46,10 L50,90 L54,30 L58,50 L90,50 ' +
    'L120,50 L125,50 L128,25 L132,75 L136,15 L140,85 L144,35 L148,50 L180,50 ' +
    'L210,50 L215,50 L218,30 L222,70 L226,10 L230,90 L234,40 L238,50 L270,50 ' +
    'L300,50 L305,50 L308,20 L312,80 L316,10 L320,90 L324,30 L328,50 L360,50 ' +
    'L390,50 L395,50 L398,25 L402,75 L406,15 L410,85 L414,35 L418,50 L450,50 ' +
    'L480,50 L485,50 L488,30 L492,70 L496,10 L500,90 L504,40 L508,50 L540,50 ' +
    'L570,50 L575,50 L578,20 L582,80 L586,10 L590,90 L594,30 L598,50 L630,50 ' +
    'L660,50 L665,50 L668,25 L672,75 L676,15 L680,85 L684,35 L688,50 L720,50';

function EcgBackground() {
    const lines = [
        { top: '12%', opacity: 0.07, duration: '12s', delay: '0s', color: '#38bdf8' },
        { top: '30%', opacity: 0.05, duration: '16s', delay: '-4s', color: '#818cf8' },
        { top: '50%', opacity: 0.06, duration: '14s', delay: '-7s', color: '#38bdf8' },
        { top: '70%', opacity: 0.04, duration: '18s', delay: '-2s', color: '#818cf8' },
        { top: '88%', opacity: 0.07, duration: '13s', delay: '-9s', color: '#38bdf8' },
    ];

    return (
        <div className="ecg-bg" aria-hidden="true">
            {lines.map((l, i) => (
                <div
                    key={i}
                    className="ecg-line-wrapper"
                    style={{
                        top: l.top,
                        opacity: l.opacity,
                        animationDuration: l.duration,
                        animationDelay: l.delay,
                    }}
                >
                    <svg
                        viewBox="0 0 720 100"
                        preserveAspectRatio="none"
                        className="ecg-svg"
                    >
                        <path
                            d={ECG_PATH}
                            fill="none"
                            stroke={l.color}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    {/* duplicate for seamless loop */}
                    <svg
                        viewBox="0 0 720 100"
                        preserveAspectRatio="none"
                        className="ecg-svg"
                    >
                        <path
                            d={ECG_PATH}
                            fill="none"
                            stroke={l.color}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            ))}
        </div>
    );
}

export default EcgBackground;
