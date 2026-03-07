import { useEffect, useState } from 'react';
import { Button, PageLayout, Tile, TitleBar, WelcomeBanner } from '@toolkit-pm/design-system/components';
import DoubleDiamondDiagram from './components/DoubleDiamondDiagram';
import DoubleDiamondBoard from './components/DoubleDiamondBoard';
import { defaultData, emptyPhases } from './utils/defaultData';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from './utils/storage';
import './DoubleDiamond.css';

function DoubleDiamond() {
  const [phases, setPhases] = useState(emptyPhases);
  const [nextItemId, setNextItemId] = useState(1);
  const [showExamples, setShowExamples] = useState(false);

  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved && Array.isArray(saved.phases) && saved.phases.length > 0) {
      setPhases(saved.phases);
      setNextItemId(saved.nextItemId || 1);
      setShowExamples(false);
    } else {
      setPhases(emptyPhases);
      setShowExamples(true);
    }
  }, []);

  useEffect(() => {
    if (phases.length > 0) {
      saveToLocalStorage({ phases, nextItemId });
    }
  }, [phases, nextItemId]);

  const handleLoadExamples = () => {
    setPhases(defaultData.phases);
    setNextItemId(defaultData.nextItemId);
    setShowExamples(false);
  };

  const handleGenerateExample = () => {
    const hasData = phases.some((phase) => phase.items.length > 0);
    if (hasData && !window.confirm('Replace current entries with example data?')) {
      return;
    }
    handleLoadExamples();
  };

  const handleReset = () => {
    if (!window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      return;
    }
    clearLocalStorage();
    setPhases(emptyPhases);
    setNextItemId(1);
    setShowExamples(true);
  };

  const handleAddItem = (phaseId, text) => {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? { ...phase, items: [...phase.items, { id: nextItemId, text }] }
          : phase
      )
    );
    setNextItemId((prev) => prev + 1);
  };

  const handleUpdateItem = (phaseId, itemId, text) => {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              items: phase.items.map((item) => (item.id === itemId ? { ...item, text } : item)),
            }
          : phase
      )
    );
  };

  const handleDeleteItem = (phaseId, itemId) => {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? { ...phase, items: phase.items.filter((item) => item.id !== itemId) }
          : phase
      )
    );
  };

  return (
    <PageLayout>
      <TitleBar
        title="Double Diamond"
        actions={
          <>
            <Button variant="secondary" onClick={handleGenerateExample}>
              Generate Example
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Reset All Data
            </Button>
          </>
        }
      />

      {showExamples && (
        <WelcomeBanner
          title="Welcome!"
          description="Load example entries to see how the Double Diamond process works, or start with your own inputs."
          actionLabel="Load Example Data"
          onAction={handleLoadExamples}
        />
      )}

      <Tile className="double-diamond-diagram-tile">
        <h2>Double Diamond Flow</h2>
        <p className="diagram-description">
          Move from broad exploration to clear focus twice: first for the problem, then for the solution.
          Use feedback from tests to return to discovery and refine your next cycle.
        </p>
        <DoubleDiamondDiagram />
      </Tile>

      <Tile className="double-diamond-board-tile">
        <h2>Decision Board</h2>
        <DoubleDiamondBoard
          phases={phases}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />
      </Tile>
    </PageLayout>
  );
}

export default DoubleDiamond;
