import { ListPanel } from '@toolkit-pm/design-system/components';
import './ListComponents.css';

export default function SystemsList({ onOpenModal }) {
  return (
    <ListPanel
      title="Systems"
      description="Systems your team builds or maintains"
      actionLabel="Manage Systems"
      onAction={onOpenModal}
      className="systems-list-panel"
    />
  );
}
