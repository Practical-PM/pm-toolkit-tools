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
    },
  });
};

export const getTourSteps = () => [
  {
    id: 'generate-example',
    title: 'Generate an Example Story Map',
    text: 'Use this to quickly spin up realistic sample activities, iterations, and stories so you can explore the workflow.',
    attachTo: {
      element: '.storymap-generate-example',
      on: 'bottom',
    },
    buttons: [
      {
        text: 'Skip',
        action: function () {
          this.cancel();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: function () {
          this.next();
        },
        classes: 'shepherd-button-primary',
      },
    ],
  },
  {
    id: 'add-controls',
    title: 'Structure Your Map',
    text: 'Start by adding Activities, Iterations, and Stories. These controls are now grouped and spaced for faster editing.',
    attachTo: {
      element: '.story-map-actions',
      on: 'bottom',
    },
    buttons: [
      {
        text: 'Back',
        action: function () {
          this.back();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action: function () {
          this.next();
        },
        classes: 'shepherd-button-primary',
      },
    ],
  },
  {
    id: 'map-grid',
    title: 'Story Map Grid',
    text: 'Click any activity, iteration, or story card to edit. Empty cells let you add a story directly in context.',
    attachTo: {
      element: '.story-map-section',
      on: 'top',
    },
    buttons: [
      {
        text: 'Back',
        action: function () {
          this.back();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Finish',
        action: function () {
          this.complete();
        },
        classes: 'shepherd-button-primary',
      },
    ],
  },
];
