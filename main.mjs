
const pointsCanvas = document.getElementById('points');
const routeCanvas = document.getElementById('route');
const ptsCtx = pointsCanvas.getContext('2d');
const rtCtx = routeCanvas.getContext('2d');

let renderHeight;
let width = 0;
let height = 0;

let scaleX;
let scaleY;

let points;

const POINT_RADIUS = 3;
const POINT_STYLE = 'lightgray';

const setPoints = (pts) => {
  points = pts
  let maxX = 0;
  let maxY = 0;

  points.forEach(({ x, y }) => {
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });

  let padX = maxX * 0.02;
  let padY = maxY * 0.02;

  maxX += (padX * 2);
  maxY += (padY * 2);

  scaleX = x => (x / maxX) * width;
  scaleY = y => (y / maxY) * height;
}

const renderPoints = () => {
  ptsCtx.clearRect(0, 0, width, height);

  ptsCtx.fillStyle = POINT_STYLE;

  points.forEach(({x, y}) => {
    ptsCtx.beginPath();
    ptsCtx.arc(scaleX(x), scaleY(y), POINT_RADIUS, 0, 2 * Math.PI, false);
    ptsCtx.fill();
  });
}

const renderRoute = () => {
  
}

const render = () => {
  renderPoints();
  renderRoute();
}

const resize = () => {
  const rect = pointsCanvas.getBoundingClientRect();
  width = rect.width;
  height = rect.height;
  routeCanvas.width = pointsCanvas.width = width;
  routeCanvas.height = pointsCanvas.height = height;
  render();
}

setPoints(JSON.parse(document.getElementById('pointsData').textContent.trim()));

requestAnimationFrame(resize);

window.addEventListener('resize', resize);