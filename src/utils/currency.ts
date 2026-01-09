interface Currency {
  code: string;
  symbol: string;
  locale: string;
  step: string;
  decimals: number;
}

export const CURRENCIES: Record<string, Currency> = {
  CZK: { code: 'CZK', symbol: 'Kč', locale: 'cs-CZ', step: '1', decimals: 0 },
  USD: { code: 'USD', symbol: '$', locale: 'en-US', step: '0.01', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', locale: 'de-DE', step: '0.1', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB', step: '0.01', decimals: 2 },
};

export const formatCurrency = (amount: number, currencyCode: string = 'CZK'): string => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.CZK;
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  }).format(amount);
};
