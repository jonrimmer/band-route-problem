import { calcCost } from './route.js';
import { Point, Result } from './model.js';
import { getRouteFromIndex } from './nearest-neighbor.js';

const INIITAL_TEMP = 100;
const COOLING_RATE = 0.999999;
const MIN_TEMP = 1;

/**
 * Standard SA probability function: Accept all better solutions,
 * and worse solutions with a probability scaled by delta and time.
 *
 * @param temp The current temperature.
 * @param delta Delta between the candidate's cost and the current best.
 */
export const prob = (temp: number, delta: number) => {
  return delta < 0 || Math.exp(-delta / temp) >= Math.random();
};

/**
 * Performs an in-place swap of two random points in a route.
 *
 * @param result The route to perform the swap on.
 * @param maxSwapDistance The maximum allowed distance between the two points.
 */
export const swapPoints = (result: number[], maxSwapDistance: number) => {
  const swapDistance = Math.ceil(Math.random() * maxSwapDistance);
  const i1 = Math.floor(Math.random() * result.length);
  const i2 = (i1 + swapDistance) % result.length;

  const temp = result[i1];
  result[i1] = result[i2];
  result[i2] = temp;
};

/**
 * Produces a new candidate route by randomly altering the original.
 * The amount that the candidate is modified is scaled by the current
 * temperature, with higher temperatures producing larger changes.
 *
 * @param original The original route.
 * @param temp The current temperate.
 */
export const generateCandidate = (original: number[], temp: number) => {
  // We want to swap more and further points at higher temperatures.
  const scaledTemp = (temp / INIITAL_TEMP) * original.length;
  const maxSwapCount = Math.ceil(scaledTemp * 0.25);
  const maxSwapDistance = Math.ceil(scaledTemp);

  let result = original.slice();
  const swapCount = Math.ceil(Math.random() * maxSwapCount);

  for (let s = 0; s < swapCount; s++) {
    swapPoints(result, maxSwapDistance);
  }

  return result;
};

/**
 * Search for an optimum route using simulated annealling.
 *
 * @param points The points to visit.
 */
export function* simulatedAnnealing(points: Point[]): IterableIterator<Result> {
  let currentTemp = INIITAL_TEMP;

  // Create initial route visiting each point in turn.
  let route = points.map((_, i) => i);
  // let route = getRouteFromIndex(points, 0);
  let energy = calcCost(points, route);

  while (currentTemp > MIN_TEMP) {
    const candidate = generateCandidate(route, Math.ceil(currentTemp));
    const newEnergy = calcCost(points, candidate);

    if (prob(currentTemp, newEnergy - energy)) {
      energy = newEnergy;
      route = candidate;
    }

    yield { route, bestCost: energy, stats: { currentTemp } };

    currentTemp *= COOLING_RATE;
  }

  yield { route, bestCost: energy, stats: { currentTemp } };
}
