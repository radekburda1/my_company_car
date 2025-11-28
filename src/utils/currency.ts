interface Currency {
  code: string;
  symbol: string;
  locale: string;
}

export const CURRENCIES: Record<string, Currency> = {
  CZK: { code: 'CZK', symbol: 'Kč', locale: 'cs-CZ' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB' },
};

export const formatCurrency = (amount: number, currencyCode: string = 'CZK'): string => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.CZK;
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
