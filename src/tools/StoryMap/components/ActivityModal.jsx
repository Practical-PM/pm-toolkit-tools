import { useState, useEffect, useRef } from 'react';
import { Modal, FormField, ModalActions } from '@toolkit-pm/design-system/components';
import './ActivityModal.css';

const ActivityModal = ({ isOpen, onClose, onSave, editingActivity, onDelete }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    if (editingActivity) {
      setName(editingActivity.name);
      setDescription(editingActivity.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [editingActivity, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({ name, description });
    setName('');
    setDescription('');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this activity? All stories in this activity will also be deleted.')) {
      onDelete(editingActivity.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingActivity ? 'Edit Activity' : 'Add New Activity'}
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        <FormField
          id="activity-name"
          label="Activity Name *"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., User Authentication"
          required
        />

        <FormField
          id="activity-description"
          label="Description"
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this activity"
          rows={3}
        />

        <ModalActions
          onCancel={onClose}
          onSubmit={() => formRef.current?.requestSubmit()}
          onDelete={editingActivity ? handleDelete : undefined}
          showDelete={!!editingActivity}
          submitLabel={editingActivity ? 'Update' : 'Add Activity'}
          cancelLabel="Cancel"
          deleteLabel="Delete Activity"
        />
      </form>

      {!editingActivity && (
        <p className="modal-hint">
          Activities represent user activities or feature areas. They form the horizontal backbone of your story map.
        </p>
      )}
    </Modal>
  );
};

export default ActivityModal;
