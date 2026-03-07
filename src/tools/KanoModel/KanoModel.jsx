import { useEffect, useState } from 'react';
import { Button, Modal, ModalActions, PageLayout, Tile, TitleBar } from '@toolkit-pm/design-system/components';
import KanoChart from './components/KanoChart';
import { useTour } from './hooks/useTour';
import 'shepherd.js/dist/css/shepherd.css';
import './KanoModel.css';
import './components/Tour.css';

const storageKey = 'pm-toolkit-kano-features';

const defaultFeatures = [
  { id: 'f-1', name: 'Battery lasts full day', category: 'performance', effort: 3, notes: '', fulfillment: 65 },
  { id: 'f-2', name: 'Makes phone calls', category: 'performance', effort: 1, notes: '', fulfillment: 90 },
  { id: 'f-3', name: 'Camera quality', category: 'performance', effort: 4, notes: '', fulfillment: 52 },
  { id: 'f-4', name: 'AI photo editing', category: 'attractive', effort: 4, notes: '', fulfillment: 32 },
  { id: 'f-5', name: 'Late payment penalty', category: 'reverse', effort: 1, notes: '', fulfillment: 42 },
];

const categoryOptions = [
  { value: 'performance', label: 'Performance' },
  { value: 'attractive', label: 'Attractive' },
  { value: 'indifferent', label: 'Indifferent' },
  { value: 'reverse', label: 'Reverse' },
];

const normalizeFeature = (feature, index) => {
  const legacyTypeToCategory = {
    must: 'performance',
    want: 'performance',
    exciter: 'attractive',
  };
  const category = feature.category || legacyTypeToCategory[feature.type] || 'performance';

  return {
    id: feature.id ?? `f-${index + 1}`,
    name: feature.name || `Feature ${index + 1}`,
    category,
    effort: Math.min(5, Math.max(1, Number(feature.effort || 3))),
    notes: feature.notes || '',
    fulfillment: Math.min(100, Math.max(0, Number(feature.fulfillment || 50))),
  };
};

function KanoModel() {
  const [features, setFeatures] = useState([]);
  const [nextId, setNextId] = useState(6);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureCategory, setNewFeatureCategory] = useState('performance');
  const [newFeatureEffort, setNewFeatureEffort] = useState(3);
  const [newFeatureNotes, setNewFeatureNotes] = useState('');
  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false);
  const [isEditFeatureOpen, setIsEditFeatureOpen] = useState(false);
  const [editingFeatureId, setEditingFeatureId] = useState(null);
  const [editingFeatureName, setEditingFeatureName] = useState('');
  const { startTour } = useTour();

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.features)) {
          setFeatures(parsed.features.map(normalizeFeature));
          setNextId(parsed.nextId || parsed.features.length + 1 || 1);
          return;
        }
      } catch {
        // Ignore invalid storage.
      }
    }
    setFeatures(defaultFeatures);
    setNextId(6);
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ features, nextId }));
  }, [features, nextId]);

  const handleAddFeature = () => {
    if (!newFeatureName.trim()) return;
    const newFeature = {
      id: `f-${nextId}`,
      name: newFeatureName.trim(),
      category: newFeatureCategory,
      effort: newFeatureEffort,
      notes: newFeatureNotes.trim(),
      fulfillment: 35,
    };
    setFeatures(prev => [...prev, newFeature]);
    setNextId(prev => prev + 1);
    setNewFeatureName('');
    setNewFeatureNotes('');
    setNewFeatureEffort(3);
    setNewFeatureCategory('performance');
    setIsAddFeatureOpen(false);
  };

  const handleRemoveFeature = (id) => {
    setFeatures(prev => prev.filter(feature => feature.id !== id));
    setIsEditFeatureOpen(false);
    setEditingFeatureId(null);
    setEditingFeatureName('');
  };

  const handleUpdateFeature = (id, updates) => {
    setFeatures(prev =>
      prev.map(feature =>
        feature.id === id ? { ...feature, ...updates } : feature
      )
    );
  };

  const handleOpenEditFeature = (id) => {
    const feature = features.find((item) => item.id === id);
    if (!feature) return;
    setEditingFeatureId(id);
    setEditingFeatureName(feature.name);
    setIsEditFeatureOpen(true);
  };

  const handleSaveFeatureName = () => {
    if (!editingFeatureId || !editingFeatureName.trim()) return;
    handleUpdateFeature(editingFeatureId, { name: editingFeatureName.trim() });
    setIsEditFeatureOpen(false);
  };

  const handleGenerateExample = () => {
    const exampleFeatures = [
      { id: 'f-1', name: 'Camera quality', category: 'performance', effort: 4, notes: 'Better execution directly improves satisfaction.', fulfillment: 58 },
      { id: 'f-2', name: 'AI photo suggestions', category: 'attractive', effort: 4, notes: 'Unexpected delight when it works well.', fulfillment: 36 },
      { id: 'f-3', name: 'Built-in FM radio', category: 'indifferent', effort: 2, notes: 'Most users are neutral to this capability.', fulfillment: 20 },
      { id: 'f-4', name: 'Overdraft fee', category: 'reverse', effort: 1, notes: 'Charges and penalties generally reduce satisfaction.', fulfillment: 48 },
    ];

    if (features.length > 0 && !window.confirm('Replace current Kano features with an example set?')) {
      return;
    }

    setFeatures(exampleFeatures);
    setNextId(5);
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Delete all Kano data and clear saved changes?')) {
      return;
    }
    setFeatures([]);
    setNextId(1);
    setNewFeatureName('');
    setNewFeatureCategory('performance');
    setNewFeatureEffort(3);
    setNewFeatureNotes('');
    setIsAddFeatureOpen(false);
    setIsEditFeatureOpen(false);
    setEditingFeatureId(null);
    setEditingFeatureName('');
  };

  return (
    <PageLayout>
      <TitleBar
        title="Kano Model"
        actions={(
          <>
            <Button variant="walkthrough" onClick={startTour}>
              Walkthrough
            </Button>
            <Button variant="secondary" onClick={handleGenerateExample}>
              Generate Example
            </Button>
            <Button variant="danger" onClick={handleResetDefaults}>
              Reset All Data
            </Button>
          </>
        )}
      />
      <Tile className="kano-chart-only-card">
        <KanoChart
          features={features}
          onFeatureClick={handleOpenEditFeature}
          onUpdateFeature={handleUpdateFeature}
          onAddFeature={() => setIsAddFeatureOpen(true)}
        />
      </Tile>

      <Tile className="kano-about">
        <h3>About the Kano Model</h3>
        <p>
          The Kano Model was developed in the 1980s by Professor Noriaki Kano to help product teams
          understand how feature execution influences customer satisfaction. It distinguishes baseline
          expectations from linear performance drivers and delight opportunities, making trade-offs easier
          to discuss.
        </p>
      </Tile>

      <Modal
        isOpen={isAddFeatureOpen}
        onClose={() => setIsAddFeatureOpen(false)}
        title="Add Feature"
      >
        <div className="feature-form">
          <label className="field">
            Name
            <input
              value={newFeatureName}
              onChange={(event) => setNewFeatureName(event.target.value)}
              placeholder="e.g. real-time alerts"
            />
          </label>
          <label className="field">
            Category
            <select
              value={newFeatureCategory}
              onChange={(event) => setNewFeatureCategory(event.target.value)}
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Effort ({newFeatureEffort})
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={newFeatureEffort}
              onChange={(event) => setNewFeatureEffort(Number(event.target.value))}
            />
          </label>
          <label className="field">
            Notes (optional)
            <textarea
              value={newFeatureNotes}
              onChange={(event) => setNewFeatureNotes(event.target.value)}
              placeholder="Any context for this feature..."
              rows={2}
            />
          </label>
        </div>
        <ModalActions
          onCancel={() => setIsAddFeatureOpen(false)}
          onConfirm={handleAddFeature}
          confirmLabel="Add Feature"
        />
      </Modal>

      <Modal
        isOpen={isEditFeatureOpen}
        onClose={() => setIsEditFeatureOpen(false)}
        title="Edit Feature Name"
      >
        <label className="field">
          Name
          <input
            value={editingFeatureName}
            onChange={(event) => setEditingFeatureName(event.target.value)}
            placeholder="Feature name"
          />
        </label>
        <ModalActions
          onCancel={() => setIsEditFeatureOpen(false)}
          onConfirm={handleSaveFeatureName}
          confirmLabel="Save Name"
        />
        <div className="feature-edit-remove">
          <Button
            variant="danger"
            onClick={() => editingFeatureId && handleRemoveFeature(editingFeatureId)}
          >
            Remove Feature
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
}

export default KanoModel;
