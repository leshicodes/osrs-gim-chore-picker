import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-decorative left"></div>
      <div className="header-decorative right"></div>
      
      <div className="header-content">
        <h1 className="app-title">
          <span className="nutville">NUTVILLE</span>
          <span className="chore-picker">Chore Picker</span>
        </h1>
        <p className="app-subtitle">
          Randomly assign OSRS tasks for your Group Ironman team
        </p>
      </div>
    </header>
  );
};

export default Header;
