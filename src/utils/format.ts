
/**
 * Format a currency amount to show 2 decimal places if needed
 * or no decimal places if the amount is a whole number
 */
export const formatCurrency = (amount: number): string => {
  return amount % 1 === 0 ? amount.toString() : amount.toFixed(2);
};

/**
 * Format date for display in a human-readable format
 */
export const formatDisplayDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};
