export function deriveMetrics(inputs) {
  const { fixedCosts, arpu, cogs, customerCount } = inputs;

  const grossMarginPerCustomer = arpu - cogs;
  const grossMarginPct = arpu > 0 ? (grossMarginPerCustomer / arpu) * 100 : 0;

  // Customers needed to cover fixed costs each month
  const breakEvenCustomers = grossMarginPerCustomer > 0 ? fixedCosts / grossMarginPerCustomer : Infinity;

  // Monthly P&L at current customer count
  const monthlyContribution = grossMarginPerCustomer * customerCount;
  const monthlyPnL = monthlyContribution - fixedCosts;

  // Fixed cost burden per customer at current count
  const fixedCostPerCustomer = customerCount > 0 ? fixedCosts / customerCount : Infinity;

  // Net profit per customer per month (after their share of fixed costs)
  const netPerCustomer = customerCount > 0 ? monthlyPnL / customerCount : grossMarginPerCustomer - fixedCosts;

  return {
    grossMarginPerCustomer,
    grossMarginPct,
    breakEvenCustomers,
    monthlyContribution,
    monthlyPnL,
    fixedCostPerCustomer,
    netPerCustomer,
  };
}

export function formatCurrency(value, compact = false) {
  if (!Number.isFinite(value)) return '—';
  if (compact && Math.abs(value) >= 1000) {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value, decimals = 1) {
  if (!Number.isFinite(value)) return '—';
  return value.toFixed(decimals);
}
