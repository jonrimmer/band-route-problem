import { shuffle } from './genetic.js';

test('shuffle', () => {
  const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  let firstSame = 0;
  let lastSame = 0;

  for (let i = 0; i < 100; i++) {
    const arr = shuffle(data);

    if (arr[0] === 0) {
      firstSame += 1;
    }

    if (arr[arr.length - 1] === 10) {
      lastSame += 1;
    }
  }

  // If we're returning the same digits first and last each time there's a problem.
  expect(firstSame).not.toBe(100);
  expect(lastSame).not.toBe(100);
});
