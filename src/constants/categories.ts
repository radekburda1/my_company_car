export const EXPENSE_CATEGORIES = ['Palivo', 'Servis', 'Pojištění', 'Parkování', 'Poplatky', 'Drobnosti'] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
