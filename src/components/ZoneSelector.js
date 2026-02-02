import React from 'react';
import './ZoneSelector.css';

const ZoneSelector = ({ onSelectZone }) => {
    return (
        <section id="zone-selector">
            <div className="page-title">Department Locator</div>
            <div className="page-subtitle">
                Choose your zone inside the plant to view departments and open navigation.
            </div>
            <div className="zone-buttons">
                <button className="zone-btn" onClick={() => onSelectZone('east')}>
                    East Land Departments
                </button>
                <button className="zone-btn" onClick={() => onSelectZone('main')}>
                    Main Land Departments
                </button>
            </div>
        </section>
    );
};

export default ZoneSelector;