/**
 * Utility for Indian Rupee (₹) and Indian Numbering System (en-IN).
 * Formats numbers into Lakhs and Crores according to Indian currency rules.
 * Examples:
 *  500 => "₹500"
 *  1250 => "₹1,250"
 *  25000 => "₹25,000"
 *  150000 => "₹1,50,000"
 *  1250000 => "₹12,50,000"
 *  12500000 => "₹1,25,00,000"
 *  125000.5 => "₹1,25,000.50"
 */

export function formatINR(val, options = {}) {
  if (val === null || val === undefined || val === '') return '';

  if (typeof val === 'number') {
    if (isNaN(val)) return '';
    const hasDecimals = !Number.isInteger(val);
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: options.decimals ?? (hasDecimals ? 2 : 0),
      minimumFractionDigits: options.minimumFractionDigits ?? (hasDecimals ? 2 : 0),
    }).format(val);

    return `₹${formatted}`;
  }

  if (typeof val === 'string') {
    const rawTrimmed = val.trim();
    if (!rawTrimmed) return '';

    // If it's already formatted with ₹ symbol
    if (rawTrimmed.startsWith('₹')) {
      return rawTrimmed;
    }

    // Replace $ or Rs or INR prefixes if present
    const cleaned = rawTrimmed.replace(/^(\$|Rs\.?|INR)\s*/i, '');
    const num = parseFloat(cleaned.replace(/[^0-9.]/g, ''));

    if (isNaN(num)) {
      return val;
    }

    const hasDecimals = cleaned.includes('.');
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: options.decimals ?? (hasDecimals ? 2 : 0),
      minimumFractionDigits: options.minimumFractionDigits ?? 0,
    }).format(num);

    return `₹${formatted}`;
  }

  return val;
}

export function formatINRNumber(val) {
  if (typeof val !== 'number' || isNaN(val)) return '0';
  return new Intl.NumberFormat('en-IN').format(val);
}
