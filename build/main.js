import { selectData, selectMethod, runBtn, bestCost, routeSvg, stats } from './ui.js';
import { loadPoints, renderPoints, points } from './points.js';
import { Method } from './model.js';
import { nnSimple, nnExhaustive } from './nearest-neighbor.js';
import { simulatedAnnealing } from './simulated-annealing.js';
import { routeToSvg } from './render.js';
selectData.addEventListener('change', async () => {
    await loadPoints(selectData.value);
    renderPoints();
    clearRoute();
});
selectMethod.addEventListener('change', async () => {
    setMethod(selectMethod.value);
});
async function load() {
    await loadPoints(selectData.value);
    renderPoints();
    setMethod(selectMethod.value);
}
load();
runBtn.addEventListener('click', () => {
    renderRoute();
});
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
