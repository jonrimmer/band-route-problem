import { getRoute } from './nearest-neighbor.js';
import { calcCost } from './route.js';
import { pointsToSvg, routeToSvg } from './render.js';
//TS types are wrong: https://github.com/microsoft/TypeScript/issues/4689
const pointsSvg = document.getElementById('points');
const routeSvg = document.getElementById('route');
const bestCost = document.getElementById('bestCost');
let points;
const POINT_RADIUS = 3;
const POINT_STYLE = 'lightgray';
const HOME_STYLE = 'blue';
const LINE_STYLE = 'green';
const setPoints = (pts) => {
    points = pts;
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    points.forEach(({ x, y }) => {
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
    });
    const pad = 0.01;
    const width = maxX - minX;
    const height = maxX - minY;
    minX -= width * pad;
    minY -= height * pad;
    maxX += 2 * (width * pad);
    maxY += 2 * (height * pad);
    routeSvg.setAttribute('viewBox', `${minX} ${minY} ${maxX} ${maxY}`);
    pointsSvg.setAttribute('viewBox', `${minX} ${minY} ${maxX} ${maxY}`);
};
const renderPoints = () => {
    pointsSvg.innerHTML = pointsToSvg(points);
};
const renderRoute = () => {
    const route = getRoute(points);
    bestCost.textContent = `${calcCost(points, route)}`;
    routeSvg.innerHTML = routeToSvg(points, route);
};
const render = () => {
    renderPoints();
    renderRoute();
};
const pointsData = document.getElementById('points200');
setPoints(JSON.parse((pointsData.textContent || '[]').trim()));
requestAnimationFrame(render);
