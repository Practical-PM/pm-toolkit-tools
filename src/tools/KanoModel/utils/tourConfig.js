import Shepherd from 'shepherd.js';

export const createTour = () => {
  return new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: { enabled: true },
      classes: 'shepherd-theme-custom',
      scrollTo: { behavior: 'smooth', block: 'center' },
    },
  });
};

export const getTourSteps = () => [
  {
    id: 'kano-map',
    title: 'Kano Satisfaction Map',
    text: 'This chart is your main workspace. Drag feature points to change fulfillment and reposition across category curves.',
    attachTo: {
      element: '.kano-chart-only-card',
      on: 'bottom',
    },
    buttons: [
      {
        text: 'Skip',
        action() {
          this.cancel();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action() {
          this.next();
        },
        classes: 'shepherd-button-primary',
      },
    ],
  },
  {
    id: 'kano-add',
    title: 'Add Features',
    text: 'Use Add to create a new feature. Set its name, category, and effort before placing it on the map.',
    attachTo: {
      element: '.kano-add-action',
      on: 'left',
    },
    buttons: [
      {
        text: 'Back',
        action() {
          this.back();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action() {
          this.next();
        },
        classes: 'shepherd-button-primary',
      },
    ],
  },
  {
    id: 'kano-edit',
    title: 'Edit Or Remove',
    text: 'Click any feature point to rename it or remove it from the analysis.',
    attachTo: {
      element: '.kano-chart-svg',
      on: 'top',
    },
    buttons: [
      {
        text: 'Back',
        action() {
          this.back();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Next',
        action() {
          this.next();
        },
        classes: 'shepherd-button-primary',
      },
    ],
  },
  {
    id: 'kano-origin',
    title: 'Kano Context',
    text: 'Use this reference section to explain the model origin and support alignment in feature-prioritization conversations.',
    attachTo: {
      element: '.kano-about',
      on: 'top',
    },
    buttons: [
      {
        text: 'Back',
        action() {
          this.back();
        },
        classes: 'shepherd-button-secondary',
      },
      {
        text: 'Finish',
        action() {
          this.complete();
        },
        classes: 'shepherd-button-primary',
      },
    ],
  },
];

