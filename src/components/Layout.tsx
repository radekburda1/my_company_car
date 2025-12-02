import React from 'react';
import { Navigation } from './Navigation';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {

  return (
    <div className="layout-container">
      <header className="layout-header">
        <div className="layout-header-content">
          <div className="layout-logo">
            <div className="layout-logo-icon">
              <div className="layout-logo-icon-inner" />
            </div>
            <h1 className="layout-logo-text">
              CarTracker
            </h1>
          </div>
          
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </header>

      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;
