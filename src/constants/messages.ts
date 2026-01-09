export const NOTIFICATIONS = {
  SUCCESS: {
    SETTINGS_SAVED: 'Settings saved successfully!',
    EXPENSE_ADDED: 'Expense added successfully!',
    EXPENSE_DELETED: 'Expense deleted',
    EXPENSE_UPDATED: 'Expense updated',
    FILE_IMPORTED: 'Successfully imported expenses!',
  },
  ERROR: {
    SETTINGS_UPDATE_FAILED: 'Failed to update settings',
    EXPENSE_ADD_FAILED: 'Failed to add expense',
    EXPENSE_DELETE_FAILED: 'Failed to delete expense',
    EXPENSE_UPDATE_FAILED: 'Failed to update expense',
    AUTH_FAILED: 'Authentication failed',
    FILE_EMPTY: 'File appears to be empty',
    FILE_PARSE_FAILED: 'Failed to parse file',
    MISSING_COLUMNS: (columns: string) => `Missing required columns: ${columns}. Please ensure your Excel file has Date and Amount columns.`,
  }
};
