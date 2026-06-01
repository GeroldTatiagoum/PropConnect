export function formatCurrency(amount: number, currency = 'EUR', locale = 'it-IT'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatArea(sqm: number): string {
  return `${sqm.toLocaleString('it-IT')} m²`;
}

export function formatDate(dateString: string, locale = 'it-IT'): string {
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(
    new Date(dateString),
  );
}

export function formatPricePerSqm(price: number, area: number, currency = 'EUR'): string {
  return formatCurrency(Math.round(price / area), currency) + '/m²';
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str;
}
