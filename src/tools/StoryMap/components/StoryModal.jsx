import { useState, useEffect, useRef } from 'react';
import { Modal, FormField, ModalActions } from '@toolkit-pm/design-system/components';
import './StoryModal.css';

const StoryModal = ({ isOpen, onClose, onSave, editingStory, onDelete, activities, iterations }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityId, setActivityId] = useState('');
  const [iterationId, setIterationId] = useState('');
  const [status, setStatus] = useState('planned');
  const formRef = useRef(null);

  useEffect(() => {
    if (editingStory) {
      setTitle(editingStory.title || '');
      setDescription(editingStory.description || '');
      setActivityId(editingStory.activityId ? String(editingStory.activityId) : '');
      setIterationId(editingStory.iterationId ? String(editingStory.iterationId) : '');
      setStatus(editingStory.status || 'planned');
    } else {
      setTitle('');
      setDescription('');
      setActivityId(activities.length > 0 ? String(activities[0].id) : '');
      setIterationId(iterations.length > 0 ? String(iterations[0].id) : '');
      setStatus('planned');
    }
  }, [editingStory, isOpen, activities, iterations]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !activityId || !iterationId) return;

    onSave({
      title,
      description,
      activityId: parseInt(activityId),
      iterationId: parseInt(iterationId),
      status,
    });
    setTitle('');
    setDescription('');
    setActivityId('');
    setIterationId('');
    setStatus('planned');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      onDelete(editingStory.id);
      onClose();
    }
  };

  const activityOptions =
    activities.length === 0
      ? [{ value: '', label: 'No activities available - add an activity first' }]
      : [
          { value: '', label: 'Select an activity' },
          ...activities.map((activity) => ({ value: String(activity.id), label: activity.name })),
        ];

  const iterationOptions =
    iterations.length === 0
      ? [{ value: '', label: 'No iterations available - add an iteration first' }]
      : [
          { value: '', label: 'Select an iteration' },
          ...iterations.map((iteration) => ({
            value: String(iteration.id),
            label: `${iteration.name} ${iteration.date ? `(${iteration.date})` : ''}`.trim(),
          })),
        ];

  const statusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingStory && editingStory.id ? 'Edit Story' : 'Add New Story'}
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        <FormField
          id="story-title"
          label="Story Title *"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Email/Password Sign Up"
          required
        />

        <FormField
          id="story-description"
          label="Description"
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this story"
          rows={3}
        />

        <FormField
          id="story-activity"
          label="Activity *"
          type="select"
          value={activityId}
          onChange={(e) => setActivityId(e.target.value)}
          options={activityOptions}
          required
        />

        <FormField
          id="story-iteration"
          label="Iteration *"
          type="select"
          value={iterationId}
          onChange={(e) => setIterationId(e.target.value)}
          options={iterationOptions}
          required
        />

        <FormField
          id="story-status"
          label="Status *"
          type="select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={statusOptions}
          required
        />

        <ModalActions
          onCancel={onClose}
          onSubmit={() => formRef.current?.requestSubmit()}
          onDelete={editingStory && editingStory.id ? handleDelete : undefined}
          showDelete={!!(editingStory && editingStory.id)}
          submitLabel={editingStory && editingStory.id ? 'Update' : 'Add Story'}
          cancelLabel="Cancel"
          deleteLabel="Delete Story"
          submitDisabled={activities.length === 0 || iterations.length === 0}
        />
      </form>

      {(!editingStory || !editingStory.id) && (
        <p className="modal-hint">
          Stories are placed at the intersection of an activity and an iteration. Make sure you have at least one activity and one iteration before adding stories.
        </p>
      )}
    </Modal>
  );
};

export default StoryModal;
