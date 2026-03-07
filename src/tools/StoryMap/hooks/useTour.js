import { useEffect, useRef } from 'react';
import { createTour, getTourSteps } from '../utils/tourConfig';

export const useTour = () => {
  const tourRef = useRef(null);

  useEffect(() => {
    const tour = createTour();
    const steps = getTourSteps();

    steps.forEach((step) => {
      tour.addStep(step);
    });

    tourRef.current = tour;
  }, []);

  const startTour = () => {
    if (tourRef.current) {
      tourRef.current.start();
    }
  };

  return { startTour };
};
