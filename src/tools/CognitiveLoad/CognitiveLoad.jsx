import { useState, useEffect } from 'react';
import { Button, PageLayout, Tile, TitleBar } from '@toolkit-pm/design-system/components';
import TeamConfig from './components/TeamConfig';
import SystemsList from './components/SystemsList';
import SystemsModal from './components/SystemsModal';
import TeamsList from './components/TeamsList';
import TeamsModal from './components/TeamsModal';
import CognitiveLoadMeter from './components/CognitiveLoadMeter';
import ForceGraph from './components/ForceGraph';
import Recommendations from './components/Recommendations';
import { calculateCognitiveLoad, getRecommendations } from './utils/calculateLoad';
import { exampleTeam, exampleSystems, exampleTeams } from './utils/exampleData';
import { useTour } from './hooks/useTour';
import 'shepherd.js/dist/css/shepherd.css';
import './CognitiveLoad.css';
import './components/Tour.css';

const STORAGE_KEY = 'cognitive-load-data';

const defaultTeam = {
  name: 'My Team',
  size: 6,
};

function CognitiveLoad() {
  const [team, setTeam] = useState(defaultTeam);
  const [systems, setSystems] = useState([]);
  const [teams, setTeams] = useState([]);
  const [systemsModalOpen, setSystemsModalOpen] = useState(false);
  const [teamsModalOpen, setTeamsModalOpen] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const { startTour } = useTour();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setTeam(data.team || defaultTeam);
        setSystems(data.systems || []);
        setTeams(data.teams || []);
        setShowExamples(false);
      } else {
        setShowExamples(true);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setShowExamples(true);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ team, systems, teams }));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }, [team, systems, teams]);

  const loadData = calculateCognitiveLoad(team, systems, teams);
  const recommendations = getRecommendations(loadData, team, systems, teams);

  const handleLoadExamples = () => {
    setTeam(exampleTeam);
    setSystems(exampleSystems);
    setTeams(exampleTeams);
    setShowExamples(false);
  };

  const handleGenerateExample = () => {
    const hasData = systems.length > 0 || teams.length > 0;
    if (hasData && !window.confirm('Replace current cognitive load data with example data?')) {
      return;
    }
    handleLoadExamples();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setTeam(defaultTeam);
      setSystems([]);
      setTeams([]);
      setShowExamples(true);
    }
  };

  return (
    <PageLayout>

      {/* ── Title bar ── */}
      <TitleBar
        title="Cognitive Load Calculator"
        actions={
          <>
            <Button variant="walkthrough" onClick={startTour}>
              Walkthrough
            </Button>
            <Button variant="secondary" onClick={handleGenerateExample}>
              Generate Example
            </Button>
          </>
        }
      />

      {/* ── Two-column body ── */}
      <div className="two-column-layout">

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-content">
            {showExamples && (
              <Tile className="welcome-banner">
                <h2>Welcome!</h2>
                <p>
                  Start by loading example data to see how the cognitive load calculator works, or add your own team, systems, and collaborations.
                </p>
                <Button variant="primary" size="large" onClick={handleLoadExamples}>
                  Load Example Data
                </Button>
              </Tile>
            )}

            <TeamConfig team={team} onUpdate={setTeam} />
            <SystemsList onOpenModal={() => setSystemsModalOpen(true)} />
            <TeamsList onOpenModal={() => setTeamsModalOpen(true)} />

            <Button variant="danger" onClick={handleReset}>
              Reset All Data
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="main-panel">
          <CognitiveLoadMeter loadData={loadData} compact={false} />
          <ForceGraph team={team} systems={systems} teams={teams} />
          <Recommendations recommendations={recommendations} />
        </div>
      </div>

      <SystemsModal 
        isOpen={systemsModalOpen} 
        onClose={() => setSystemsModalOpen(false)} 
        systems={systems} 
        onUpdate={setSystems} 
      />

      <TeamsModal 
        isOpen={teamsModalOpen} 
        onClose={() => setTeamsModalOpen(false)} 
        teams={teams} 
        onUpdate={setTeams} 
      />
    </PageLayout>
  );
}

export default CognitiveLoad;
