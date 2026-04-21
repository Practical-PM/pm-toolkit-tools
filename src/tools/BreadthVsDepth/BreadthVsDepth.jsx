import { useEffect, useMemo, useState } from 'react';
import { Button, FormGroup, PageLayout, Slider, Tile, TitleBar } from '@toolkit-pm/design-system/components';
import { clearLocalStorage, loadFromLocalStorage, saveToLocalStorage } from './utils/storage';
import './BreadthVsDepth.css';

const defaultModel = {
  segmentMaturity: 3,
  expansionConfidence: 3,
  executionCapacity: 3,
  revenuePressure: 3,
  moatPotential: 3,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const scaleToHundred = (score) => clamp(Math.round(score * 20), 0, 100);

function BreadthVsDepth() {
  const [model, setModel] = useState(defaultModel);

  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved) {
      setModel({ ...defaultModel, ...saved });
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage(model);
  }, [model]);

  const derived = useMemo(() => {
    const breadthRaw =
      model.expansionConfidence * 0.3 +
      model.executionCapacity * 0.25 +
      (6 - model.segmentMaturity) * 0.2 +
      model.revenuePressure * 0.15 +
      (6 - model.moatPotential) * 0.1;

    const depthRaw =
      model.segmentMaturity * 0.3 +
      model.moatPotential * 0.25 +
      model.revenuePressure * 0.2 +
      model.executionCapacity * 0.15 +
      (6 - model.expansionConfidence) * 0.1;

    const breadthScore = scaleToHundred(breadthRaw);
    const depthScore = scaleToHundred(depthRaw);
    const scoreDelta = breadthScore - depthScore;

    let mode = 'Balanced portfolio';
    if (scoreDelta >= 8) mode = 'Broad-then-stabilize';
    if (scoreDelta <= -8) mode = 'Depth-first';

    const guidance = {
      'Broad-then-stabilize': {
        tradeoff: 'You gain discovery speed and segment optionality, but risk shallow execution and fragmented quality.',
        antiPattern: 'Spreading teams across too many segments before one wedge clearly compounds.',
        next90Days: 'Run 2-3 tightly scoped expansion probes, instrument learning, and set explicit kill criteria.',
      },
      'Depth-first': {
        tradeoff: 'You improve retention and defensibility in one segment, but may miss adjacent timing windows.',
        antiPattern: 'Over-investing in perfection while segment growth stalls or TAM assumptions go untested.',
        next90Days: 'Concentrate on bottlenecks in your core segment and ship measurable depth improvements weekly.',
      },
      'Balanced portfolio': {
        tradeoff: 'You hedge concentration risk, but must actively protect focus to avoid a muddled strategy.',
        antiPattern: 'Calling it balanced while work remains unprioritized and execution context-switching rises.',
        next90Days: 'Ring-fence one depth stream and one breadth stream with clear owner, budget, and success metric.',
      },
    };

    return {
      breadthScore,
      depthScore,
      mode,
      scoreDelta,
      guidance: guidance[mode],
    };
  }, [model]);

  const handleSlider = (key) => (event) => {
    const value = Number(event.target.value);
    setModel((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    if (!window.confirm('Reset this model to default values?')) return;
    clearLocalStorage();
    setModel(defaultModel);
  };

  return (
    <PageLayout>
      <TitleBar
        title="Breadth vs Depth"
        actions={
          <Button variant="danger" onClick={handleReset}>
            Reset Model
          </Button>
        }
      />

      <Tile>
        <p className="bvd-intro">
          Use this canvas to decide whether your next cycle should prioritize market breadth or depth in the segment
          where you already have traction.
        </p>
      </Tile>

      <div className="bvd-grid">
        <Tile className="bvd-inputs">
          <h3>Decision Inputs</h3>
          <FormGroup label={`Current segment maturity: ${model.segmentMaturity}/5`}>
            <Slider min={1} max={5} step={1} value={model.segmentMaturity} onChange={handleSlider('segmentMaturity')} />
          </FormGroup>
          <FormGroup label={`Expansion confidence: ${model.expansionConfidence}/5`}>
            <Slider
              min={1}
              max={5}
              step={1}
              value={model.expansionConfidence}
              onChange={handleSlider('expansionConfidence')}
            />
          </FormGroup>
          <FormGroup label={`Execution capacity: ${model.executionCapacity}/5`}>
            <Slider min={1} max={5} step={1} value={model.executionCapacity} onChange={handleSlider('executionCapacity')} />
          </FormGroup>
          <FormGroup label={`Near-term revenue pressure: ${model.revenuePressure}/5`}>
            <Slider min={1} max={5} step={1} value={model.revenuePressure} onChange={handleSlider('revenuePressure')} />
          </FormGroup>
          <FormGroup label={`Strategic moat potential in core segment: ${model.moatPotential}/5`}>
            <Slider min={1} max={5} step={1} value={model.moatPotential} onChange={handleSlider('moatPotential')} />
          </FormGroup>
        </Tile>

        <Tile className="bvd-map">
          <h3>Position Map</h3>
          <div className="bvd-map-frame">
            <svg viewBox="0 0 320 240" className="bvd-map-svg" aria-label="Breadth versus depth position map">
              <rect x="24" y="20" width="272" height="180" className="bvd-map-bg" />
              <line x1="160" y1="20" x2="160" y2="200" className="bvd-axis-line" />
              <line x1="24" y1="110" x2="296" y2="110" className="bvd-axis-line" />
              <text x="160" y="230" textAnchor="middle" className="bvd-axis-label">Breadth score</text>
              <text x="12" y="112" textAnchor="middle" className="bvd-axis-label" transform="rotate(-90 12 112)">
                Depth score
              </text>
              <circle
                cx={24 + (derived.breadthScore / 100) * 272}
                cy={200 - (derived.depthScore / 100) * 180}
                r="8"
                className="bvd-point"
              />
            </svg>
          </div>
          <div className="bvd-score-row">
            <p>
              Breadth: <strong>{derived.breadthScore}</strong>
            </p>
            <p>
              Depth: <strong>{derived.depthScore}</strong>
            </p>
            <p>
              Delta: <strong>{derived.scoreDelta > 0 ? `+${derived.scoreDelta}` : derived.scoreDelta}</strong>
            </p>
          </div>
        </Tile>
      </div>

      <Tile className="bvd-recommendation">
        <h3>Recommended mode: {derived.mode}</h3>
        <p>
          <strong>Trade-off:</strong> {derived.guidance.tradeoff}
        </p>
        <p>
          <strong>Anti-pattern:</strong> {derived.guidance.antiPattern}
        </p>
        <p>
          <strong>Next 90 days:</strong> {derived.guidance.next90Days}
        </p>
      </Tile>
    </PageLayout>
  );
}

export default BreadthVsDepth;
