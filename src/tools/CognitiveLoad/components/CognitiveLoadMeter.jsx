import { Tile, Badge } from '@toolkit-pm/design-system/components';
import './CognitiveLoadMeter.css';

export default function CognitiveLoadMeter({ loadData, compact = false }) {
  const { score, status, systemLoad, teamLoad, capacity } = loadData;

  if (compact) {
    return (
      <Tile className="cognitive-load-meter-compact">
        <div className="compact-score">
          <div className="compact-value">{score}</div>
          <div className="compact-label">/100</div>
        </div>
        <Badge color={status.color} className="compact-status">{status.label}</Badge>
      </Tile>
    );
  }

  return (
    <Tile className="cognitive-load-meter">
      <h3>Team Efficiency</h3>
      <div className="meter-content">
        <div className="score-section">
          <div className="score-display-compact">
            <div 
              className="score-circle-compact" 
              style={{ borderColor: status.color }}
            >
              <div className="score-value-compact">{score}</div>
              <div className="score-label-compact">/ 100</div>
            </div>
            <Badge color={status.color} className="status-indicator-compact">{status.label}</Badge>
          </div>
        </div>

        <div className="metrics-section">
          <div className="load-breakdown-compact">
            <div className="breakdown-item-compact">
              <span className="breakdown-label-compact">Systems Load</span>
              <span className="breakdown-value-compact">{systemLoad}</span>
            </div>
            <div className="breakdown-item-compact">
              <span className="breakdown-label-compact">Teams Load</span>
              <span className="breakdown-value-compact">{teamLoad}</span>
            </div>
            <div className="breakdown-item-compact">
              <span className="breakdown-label-compact">Team Capacity</span>
              <span className="breakdown-value-compact">{capacity.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Tile>
  );
}
