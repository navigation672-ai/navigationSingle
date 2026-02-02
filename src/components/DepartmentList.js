import React, { useState } from 'react';
import { 
    EAST_LAND_DISPLAY, 
    MAIN_LAND_DISPLAY, 
    generateToken,
    generateMapplsURL 
} from '../utils';
import './DepartmentList.css';

const DepartmentList = ({ zone, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const departments = zone === 'east' ? EAST_LAND_DISPLAY : MAIN_LAND_DISPLAY;
    const zoneTitle = zone === 'east' ? 'East Land Departments' : 'Main Land Departments';
    const zoneSubtitle = `Select a department in ${zone === 'east' ? 'East' : 'Main'} Land to start navigation.`;
    
    const filteredDepts = Object.entries(departments).filter(([code, name]) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNavigation = (deptCode) => {
        const token = generateToken(deptCode);
        const mapplsURL = generateMapplsURL(deptCode, token);
        
        // Store token in localStorage with expiry
        localStorage.setItem(`token_${deptCode}`, JSON.stringify({
            token: token,
            expiry: Date.now() + (30 * 60 * 1000)
        }));
        
        // Open navigation in new tab
        window.open(mapplsURL, '_blank');
    };

    return (
        <section id="zone-view">
            <div className="zone-header">
                <button className="back-btn" onClick={onBack}>&#8592;</button>
                <div className="zone-title-block">
                    <div className="zone-title">{zoneTitle}</div>
                    <div className="zone-subtitle">{zoneSubtitle}</div>
                </div>
            </div>

            <div className="search-box">
                <input
                    id="search"
                    className="search-input"
                    type="text"
                    placeholder="Search department in this zone…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">&#128269;</span>
            </div>

            <div className="layout-grid">
                <section className="card">
                    <div className="dept-list">
                        {filteredDepts.map(([code, name]) => (
                            <div className="dept-row" key={code}>
                                <button 
                                    className="dept-link"
                                    onClick={() => handleNavigation(code)}
                                >
                                    {name}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="footer-actions">
                <p className="note-text">
                    Note: Navigation links are valid for 30 minutes from generation.
                </p>
            </div>
        </section>
    );
};

export default DepartmentList;