import { calcDistance, calcCost, Point } from './route.js';

/**
 * Use NN heuristic to construct a route, starting from a given index.
 *
 * @param points Points to visit
 * @param startIndex Index of the point to start from.
 * @returns The constructed route.
 */
export const getRouteFromIndex = (points: Point[], startIndex: number) => {
  let current = points[startIndex];
  let route = [startIndex];
  const unvisited = Array.from({ length: points.length }, (_, i) => i);

  // Remove the start point.
  unvisited.splice(startIndex, 1);

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
    route.push(nearestPoint);
    unvisited.splice(nearestIndex, 1);
  }

  return route;
};

/**
 * Apply the NN heuristic to a set of points, starting at each point
 * in turn, to find the best route.
 *
 * @param points Points to visit
 * @returns The fastest route found via NN
 */
export const getRoute = (points: Point[]) => {
  let bestCost = Number.POSITIVE_INFINITY;
  let bestRoute: number[] = [];

  // We run the NN repeatedly, trying each point as the "starting point".
  for (let startIndex = 0; startIndex < points.length; startIndex++) {
    const route = getRouteFromIndex(points, startIndex);
    const cost = calcCost(points, route);

    if (cost < bestCost) {
      console.debug(`Starting at ${startIndex}. Cost ${cost} beat ${bestCost}`);
      bestCost = cost;
      bestRoute = route;
    } else {
      console.debug(
        `Starting at ${startIndex}. Cost ${cost} didn't beat ${bestCost}`
      );
    }
  }

  // Reformulate the route to put the real home point first.
  const homeIndex = bestRoute.indexOf(0);
  return bestRoute.slice(homeIndex).concat(bestRoute.slice(0, homeIndex));
};
