import { formatValue, parseValue, getInputStep } from '../utils/formatting'
import './WaterfallConfig.css'

export function WaterfallConfigComponent({ waterfall, onUpdate }) {
  const handleNameChange = (name) => {
    onUpdate({ ...waterfall, name: name || 'Waterfall' })
  }

  const handleNameBlur = (name) => {
    const trimmed = name.trim()
    if (trimmed !== waterfall.name) {
      onUpdate({ ...waterfall, name: trimmed || 'Waterfall' })
    }
  }

  const handleMetricTypeChange = (metricType) => {
    const updated = {
      ...waterfall,
      metricType,
      currency: metricType === 'currency' ? (waterfall.currency || 'USD') : undefined,
    }
    onUpdate(updated)
  }

  const handleCurrencyChange = (currency) => {
    onUpdate({ ...waterfall, currency })
  }

  const handleBaselineChange = (baseline) => {
    onUpdate({ ...waterfall, baseline })
  }

  const handleTargetChange = (target) => {
    onUpdate({ ...waterfall, target })
  }

  const handleReverseModeChange = (isReverse) => {
    onUpdate({ ...waterfall, isReverse })
  }

  return (
    <div className="waterfall-config">
      <div className="config-section">
        <label htmlFor="waterfall-name">Waterfall Name:</label>
        <input
          id="waterfall-name"
          type="text"
          value={waterfall.name}
          onChange={(e) => handleNameChange(e.target.value)}
          onBlur={(e) => handleNameBlur(e.target.value)}
          className="config-input"
          placeholder="Waterfall name"
        />
      </div>

      <div className="config-section">
        <label htmlFor="reverse-mode">
          <input
            id="reverse-mode"
            type="checkbox"
            checked={waterfall.isReverse}
            onChange={(e) => handleReverseModeChange(e.target.checked)}
            className="config-checkbox"
          />
          <span>Reverse Waterfall (reduce from baseline)</span>
        </label>
        <p className="config-hint">
          In reverse mode, negative initiative values (reductions) are displayed as positive changes.
        </p>
      </div>

      <div className="config-section">
        <label htmlFor="metric-type">Metric Type:</label>
        <select
          id="metric-type"
          value={waterfall.metricType}
          onChange={(e) => handleMetricTypeChange(e.target.value)}
          className="config-select"
        >
          <option value="currency">Currency</option>
          <option value="percentage">Percentage (%)</option>
          <option value="number">Number</option>
        </select>
      </div>

      {waterfall.metricType === 'currency' && (
        <div className="config-section">
          <label htmlFor="currency-type">Currency:</label>
          <select
            id="currency-type"
            value={waterfall.currency || 'USD'}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="config-select"
          >
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      )}

      <div className="config-section">
        <label htmlFor="baseline-config">Baseline:</label>
        <input
          id="baseline-config"
          type="number"
          step={getInputStep(waterfall.metricType)}
          value={waterfall.baseline}
          onChange={(e) => {
            const value = parseValue(e.target.value, waterfall.metricType)
            if (!isNaN(value)) {
              handleBaselineChange(value)
            }
          }}
          className="config-input"
        />
        <span className="config-value-preview">
          = {formatValue(waterfall.baseline, waterfall.metricType, waterfall.currency)}
        </span>
      </div>

      <div className="config-section">
        <label htmlFor="target-config">Target (optional):</label>
        <input
          id="target-config"
          type="number"
          step={getInputStep(waterfall.metricType)}
          value={waterfall.target ?? ''}
          onChange={(e) => {
            const value = e.target.value === '' ? null : parseValue(e.target.value, waterfall.metricType)
            if (value === null || !isNaN(value)) {
              handleTargetChange(value)
            }
          }}
          className="config-input"
          placeholder="No target"
        />
        {waterfall.target !== null && (
          <span className="config-value-preview">
            = {formatValue(waterfall.target, waterfall.metricType, waterfall.currency)}
          </span>
        )}
      </div>
    </div>
  )
}
