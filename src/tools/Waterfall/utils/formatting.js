/**
 * Formats a numeric value according to the metric type
 */
export function formatValue(value, metricType, currency) {
  switch (metricType) {
    case 'currency': {
      const currencySymbols = {
        USD: '$',
        GBP: '£',
        EUR: '€',
      };
      const symbol = currency ? currencySymbols[currency] : '$';
      const absValue = Math.abs(value)
      const sign = value < 0 ? '-' : ''
      
      // Format with K/M notation
      if (absValue >= 1000000) {
        const millions = absValue / 1000000
        // Show one decimal place if less than 10M and has decimal part, otherwise round
        let formatted
        if (millions >= 10) {
          formatted = Math.round(millions).toString()
        } else if (millions % 1 === 0) {
          formatted = millions.toString()
        } else {
          formatted = millions.toFixed(1)
        }
        return `${sign}${symbol}${formatted}m`
      } else if (absValue >= 1000) {
        const thousands = absValue / 1000
        // Show one decimal place if less than 10K and has decimal part, otherwise round
        let formatted
        if (thousands >= 10) {
          formatted = Math.round(thousands).toString()
        } else if (thousands % 1 === 0) {
          formatted = thousands.toString()
        } else {
          formatted = thousands.toFixed(1)
        }
        return `${sign}${symbol}${formatted}K`
      } else {
        // For values less than 1000, use standard formatting
        return `${sign}${symbol}${absValue.toFixed(2)}`;
      }
    }

    case 'percentage':
      return `${value.toFixed(2)}%`

    case 'number':
      // Format with appropriate decimals based on magnitude
      if (Math.abs(value) >= 1000) {
        return value.toFixed(0)
      } else if (Math.abs(value) >= 1) {
        return value.toFixed(2)
      } else {
        return value.toFixed(4)
      }

    default:
      return value.toString()
  }
}

/**
 * Parses a string value according to the metric type
 */
export function parseValue(value, metricType) {
  // Remove currency symbols, percentage signs, and commas
  let cleaned = value.trim().replace(/[$£€,\s]/g, '')
  
  if (metricType === 'percentage') {
    cleaned = cleaned.replace(/%/g, '')
  }
  
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Gets the step value for number inputs based on metric type
 */
export function getInputStep(metricType) {
  switch (metricType) {
    case 'currency':
      return '0.01'
    case 'percentage':
      return '0.01'
    case 'number':
      return '0.01'
    default:
      return '0.01'
  }
}

/**
 * Gets a label for value changes based on metric type
 */
export function getValueChangeLabel(metricType) {
  switch (metricType) {
    case 'currency':
      return 'Value Change'
    case 'percentage':
      return 'Percentage Change'
    case 'number':
      return 'Value Change'
    default:
      return 'Value Change'
  }
}

/**
 * Gets a label for baseline based on metric type
 */
export function getBaselineLabel(metricType) {
  switch (metricType) {
    case 'currency':
      return 'Starting Baseline'
    case 'percentage':
      return 'Starting Baseline (%)'
    case 'number':
      return 'Starting Baseline'
    default:
      return 'Starting Baseline'
  }
}
