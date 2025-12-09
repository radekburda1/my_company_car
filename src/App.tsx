import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import AddExpenseForm from './components/AddExpenseForm';
import Settings from './components/Settings';
import FileImporter from './components/FileImporter';

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface SettingsData {
  allowance: number;
  startDate: string;
  currency: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('activeTab') || 'dashboard';
  });
  
  // State
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<SettingsData>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : {
      allowance: 500, // Default
      startDate: new Date().toISOString().split('T')[0],
      currency: 'CZK'
    };
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  // Handlers
  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev]);
    setActiveTab('expenses');
  };

  const handleImportExpenses = (importedExpenses: Expense[]) => {
    setExpenses(prev => [...importedExpenses, ...prev]);
    setActiveTab('expenses');
  };

  const handleUpdateSettings = (newSettings: SettingsData) => {
    setSettings(newSettings);
    alert('Settings saved successfully!');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ));
  };

  const handleClearData = () => {
    setExpenses([]);
    setSettings({
      allowance: 0,
      startDate: new Date().toISOString().split('T')[0],
      currency: 'CZK'
    });
    localStorage.removeItem('expenses');
    localStorage.removeItem('settings');
    window.location.reload();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            expenses={expenses} 
            allowance={settings.allowance} 
            startDate={settings.startDate}
            currency={settings.currency}
          />
        );
      case 'expenses':
        return <ExpenseList expenses={expenses} currency={settings.currency} onDeleteExpense={handleDeleteExpense} onUpdateExpense={handleUpdateExpense} />;
      case 'add':
        return (
          <div className="space-y-8">
            <AddExpenseForm onAddExpense={handleAddExpense} currency={settings.currency} />
              <br></br>
            <FileImporter onImport={handleImportExpenses} />
          </div>
        );
      case 'settings':
        return (
          <Settings 
            settings={settings} 
            onUpdateSettings={handleUpdateSettings} 
            onClearData={handleClearData}
          />
        );
      default:
        return (
          <Dashboard 
            expenses={expenses} 
            allowance={settings.allowance} 
            startDate={settings.startDate}
            currency={settings.currency}
          />
        );
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
