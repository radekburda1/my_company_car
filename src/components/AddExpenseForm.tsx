import React, { useState, FormEvent } from 'react';
import { PlusCircle } from 'lucide-react';
import { CURRENCIES } from '../utils/currency';
import './AddExpenseForm.css';

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
    <div className="add-expense-container">
      <div className="card">
        <h2 className="add-expense-header">
          <PlusCircle className="add-expense-header-icon" />
          Add New Expense
        </h2>

        <form onSubmit={handleSubmit} className="add-expense-form">
          <div className="add-expense-field">
            <label className="add-expense-label">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="add-expense-input"
            />
          </div>

          <div className="add-expense-field">
            <label className="add-expense-label">Description</label>
            <input
              type="text"
              required
              placeholder="e.g., Shell Station"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="add-expense-input"
            />
          </div>

          <div className="add-expense-grid">
            <div className="add-expense-field">
              <label className="add-expense-label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="add-expense-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="add-expense-field">
              <label className="add-expense-label">Amount</label>
              <div className="add-expense-amount-wrapper">
                <span className="add-expense-currency-symbol">{selectedCurrency.symbol}</span>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="add-expense-amount-input"
                />
              </div>
            </div>
          </div>

          <div className="add-expense-submit">
            <button
              type="submit"
              className="btn-primary add-expense-submit-button"
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
