import { useState } from 'react';
import { Modal, FormField, SliderField, Button, EmptyState } from '@toolkit-pm/design-system/components';
import './ListComponents.css';

export default function TeamsModal({ isOpen, onClose, teams, onUpdate }) {
  const [name, setName] = useState('');
  const [complexity, setComplexity] = useState(3);
  const [editingId, setEditingId] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onUpdate([...teams, {
        id: Date.now(),
        name: name.trim(),
        complexity: parseInt(complexity),
      }]);
      setName('');
      setComplexity(3);
    }
  };

  const handleDelete = (id) => {
    onUpdate(teams.filter(t => t.id !== id));
  };

  const handleEdit = (team) => {
    setEditingId(team.id);
  };

  const handleUpdate = (id, newComplexity) => {
    onUpdate(teams.map(t => 
      t.id === id ? { ...t, complexity: parseInt(newComplexity) } : t
    ));
  };

  const handleToggleBurn = (id) => {
    onUpdate(teams.map(t => 
      t.id === id ? { ...t, letItBurn: !t.letItBurn } : t
    ));
  };

  const getComplexityColor = (complexity) => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];
    return colors[(complexity || 1) - 1];
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Other Teams">
      <form onSubmit={handleAdd} className="add-form">
        <FormField
          id="team-name"
          label="Team name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Platform Team"
        />
        <SliderField
          label={`Domain Complexity: ${complexity}`}
          min={1}
          max={5}
          value={complexity}
          onChange={(e) => setComplexity(e.target.value)}
        />
        <Button type="submit" variant="add">+ Add Team</Button>
      </form>

      <div className="items-list">
        {teams.length === 0 ? (
          <EmptyState message="No teams added yet" />
        ) : (
          teams.map(team => (
            <div key={team.id} className={`list-item ${team.letItBurn ? 'burned-out' : ''}`}>
              <div 
                className="complexity-indicator" 
                style={{ background: team.letItBurn ? '#999' : getComplexityColor(team.complexity) }}
              />
              <div className="item-info">
                <div className="item-name">
                  {team.letItBurn && <span className="burn-icon">🔥</span>}
                  {team.name}
                  {team.letItBurn && <span className="burned-label">Ignored</span>}
                </div>
                {editingId === team.id ? (
                  <div className="edit-complexity">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={team.complexity}
                      onChange={(e) => handleUpdate(team.id, e.target.value)}
                    />
                    <span>Complexity: {team.complexity}</span>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setEditingId(null)}
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <div className="item-details">
                    Domain Complexity: {team.complexity}/5
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => handleEdit(team)}
                    >
                      Edit
                    </Button>
                    <button 
                      type="button"
                      className={`burn-btn ${team.letItBurn ? 'active' : ''}`}
                      onClick={() => handleToggleBurn(team.id)}
                      title={team.letItBurn ? "Include in cognitive load" : "Let it burn (ignore)"}
                    >
                      🔥
                    </button>
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="delete"
                onClick={() => handleDelete(team.id)}
                className="delete-btn"
              >
                &times;
              </Button>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
