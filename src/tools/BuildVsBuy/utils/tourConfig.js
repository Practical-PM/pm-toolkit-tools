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
    id: 'add-domain',
    title: 'Add Your Domains',
    text: 'Click this button to add a new technical domain to your grid. You can add domains like "Authentication", "Email Service", or "Analytics".',
    attachTo: {
      element: '.btn-add',
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
    id: 'grid-interaction',
    title: 'Position Your Domains',
    text: 'Once you add domains, drag them around the grid to position them based on their complexity and differentiation. Click on a domain to edit its details.',
    attachTo: {
      element: '.build-vs-buy-grid',
      on: 'left',
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
    title: 'Get Strategic Recommendations',
    text: 'Based on where you place domains on the grid, you\'ll get strategic recommendations. The four quadrants represent different approaches: Buy, Tolerate, Build Selectively, and Invest Heavily.',
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

