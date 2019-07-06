import { pointsToSvg, routeToSvg } from './render.js';

const POINTS = [
  {
    x: 1,
    y: 2
  },
  {
    x: 3,
    y: 4
  }
];

test('pointsToSvg', () => {
  const svg = pointsToSvg(POINTS);

  expect(svg).toBeDefined();
  expect(svg.trim()).toEqual(
    `<circle class="start" cx="1" cy="2" r="5" />` +
      `<circle class="point" cx="3" cy="4" r="3" />`
  );
});

test('pointsToSvg', () => {
  const svg = routeToSvg(POINTS, [1, 0]);

  expect(svg).toBeDefined();
  expect(svg.trim()).toEqual(
    `<line class="link" x1="3" y1="4" x2="1" y2="2" />` +
      `<line class="link" x1="1" y1="2" x2="3" y2="4" />`
  );
});
