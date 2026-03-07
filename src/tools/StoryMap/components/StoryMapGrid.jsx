import { Badge, EmptyState } from '@toolkit-pm/design-system/components';
import './StoryMapGrid.css';

const StoryMapGrid = ({ activities, stories, iterations, onSelectActivity, onSelectStory, onSelectIteration, onAddStory }) => {
  // Sort iterations by id for consistent display
  const sortedIterations = [...iterations].sort((a, b) => a.id - b.id);
  const sortedActivities = [...activities].sort((a, b) => a.id - b.id);

  const getStoriesForCell = (activityId, iterationId) => {
    return stories.filter(s => s.activityId === activityId && s.iterationId === iterationId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return '#10b981'; // green
      case 'in-progress':
        return '#f59e0b'; // yellow/orange
      case 'planned':
      default:
        return '#9ca3af'; // gray
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'done':
        return 'Done';
      case 'in-progress':
        return 'In Progress';
      case 'planned':
      default:
        return 'Planned';
    }
  };

  if (activities.length === 0 && iterations.length === 0) {
    return (
      <EmptyState
        message="Add activities and iterations to start building your story map."
        className="story-map-empty"
      />
    );
  }

  return (
    <div className="story-map-container">
      <div className="story-map-wrapper">
        <table className="story-map-table">
          <thead>
            <tr>
              <th className="iteration-header-cell"></th>
              {sortedActivities.map(activity => (
                <th key={activity.id} className="activity-header-cell">
                  <div className="activity-header-content">
                    <button
                      className="activity-header-button"
                      onClick={() => onSelectActivity(activity)}
                      title={activity.description || activity.name}
                    >
                      <h3>{activity.name}</h3>
                      {activity.description && (
                        <p className="activity-description">{activity.description}</p>
                      )}
                    </button>
                  </div>
                </th>
              ))}
              {sortedActivities.length === 0 && (
                <th className="activity-header-cell empty">
                  <div className="empty-message">Add an activity to get started</div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedIterations.length === 0 ? (
              <tr>
                <td className="iteration-label-cell">
                  <div className="empty-message">Add an iteration</div>
                </td>
                {sortedActivities.map(() => (
                  <td key={`empty-${Math.random()}`} className="story-cell"></td>
                ))}
              </tr>
            ) : (
              sortedIterations.map(iteration => (
                <tr key={iteration.id}>
                  <td className="iteration-label-cell">
                    <button
                      className="iteration-label-button"
                      onClick={() => onSelectIteration(iteration)}
                    >
                      <div className="iteration-name">{iteration.name}</div>
                      {iteration.date && (
                        <div className="iteration-date">{iteration.date}</div>
                      )}
                    </button>
                  </td>
                  {sortedActivities.map(activity => {
                    const cellStories = getStoriesForCell(activity.id, iteration.id);
                    return (
                      <td key={`${activity.id}-${iteration.id}`} className="story-cell">
                        {cellStories.map(story => (
                          <div
                            key={story.id}
                            className="story-card"
                            style={{ borderLeftColor: getStatusColor(story.status) }}
                            onClick={() => onSelectStory(story)}
                            title={story.description || story.title}
                          >
                            <div className="story-card-header">
                              <span className="story-title">{story.title}</span>
                              <Badge color={getStatusColor(story.status)} className="story-status-badge">
                                {getStatusLabel(story.status)}
                              </Badge>
                            </div>
                            {story.description && (
                              <p className="story-description">{story.description}</p>
                            )}
                          </div>
                        ))}
                        {cellStories.length === 0 && (
                          <div 
                            className="empty-cell-hint clickable" 
                            onClick={() => onAddStory && onAddStory(activity.id, iteration.id)}
                          >
                            Click to add story
                          </div>
                        )}
                      </td>
                    );
                  })}
                  {sortedActivities.length === 0 && (
                    <td className="story-cell empty">
                      <div className="empty-message">Add an activity</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoryMapGrid;

