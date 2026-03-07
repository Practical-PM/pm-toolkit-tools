const DoubleDiamondDiagram = () => {
  return (
    <div className="double-diamond-diagram" aria-label="Double Diamond process diagram">
      <svg viewBox="-130 0 1000 320" role="img" aria-hidden="true">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>

        <path
          className="diamond-shape"
          d="M90 160 L220 70 L350 160 L220 250 Z"
        />
        <path
          className="diamond-shape"
          d="M350 160 L480 70 L610 160 L480 250 Z"
        />

        {/* <line className="flow-arrow" x1="20" y1="160" x2="90" y2="160" /> */}
        {/* <line className="flow-arrow" x1="350" y1="160" x2="390" y2="160" /> */}
        {/* <line className="flow-arrow" x1="650" y1="160" x2="760" y2="160" /> */}

        {/* <path
          className="feedback-arrow"
          d="M760 160 C860 160, 860 40, 520 40 C250 40, 120 40, 20 120"
        /> */}

        <text className="phase-label phase-label-discover" x="160" y="165">Discover</text>
        <text className="phase-label phase-label-define" x="280" y="165">Define</text>
        <text className="phase-label phase-label-develop" x="420" y="165">Develop</text>
        <text className="phase-label phase-label-decide" x="540" y="165">Decide</text>
        {/* <text className="feedback-label" x="770" y="105">Feedback loop</text> */}
      </svg>
    </div>
  );
};

export default DoubleDiamondDiagram;
