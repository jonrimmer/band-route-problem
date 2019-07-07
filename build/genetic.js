import { calcCost } from './route.js';
import { swapPoints } from './simulated-annealing.js';
const POPULATION_SIZE = 1000;
const GENERATIONS = 10000;
const TOURNAMENT_SIZE = 0.01;
const CROSSOVER_RATE = 0.7;
const MUTATION_CHANCE = 0.01;
const MUTATION_AMOUNT = 0.01;
const ELITISM = 0.01;
// Sort routes in descending order of fitness.
const fitnessSort = (a, b) => a.fitness - b.fitness;
/**
 * Peforms an in-place Fisher-Yates shuffle of the array.
 *
 * @param arr The array to shuffle.
 */
export const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * i);
        const temp = arr[i];
        arr[i] = arr[r];
        arr[r] = temp;
    }
    return arr;
};
/**
 * Create an initial population of random routes.
 *
 * @param points The points to visit.
 * @param size Number of individuals in the population.
 */
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
/**
 * Crossover operator function. A randomly sized "window" is selected, and
 * the points it contains in each parent is copied to one of the offspring.
 * The remaining empty slots are then filled with points from the opposite
 * parent, skipping those that were copied in the original window.
 *
 * @param points The points to visit.
 * @param parentA The first parent.
 * @param parentB The second part.
 */
export const crossover = (points, parentA, parentB) => {
    const child1 = [];
    const child2 = [];
    // Calc the crossover window:
    const startIndex = Math.floor(Math.random() * points.length);
    const endIndex = startIndex + Math.ceil(Math.random() * (points.length - startIndex));
    const windowSize = endIndex - startIndex;
    // Copy the window from parent A into 1:
    child1.push(...parentA.route.slice(startIndex, endIndex));
    // Copy the window from parent B into 2:
    child2.push(...parentB.route.slice(startIndex, endIndex));
    // Fill the remaining slots from the opposite parent:
    let ap = 0;
    let bp = 0;
    for (let i = 0; i < points.length - windowSize; i++) {
        while (child2.includes(parentA.route[ap])) {
            ap += 1;
        }
        if (i < startIndex) {
            child2.unshift(parentA.route[ap]);
        }
        else {
            child2.push(parentA.route[ap]);
        }
        while (child1.includes(parentB.route[bp])) {
            bp += 1;
        }
        if (i < startIndex) {
            child1.unshift(parentB.route[bp]);
        }
        else {
            child1.push(parentB.route[bp]);
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
/**
 * Searches for an optimum route using a genetic algorithm.
 *
 * @param points The points to visit.
 */
export function* genetic(points) {
    let population = createPopulation(points, POPULATION_SIZE);
    population.sort(fitnessSort);
    for (let g = 1; g <= GENERATIONS; g++) {
        console.debug(`Best route in population: ${population[0].fitness}`);
        console.debug(`Worst route in population: ${population[population.length - 1].fitness}`);
        const offspring = [];
        // Elitism
        const elitismCount = Math.round(POPULATION_SIZE * ELITISM);
        offspring.push(...population.slice(0, elitismCount));
        // Breeding
        const tourneySize = Math.round(POPULATION_SIZE * TOURNAMENT_SIZE);
        // Tournament selection
        for (let i = POPULATION_SIZE - elitismCount; i > 0; i -= 2) {
            const tourney1 = shuffle(population).slice(0, tourneySize);
            tourney1.sort(fitnessSort);
            const first = tourney1[0];
            const tourney2 = shuffle(population).slice(0, tourneySize);
            tourney1.sort(fitnessSort);
            const second = tourney2[0];
            if (Math.random() > CROSSOVER_RATE) {
                // Add recombined offspring.
                offspring.push(...crossover(points, first, second));
            }
            else {
                // Add to offspring unchanged.
                offspring.push({
                    route: first.route.slice(0),
                    fitness: 0 // Calc this later after mutation.
                }, {
                    route: second.route.slice(0),
                    fitness: 0 // Calc this later after mutation.
                });
            }
        }
        // Mutation
        for (let i = elitismCount; i < POPULATION_SIZE; i++) {
            if (Math.random() < MUTATION_CHANCE + g / GENERATIONS) {
                for (let s = Math.ceil(points.length * MUTATION_AMOUNT); s > 0; s--) {
                    swapPoints(offspring[i].route, 2);
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
