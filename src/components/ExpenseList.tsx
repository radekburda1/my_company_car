import React, { useState, useMemo } from 'react';
import { Search, Filter, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import './ExpenseList.css';

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  currency: string;
  onDeleteExpense: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, currency, onDeleteExpense }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['All', ...new Set(expenses.map(e => e.category))];

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesCategory = filterCategory === 'All' || expense.category === filterCategory;
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filterCategory, searchTerm]);

  return (
    <div className="expense-list-container">
      <div className="expense-list-header">
        <h2 className="expense-list-title">Expense History</h2>
        
        <div className="expense-list-controls">
          <div className="expense-list-search-wrapper">
            <Search className="expense-list-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="expense-list-search-input"
            />
          </div>
          
          <div className="expense-list-filter-wrapper">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="expense-list-filter-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Filter className="expense-list-filter-icon" size={16} />
          </div>
        </div>
      </div>

      <div className="card expense-list-table-wrapper">
        <div className="expense-list-table-scroll">
          <table className="expense-list-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th className="align-right">Amount</th>
                <th className="align-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="expense-list-date">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="expense-list-description">
                      {expense.description}
                    </td>
                    <td>
                      <span className="expense-list-category-badge">
                        {expense.category}
                      </span>
                    </td>
                    <td className="expense-list-amount">
                      {formatCurrency(expense.amount, currency)}
                    </td>
                    <td className="expense-list-actions">
                      <button
                        onClick={() => onDeleteExpense(expense.id)}
                        className="expense-list-delete-button"
                        title="Delete expense"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="expense-list-empty">
                    No expenses found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
