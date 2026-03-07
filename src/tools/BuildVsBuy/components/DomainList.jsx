import { Tile, Badge, ActionButtonGroup, EmptyState } from '@toolkit-pm/design-system/components';
import { getQuadrant } from '../utils/defaultDomains';
import './DomainList.css';

const DomainList = ({ domains, onEditDomain, onDeleteDomain }) => {
  return (
    <Tile className="domain-list">
      <div className="domain-list-header">
        <h3>Your Domains ({domains.length})</h3>
      </div>

      {domains.length === 0 ? (
        <EmptyState message="No domains yet. Add your first domain to get started!" />
      ) : (
        <div className="domains-table">
          <table>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Description</th>
                <th>Position</th>
                <th>Quadrant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {domains.map(domain => {
                const quadrant = getQuadrant(domain.x, domain.y);
                return (
                  <tr key={domain.id}>
                    <td className="domain-name">{domain.name}</td>
                    <td className="domain-description">{domain.description || '-'}</td>
                    <td className="domain-position">
                      ({domain.x.toFixed(1)}, {domain.y.toFixed(1)})
                    </td>
                    <td className="domain-quadrant">
                      {quadrant && (
                        <Badge color={quadrant.color}>{quadrant.name}</Badge>
                      )}
                    </td>
                    <td className="domain-actions">
                      <ActionButtonGroup
                        onEdit={() => onEditDomain(domain)}
                        onDelete={() => onDeleteDomain(domain.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Tile>
  );
};

export default DomainList;

