/**
 * Calculate the Euclidian distance between two points.
 *
 * @param p1 First point
 * @param p2 Second point
 */
export const calcDistance = ({ x: ax, y: ay }, { x: bx, y: by }) =>
  Math.sqrt(Math.abs((ax - bx) ** 2) + Math.abs((ay - by) ** 2));

/**
 * Calculate a route's cost as the sum of the distances between each point.
 *
 * @param route
 */
export const calcCost = route =>
  Math.round(
    route.reduce(
      (acc, point, i) =>
        acc +
        calcDistance(point, i === 0 ? route[route.length - 1] : route[i - 1]),
      0
    )
  );
