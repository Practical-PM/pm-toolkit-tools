const STORAGE_KEY = 'double-diamond-data-v1';

export const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save Double Diamond data:', error);
  }
};

export const loadFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.phases)) {
      return null;
    }

    return {
      phases: parsed.phases,
      nextItemId: typeof parsed.nextItemId === 'number' ? parsed.nextItemId : 1,
    };
  } catch (error) {
    console.error('Failed to load Double Diamond data:', error);
    return null;
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear Double Diamond data:', error);
  }
};
