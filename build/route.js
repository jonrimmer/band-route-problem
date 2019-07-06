import { Method } from './model.js';
import { simulatedAnnealing } from './simulated-annealing.js';
import { nnSimple, nnExhaustive } from './nearest-neighbor.js';
import { points } from './points.js';
import { bestCost, routeSvg, stats, runBtn } from './ui.js';
import { routeToSvg } from './render.js';
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
let getRoute;
export const setMethod = (method) => {
    switch (method) {
        case Method.NearestNeighbor:
            getRoute = nnSimple;
            break;
        case Method.ExhaustiveNearestNeighbor:
            getRoute = nnExhaustive;
            break;
        case Method.SimulatedAnnealing:
            getRoute = simulatedAnnealing;
            break;
    }
};
let running = false;
let currentFrame;
export const renderRoute = () => {
    if (running) {
        running = false;
        runBtn.innerText = 'Run';
        if (currentFrame) {
            clearTimeout(currentFrame);
        }
        return;
    }
    const iterator = getRoute(points.data);
    running = true;
    runBtn.innerText = 'Stop';
    const renderFrame = () => {
        const curr = iterator.next();
        if (curr.value) {
            bestCost.textContent = `${curr.value.bestCost}`;
            routeSvg.innerHTML = routeToSvg(points.data, curr.value.route);
            stats.innerText = Object.entries(curr.value.stats)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n');
        }
        if (running && !curr.done) {
            currentFrame = window.setTimeout(renderFrame, 0);
        }
        else {
            running = false;
            runBtn.innerText = 'Run';
        }
    };
    renderFrame();
};
export const clearRoute = () => {
    routeSvg.innerHTML = '';
};
