import { useState } from 'react';
import { Button, TextArea } from '@toolkit-pm/design-system/components';
import './DoubleDiamondBoard.css';

const DoubleDiamondBoard = ({ phases, onAddItem, onUpdateItem, onDeleteItem }) => {
  const [drafts, setDrafts] = useState({});
  const [editingItemId, setEditingItemId] = useState(null);
  const [editDraft, setEditDraft] = useState('');

  const updateDraft = (phaseId, value) => {
    setDrafts((prev) => ({ ...prev, [phaseId]: value }));
  };

  const handleAdd = (phaseId) => {
    const value = (drafts[phaseId] || '').trim();
    if (!value) return;
    onAddItem(phaseId, value);
    updateDraft(phaseId, '');
  };

  const handleStartEdit = (itemId, text) => {
    setEditingItemId(itemId);
    setEditDraft(text);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditDraft('');
  };

  const handleSaveEdit = (phaseId, itemId) => {
    const value = editDraft.trim();
    if (!value) return;
    onUpdateItem(phaseId, itemId, value);
    handleCancelEdit();
  };

  return (
    <div className="double-diamond-board">
      {phases.map((phase) => (
        <section key={phase.id} className="phase-column">
          <header className="phase-column-header">
            <p className="phase-subtitle">{phase.subtitle}</p>
            <h3>{phase.title}</h3>
          </header>

          <div className="phase-items">
            {phase.items.length === 0 ? (
              <p className="empty-phase-message">No entries yet. Add your first idea below.</p>
            ) : (
              phase.items.map((item) => (
                <article key={item.id} className="phase-item-card">
                  {editingItemId === item.id ? (
                    <>
                      <TextArea
                        value={editDraft}
                        onChange={(event) => setEditDraft(event.target.value)}
                        rows={3}
                        aria-label={`Edit item in ${phase.title}`}
                      />
                      <div className="item-actions">
                        <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                        <Button variant="add" onClick={() => handleSaveEdit(phase.id, item.id)}>Save</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>{item.text}</p>
                      <div className="item-actions">
                        <Button variant="secondary" onClick={() => handleStartEdit(item.id, item.text)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => onDeleteItem(phase.id, item.id)}>
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </article>
              ))
            )}
          </div>

          <div className="phase-add-form">
            <TextArea
              value={drafts[phase.id] || ''}
              onChange={(event) => updateDraft(phase.id, event.target.value)}
              placeholder="Add an entry..."
              rows={3}
              aria-label={`Add item for ${phase.title}`}
            />
            <Button variant="add" onClick={() => handleAdd(phase.id)}>
              + Add Entry
            </Button>
          </div>
        </section>
      ))}
    </div>
  );
};

export default DoubleDiamondBoard;
