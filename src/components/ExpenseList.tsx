import React, { useState, useMemo } from 'react';
import { Search, Trash2, Edit2, Check, X } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { CURRENCIES } from '../utils/currency';
import ConfirmDialog from './ConfirmDialog';
import { EXPENSE_CATEGORIES } from '../constants/categories';
import { Select } from './ui/Select';
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
  onUpdateExpense: (expense: Expense) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, currency, onDeleteExpense, onUpdateExpense }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Expense | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; expenseId: string | null }>({
    isOpen: false,
    expenseId: null
  });

  const categories = ['All', ...EXPENSE_CATEGORIES];

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesCategory = filterCategory === 'All' || expense.category === filterCategory;
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filterCategory, searchTerm]);

  const handleEditClick = (expense: Expense) => {
    setEditingId(expense.id);
    setEditForm({ ...expense });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = () => {
    if (editForm && editForm.description && editForm.amount > 0) {
      onUpdateExpense(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleEditFormChange = (field: keyof Expense, value: string | number) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const handleDeleteClick = (expenseId: string) => {
    setDeleteConfirm({ isOpen: true, expenseId });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.expenseId) {
      onDeleteExpense(deleteConfirm.expenseId);
    }
    setDeleteConfirm({ isOpen: false, expenseId: null });
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ isOpen: false, expenseId: null });
  };

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
            <Select
              options={categories}
              value={filterCategory}
              onChange={(val) => setFilterCategory(val)}
              className="expense-list-filter-select"
            />
          </div>
        </div>
      </div>

      <div className="card expense-list-table-wrapper">
        <div className="expense-list-table-scroll">
          <table className="expense-list-table">
            <thead>
              <tr>
                <th className="col-date">Date</th>
                <th className="col-description">Description</th>
                <th className="col-category">Category</th>
                <th className="col-amount align-right">Amount</th>
                <th className="col-actions align-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => {
                  const isEditing = editingId === expense.id;
                  const selectedCurrency = CURRENCIES[currency] || CURRENCIES.CZK;
                  
                  return (
                    <tr key={expense.id} className={isEditing ? 'editing' : ''}>
                      <td className="expense-list-date">
                        {isEditing && editForm ? (
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) => handleEditFormChange('date', e.target.value)}
                            className="expense-list-edit-input"
                          />
                        ) : (
                          new Date(expense.date).toLocaleDateString()
                        )}
                      </td>
                      <td className="expense-list-description">
                        {isEditing && editForm ? (
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) => handleEditFormChange('description', e.target.value)}
                            className="expense-list-edit-input"
                            placeholder="Description"
                          />
                        ) : (
                          expense.description
                        )}
                      </td>
                      <td>
                        {isEditing && editForm ? (
                          <div className="expense-list-edit-select-container">
                            <Select
                              options={EXPENSE_CATEGORIES}
                              value={editForm.category}
                              onChange={(val) => handleEditFormChange('category', val)}
                            />
                          </div>
                        ) : (
                          <span className="expense-list-category-badge">
                            {expense.category}
                          </span>
                        )}
                      </td>
                      <td className="expense-list-amount">
                        {isEditing && editForm ? (
                          <div className="expense-list-edit-amount-wrapper">
                            <span className="expense-list-edit-currency">{selectedCurrency.symbol}</span>
                            <input
                              type="number"
                              step={selectedCurrency.step}
                              min="0"
                              value={editForm.amount}
                              onChange={(e) => handleEditFormChange('amount', parseFloat(e.target.value))}
                              className="expense-list-edit-amount-input"
                            />
                          </div>
                        ) : (
                          formatCurrency(expense.amount, currency)
                        )}
                      </td>
                      <td className="expense-list-actions">
                        {isEditing ? (
                          <div className="expense-list-action-buttons">
                            <button
                              type="button"
                              onClick={handleSaveEdit}
                              className="expense-list-save-button"
                              title="Save changes"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="expense-list-cancel-button"
                              title="Cancel editing"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="expense-list-action-buttons">
                            <button
                              type="button"
                              onClick={() => handleEditClick(expense)}
                              className="expense-list-edit-button"
                              title="Edit expense"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(expense.id)}
                              className="expense-list-delete-button"
                              title="Delete expense"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
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

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ExpenseList;
