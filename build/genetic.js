import { calcCost } from './route.js';
import { swapPoints } from './simulated-annealing.js';
const POPULATION_SIZE = 1000;
const GENERATIONS = 10000;
const TOURNAMENT_SIZE = 0.01;
const MUTATION_CHANCE = 0.05;
const MUTATION_AMOUNT = 0.05;
const ELITISM = 0.05;
const fitnessSort = (a, b) => a.fitness - b.fitness;
export const shuffle = (arr) => {
    let result = arr.slice();
    for (let i = result.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * i);
        const temp = result[i];
        result[i] = result[r];
        result[r] = temp;
    }
    return result;
};
export const createPopulation = (points, size) => {
    // Create an ordered template that we'll shuffle to get random pop members.
    const ordered = points.map((_, i) => i);
    return Array.from({ length: size }, () => {
        const route = shuffle(ordered);
        return {
            route,
            fitness: calcCost(points, route)
        };
    });
};
export const crossover = (points, a, b) => {
    const child1 = [];
    const child2 = [];
    // Calc the crossover window:
    const startIndex = Math.floor(Math.random() * points.length);
    const endIndex = startIndex + Math.ceil(Math.random() * (points.length - startIndex));
    const windowSize = endIndex - startIndex;
    // Copy the window from a into 1:
    child1.push(...a.route.slice(startIndex, endIndex));
    // Copy the window from b into 2:
    child2.push(...b.route.slice(startIndex, endIndex));
    // Fill the remaining slots from the opposite parent:
    let ap = 0;
    let bp = 0;
    for (let i = 0; i < points.length - windowSize; i++) {
        while (child2.includes(a.route[ap])) {
            ap += 1;
        }
        if (i < startIndex) {
            child2.unshift(a.route[ap]);
        }
        else {
            child2.push(a.route[ap]);
        }
        while (child1.includes(b.route[bp])) {
            bp += 1;
        }
        if (i < startIndex) {
            child1.unshift(b.route[bp]);
        }
        else {
            child1.push(b.route[bp]);
        }
    }
    return [
        {
            route: child1,
            fitness: 0 // Calc this later after mutation.
        },
        {
            route: child2,
            fitness: 0 // Calc this later after mutation.
        }
    ];
};
export function* genetic(points) {
    let population = createPopulation(points, POPULATION_SIZE);
    for (let g = 1; g <= GENERATIONS; g++) {
        population.sort(fitnessSort);
        console.debug(`Best route in population: ${population[0].fitness}`);
        console.debug(`Worst route in population: ${population[population.length - 1].fitness}`);
        const offspring = [];
        // Elitism
        const elitismCount = Math.round(POPULATION_SIZE * ELITISM);
        offspring.push(...population.slice(0, elitismCount));
        // Breeding
        const tourneySize = Math.round(POPULATION_SIZE * TOURNAMENT_SIZE);
        for (let i = POPULATION_SIZE - elitismCount; i > 0; i -= 2) {
            // Tournament selection
            const tourney1 = shuffle(population).slice(0, tourneySize);
            tourney1.sort(fitnessSort);
            const first = tourney1[0];
            const tourney2 = shuffle(population).slice(0, tourneySize);
            tourney1.sort(fitnessSort);
            const second = tourney2[0];
            offspring.push(...crossover(points, first, second));
        }
        // Mutation
        for (let i = 2; i < POPULATION_SIZE; i++) {
            if (Math.random() < MUTATION_CHANCE) {
                for (let s = Math.ceil(points.length * MUTATION_AMOUNT); s > 0; s--) {
                    swapPoints(offspring[i].route, points.length);
                }
            }
        }
        offspring.forEach(o => (o.fitness = calcCost(points, o.route)));
        offspring.sort(fitnessSort);
        population = offspring;
        yield {
            route: population[0].route,
            bestCost: population[0].fitness,
            stats: {
                generation: g
            }
        };
    }
}
