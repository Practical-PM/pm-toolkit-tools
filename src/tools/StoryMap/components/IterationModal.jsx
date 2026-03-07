import { useState, useEffect, useRef } from 'react';
import { Modal, FormField, ModalActions } from '@toolkit-pm/design-system/components';
import './IterationModal.css';

const IterationModal = ({ isOpen, onClose, onSave, editingIteration, onDelete }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    if (editingIteration) {
      setName(editingIteration.name);
      setDate(editingIteration.date || '');
    } else {
      setName('');
      setDate('');
    }
  }, [editingIteration, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({ name, date });
    setName('');
    setDate('');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this iteration? All stories in this iteration will also be deleted.')) {
      onDelete(editingIteration.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingIteration ? 'Edit Iteration' : 'Add New Iteration'}
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        <FormField
          id="iteration-name"
          label="Iteration Name *"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., MVP, Iteration 2, Q1 Release"
          required
        />

        <FormField
          id="iteration-date"
          label="Date (Optional)"
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="e.g., 2025-Q1, March 2025"
        />

        <ModalActions
          onCancel={onClose}
          onSubmit={() => formRef.current?.requestSubmit()}
          onDelete={editingIteration ? handleDelete : undefined}
          showDelete={!!editingIteration}
          submitLabel={editingIteration ? 'Update' : 'Add Iteration'}
          cancelLabel="Cancel"
          deleteLabel="Delete Iteration"
        />
      </form>

      {!editingIteration && (
        <p className="modal-hint">
          Iterations represent releases or development cycles. They form horizontal slices across your story map.
        </p>
      )}
    </Modal>
  );
};

export default IterationModal;
