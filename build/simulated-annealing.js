import { calcCost } from './route.js';
const INIITAL_TEMP = 100;
const COOLING_RATE = 0.999999;
const MIN_TEMP = 1;
export const prob = (temp, delta) => {
    return delta < 0 || Math.exp(-delta / temp) >= Math.random();
};
export const swapPoints = (result, maxSwapDistance) => {
    const swapDistance = Math.ceil(Math.random() * maxSwapDistance);
    const i1 = Math.floor(Math.random() * result.length);
    const i2 = (i1 + swapDistance) % result.length;
    const temp = result[i1];
    result[i1] = result[i2];
    result[i2] = temp;
};
export const generateCandidate = (original, temp) => {
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
export function* simulatedAnnealing(points) {
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
        yield { route: route, bestCost: energy, stats: { currentTemp } };
        currentTemp *= COOLING_RATE;
    }
    yield { route: route, bestCost: energy, stats: { currentTemp } };
}
