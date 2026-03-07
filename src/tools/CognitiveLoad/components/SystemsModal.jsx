import { useState } from 'react';
import { Modal, Button, EmptyState } from '@toolkit-pm/design-system/components';
import './ListComponents.css';

export default function SystemsModal({ isOpen, onClose, systems, onUpdate }) {
  const [name, setName] = useState('');
  const [complexity, setComplexity] = useState(3);
  const [editingId, setEditingId] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onUpdate([...systems, {
        id: Date.now(),
        name: name.trim(),
        complexity: parseInt(complexity),
      }]);
      setName('');
      setComplexity(3);
    }
  };

  const handleDelete = (id) => {
    onUpdate(systems.filter(s => s.id !== id));
  };

  const handleEdit = (system) => {
    setEditingId(system.id);
  };

  const handleUpdate = (id, newComplexity) => {
    onUpdate(systems.map(s => 
      s.id === id ? { ...s, complexity: parseInt(newComplexity) } : s
    ));
  };

  const handleToggleBurn = (id) => {
    onUpdate(systems.map(s => 
      s.id === id ? { ...s, letItBurn: !s.letItBurn } : s
    ));
  };

  const getComplexityColor = (complexity) => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];
    return colors[(complexity || 1) - 1];
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Systems">
      <form onSubmit={handleAdd} className="add-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="System name (e.g., Payment API)"
        />
        <div className="complexity-input">
          <label>Complexity: {complexity}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          />
        </div>
        <button type="submit">+ Add System</button>
      </form>

      <div className="items-list">
        {systems.length === 0 ? (
          <EmptyState message="No systems added yet" />
        ) : (
          systems.map(system => (
            <div key={system.id} className={`list-item ${system.letItBurn ? 'burned-out' : ''}`}>
              <div 
                className="complexity-indicator" 
                style={{ background: system.letItBurn ? '#999' : getComplexityColor(system.complexity) }}
              />
              <div className="item-info">
                <div className="item-name">
                  {system.letItBurn && <span className="burn-icon">🔥</span>}
                  {system.name}
                  {system.letItBurn && <span className="burned-label">Ignored</span>}
                </div>
                {editingId === system.id ? (
                  <div className="edit-complexity">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={system.complexity}
                      onChange={(e) => handleUpdate(system.id, e.target.value)}
                    />
                    <span>Complexity: {system.complexity}</span>
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
                    Complexity: {system.complexity}/5
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => handleEdit(system)}
                    >
                      Edit
                    </Button>
                    <button 
                      type="button"
                      className={`burn-btn ${system.letItBurn ? 'active' : ''}`}
                      onClick={() => handleToggleBurn(system.id)}
                      title={system.letItBurn ? "Include in cognitive load" : "Let it burn (ignore)"}
                    >
                      🔥
                    </button>
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="delete"
                onClick={() => handleDelete(system.id)}
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
