import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import AddExpenseForm from './components/AddExpenseForm';
import Settings from './components/Settings';
import FileImporter from './components/FileImporter';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

interface Expense {
  id: string; // Will correspond to _id from MongoDB but mapped to id
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

const AuthenticatedApp: React.FC = () => {
  const { user, logout, updateSettings } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<SettingsData>({
    allowance: user?.settings.allowance || 500,
    startDate: user?.settings.startDate || new Date().toISOString().split('T')[0],
    currency: user?.settings.currency || 'CZK'
  });

  // Sync settings from user context
  useEffect(() => {
    if (user && user.settings) {
      setSettings(user.settings);
    }
  }, [user]);

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/transactions', {
          headers: { 'x-auth-token': token || '' }
        });
        if (res.ok) {
          const data = await res.json();
          // Transform _id to id if needed, though our backend does it
          setExpenses(data);
        }
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      }
    };
    fetchExpenses();
  }, []);

  const handleAddExpense = async (newExpense: Expense) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify(newExpense)
      });
      
      if (res.ok) {
        const savedExpense = await res.json();
        setExpenses(prev => [savedExpense, ...prev]);
        setActiveTab('expenses');
        toast.success('Expense added successfully!');
      }
    } catch (err: any) {
      console.error("Failed to add expense", err);
      toast.error('Failed to add expense');
    }
  };

  const handleImportExpenses = async (importedExpenses: Expense[]) => {
    // Process one by one or batch if backend supports it. For now, one by one simple loop
    const token = localStorage.getItem('token');
    const savedExpenses: Expense[] = [];

    for (const expense of importedExpenses) {
      try {
         const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token || ''
          },
          body: JSON.stringify(expense)
        });
        if (res.ok) {
          savedExpenses.push(await res.json());
        }
      } catch (err) {
        console.error("Failed to import expense", expense);
      }
    }

    setExpenses(prev => [...savedExpenses, ...prev]);
    setActiveTab('expenses');
  };

  const handleUpdateSettings = async (newSettings: SettingsData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify(newSettings)
      });

      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        updateSettings(updated);
        toast.success('Settings saved successfully!');
      }
    } catch (err: any) {
      console.error("Failed to update settings", err);
      toast.error(err.message || 'Failed to update settings');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token || '' }
      });
      if (res.ok) {
        setExpenses(prev => prev.filter(expense => expense.id !== id));
        toast.success('Expense deleted');
      }
    } catch (err) {
      console.error("Failed to delete expense", err);
      toast.error('Failed to delete expense');
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/transactions/${updatedExpense.id}`, {
        method: 'PUT',
        headers: {
           'Content-Type': 'application/json',
           'x-auth-token': token || ''
        },
        body: JSON.stringify(updatedExpense)
      });

      if (res.ok) {
        const saved = await res.json();
        setExpenses(prev => prev.map(expense => 
          expense.id === saved.id ? saved : expense
        ));
        toast.success('Expense updated');
      }
    } catch (err) {
      console.error("Failed to update expense", err);
      toast.error('Failed to update expense');
    }
  };

  const handleLogout = () => {
    logout();
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
            onClearData={() => {}} // Disabled clear data for now or implement clear all
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
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} user={user}>
      {renderContent()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'premium-toast',
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
          },
        }}
      />
      <AppContent />
    </AuthProvider>
  );
}

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <AuthenticatedApp /> : <Login />;
};

export default App;
