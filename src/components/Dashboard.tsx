import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
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

  // Process data for the chart
  const getChartData = () => {
    const data: any[] = [];
    const monthsToShow = monthsDiff > 12 ? 12 : monthsDiff; // show last 12 months max
    
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      const yearLabel = d.getFullYear().toString().slice(-2);
      
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      
      const monthlySpending = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate >= monthStart && expDate <= monthEnd;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);
        
      data.push({
        name: `${monthLabel} '${yearLabel}`,
        spending: monthlySpending,
        earnings: allowance,
      });
    }
    return data;
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getHighestExpensesData = () => {
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    return [...expenses]
      .filter(exp => new Date(exp.date) >= oneYearAgo)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)
      .map(exp => ({
        name: `${formatDate(exp.date)} - ${exp.category}`,
        amount: exp.amount,
        description: exp.description,
        date: formatDate(exp.date),
        category: exp.category,
      }));
  };

  const chartData = getChartData();
  const highestExpensesData = getHighestExpensesData();

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

      {/* Chart Section - Monthly Overview */}
      <div className="card dashboard-chart-card">
        <h3 className="dashboard-chart-title">Monthly Overview</h3>
        <p className="dashboard-chart-subtitle">Allowance vs Spending over time</p>
        <div className="dashboard-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(51, 65, 85, 0.3)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }}
                itemStyle={{ fontSize: '13px' }}
                formatter={(value: number | undefined) => [value !== undefined ? formatCurrency(value, currency) : '0', '']}
              />
              <Area 
                type="monotone" 
                dataKey="earnings" 
                name="Earnings"
                stroke="#38bdf8" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorEarnings)" 
              />
              <Area 
                type="monotone" 
                dataKey="spending" 
                name="Spending"
                stroke="#818cf8" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSpending)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Highest Expenses Chart */}
      <div className="card dashboard-chart-card">
        <h3 className="dashboard-chart-title">Highest Expenses</h3>
        <p className="dashboard-chart-subtitle">Top 10 transactions in the last year</p>
        <div className="dashboard-chart-wrapper bar-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={highestExpensesData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(51, 65, 85, 0.3)" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                width={100}
              />
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="custom-dashboard-tooltip">
                        <div className="tooltip-header">
                          <span className="tooltip-date">{data.date}</span>
                          <span className="tooltip-category">{data.category}</span>
                        </div>
                        <div className="tooltip-amount">{formatCurrency(data.amount, currency)}</div>
                        {data.description && <div className="tooltip-description">{data.description}</div>}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="#818cf8" 
                radius={[0, 4, 4, 0]} 
                activeBar={{ fill: '#a5b4fc' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
