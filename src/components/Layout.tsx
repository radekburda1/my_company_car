import React from 'react';
import { Navigation } from './Navigation';
import './Layout.css';

interface User {
  username: string;
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
  user?: User | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout, user }) => {

  return (
    <div className="layout-container">
      <header className="layout-header">
        <div className="layout-header-content">
          <div className="layout-logo">
            <div className="layout-logo-icon">
              <img src="/logo.png" alt="CarTracker Logo" className="layout-logo-img" />
            </div>
            <h1 className="layout-logo-text">
              <span className="text-car">Car</span>
              <span className="text-tracker">Tracker</span>
            </h1>
          </div>
          
          {user && (
            <div className="layout-user-mobile-info only-mobile">
               <span className="layout-user-name">
                {user.username}
              </span>
            </div>
          )}

          <Navigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onLogout={onLogout}
          />

          {user && (
            <div className="layout-user-section hide-mobile">
              <span className="layout-user-name">
                {user.username}
              </span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="layout-logout-button"
                >
                  Sign Out
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;
