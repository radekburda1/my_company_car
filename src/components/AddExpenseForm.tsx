import React, { useState, FormEvent } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { CURRENCIES } from '../utils/currency';

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface AddExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
  currency: string;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onAddExpense, currency }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Fuel',
    amount: ''
  });

  const categories = ['Fuel', 'Maintenance', 'Insurance', 'Tax', 'Parking', 'Tolls', 'Other'];
  const selectedCurrency = CURRENCIES[currency] || CURRENCIES.CZK;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    onAddExpense({
      ...formData,
      amount: parseFloat(formData.amount),
      id: Date.now().toString()
    });

    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'Fuel',
      amount: ''
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <PlusCircle className="text-sky-400" />
          Add New Expense
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <input
              type="text"
              required
              placeholder="e.g., Shell Station"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{selectedCurrency.symbol}</span>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <PlusCircle size={20} />
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;
