import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

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
        throw new Error('File appears to be empty');
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
        throw new Error(`Missing required columns: ${missingFields.join(', ')}. Please ensure your Excel file has Date and Amount columns.`);
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
      setError(err.message || 'Failed to parse file');
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
    <div className="max-w-xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileSpreadsheet className="text-sky-400" />
          Import Expenses
        </h2>
        
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging 
              ? 'border-sky-500 bg-sky-500/10' 
              : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-3">
            <div className={`p-4 rounded-full ${isDragging ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800 text-slate-400'}`}>
              <Upload size={32} />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-200">
                Drop your Excel file here
              </p>
              <p className="text-sm text-slate-500 mt-1">
                or click to browse
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 text-rose-400 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-emerald-400 text-sm">
            <Check size={16} />
            Successfully imported expenses!
          </div>
        )}

        <div className="mt-6 text-xs text-slate-500">
          <p className="font-medium mb-1">Supported Columns:</p>
          <ul className="list-disc list-inside space-y-1">
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
