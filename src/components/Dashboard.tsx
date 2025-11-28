import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Balance Card */}
        <div className={`md:col-span-3 card relative overflow-hidden ${isPositive ? 'border-emerald-500/30' : 'border-rose-500/30'}`}>
          <div className={`absolute inset-0 opacity-10 ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
          <div className="relative z-10 flex flex-col items-center justify-center py-8 text-center">
            <h2 className="text-slate-400 font-medium mb-2">Current Balance</h2>
            <div className={`text-5xl font-bold mb-4 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {balance > 0 ? '+' : ''}{formatCurrency(balance, currency)}
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              isPositive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {isPositive ? 'Good Decision' : 'Over Budget'}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-full bg-sky-500/20 text-sky-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total Allowance</p>
            <p className="text-xl font-bold text-slate-100">{formatCurrency(totalAllowance, currency)}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-full bg-rose-500/20 text-rose-400">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total Expenses</p>
            <p className="text-xl font-bold text-slate-100">{formatCurrency(totalExpenses, currency)}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-400">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Months Active</p>
            <p className="text-xl font-bold text-slate-100">{monthsDiff}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
