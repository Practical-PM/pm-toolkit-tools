import { useState } from 'react';
import { Tile, FormField, Button } from '@toolkit-pm/design-system/components';
import './DomainForm.css';

const DomainForm = ({ onAddDomain, onUpdateDomain, editingDomain, onCancelEdit }) => {
  const [name, setName] = useState(editingDomain?.name || '');
  const [description, setDescription] = useState(editingDomain?.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    if (editingDomain) {
      onUpdateDomain(editingDomain.id, { name, description });
      onCancelEdit();
    } else {
      onAddDomain({ name, description });
    }
    
    setName('');
    setDescription('');
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    onCancelEdit();
  };

  // Update form when editing domain changes
  if (editingDomain && (name !== editingDomain.name || description !== editingDomain.description)) {
    setName(editingDomain.name);
    setDescription(editingDomain.description);
  }

  return (
    <Tile className="domain-form">
      <h3>{editingDomain ? 'Edit Domain' : 'Add New Domain'}</h3>
      <form onSubmit={handleSubmit}>
        <FormField
          label="Domain Name *"
          type="text"
          id="domain-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Email Service"
          required
        />

        <FormField
          label="Description"
          type="textarea"
          id="domain-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of what this domain includes"
          rows={3}
        />

        <div className="form-actions">
          <Button type="submit" variant="primary">
            {editingDomain ? 'Update Domain' : 'Add Domain'}
          </Button>
          {editingDomain && (
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
      
      {!editingDomain && (
        <p className="form-hint">
          After adding, click on the grid to position your domain, or drag it to adjust.
        </p>
      )}
    </Tile>
  );
};

export default DomainForm;

