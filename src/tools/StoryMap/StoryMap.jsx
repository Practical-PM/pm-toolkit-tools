import { useState, useEffect } from 'react';
import { Button, PageLayout, Tile, TitleBar, WelcomeBanner } from '@toolkit-pm/design-system/components';
import StoryMapGrid from './components/StoryMapGrid';
import ActivityModal from './components/ActivityModal';
import StoryModal from './components/StoryModal';
import IterationModal from './components/IterationModal';
import { defaultData } from './utils/defaultData';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from './utils/storage';
import { generateStoryMapExample } from './utils/exampleGenerator';
import { useTour } from './hooks/useTour';
import 'shepherd.js/dist/css/shepherd.css';
import './StoryMap.css';
import './components/Tour.css';

function StoryMap() {
  const [activities, setActivities] = useState([]);
  const [stories, setStories] = useState([]);
  const [iterations, setIterations] = useState([]);
  const [nextActivityId, setNextActivityId] = useState(1);
  const [nextStoryId, setNextStoryId] = useState(1);
  const [nextIterationId, setNextIterationId] = useState(1);
  
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isIterationModalOpen, setIsIterationModalOpen] = useState(false);
  
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingStory, setEditingStory] = useState(null);
  const [editingIteration, setEditingIteration] = useState(null);
  
  const [showExamples, setShowExamples] = useState(false);
  const { startTour } = useTour();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved && (saved.activities?.length > 0 || saved.stories?.length > 0 || saved.iterations?.length > 0)) {
      setActivities(saved.activities || []);
      setStories(saved.stories || []);
      setIterations(saved.iterations || []);
      setNextActivityId(saved.nextActivityId || 1);
      setNextStoryId(saved.nextStoryId || 1);
      setNextIterationId(saved.nextIterationId || 1);
      setShowExamples(false);
    } else {
      setShowExamples(true);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (activities.length > 0 || stories.length > 0 || iterations.length > 0) {
      saveToLocalStorage({
        activities,
        stories,
        iterations,
        nextActivityId,
        nextStoryId,
        nextIterationId,
      });
    }
  }, [activities, stories, iterations, nextActivityId, nextStoryId, nextIterationId]);

  // Activity handlers
  const handleOpenActivityModal = () => {
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleCloseActivityModal = () => {
    setIsActivityModalOpen(false);
    setEditingActivity(null);
  };

  const handleSaveActivity = (activityData) => {
    if (editingActivity) {
      setActivities(activities.map(a =>
        a.id === editingActivity.id
          ? { ...a, name: activityData.name, description: activityData.description }
          : a
      ));
    } else {
      const newActivity = {
        id: nextActivityId,
        name: activityData.name,
        description: activityData.description,
      };
      setActivities([...activities, newActivity]);
      setNextActivityId(nextActivityId + 1);
    }
    handleCloseActivityModal();
  };

  const handleDeleteActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
    setStories(stories.filter(s => s.activityId !== id));
  };

  const handleSelectActivity = (activity) => {
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  // Story handlers
  const handleOpenStoryModal = () => {
    setEditingStory(null);
    setIsStoryModalOpen(true);
  };

  const handleCloseStoryModal = () => {
    setIsStoryModalOpen(false);
    setEditingStory(null);
  };

  const handleSaveStory = (storyData) => {
    if (editingStory && editingStory.id) {
      setStories(stories.map(s =>
        s.id === editingStory.id
          ? { ...s, ...storyData }
          : s
      ));
    } else {
      const newStory = {
        id: nextStoryId,
        ...storyData,
      };
      setStories([...stories, newStory]);
      setNextStoryId(nextStoryId + 1);
    }
    handleCloseStoryModal();
  };

  const handleDeleteStory = (id) => {
    setStories(stories.filter(s => s.id !== id));
  };

  const handleSelectStory = (story) => {
    setEditingStory(story);
    setIsStoryModalOpen(true);
  };

  // Iteration handlers
  const handleOpenIterationModal = () => {
    setEditingIteration(null);
    setIsIterationModalOpen(true);
  };

  const handleCloseIterationModal = () => {
    setIsIterationModalOpen(false);
    setEditingIteration(null);
  };

  const handleSaveIteration = (iterationData) => {
    if (editingIteration) {
      setIterations(iterations.map(i =>
        i.id === editingIteration.id
          ? { ...i, name: iterationData.name, date: iterationData.date }
          : i
      ));
    } else {
      const newIteration = {
        id: nextIterationId,
        name: iterationData.name,
        date: iterationData.date,
      };
      setIterations([...iterations, newIteration]);
      setNextIterationId(nextIterationId + 1);
    }
    handleCloseIterationModal();
  };

  const handleDeleteIteration = (id) => {
    setIterations(iterations.filter(i => i.id !== id));
    setStories(stories.filter(s => s.iterationId !== id));
  };

  const handleSelectIteration = (iteration) => {
    setEditingIteration(iteration);
    setIsIterationModalOpen(true);
  };

  const handleLoadExamples = () => {
    const sampleData = defaultData;
    setActivities(sampleData.activities);
    setStories(sampleData.stories);
    setIterations(sampleData.iterations);
    setNextActivityId(sampleData.nextActivityId);
    setNextStoryId(sampleData.nextStoryId);
    setNextIterationId(sampleData.nextIterationId);
    setShowExamples(false);
  };

  const handleGenerateExample = () => {
    const hasData = activities.length > 0 || stories.length > 0 || iterations.length > 0;
    if (hasData && !window.confirm('Generate a fresh example story map and replace current data?')) {
      return;
    }

    const sampleData = generateStoryMapExample();
    setActivities(sampleData.activities);
    setStories(sampleData.stories);
    setIterations(sampleData.iterations);
    setNextActivityId(sampleData.nextActivityId);
    setNextStoryId(sampleData.nextStoryId);
    setNextIterationId(sampleData.nextIterationId);
    setShowExamples(false);
  };

  const handleReset = () => {
    if (!window.confirm('Reset all story map data and clear local changes?')) {
      return;
    }
    clearLocalStorage();
    setActivities([]);
    setStories([]);
    setIterations([]);
    setNextActivityId(1);
    setNextStoryId(1);
    setNextIterationId(1);
    setShowExamples(true);
  };

  return (
    <PageLayout>
      <TitleBar
        title="Story Map"
        actions={
          <>
            <Button
              variant="walkthrough"
              className="storymap-tour-trigger"
              onClick={startTour}
              title="Open Story Map walkthrough"
            >
              Walkthrough
            </Button>
            <Button
              variant="secondary"
              className="storymap-generate-example"
              onClick={handleGenerateExample}
              title="Generate example story map"
            >
              Generate Example
            </Button>
            <Button variant="danger" onClick={handleReset} title="Reset all story map data">
              Reset All Data
            </Button>
          </>
        }
      />

      {showExamples && (
        <WelcomeBanner
          title="Welcome!"
          description="Start by loading example data to see how story mapping works, or add your own activities, stories, and iterations."
          actionLabel="Generate Example Map"
          onAction={handleLoadExamples}
        />
      )}

      <Tile className="story-map-section">
        <div className="story-map-header">
          <h2>Story Map</h2>
          <div className="header-buttons story-map-actions">
            <Button variant="add" className="storymap-add-activity" onClick={handleOpenActivityModal}>
              + Add Activity
            </Button>
            <Button variant="add" className="storymap-add-iteration" onClick={handleOpenIterationModal}>
              + Add Iteration
            </Button>
            <Button variant="add" className="storymap-add-story" onClick={handleOpenStoryModal}>
              + Add Story
            </Button>
          </div>
        </div>
        <StoryMapGrid
          activities={activities}
          stories={stories}
          iterations={iterations}
          onSelectActivity={handleSelectActivity}
          onSelectStory={handleSelectStory}
          onSelectIteration={handleSelectIteration}
          onAddStory={(activityId, iterationId) => {
            setEditingStory(null);
            if (activities.length > 0 && iterations.length > 0) {
              const storyData = {
                title: '',
                description: '',
                activityId,
                iterationId,
                status: 'planned',
              };
              setEditingStory(storyData);
              setIsStoryModalOpen(true);
            }
          }}
        />
      </Tile>

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={handleCloseActivityModal}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
        editingActivity={editingActivity}
      />

      <StoryModal
        isOpen={isStoryModalOpen}
        onClose={handleCloseStoryModal}
        onSave={handleSaveStory}
        onDelete={handleDeleteStory}
        editingStory={editingStory}
        activities={activities}
        iterations={iterations}
      />

      <IterationModal
        isOpen={isIterationModalOpen}
        onClose={handleCloseIterationModal}
        onSave={handleSaveIteration}
        onDelete={handleDeleteIteration}
        editingIteration={editingIteration}
      />
    </PageLayout>
  );
}

export default StoryMap;
