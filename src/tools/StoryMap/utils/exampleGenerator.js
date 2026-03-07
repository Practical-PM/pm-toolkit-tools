const activityTemplates = [
  { name: 'Onboarding', description: 'First-time setup and initial value moments' },
  { name: 'Core Workflow', description: 'Day-to-day flow users rely on most' },
  { name: 'Insights & Reporting', description: 'Visibility, metrics, and decision support' },
  { name: 'Collaboration', description: 'Sharing, feedback, and team workflows' },
  { name: 'Administration', description: 'Configuration, governance, and controls' },
];

const iterationTemplates = [
  { name: 'Foundation', date: 'Q1' },
  { name: 'Expansion', date: 'Q2' },
  { name: 'Optimization', date: 'Q3' },
];

const storyTemplates = [
  'Create workspace',
  'Invite teammates',
  'Set preferences',
  'Complete guided setup',
  'Track progress',
  'Filter and search',
  'Edit and update',
  'Review insights',
  'Export summary',
];

function randomPick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffled(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

export function generateStoryMapExample() {
  const activities = shuffled(activityTemplates).slice(0, 3).map((activity, index) => ({
    id: index + 1,
    ...activity,
  }));

  const iterations = iterationTemplates.map((iteration, index) => ({
    id: index + 1,
    ...iteration,
  }));

  const statuses = ['planned', 'in-progress', 'done'];
  let nextStoryId = 1;
  const stories = [];

  activities.forEach((activity) => {
    iterations.forEach((iteration) => {
      if (Math.random() < 0.78) {
        stories.push({
          id: nextStoryId++,
          title: randomPick(storyTemplates),
          description: `${activity.name}: ${randomPick(storyTemplates).toLowerCase()}.`,
          activityId: activity.id,
          iterationId: iteration.id,
          status: randomPick(statuses),
        });
      }
    });
  });

  if (stories.length === 0) {
    stories.push({
      id: nextStoryId++,
      title: 'Kickoff story',
      description: 'Initial slice to bootstrap delivery and learning.',
      activityId: activities[0].id,
      iterationId: iterations[0].id,
      status: 'planned',
    });
  }

  return {
    activities,
    iterations,
    stories,
    nextActivityId: activities.length + 1,
    nextIterationId: iterations.length + 1,
    nextStoryId,
  };
}
