import { calcDistance } from './route.mjs';

export const getRoute = points => {
  let current = points[0];
  const result = [0];

  const unvisited = Array.from({ length: points.length }, (_, i) => i);

  while (unvisited.length > 0) {
    let nearestIndex = -1;
    let nearestDistance = Number.POSITIVE_INFINITY;

    // Find the nearest unvisited point.
    for (let i = 0; i < unvisited.length; i++) {
      const candidate = points[unvisited[i]];
      const distance = calcDistance(current, candidate);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    const nearestPoint = unvisited[nearestIndex];

    current = points[nearestPoint];
    result.push(nearestPoint);
    unvisited.splice(nearestIndex, 1);
  }

  // Return to start.
  result.push(0);

  return result;
};
