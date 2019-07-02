import { calcDistance } from './route.mjs';

export const getRoute = points => {
  let current = points[0];
  const result = [current];

  const unvisited = points.slice(1);

  while (unvisited.length > 0) {
    let nearestIndex = -1;
    let nearestDistance = Number.POSITIVE_INFINITY;

    // Find the nearest unvisited point.
    for (let i = 0; i < unvisited.length; i++) {
      const distance = calcDistance(current, unvisited[i]);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    current = unvisited[nearestIndex];
    result.push(current);
    unvisited.splice(nearestIndex, 1);
  }

  // Return to start.
  result.push(points[0]);

  return result;
};
