export const defaultData = {
  phases: [
    {
      id: 'discover',
      title: '1. Broad Business Problems',
      subtitle: 'Discover',
      items: [
        { id: 1, text: 'Customer onboarding takes too long and causes churn.' },
        { id: 2, text: 'PMs and engineers duplicate effort across planning tools.' },
      ],
    },
    {
      id: 'define',
      title: '2. Focus Problem',
      subtitle: 'Define',
      items: [
        { id: 3, text: 'Reduce onboarding time for new customers by 30%.' },
      ],
    },
    {
      id: 'develop',
      title: '3. Possible Solutions',
      subtitle: 'Develop',
      items: [
        { id: 4, text: 'Guided setup wizard with role-based defaults.' },
        { id: 5, text: 'In-product checklist with progress nudges.' },
      ],
    },
    {
      id: 'decide',
      title: '4. Solutions To Test',
      subtitle: 'Decide',
      items: [
        { id: 6, text: 'A/B test guided setup wizard against current onboarding flow.' },
      ],
    },
  ],
  nextItemId: 7,
};

export const emptyPhases = defaultData.phases.map((phase) => ({
  ...phase,
  items: [],
}));
