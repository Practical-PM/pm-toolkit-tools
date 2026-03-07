import { Tile, EmptyState } from '@toolkit-pm/design-system/components';
import './Timeline.css';

const Timeline = ({ iterations, stories }) => {
  // Get all iterations with dates
  const iterationsWithDates = iterations.filter(
    iter => iter.startDate || iter.endDate
  );

  if (iterationsWithDates.length === 0) {
    return (
      <Tile className="timeline-container">
        <EmptyState message="Add start and end dates to your iterations to see the timeline view." />
      </Tile>
    );
  }

  // Parse date strings to Date objects
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  // Get all start and end dates
  const allDates = [];
  iterationsWithDates.forEach(iter => {
    if (iter.startDate) {
      const date = parseDate(iter.startDate);
      if (date) allDates.push(date);
    }
    if (iter.endDate) {
      const date = parseDate(iter.endDate);
      if (date) allDates.push(date);
    }
  });

  if (allDates.length === 0) {
    return (
      <Tile className="timeline-container">
        <EmptyState message="Add valid start and end dates to your iterations to see the timeline view." />
      </Tile>
    );
  }

  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));

  // Extend range by 1 month on each side for better visualization
  const rangeStart = new Date(minDate);
  rangeStart.setMonth(rangeStart.getMonth() - 1);
  const rangeEnd = new Date(maxDate);
  rangeEnd.setMonth(rangeEnd.getMonth() + 1);

  const totalDays = Math.ceil((rangeEnd - rangeStart) / (1000 * 60 * 60 * 24));

  const getPosition = (date) => {
    if (!date) return 0;
    const daysDiff = Math.ceil((date - rangeStart) / (1000 * 60 * 60 * 24));
    return (daysDiff / totalDays) * 100;
  };

  const getWidth = (startDate, endDate) => {
    if (!startDate || !endDate) return 5;
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const widthPercent = (daysDiff / totalDays) * 100;
    return Math.max(widthPercent, 1);
  };

  // Group stories by iteration
  const storiesByIteration = {};
  iterations.forEach(iter => {
    storiesByIteration[iter.id] = stories.filter(s => s.iterationId === iter.id);
  });

  // Generate month labels
  const monthLabels = [];
  let currentDate = new Date(rangeStart);
  while (currentDate <= rangeEnd) {
    monthLabels.push({
      date: new Date(currentDate),
      label: currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return (
    <Tile className="timeline-container">
      <div className="timeline-header">
        <h3>Timeline View</h3>
      </div>
      <div className="timeline-content">
        <div className="timeline-scroll">
          <div className="timeline-grid">
            {/* Month labels */}
            <div className="timeline-months">
              {monthLabels.map((month, idx) => (
                <div
                  key={idx}
                  className="timeline-month"
                  style={{ left: `${(idx / (monthLabels.length - 1)) * 100}%` }}
                >
                  <div className="month-label">{month.label}</div>
                  <div className="month-line"></div>
                </div>
              ))}
            </div>

            {/* Iteration bars */}
            <div className="timeline-iterations">
              {iterationsWithDates.map(iter => {
                const startDate = parseDate(iter.startDate);
                const endDate = parseDate(iter.endDate);
                
                const positionDate = startDate || endDate;
                if (!positionDate) return null;

                const position = getPosition(positionDate);
                
                let width;
                if (startDate && endDate) {
                  width = getWidth(startDate, endDate);
                } else if (startDate) {
                  const assumedEnd = new Date(startDate);
                  assumedEnd.setMonth(assumedEnd.getMonth() + 1);
                  width = getWidth(startDate, assumedEnd);
                } else {
                  const assumedStart = new Date(endDate);
                  assumedStart.setMonth(assumedStart.getMonth() - 1);
                  width = getWidth(assumedStart, endDate);
                  const adjustedPosition = getPosition(assumedStart);
                  return (
                    <div
                      key={iter.id}
                      className="timeline-iteration-bar"
                      style={{
                        left: `${adjustedPosition}%`,
                        width: `${width}%`,
                      }}
                      title={`${iter.name}${startDate ? ` (${startDate.toLocaleDateString()}` : ''}${startDate && endDate ? ' - ' : startDate ? '' : ' (until '}${endDate ? endDate.toLocaleDateString() : ''}${startDate || endDate ? ')' : ''} - ${storiesByIteration[iter.id]?.length || 0} ${(storiesByIteration[iter.id]?.length || 0) === 1 ? 'story' : 'stories'}`}
                    >
                      <div className="iteration-bar-label">{iter.name}</div>
                      {(storiesByIteration[iter.id]?.length || 0) > 0 && (
                        <div className="iteration-story-count">{storiesByIteration[iter.id].length}</div>
                      )}
                    </div>
                  );
                }

                const storyCount = storiesByIteration[iter.id]?.length || 0;
                
                return (
                  <div
                    key={iter.id}
                    className="timeline-iteration-bar"
                    style={{
                      left: `${position}%`,
                      width: `${width}%`,
                    }}
                    title={`${iter.name}${startDate ? ` (${startDate.toLocaleDateString()}` : ''}${startDate && endDate ? ' - ' : startDate ? '' : ' (until '}${endDate ? endDate.toLocaleDateString() : ''}${startDate || endDate ? ')' : ''} - ${storyCount} ${storyCount === 1 ? 'story' : 'stories'}`}
                  >
                    <div className="iteration-bar-label">{iter.name}</div>
                    {storyCount > 0 && (
                      <div className="iteration-story-count">{storyCount}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Tile>
  );
};

export default Timeline;
