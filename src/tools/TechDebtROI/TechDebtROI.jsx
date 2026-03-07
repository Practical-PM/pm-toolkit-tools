import { useEffect, useMemo, useState } from 'react';
import { Button, FormField, FormGroup, PageLayout, Slider, Tile, TitleBar, WelcomeBanner } from '@toolkit-pm/design-system/components';
import VelocityComparisonChart from './components/VelocityComparisonChart';
import { defaultModel } from './utils/defaultData';
import { clearLocalStorage, loadFromLocalStorage, saveToLocalStorage } from './utils/storage';
import './TechDebtROI.css';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const HORIZON_MONTHS = 12;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function TechDebtROI() {
  const [model, setModel] = useState(defaultModel);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved) {
      setModel({ ...defaultModel, ...saved });
      setShowWelcome(false);
    } else {
      setShowWelcome(true);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage(model);
  }, [model]);

  const derived = useMemo(() => {
    const impact = clamp(model.debtImpactPct, 0, 95) / 100;
    const currentVelocity = Math.max(model.currentVelocity, 0); // current state with debt drag
    const improvedVelocity = impact < 1 ? currentVelocity / (1 - impact) : currentVelocity;
    const velocityRecovered = Math.max(0, improvedVelocity - currentVelocity);

    const featurePoints = Math.max(model.avgFeaturePoints, 1);
    const recoveredFeaturesPerSprint = velocityRecovered / featurePoints;
    const sprintsInHorizon = HORIZON_MONTHS * 2;
    const featuresNotShipped = recoveredFeaturesPerSprint * sprintsInHorizon;
    const delayedRevenue = featuresNotShipped * Math.max(model.revenuePerFeature, 0);

    const cleanupCostFeatures = (currentVelocity * Math.max(model.paydownSprints, 1)) / featurePoints;
    const paybackSprints = recoveredFeaturesPerSprint > 0 ? cleanupCostFeatures / recoveredFeaturesPerSprint : Infinity;

    const postCleanupSprints = Math.max(0, sprintsInHorizon - Math.max(model.paydownSprints, 1));
    const recoveredFeaturesHorizon = postCleanupSprints * recoveredFeaturesPerSprint;
    const valueRecovered = recoveredFeaturesHorizon * Math.max(model.revenuePerFeature, 0);
    const netValue = valueRecovered - cleanupCostFeatures * Math.max(model.revenuePerFeature, 0);

    const riskScore = (model.outageRisk + model.securityRisk + model.scalabilityRisk) / 3;
    const riskBand = riskScore >= 4 ? 'Critical' : riskScore >= 3 ? 'High' : riskScore >= 2 ? 'Moderate' : 'Low';

    return {
      improvedVelocity,
      velocityRecovered,
      featuresNotShipped,
      delayedRevenue,
      paybackSprints,
      recoveredFeaturesHorizon,
      valueRecovered,
      netValue,
      riskScore,
      riskBand,
    };
  }, [model]);

  const updateNumber = (key) => (event) => {
    const value = Number(event.target.value);
    setModel((prev) => ({ ...prev, [key]: Number.isNaN(value) ? prev[key] : value }));
    setShowWelcome(false);
  };

  const updateSlider = (key) => (event) => {
    const value = Number(event.target.value);
    setModel((prev) => ({ ...prev, [key]: value }));
    setShowWelcome(false);
  };

  const handleReset = () => {
    if (!window.confirm('Reset this model to default values?')) return;
    clearLocalStorage();
    setModel(defaultModel);
    setShowWelcome(true);
  };

  return (
    <PageLayout>
      <TitleBar
        title="Tech Debt ROI"
        actions={
          <Button variant="danger" onClick={handleReset}>
            Reset Model
          </Button>
        }
      />

      {showWelcome && (
        <WelcomeBanner
          title="Quantify technical debt in business terms"
          description="Translate velocity drag into delayed features, delayed revenue, payback horizon, and risk exposure."
          actionLabel="Load Starter Model"
          onAction={() => setModel(defaultModel)}
        />
      )}

      <div className="tech-debt-roi-grid">
        <Tile className="model-inputs">
          <h3>Model Inputs</h3>
          <FormField
            label="Current sprint velocity (story points)"
            type="number"
            min={1}
            value={model.currentVelocity}
            onChange={updateNumber('currentVelocity')}
          />
          <FormGroup
            label={
              <>
                Velocity loss from tech debt: <strong className="slider-value">{model.debtImpactPct}%</strong>
              </>
            }
          >
            <Slider
              min={0}
              max={60}
              step={1}
              value={model.debtImpactPct}
              onChange={updateSlider('debtImpactPct')}
              className="confidence-slider"
            />
          </FormGroup>
          <FormField
            label="Average points per feature"
            type="number"
            min={1}
            value={model.avgFeaturePoints}
            onChange={updateNumber('avgFeaturePoints')}
          />
          <FormField
            label="Estimated revenue per feature shipped ($)"
            type="number"
            min={0}
            step={1000}
            value={model.revenuePerFeature}
            onChange={updateNumber('revenuePerFeature')}
          />
          <FormField
            label="Debt paydown investment (sprints)"
            type="number"
            min={1}
            value={model.paydownSprints}
            onChange={updateNumber('paydownSprints')}
          />
        </Tile>

        <Tile className="roi-panel">
          <h3>Velocity Drag & Opportunity Cost</h3>
          <VelocityComparisonChart
            currentVelocity={model.currentVelocity}
            improvedVelocity={derived.improvedVelocity}
          />

          <div className="features-counter">
            <p>
              Features we could ship over {HORIZON_MONTHS} months by reducing debt drag:
              <strong> {derived.recoveredFeaturesHorizon.toFixed(1)} features</strong>
            </p>
          </div>

          <div className="roi-cards">
            <div className="roi-card">
              <p className="roi-card-label">Velocity regained</p>
              <p className="roi-card-value">{derived.velocityRecovered.toFixed(1)} pts/sprint</p>
            </div>
            <div className="roi-card">
              <p className="roi-card-label">Opportunity cost</p>
              <p className="roi-card-value">{derived.featuresNotShipped.toFixed(1)} features</p>
            </div>
            <div className="roi-card">
              <p className="roi-card-label">Delayed revenue</p>
              <p className="roi-card-value">{currency.format(derived.delayedRevenue)}</p>
            </div>
            <div className="roi-card">
              <p className="roi-card-label">Time to payback</p>
              <p className="roi-card-value">
                {Number.isFinite(derived.paybackSprints) ? `${derived.paybackSprints.toFixed(1)} sprints` : 'N/A'}
              </p>
            </div>
          </div>
        </Tile>
      </div>

      <Tile className="risk-panel">
        <h3>Risk Severity Scoring</h3>
        <div className="risk-grid">
          <FormGroup label={`Outage risk: ${model.outageRisk}/5`}>
            <Slider min={1} max={5} step={1} value={model.outageRisk} onChange={updateSlider('outageRisk')} />
          </FormGroup>
          <FormGroup label={`Security risk: ${model.securityRisk}/5`}>
            <Slider min={1} max={5} step={1} value={model.securityRisk} onChange={updateSlider('securityRisk')} />
          </FormGroup>
          <FormGroup label={`Scalability risk: ${model.scalabilityRisk}/5`}>
            <Slider min={1} max={5} step={1} value={model.scalabilityRisk} onChange={updateSlider('scalabilityRisk')} />
          </FormGroup>
        </div>
        <div className="risk-score">
          <p>
            Composite risk score: <strong>{derived.riskScore.toFixed(1)}/5 ({derived.riskBand})</strong>
          </p>
        </div>
      </Tile>

      <Tile className="cfo-panel">
        <h3>Managing Upwards Narrative</h3>
        <p>
          Tech debt currently costs us <strong>{model.debtImpactPct}% velocity</strong>, equivalent to
          <strong> {currency.format(derived.delayedRevenue)}</strong> in delayed value over {HORIZON_MONTHS} months.
          Investing <strong>{model.paydownSprints} sprint(s)</strong> in debt cleanup can recover approximately
          <strong> {derived.recoveredFeaturesHorizon.toFixed(1)} features</strong> and deliver an estimated net impact of
          <strong> {currency.format(derived.netValue)}</strong> over the same period.
        </p>
      </Tile>
    </PageLayout>
  );
}

export default TechDebtROI;
