import { getRoute } from './nearest-neighbor.js';
import { calcCost, Point } from './route.js';

const pointsCanvas = document.getElementById('points') as HTMLCanvasElement;
const routeCanvas = document.getElementById('route') as HTMLCanvasElement;
const bestCost = document.getElementById('bestCost') as HTMLSpanElement;

const ptsCtx = pointsCanvas.getContext('2d')!;
const rtCtx = routeCanvas.getContext('2d')!;

let width = 0;
let height = 0;

let scaleX: (v: number) => number;
let scaleY: (v: number) => number;

let points: Point[];

const POINT_RADIUS = 3;
const POINT_STYLE = 'lightgray';
const HOME_STYLE = 'blue';

const LINE_STYLE = 'green';

const setPoints = (pts: Point[]) => {
  points = pts;
  let maxX = 0;
  let maxY = 0;

  points.forEach(({ x, y }) => {
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });

  let padX = maxX * 0.02;
  let padY = maxY * 0.02;

  maxX += padX * 2;
  maxY += padY * 2;

  scaleX = x => (x / maxX) * width;
  scaleY = y => (y / maxY) * height;
};

const renderPoints = () => {
  ptsCtx.clearRect(0, 0, width, height);

  points.forEach(({ x, y }, i) => {
    ptsCtx.fillStyle = i == 0 ? HOME_STYLE : POINT_STYLE;
    ptsCtx.beginPath();
    ptsCtx.arc(scaleX(x), scaleY(y), POINT_RADIUS, 0, 2 * Math.PI, false);
    ptsCtx.fill();
  });
};

const renderRoute = () => {
  const route = getRoute(points);

  bestCost.textContent = `${calcCost(points, route)}`;

  rtCtx.clearRect(0, 0, width, height);

  rtCtx.strokeStyle = LINE_STYLE;

  // Home
  const { x: ox, y: oy } = points[0];

  // Start at home
  rtCtx.moveTo(scaleX(ox), scaleY(oy));
  rtCtx.beginPath();

  route.forEach(i => {
    const { x, y } = points[i];
    rtCtx.lineTo(scaleX(x), scaleY(y));
  });

  // Return home
  rtCtx.lineTo(scaleX(ox), scaleY(oy));
  rtCtx.stroke();
};

const render = () => {
  renderPoints();
  renderRoute();
};

const resize = () => {
  const rect = pointsCanvas.getBoundingClientRect();
  width = rect.width;
  height = rect.height;
  routeCanvas.width = pointsCanvas.width = width;
  routeCanvas.height = pointsCanvas.height = height;
  render();
};

const pointsData = document.getElementById('points400') as HTMLScriptElement;
setPoints(JSON.parse((pointsData.textContent || '[]').trim()));

requestAnimationFrame(resize);

window.addEventListener('resize', resize);
