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
    id: 'competency-scoring',
    title: 'Score Your Competencies',
    text: 'Click on any cell in the matrix to rate yourself from 1-5 on each competency. The scale goes from "Novice" to "Expert" - be honest with yourself for the most accurate assessment.',
    attachTo: {
      element: '.competency-matrix',
      on: 'left',
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
    id: 'add-competency',
    title: 'Add Custom Competencies',
    text: 'Click this button to add your own competencies to the assessment. You can customize the framework to match your specific role, organization, or career goals.',
    attachTo: {
      element: '.add-competency-btn',
      on: 'bottom',
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
    id: 'expand-details',
    title: 'View Level Characteristics',
    text: 'Click the arrow button next to any competency to expand and see detailed descriptions for each skill level (1-5). You can also edit these descriptions to match your organization\'s definitions.',
    attachTo: {
      element: '.expand-btn',
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
    id: 'radar-chart',
    title: 'Visualize Your Profile',
    text: 'As you score competencies, a radar chart will appear showing your strengths and development areas. This visual representation helps you quickly identify patterns and balance across different skill dimensions.',
    attachTo: {
      element: '.radar-chart-container',
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
    id: 'insights-export',
    title: 'Get Insights & Export Results',
    text: 'After scoring, the Insights section shows your overall score, top strengths, and development areas. Use the Actions section to export your results as PNG, PDF, or copy to clipboard for sharing with your manager or personal development planning.',
    attachTo: {
      element: '.insights-summary',
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
