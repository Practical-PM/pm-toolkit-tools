// localStorage service for persisting waterfall configurations

const STORAGE_PREFIX = 'waterfall-'
const MAX_WATERFALLS = 3

/**
 * Generates a unique ID for a waterfall
 */
function generateWaterfallId() {
  return `waterfall-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Loads all waterfalls from localStorage
 */
export function loadWaterfalls() {
  try {
    const waterfalls = []
    
    for (let i = 0; i < MAX_WATERFALLS; i++) {
      const key = `${STORAGE_PREFIX}${i}`
      const stored = localStorage.getItem(key)
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          
          // Validate structure
          if (
            typeof parsed.id === 'string' &&
            typeof parsed.name === 'string' &&
            ['currency', 'percentage', 'number'].includes(parsed.metricType) &&
            typeof parsed.baseline === 'number' &&
            (parsed.target === null || typeof parsed.target === 'number') &&
            (parsed.currency === undefined || ['USD', 'GBP', 'EUR'].includes(parsed.currency)) &&
            Array.isArray(parsed.initiatives) &&
            parsed.initiatives.every(
              (item) =>
                typeof item.id === 'string' &&
                typeof item.name === 'string' &&
                typeof item.valueChange === 'number'
            )
          ) {
            // Backward compatibility: default isReverse to false if missing
            if (typeof parsed.isReverse !== 'boolean') {
              parsed.isReverse = false
            }
            waterfalls.push(parsed)
          }
        } catch (e) {
          console.error(`Failed to parse waterfall ${i}:`, e)
        }
      }
    }
    
    return waterfalls
  } catch (error) {
    console.error('Failed to load waterfalls from localStorage:', error)
    return []
  }
}

/**
 * Saves a waterfall to localStorage
 */
export function saveWaterfall(waterfall, index) {
  try {
    if (index < 0 || index >= MAX_WATERFALLS) {
      throw new Error(`Invalid waterfall index: ${index}`)
    }
    
    const key = `${STORAGE_PREFIX}${index}`
    localStorage.setItem(key, JSON.stringify(waterfall))
  } catch (error) {
    console.error('Failed to save waterfall to localStorage:', error)
  }
}

/**
 * Deletes a waterfall from localStorage
 */
export function deleteWaterfall(index) {
  try {
    if (index < 0 || index >= MAX_WATERFALLS) {
      throw new Error(`Invalid waterfall index: ${index}`)
    }
    
    const key = `${STORAGE_PREFIX}${index}`
    localStorage.removeItem(key)
    
    // Shift remaining waterfalls down
    for (let i = index + 1; i < MAX_WATERFALLS; i++) {
      const currentKey = `${STORAGE_PREFIX}${i}`
      const nextKey = `${STORAGE_PREFIX}${i - 1}`
      const stored = localStorage.getItem(currentKey)
      
      if (stored) {
        localStorage.setItem(nextKey, stored)
        localStorage.removeItem(currentKey)
      } else {
        break
      }
    }
  } catch (error) {
    console.error('Failed to delete waterfall from localStorage:', error)
  }
}

/**
 * Clears all persisted waterfalls from localStorage
 */
export function clearWaterfalls() {
  try {
    for (let i = 0; i < MAX_WATERFALLS; i++) {
      localStorage.removeItem(`${STORAGE_PREFIX}${i}`)
    }
  } catch (error) {
    console.error('Failed to clear waterfalls from localStorage:', error)
  }
}

/**
 * Creates a new default waterfall configuration
 */
export function createDefaultWaterfall(name, metricType = 'number', currency = 'USD') {
  return {
    id: generateWaterfallId(),
    name,
    metricType,
    currency: metricType === 'currency' ? currency : undefined,
    baseline: 0,
    target: null,
    isReverse: false,
    initiatives: [],
  }
}
