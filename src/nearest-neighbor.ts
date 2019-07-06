import { calcDistance, calcCost, Point } from './route.js';

export const getRoute = (points: Point[]) => {
  let bestCost = Number.POSITIVE_INFINITY;
  let bestRoute: number[] = [];

  // We run the NN repeatedly, trying each point as the "starting point".
  for (let startIndex = 0; startIndex < points.length; startIndex++) {
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

    // Return to the start

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
