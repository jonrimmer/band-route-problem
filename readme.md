# The Challenge

The year is 2092. A budding young vocalist and his band have just enough money to buy a hovercar and begin their tour. They have struck deals with multiple venues and can set their own tour schedule, any venue in any order. Can you help them find the shortest route to take to hit all cities to maximize their fuel budget?

We have provided some test data to begin mapping on the grid. Spend up to 4 hours creating your algorithm and display of optimal route(s). Fork this repository and make any notes and commentary at the bottom of the readme.

# The Tech

Please use JavaScript, HTML, and CSS to display the best route(s) the band can take. Let's assume the first data point is home, the point you originate from and must end at. It is up to you to display the route(s) your code chooses, graphical, textual, tabular or other. _Please do not use Angular, React, Vue, Ember, etc. We want to see the solve and the display of the data. You can use libraries that help display tabular or graphical data in the browser._

We will review the code with you, be prepared to discuss any choices of external libraries. If you need to use an external library, that's fine, please note it in the readme.md.

# The Data

Here is are some sample sets of data to use:

# Contact

If you have questions on the challenge, please contact Jared Sartin: jared@leftfieldlabs.com

# Candidate Notes:

To run the solution:

```
npm install
npm run start
```

Open http://localhost:8080 in a browser. The browser must support ES modules and other modern features (arrow functions,
generators, etc.). Chrome is recommended.

That implementation contains four algorithms for solving the problem:

## Simple Nearest Neighbour

Starts at the "home" city and proceeds to the closest unvisited city. When there are no unvisited cities left, it returns
home.

NN is fast and tends to produce a decent, albeit non-optimal solution in non-pathological cases, even for large numbers
of cities. One problem is the final trip home, as the end city may be very far away from the start, requiring a large jump.

## Exhaustive Nearest Neighbour

A modification of NN to begin the search at each city in turn. The best route is the normalised to start from the real
"home" city. This can help to minimise the final-jump problem and other minor inefficiencies.

## Simulated Annealing

A classic optimisation approach inspired by physical cooling processes. Attempts to close in on a good solution while
avoiding local minima by jumping around the search space a lot at first, then graduating towards smaller and more
conservative changes later.

Tends to outperform NN at small sizes, but eventually gets stuck in a local minima at at larger network sizes.

## Genetic

A basic GA with elitism, tournament selection, crossover, and mutation. Produces steady improvement, but slowly.

## Implementation

Each algorithm is implemented as a generator that `yield`s solutions. The `run()` function renders the latest of these
approximately every 50ms.

### Time-Tracking

- Setup and basic rendering: ~1 hour
- Nearest Neighbour: ~1 hour
- Exhaustive Nearest Neighbour: ~.5 hours
- Simulated Annealling: ~2 hours
- Genetic: ~ 2 hours
- Misc refactoring and fiddling: ~2 hours

Total: ~8.5 hours

## Possible Enhancements

I had various ideas for additional improvements, if I had the time:

- Expose annealing and genetic parameters such as cooling rate and population size in UI.
- Attempt to auto-optimise parameters based on network size.
- Move calculation into web workers and allow multi-core.
- Animatied route transitions.
- Implement ant-colony optimisation.
- Investigate alternative genetic crossover operators.
- Add fitness tracking chart to UI.
