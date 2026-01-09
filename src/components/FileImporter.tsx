import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { NOTIFICATIONS } from '../constants/messages';
import './FileImporter.css';

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface FileImporterProps {
  onImport: (expenses: Expense[]) => void;
}

const FileImporter: React.FC<FileImporterProps> = ({ onImport }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setError(null);
    setSuccess(false);

    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        throw new Error(NOTIFICATIONS.ERROR.FILE_EMPTY);
      }

      // Normalize keys to lowercase for easier matching
      const normalizedData = jsonData.map((row: any) => {
        const newRow: any = {};
        Object.keys(row).forEach(key => {
          newRow[key.toLowerCase()] = row[key];
        });
        return newRow;
      });

      // Validate required columns (flexible matching)
      const firstRow = normalizedData[0];
      const requiredFields = ['date', 'amount'];
      const missingFields = requiredFields.filter(field => !Object.keys(firstRow).some(k => k.includes(field)));

      if (missingFields.length > 0) {
        throw new Error(NOTIFICATIONS.ERROR.MISSING_COLUMNS(missingFields.join(', ')));
      }

      // Transform data
      const expenses = normalizedData.map((row: any, index: number) => {
        // Find keys that match our expected fields
        const dateKey = Object.keys(row).find(k => k.includes('date'))!;
        const amountKey = Object.keys(row).find(k => k.includes('amount'))!;
        const categoryKey = Object.keys(row).find(k => k.includes('category')) || 'Other';
        const descKey = Object.keys(row).find(k => k.includes('description') || k.includes('desc')) || 'Imported Expense';

        let dateVal = row[dateKey];
        // Handle Excel serial dates if necessary, or string dates
        if (typeof dateVal === 'number') {
           const dateObj = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
           dateVal = dateObj.toISOString().split('T')[0];
        } else if (dateVal instanceof Date) {
            dateVal = dateVal.toISOString().split('T')[0];
        }

        return {
          id: `imported-${Date.now()}-${index}`,
          date: dateVal,
          amount: parseFloat(row[amountKey]) || 0,
          category: row[categoryKey] || 'Other',
          description: row[descKey] || row[Object.keys(row).find(k => !['date', 'amount', 'category'].includes(k))!] || 'Imported Expense'
        };
      }).filter((e: Expense) => e.amount > 0 && e.date);

      onImport(expenses);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || NOTIFICATIONS.ERROR.FILE_PARSE_FAILED);
    } finally {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="file-importer-container">
      <div className="card">
        <h2 className="file-importer-header">
          <FileSpreadsheet className="file-importer-header-icon" />
          Import Expenses
        </h2>
        
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`file-importer-dropzone ${isDragging ? 'dragging' : ''}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".xlsx,.xls,.csv"
            className="file-importer-input"
          />
          
          <div className="file-importer-content">
            <div className={`file-importer-icon ${isDragging ? 'dragging' : ''}`}>
              <Upload size={32} />
            </div>
            <div>
              <p className="file-importer-text-primary">
                Drop your Excel file here
              </p>
              <p className="file-importer-text-secondary">
                or click to browse
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="file-importer-message file-importer-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="file-importer-message file-importer-success">
            <Check size={16} />
            {NOTIFICATIONS.SUCCESS.FILE_IMPORTED}
          </div>
        )}

        <div className="file-importer-info">
          <p className="file-importer-info-title">Supported Columns:</p>
          <ul className="file-importer-info-list">
            <li>Date (required)</li>
            <li>Amount (required)</li>
            <li>Category (optional)</li>
            <li>Description (optional)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileImporter;
