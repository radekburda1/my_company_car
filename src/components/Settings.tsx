import React, { FormEvent } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { CURRENCIES } from '../utils/currency';

interface SettingsData {
  allowance: number;
  startDate: string;
  currency: string;
}

interface SettingsProps {
  settings: SettingsData;
  onUpdateSettings: (settings: SettingsData) => void;
  onClearData: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings, onClearData }) => {
  const [formData, setFormData] = React.useState<SettingsData>(settings);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...formData,
      allowance: parseFloat(formData.allowance.toString())
    });
  };

  const selectedCurrency = CURRENCIES[formData.currency] || CURRENCIES.CZK;

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="card">
        <h2 className="text-xl font-bold mb-6">Configuration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
            >
              {Object.values(CURRENCIES).map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Monthly Car Allowance</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{selectedCurrency.symbol}</span>
              <input
                type="number"
                required
                min="0"
                value={formData.allowance}
                onChange={(e) => setFormData({ ...formData, allowance: parseFloat(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              The amount your company provides monthly for the car.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Start Date</label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
            />
            <p className="text-xs text-slate-500 mt-1">
              When did you start receiving the allowance?
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      <div className="card border-rose-900/50 bg-rose-950/10">
        <h3 className="text-lg font-bold text-rose-400 mb-2">Danger Zone</h3>
        <p className="text-slate-400 text-sm mb-4">
          This will remove all your expenses and reset the application. This action cannot be undone.
        </p>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all data?')) {
              onClearData();
            }
          }}
          className="px-4 py-2 border border-rose-500/50 text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Reset Application Data
        </button>
      </div>
    </div>
  );
};

export default Settings;
