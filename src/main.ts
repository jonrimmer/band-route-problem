import {
  selectData,
  selectMethod,
  runBtn,
  bestCost,
  routeSvg,
  stats
} from './ui.js';
import { loadPoints, renderPoints, points } from './points.js';
import { Method, RouteGenerator, Result } from './model.js';
import { nnSimple, nnExhaustive } from './nearest-neighbor.js';
import { simulatedAnnealing } from './simulated-annealing.js';
import { routeToSvg } from './render.js';
import { genetic } from './genetic.js';

selectData.addEventListener('change', async () => {
  await loadPoints(selectData.value);
  renderPoints();
  clearRoute();
});

selectMethod.addEventListener('change', async () => {
  setMethod(selectMethod.value as Method);
});

async function load() {
  await loadPoints(selectData.value);
  renderPoints();
  setMethod(selectMethod.value as Method);
}

load();

runBtn.addEventListener('click', () => {
  renderRoute();
});

let getRoute: RouteGenerator;

export const setMethod = (method: Method) => {
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
    case Method.Genetic:
      getRoute = genetic;
      break;
  }
};

let running = false;
let currentFrame: number | null;

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
    let mark = Date.now();
    let result: Result | null = null;
    let curr;

    // Render at approximately 60fps:
    do {
      curr = iterator.next();

      if (curr.value) {
        result = curr.value;
      }
    } while (Date.now() - mark < 62 && !curr.done);

    if (result) {
      bestCost.textContent = `${result.bestCost}`;
      routeSvg.innerHTML = routeToSvg(points.data, result.route);
      stats.innerText = Object.entries(result.stats)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    }

    if (running && !curr.done) {
      currentFrame = window.setTimeout(renderFrame, 0);
    } else {
      running = false;
      runBtn.innerText = 'Run';
    }
  };

  renderFrame();
};

export const clearRoute = () => {
  routeSvg.innerHTML = '';
};
