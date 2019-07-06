import { Point } from './route.js';

export const pointsToSvg = (points: Point[]) => {
  return points
    .map(
      ({ x, y }, i) =>
        `<circle class="${
          i === 0 ? 'start' : 'point'
        }" cx="${x}" cy="${y}" r="${i === 0 ? 5 : 3}" />`
    )
    .join('');
};

export const routeToSvg = (points: Point[], route: number[]) => {
  return route
    .map((p, i) => {
      const { x: x1, y: y1 } = points[p];
      const { x: x2, y: y2 } = points[
        i === route.length - 1 ? route[0] : route[i + 1]
      ];

      return `<line class="link" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
    })
    .join('');
};
