const VelocityComparisonChart = ({ currentVelocity, improvedVelocity }) => {
  const maxVelocity = Math.max(currentVelocity, improvedVelocity, 1);
  const velocityGain = Math.max(0, improvedVelocity - currentVelocity);

  const currentHeight = (currentVelocity / maxVelocity) * 220;
  const improvedHeight = (improvedVelocity / maxVelocity) * 220;

  return (
    <div className="velocity-chart" aria-label="Velocity before and after technical debt drag">
      <div className="velocity-bars">
        <div className="velocity-bar-group">
          <div className="velocity-bar velocity-bar-drag" style={{ height: `${currentHeight}px` }}>
            <span>{currentVelocity.toFixed(1)}</span>
          </div>
          <p>Current velocity</p>
        </div>
        <div className="velocity-bar-group">
          <div className="velocity-bar velocity-bar-healthy" style={{ height: `${improvedHeight}px` }}>
            <span>{improvedVelocity.toFixed(1)}</span>
          </div>
          <p>After debt paydown</p>
        </div>
      </div>
      <p className="velocity-delta">
        Velocity upside: <strong>{velocityGain.toFixed(1)} pts/sprint</strong>
      </p>
    </div>
  );
};

export default VelocityComparisonChart;
