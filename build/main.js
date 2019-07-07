import { selectData, selectMethod, runBtn, bestCost, routeSvg, stats } from './ui.js';
import { loadPoints } from './points.js';
import { Method } from './model.js';
import { nnSimple, nnExhaustive } from './nearest-neighbor.js';
import { simulatedAnnealing } from './simulated-annealing.js';
import { routeToSvg } from './render.js';
import { genetic } from './genetic.js';
let points = Promise.resolve([]);
let getRoute;
let running = false;
let currentFrame;
const loadMethod = () => {
    switch (selectMethod.value) {
        case Method.NearestNeighbor:
            getRoute = nnSimple;
            break;
        case Method.ExhaustiveNearestNeighbor:
            getRoute = nnExhaustive;
            break;
        case Method.SimulatedAnnealing:
            getRoute = simulatedAnnealing;
            break;
        case Method.Genetic:
            getRoute = genetic;
            break;
    }
};
selectMethod.addEventListener('change', loadMethod);
points = loadPoints(selectData.value);
loadMethod();
selectData.addEventListener('change', async () => {
    points = loadPoints(selectData.value);
    clearRoute();
});
runBtn.addEventListener('click', () => {
    run();
});
export const run = async () => {
    if (running) {
        running = false;
        runBtn.innerText = 'Run';
        if (currentFrame) {
            clearTimeout(currentFrame);
        }
        return;
    }
    const pts = await points;
    const iterator = getRoute(pts);
    running = true;
    runBtn.innerText = 'Stop';
    const renderFrame = () => {
        let mark = Date.now();
        let result = null;
        let curr;
        // Render at approximately 60fps:
        do {
            curr = iterator.next();
            if (curr.value) {
                result = curr.value;
            }
        } while (Date.now() - mark < 50 && !curr.done);
        if (result) {
            bestCost.textContent = `${result.bestCost}`;
            routeSvg.innerHTML = routeToSvg(pts, result.route);
            stats.innerText = Object.entries(result.stats)
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
