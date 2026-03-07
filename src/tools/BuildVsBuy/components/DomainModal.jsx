import { useState, useEffect } from 'react';
import { Modal, FormField, ModalActions } from '@toolkit-pm/design-system/components';
import './DomainModal.css';

const DomainModal = ({ isOpen, onClose, onSave, editingDomain, onDelete }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingDomain) {
      setName(editingDomain.name);
      setDescription(editingDomain.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [editingDomain, isOpen]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!name.trim()) return;

    onSave({ name, description });
    setName('');
    setDescription('');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      onDelete(editingDomain.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingDomain ? 'Edit Domain' : 'Add New Domain'}
    >
      <form onSubmit={handleSubmit}>
        <FormField
          label="Domain Name *"
          type="text"
          id="domain-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Email Service"
          required
          autoFocus
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

        <ModalActions
          onCancel={onClose}
          onSubmit={handleSubmit}
          onDelete={editingDomain ? handleDelete : undefined}
          submitLabel={editingDomain ? 'Update' : 'Add Domain'}
          cancelLabel="Cancel"
          deleteLabel="Delete Domain"
          showDelete={!!editingDomain}
        />
      </form>

      {!editingDomain && (
        <p className="modal-hint">
          After adding, drag the domain on the grid to position it based on complexity and differentiation.
        </p>
      )}
    </Modal>
  );
};

export default DomainModal;
