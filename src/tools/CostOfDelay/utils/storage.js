const STORAGE_KEY = 'pm-toolkit-cost-of-delay-v1';

export function saveCostOfDelayState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save Cost of Delay state:', error);
  }
}

export function loadCostOfDelayState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to load Cost of Delay state:', error);
    return null;
  }
}

export function clearCostOfDelayState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear Cost of Delay state:', error);
  }
}
