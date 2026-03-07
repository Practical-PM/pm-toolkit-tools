import { useEffect, useRef, useState } from 'react';
import { createTour, getTourSteps } from '../utils/tourConfig';

const TOUR_COMPLETED_KEY = 'competenciesTourCompleted';

export const useTour = () => {
  const tourRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Create tour instance
    const tour = createTour();
    tourRef.current = tour;

    // Add steps to tour
    const steps = getTourSteps();
    steps.forEach(step => {
      tour.addStep(step);
    });

    // Track tour completion
    tour.on('complete', () => {
      localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    });

    // Track tour cancellation
    tour.on('cancel', () => {
      // Optionally mark as completed even if cancelled
      localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    });

    setIsInitialized(true);

    // Note: Shepherd.js automatically cleans up when tour is cancelled or completed
    // No manual cleanup needed on unmount
  }, []);

  useEffect(() => {
    if (isInitialized && tourRef.current) {
      // Check if user has already completed tour
      const hasCompletedTour = localStorage.getItem(TOUR_COMPLETED_KEY) === 'true';

      // Auto-start tour on first visit
      if (!hasCompletedTour) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          if (tourRef.current) {
            tourRef.current.start();
          }
        }, 500);
      }
    }
  }, [isInitialized]);

  const startTour = () => {
    if (tourRef.current) {
      tourRef.current.start();
    }
  };

  return { startTour };
};
