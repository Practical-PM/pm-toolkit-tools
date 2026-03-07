import { useState, useEffect } from 'react';
import { Button, PageLayout, TitleBar } from '@toolkit-pm/design-system/components';
import CompetencyList from './components/CompetencyList';
import RadarChart from './components/RadarChart';
import InsightsSummary from './components/InsightsSummary';
import { defaultCompetencies } from './utils/defaultCompetencies';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from './utils/storage';
import { useTour } from './hooks/useTour';
import 'shepherd.js/dist/css/shepherd.css';
import './ProductCompetencies.css';
import './components/Tour.css';

function ProductCompetencies() {
  const [competencies, setCompetencies] = useState([]);
  const [nextId, setNextId] = useState(6);
  const { startTour } = useTour();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved && saved.competencies) {
      const updatedCompetencies = saved.competencies.map(comp => {
        const defaultComp = defaultCompetencies.find(dc => dc.name === comp.name);
        if (defaultComp && defaultComp.levelDescriptions && !comp.levelDescriptions) {
          return { ...comp, levelDescriptions: defaultComp.levelDescriptions };
        }
        return comp;
      });
      setCompetencies(updatedCompetencies);
      setNextId(saved.nextId || 6);
    } else {
      setCompetencies(defaultCompetencies);
    }
  }, []);

  // Save to localStorage whenever competencies change
  useEffect(() => {
    if (competencies.length > 0) {
      saveToLocalStorage({ competencies, nextId });
    }
  }, [competencies, nextId]);

  const handleUpdateCompetency = (id, updates) => {
    setCompetencies(prev =>
      prev.map(comp =>
        comp.id === id ? { ...comp, ...updates } : comp
      )
    );
  };

  const handleAddCompetency = (newCompetency) => {
    const competency = {
      id: nextId,
      ...newCompetency,
    };
    setCompetencies(prev => [...prev, competency]);
    setNextId(prev => prev + 1);
  };

  const handleRemoveCompetency = (id) => {
    if (competencies.length <= 3) {
      alert('You must have at least 3 competencies.');
      return;
    }
    if (window.confirm('Are you sure you want to remove this competency?')) {
      setCompetencies(prev => prev.filter(comp => comp.id !== id));
    }
  };

  const handleReset = () => {
    if (!window.confirm('Reset all competency data and start over?')) {
      return;
    }
    clearLocalStorage();
    setCompetencies(defaultCompetencies);
    setNextId(6);
  };

  const handleGenerateExample = () => {
    if (competencies.length > 0 && !window.confirm('Replace current competency scores with an example assessment?')) {
      return;
    }

    const seededCompetencies = defaultCompetencies.map((competency) => ({
      ...competency,
      score: Math.floor(Math.random() * 5) + 1,
    }));
    setCompetencies(seededCompetencies);
    setNextId(6);
  };

  return (
    <PageLayout>
      <TitleBar
        title="Product Competencies"
        actions={
          <>
            <Button variant="walkthrough" onClick={startTour}>
              Walkthrough
            </Button>
            <Button variant="secondary" onClick={handleGenerateExample}>
              Generate Example
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Reset All Data
            </Button>
          </>
        }
      />

      <CompetencyList
        competencies={competencies}
        onUpdateCompetency={handleUpdateCompetency}
        onAddCompetency={handleAddCompetency}
        onRemoveCompetency={handleRemoveCompetency}
      />

      <RadarChart competencies={competencies} />

      <InsightsSummary competencies={competencies} />
    </PageLayout>
  );
}

export default ProductCompetencies;
