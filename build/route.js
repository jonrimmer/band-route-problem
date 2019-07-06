/**
 * Calculate the Euclidian distance between two points.
 *
 * @param p1 First point
 * @param p2 Second point
 */
export const calcDistance = ({ x: ax, y: ay }, { x: bx, y: by }) => Math.sqrt(Math.abs((ax - bx) ** 2) + Math.abs((ay - by) ** 2));
/**
 * Calculate a route's cost as the sum of the distances between each point.
 *
 * @param route
 */
export const calcCost = (points, route) => Math.round(route.reduce((acc, p, i) => acc +
    calcDistance(points[p], i === 0 ? points[route[route.length - 1]] : points[route[i - 1]]), 0));
