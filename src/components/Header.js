import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className="app-header">
            <div className="header-center">
                <div className="logo-circle">
                    <img src="/Ashok-Leyland-Logo.png" alt="Ashok Leyland Logo" />
                </div>
                <div className="header-title-main">ASHOK LEYLAND</div>
                <div className="header-title-sub">Department Locator</div>
            </div>
        </header>
    );
};

export default Header;