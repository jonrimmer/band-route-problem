import { pointsToSvg } from './render.js';
import { routeSvg, pointsSvg } from './ui.js';
/**
 * Set the current points to render and operate on.
 *
 * @param points The x and y specification of the points.
 */
const setPoints = (points) => {
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
    renderPoints(points);
    return points;
};
/**
 * Render the current points.
 */
export const renderPoints = (points) => {
    pointsSvg.innerHTML = pointsToSvg(points);
};
/**
 * Load points from a URL.
 *
 * @param path A URL to a JSON data file.
 */
export const loadPoints = async (path) => {
    return fetch(path)
        .then(r => r.json())
        .then(setPoints);
};
