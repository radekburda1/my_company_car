import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import './Dashboard.css';

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface DashboardProps {
  expenses: Expense[];
  allowance: number;
  startDate: string;
  currency: string;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, allowance, startDate, currency }) => {
  // Calculate stats
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const start = new Date(startDate);
  const now = new Date();
  const monthsDiff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1;
  const totalAllowance = monthsDiff * allowance;
  
  const balance = totalAllowance - totalExpenses;
  const isPositive = balance >= 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {/* Main Balance Card */}
        <div className={`card dashboard-balance-card ${isPositive ? 'positive' : 'negative'}`}>
          <div className={`dashboard-balance-bg ${isPositive ? 'positive' : 'negative'}`}></div>
          <div className="dashboard-balance-content">
            <h2 className="dashboard-balance-label">Current Balance</h2>
            <div className={`dashboard-balance-amount ${isPositive ? 'positive' : 'negative'}`}>
              {balance > 0 ? '+' : ''}{formatCurrency(balance, currency)}
            </div>
            <div className={`dashboard-balance-badge ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {isPositive ? 'Good Decision' : 'Over Budget'}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="card dashboard-stat-card">
          <div className="dashboard-stat-icon sky">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="dashboard-stat-label">Total Allowance</p>
            <p className="dashboard-stat-value">{formatCurrency(totalAllowance, currency)}</p>
          </div>
        </div>

        <div className="card dashboard-stat-card">
          <div className="dashboard-stat-icon rose">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="dashboard-stat-label">Total Expenses</p>
            <p className="dashboard-stat-value">{formatCurrency(totalExpenses, currency)}</p>
          </div>
        </div>

        <div className="card dashboard-stat-card">
          <div className="dashboard-stat-icon indigo">
            <Calendar size={24} />
          </div>
          <div>
            <p className="dashboard-stat-label">Months Active</p>
            <p className="dashboard-stat-value">{monthsDiff}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
