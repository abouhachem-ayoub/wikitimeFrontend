interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: PerformanceMemory;
}

interface WindowWithMemory extends Window {
  performance: PerformanceWithMemory;
}

/**
 * Gets the current memory usage in MB
 * @returns Memory usage in MB as a string, or empty string if not available
 */
export const getMemoryUsage = (): string => {
  const windowWithMemory = window as WindowWithMemory;
  if (windowWithMemory.performance?.memory) {
    return (windowWithMemory.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
  }
  return '';
}; 
