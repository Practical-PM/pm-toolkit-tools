export const defaultData = {
  activities: [
    {
      id: 1,
      name: 'User Authentication',
      description: 'Sign up, login, and account management',
    },
    {
      id: 2,
      name: 'Product Discovery',
      description: 'Browse and search for products',
    },
    {
      id: 3,
      name: 'Checkout & Payment',
      description: 'Complete purchase and payment processing',
    },
  ],
  iterations: [
    {
      id: 1,
      name: 'MVP',
      date: '2025-Q1',
    },
    {
      id: 2,
      name: 'Iteration 2',
      date: '2025-Q2',
    },
    {
      id: 3,
      name: 'Iteration 3',
      date: '2025-Q3',
    },
  ],
  stories: [
    {
      id: 1,
      title: 'Email/Password Sign Up',
      description: 'Basic email and password registration',
      activityId: 1,
      iterationId: 1,
      status: 'done',
    },
    {
      id: 2,
      title: 'Social Login',
      description: 'Sign in with Google and Facebook',
      activityId: 1,
      iterationId: 2,
      status: 'in-progress',
    },
    {
      id: 3,
      title: 'Product Search',
      description: 'Search products by name and category',
      activityId: 2,
      iterationId: 1,
      status: 'done',
    },
    {
      id: 4,
      title: 'Product Filters',
      description: 'Filter by price, rating, and attributes',
      activityId: 2,
      iterationId: 2,
      status: 'planned',
    },
    {
      id: 5,
      title: 'Shopping Cart',
      description: 'Add items to cart and view cart',
      activityId: 3,
      iterationId: 1,
      status: 'done',
    },
    {
      id: 6,
      title: 'Payment Processing',
      description: 'Credit card and PayPal integration',
      activityId: 3,
      iterationId: 2,
      status: 'in-progress',
    },
  ],
  nextActivityId: 4,
  nextStoryId: 7,
  nextIterationId: 4,
};

