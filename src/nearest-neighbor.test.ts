import { getRouteFromIndex } from './nearest-neighbor.js';
import { Point } from './model.js';

const POINTS: Point[] = require('../data/points40.json');

test('getRouteFromIndex', () => {
  const route = getRouteFromIndex(POINTS, 0);

  // Should visit every point.
  expect(route.length).toBe(POINTS.length);

  const indexesFound = POINTS.map(() => false);

  route.forEach(i => {
    // Should only visit each point once.
    expect(indexesFound[i]).toBe(false);
    indexesFound[i] = true;
  });
});
