import { useEffect, useRef, useState } from 'react';
import { createTour, getTourSteps } from '../utils/tourConfig';

const TOUR_COMPLETED_KEY = 'kanoModelTourCompleted';

export const useTour = () => {
  const tourRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const tour = createTour();
    tourRef.current = tour;

    const steps = getTourSteps();
    steps.forEach((step) => {
      tour.addStep(step);
    });

    tour.on('complete', () => {
      localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    });

    tour.on('cancel', () => {
      localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    });

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized || !tourRef.current) return;

    const hasCompletedTour = localStorage.getItem(TOUR_COMPLETED_KEY) === 'true';
    if (hasCompletedTour) return;

    setTimeout(() => {
      if (tourRef.current) {
        tourRef.current.start();
      }
    }, 500);
  }, [isInitialized]);

  const startTour = () => {
    if (tourRef.current) {
      tourRef.current.start();
    }
  };

  return { startTour };
};

