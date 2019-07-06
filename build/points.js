import { pointsToSvg } from './render.js';
import { routeSvg, pointsSvg } from './ui.js';
export const points = {
    data: []
};
const setPoints = (pts) => {
    points.data = pts;
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    points.data.forEach(({ x, y }) => {
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
export const renderPoints = () => {
    pointsSvg.innerHTML = pointsToSvg(points.data);
};
export const loadPoints = async (path) => {
    const pointsJSON = await fetch(path).then(r => r.json());
    setPoints(pointsJSON);
};
