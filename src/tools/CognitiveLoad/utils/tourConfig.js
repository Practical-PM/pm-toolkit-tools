import Shepherd from 'shepherd.js';

export const createTour = () => {
  return new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: {
        enabled: true,
      },
      classes: 'shepherd-theme-custom',
      scrollTo: { behavior: 'smooth', block: 'center' },
      when: {
        show: function() {
          // Add any custom logic when step is shown
        },
      },
    },
  });
};

export const getTourSteps = () => [
  {
    id: 'cognitive-load-meter',
    title: 'Cognitive Load Score',
    text: 'This meter shows your team\'s current cognitive load score out of 100. The score is calculated from three factors: Systems Load (systems your team owns), Teams Load (collaborations with other teams), and Team Capacity (based on team size). Lower scores indicate manageable load, while higher scores suggest your team may be overloaded.',
    attachTo: {
      element: '.cognitive-load-meter',
      on: 'bottom',
    },
    buttons: [
      {
        text: 'Skip',
        action: function() {
          this.cancel();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: function() {
          this.next();
        },
        classes: 'shepherd-button-primary',
      },
    ],
  },
  {
    id: 'team-config',
    title: 'Configure Your Team',
    text: 'Start by setting your team\'s name and size. Team size affects capacity - smaller teams are more efficient per person but have less parallelism, while larger teams have more capacity but incur coordination overhead. Adjust the slider to see how team size impacts efficiency.',
    attachTo: {
      element: '.team-config',
      on: 'right',
    },
    buttons: [
      {
        text: 'Back',
        action: function() {
          this.back();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: function() {
          this.next();
        },
        classes: 'shepherd-button-primary',
      },
    ],
  },
  {
    id: 'systems-management',
    title: 'Add Systems',
    text: 'Click "Manage Systems" to add the software systems your team builds or maintains. For each system, assign a complexity level (1-5). Systems contribute to cognitive load - the more systems and higher complexity, the greater the load. You can mark systems as "burned out" if they\'re no longer actively maintained.',
    attachTo: {
      element: '.systems-list-panel',
      on: 'right',
    },
    buttons: [
      {
        text: 'Back',
        action: function() {
          this.back();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: function() {
          this.next();
        },
        classes: 'shepherd-button-primary',
      },
    ],
  },
  {
    id: 'teams-management',
    title: 'Add Collaborating Teams',
    text: 'Click "Manage Teams" to add other teams your team collaborates with. Each collaboration also has a complexity level (1-5). Inter-team collaborations add to cognitive load as they require communication, coordination, and context switching. Track all teams you regularly work with.',
    attachTo: {
      element: '.teams-list-panel',
      on: 'right',
    },
    buttons: [
      {
        text: 'Back',
        action: function() {
          this.back();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: function() {
          this.next();
        },
        classes: 'shepherd-button-primary',
      },
    ],
  },
  {
    id: 'force-graph',
    title: 'Visualize Your Network',
    text: 'The force-directed graph shows your team (center, orange), systems (rectangles, right), and collaborating teams (circles, left). Colors indicate complexity: green (low), yellow (medium), red (high). You can drag nodes to rearrange the visualization. This helps you see the relationships and complexity at a glance.',
    attachTo: {
      element: '.force-graph-container',
      on: 'top',
    },
    buttons: [
      {
        text: 'Back',
        action: function() {
          this.back();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: function() {
          this.next();
        },
        classes: 'shepherd-button-primary',
      },
    ],
  },
  {
    id: 'recommendations',
    title: 'Get Actionable Recommendations',
    text: 'Based on your cognitive load score and configuration, you\'ll see recommendations here for reducing load. These might include reducing system complexity, consolidating collaborations, adjusting team size, or marking systems as "burned out" if they\'re no longer actively maintained. Use these insights to optimize your team\'s capacity.',
    attachTo: {
      element: '.recommendations',
      on: 'top',
    },
    buttons: [
      {
        text: 'Back',
        action: function() {
          this.back();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Finish',
        action: function() {
          this.complete();
        },
        classes: 'shepherd-button-primary',
      },
    ],
  },
];

