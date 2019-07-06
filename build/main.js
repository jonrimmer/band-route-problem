import { getRoute } from './nearest-neighbor.js';
import { calcCost } from './route.js';
import { pointsToSvg, routeToSvg } from './render.js';
import { routeSvg, pointsSvg, bestCost, selectData } from './ui.js';
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
    requestAnimationFrame(() => {
        render();
    });
};
const renderPoints = () => { };
const renderRoute = () => {
    const route = getRoute(points);
    bestCost.textContent = `${calcCost(points, route)}`;
    routeSvg.innerHTML = routeToSvg(points, route);
};
const render = () => {
    renderPoints();
    renderRoute();
};
const renderer = {
    renderRoute(route) {
        pointsSvg.innerHTML = pointsToSvg(points);
    }
};
const pointsData = document.getElementById('points200');
const loadPoints = async (path) => {
    const pointsJSON = await fetch(path).then(r => r.json());
    setPoints(pointsJSON);
};
selectData.addEventListener('change', () => {
    loadPoints(selectData.value);
});
loadPoints(selectData.value);
