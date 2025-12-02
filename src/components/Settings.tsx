import React, { FormEvent } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { CURRENCIES } from '../utils/currency';
import './Settings.css';

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
    <div className="settings-container">
      <div className="card">
        <h2 className="settings-header">Configuration</h2>
        
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-field">
            <label className="settings-label">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="settings-select"
            >
              {Object.values(CURRENCIES).map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="settings-field">
            <label className="settings-label">Monthly Car Allowance</label>
            <div className="settings-amount-wrapper">
              <span className="settings-currency-symbol">{selectedCurrency.symbol}</span>
              <input
                type="number"
                required
                min="0"
                value={formData.allowance}
                onChange={(e) => setFormData({ ...formData, allowance: parseFloat(e.target.value) })}
                className="settings-amount-input"
              />
            </div>
            <p className="settings-hint">
              The amount your company provides monthly for the car.
            </p>
          </div>

          <div className="settings-field">
            <label className="settings-label">Start Date</label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="settings-input"
            />
            <p className="settings-hint">
              When did you start receiving the allowance?
            </p>
          </div>

          <div className="settings-submit">
            <button
              type="submit"
              className="btn-primary settings-submit-button"
            >
              <Save size={18} />
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      <div className="card settings-danger-zone">
        <h3 className="settings-danger-title">Danger Zone</h3>
        <p className="settings-danger-description">
          This will remove all your expenses and reset the application. This action cannot be undone.
        </p>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all data?')) {
              onClearData();
            }
          }}
          className="settings-danger-button"
        >
          <RefreshCw size={16} />
          Reset Application Data
        </button>
      </div>
    </div>
  );
};

export default Settings;
