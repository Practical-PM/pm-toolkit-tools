import { Tile, Badge } from '@toolkit-pm/design-system/components';
import './Recommendations.css';

export default function Recommendations({ recommendations }) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Tile className="recommendations">
      <h3>Recommendations</h3>
      <div className="recommendations-list">
        {recommendations.map((rec, index) => (
          <div key={index} className="recommendation-item">
            <Badge className="rec-icon">{rec.icon}</Badge>
            <span className="rec-text">{rec.text}</span>
          </div>
        ))}
      </div>
    </Tile>
  );
}
