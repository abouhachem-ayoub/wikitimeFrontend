export const getAnimHash = (newX: number | string, zoomscales: {
  prevZoomScaleData: { id: number },
  newZoomScaleData: { id: number }
}) => {
  return `${newX}|${zoomscales.prevZoomScaleData.id}${zoomscales.newZoomScaleData.id}`;
};

export const checkAnimHash = (newX: number | string, child: any, zoomscales: {
  prevZoomScaleData: { id: number },
  newZoomScaleData: { id: number }
}) => {
  return child.target !== getAnimHash(newX, zoomscales);
};

export const averageDistance = (coords: number[]) => {
  if (coords.length < 2) return 0; // Если точек меньше 2, расстояние = 0

  const sorted = [...coords].sort((a, b) => a - b); // Сортируем по возрастанию
  const distances = sorted.slice(1).map((x, i) => x - sorted[i]); // Разницы между соседями
  const avg = distances.reduce((sum, d) => sum + d, 0) / distances.length; // Среднее расстояние

  return avg;
};
