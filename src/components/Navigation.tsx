import React from 'react';
import { LayoutDashboard, List, PlusCircle, Settings } from 'lucide-react';
import './Navigation.css';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: List },
    { id: 'add', label: 'Add New', icon: PlusCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`navigation-button ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
