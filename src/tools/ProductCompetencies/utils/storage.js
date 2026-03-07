const STORAGE_KEY = 'pm-competencies-data';

export const saveToLocalStorage = (competencies) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(competencies));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
};

export const generateTextSummary = (competencies) => {
  const scored = competencies.filter(c => c.score !== null);
  if (scored.length === 0) {
    return 'No competencies have been scored yet.';
  }

  const average = (scored.reduce((sum, c) => sum + c.score, 0) / scored.length).toFixed(2);
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 3);
  const developmentAreas = sorted.slice(-3).reverse();

  let summary = `PM COMPETENCIES SELF-ASSESSMENT\n\n`;
  summary += `Overall Score: ${average}/5\n\n`;
  
  summary += `TOP STRENGTHS:\n`;
  strengths.forEach((c, i) => {
    summary += `${i + 1}. ${c.name}: ${c.score}/5\n`;
  });
  
  summary += `\nDEVELOPMENT AREAS:\n`;
  developmentAreas.forEach((c, i) => {
    summary += `${i + 1}. ${c.name}: ${c.score}/5\n`;
  });
  
  summary += `\nALL COMPETENCIES:\n`;
  competencies.forEach(c => {
    const scoreText = c.score !== null ? `${c.score}/5` : 'Not scored';
    summary += `- ${c.name}: ${scoreText}\n`;
  });

  return summary;
};

