import { useState } from 'react';
import { Tile, Button, FormField, ActionButtonGroup, EmptyState } from '@toolkit-pm/design-system/components';
import { scoreLevels, MIN_COMPETENCIES, MAX_COMPETENCIES } from '../utils/defaultCompetencies';
import './CompetencyList.css';

const CompetencyList = ({ competencies, onUpdateCompetency, onAddCompetency, onRemoveCompetency }) => {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [editingLevelId, setEditingLevelId] = useState(null);
  const [editingLevel, setEditingLevel] = useState(null);
  const [editLevelText, setEditLevelText] = useState('');

  const handleStartEdit = (competency) => {
    setEditingId(competency.id);
    setEditName(competency.name);
    setEditDescription(competency.description);
  };

  const handleSaveEdit = (id) => {
    if (editName.trim()) {
      onUpdateCompetency(id, { name: editName, description: editDescription });
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleScoreChange = (id, score) => {
    onUpdateCompetency(id, { score: parseInt(score) });
  };

  const handleAddNew = () => {
    if (newName.trim()) {
      onAddCompetency({
        name: newName,
        description: newDescription,
        score: null,
        levelDescriptions: {
          1: 'Add description for level 1',
          2: 'Add description for level 2',
          3: 'Add description for level 3',
          4: 'Add description for level 4',
          5: 'Add description for level 5',
        },
      });
      setNewName('');
      setNewDescription('');
      setShowAddForm(false);
    }
  };

  const canRemove = competencies.length > MIN_COMPETENCIES;
  const canAdd = competencies.length < MAX_COMPETENCIES;

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStartEditLevel = (competencyId, level, currentText) => {
    setEditingLevelId(competencyId);
    setEditingLevel(level);
    setEditLevelText(currentText);
  };

  const handleSaveLevel = (competencyId) => {
    const competency = competencies.find(c => c.id === competencyId);
    if (competency && editLevelText.trim()) {
      const updatedDescriptions = {
        ...competency.levelDescriptions,
        [editingLevel]: editLevelText,
      };
      onUpdateCompetency(competencyId, { levelDescriptions: updatedDescriptions });
    }
    setEditingLevelId(null);
    setEditingLevel(null);
    setEditLevelText('');
  };

  const handleCancelLevelEdit = () => {
    setEditingLevelId(null);
    setEditingLevel(null);
    setEditLevelText('');
  };

  return (
    <Tile className="competency-list">
      <div className="competency-list-header">
        <h2>Competency Assessment Matrix</h2>
        <div className="header-actions">
          {canAdd && !showAddForm && (
            <Button
              variant="add"
              onClick={() => setShowAddForm(true)}
              aria-label="Add new competency"
            >
              + Add Competency
            </Button>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="add-competency-form">
          <h3>Add New Competency</h3>
          <FormField
            id="new-name"
            label="Competency Name *"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g., Market Analysis"
          />
          <FormField
            id="new-description"
            label="Description"
            type="textarea"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Brief description of this competency..."
            rows={2}
          />
          <div className="form-actions">
            <Button variant="primary" onClick={handleAddNew} disabled={!newName.trim()}>
              Add
            </Button>
            <Button variant="secondary" onClick={() => {
              setShowAddForm(false);
              setNewName('');
              setNewDescription('');
            }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="competency-matrix">
        {competencies.length === 0 ? (
          <EmptyState
            icon="📋"
            message="No competencies yet. Add your first competency to get started."
            actionLabel="+ Add Competency"
            onAction={() => setShowAddForm(true)}
          />
        ) : (
        <table>
          <thead>
            <tr>
              <th className="competency-col">Competency</th>
              {scoreLevels.map(level => (
                <th key={level.value} className="score-col" title={level.description}>
                  <div className="score-header">
                    <span className="score-number">{level.value}</span>
                    <span className="score-label">{level.label}</span>
                  </div>
                </th>
              ))}
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {competencies.map(competency => (
              <>
                <tr key={competency.id} className={editingId === competency.id ? 'editing' : ''}>
                  {editingId === competency.id ? (
                  <td colSpan={scoreLevels.length + 2} className="edit-cell">
                    <div className="competency-edit-form">
                      <FormField
                        id={`edit-name-${competency.id}`}
                        label="Competency Name"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <FormField
                        id={`edit-desc-${competency.id}`}
                        label="Description"
                        type="textarea"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={2}
                      />
                      <div className="form-actions">
                        <Button variant="primary" onClick={() => handleSaveEdit(competency.id)}>
                          Save
                        </Button>
                        <Button variant="secondary" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="competency-cell">
                      <div className="competency-name-row">
                        <Button
                          type="button"
                          variant="secondary"
                          className="expand-btn"
                          onClick={() => toggleExpand(competency.id)}
                          aria-label={expandedId === competency.id ? 'Collapse details' : 'Expand details'}
                        >
                          {expandedId === competency.id ? '▼' : '▶'}
                        </Button>
                        <div>
                          <div className="competency-name">{competency.name}</div>
                          <div className="competency-description">{competency.description}</div>
                        </div>
                      </div>
                    </td>
                    {scoreLevels.map(level => (
                      <td 
                        key={level.value} 
                        className={`score-cell ${competency.score === level.value ? 'selected' : ''}`}
                        onClick={() => handleScoreChange(competency.id, level.value)}
                        title={`${level.label}: ${level.description}`}
                      >
                        <div className="score-option">
                          <input
                            type="radio"
                            name={`score-${competency.id}`}
                            value={level.value}
                            checked={competency.score === level.value}
                            onChange={() => handleScoreChange(competency.id, level.value)}
                            aria-label={`Score ${level.value} for ${competency.name}`}
                          />
                          <span className="checkmark">✓</span>
                        </div>
                      </td>
                    ))}
                    <td className="actions-cell">
                      <ActionButtonGroup
                        onEdit={() => handleStartEdit(competency)}
                        onDelete={canRemove ? () => onRemoveCompetency(competency.id) : undefined}
                        showDelete={canRemove}
                      />
                    </td>
                  </>
                )}
                </tr>
                {/* Expanded Detail Row */}
                {expandedId === competency.id && competency.levelDescriptions && (
                  <tr className="expanded-row">
                    <td colSpan={scoreLevels.length + 2} className="expanded-cell">
                      <div className="level-details-container">
                        <h4>Level Characteristics:</h4>
                        <div className="level-details-table">
                          <table>
                            <thead>
                              <tr>
                                {scoreLevels.map(level => (
                                  <th key={level.value}>
                                    <div className="level-header">
                                      <span className="level-number">{level.value}</span>
                                      <span className="level-label">{level.label}</span>
                                    </div>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {scoreLevels.map(level => (
                                  <td key={level.value} className="level-detail-cell">
                                    {editingLevelId === competency.id && editingLevel === level.value ? (
                                      <div className="level-edit-form">
                                        <textarea
                                          value={editLevelText}
                                          onChange={(e) => setEditLevelText(e.target.value)}
                                          rows="4"
                                          autoFocus
                                        />
                                        <div className="level-edit-actions">
                                          <Button
                                            variant="primary"
                                            onClick={() => handleSaveLevel(competency.id)}
                                          >
                                            Save
                                          </Button>
                                          <Button
                                            variant="secondary"
                                            onClick={handleCancelLevelEdit}
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="level-detail-content">
                                        <p>{competency.levelDescriptions[level.value] || 'No description available'}</p>
                                        <Button
                                          variant="primary"
                                          className="edit-level-btn"
                                          onClick={() => handleStartEditLevel(
                                            competency.id, 
                                            level.value, 
                                            competency.levelDescriptions[level.value] || ''
                                          )}
                                          title="Edit description"
                                        >
                                          ✏️
                                        </Button>
                                      </div>
                                    )}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        )}
      </div>

      <div className="matrix-legend">
        <p><strong>How to use:</strong> Click on any cell to rate yourself on that competency. Click the ▶ arrow to see detailed characteristics for each level. You can edit competency names/descriptions or add your own.</p>
      </div>
    </Tile>
  );
};

export default CompetencyList;
