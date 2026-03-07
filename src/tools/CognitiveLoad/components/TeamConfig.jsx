import { Tile, FormField, SliderField } from '@toolkit-pm/design-system/components';
import './TeamConfig.css';

export default function TeamConfig({ team, onUpdate }) {
  // Calculate efficiency factor based on team size
  const getEfficiencyFactor = (size) => {
    // Small teams are more efficient per person but have less parallelism
    // Large teams incur management and communication overhead
    // Formula: 2.0 / (1 + size * 0.2)
    // Result: size=2: 1.43, size=5: 1.0, size=10: 0.67, size=15: 0.5
    return 2.0 / (1 + size * 0.2);
  };

  const efficiencyFactor = getEfficiencyFactor(team.size);
  const efficiencyHint =
    team.size <= 3 ? "Small teams are highly efficient but have limited parallelism" :
    team.size <= 7 ? "Optimal team size for efficiency and capacity" :
    "Larger teams have more capacity but incur coordination overhead";

  return (
    <Tile className="team-config">
      <h3>Your Team Configuration</h3>
      
      <FormField
        id="team-name"
        label="Team Name"
        type="text"
        value={team.name}
        onChange={(e) => onUpdate({ ...team, name: e.target.value })}
        placeholder="e.g., Checkout Team"
      />

      <SliderField
        label={`Team Size: ${team.size}`}
        min={1}
        max={20}
        value={team.size}
        onChange={(e) => onUpdate({ ...team, size: parseInt(e.target.value) })}
        formatValue={(v) => `${v}`}
        hint={`Team Efficiency: ${efficiencyFactor.toFixed(2)}x — ${efficiencyHint}`}
      />
    </Tile>
  );
}
