import { ListPanel } from '@toolkit-pm/design-system/components';
import './ListComponents.css';

export default function TeamsList({ onOpenModal }) {
  return (
    <ListPanel
      title="Other Teams"
      description="Teams your team collaborates with"
      actionLabel="Manage Teams"
      onAction={onOpenModal}
      className="teams-list-panel"
    />
  );
}
