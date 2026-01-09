import React from 'react';
import { LayoutDashboard, List, PlusCircle, Settings, Menu, X, LogOut } from 'lucide-react';
import './Navigation.css';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: List },
    { id: 'add', label: 'Add New', icon: PlusCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <nav className="navigation-container">
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`navigation ${isOpen ? 'mobile-open' : ''}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`navigation-button ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {isOpen && onLogout && (
          <>
            <div className="navigation-separator" />
            <button
              onClick={onLogout}
              className="navigation-button logout-item"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </>
        )}
      </div>
      
      {isOpen && <div className="mobile-menu-overlay" onClick={() => setIsOpen(false)} />}
    </nav>
  );
};
