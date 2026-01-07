# Overview

## Welcome
Welcome to my games repository. I like to consider the logical aspects to games as well as algorithmic solutions to those games. Note that each game has it's own README file & folder and can be considered independent from other games. 

## Table of Contents
- [2048](apps/games/2048)
- [Acquire](apps/games/Acquire)
- [Mastermind](apps/games/Mastermind)
- [Queens](apps/games/Queens)
- [Random Event Poisson](apps/games/Random%20Event%20Poisson)
- [Sliding Block Puzzle - Rubiks](apps/games/Sliding%20Block%20Puzzle%20-%20Rubiks)
- [Wordle](apps/games/Wordle)
- [Risk](apps/games/Risk)


### 2048

A single-player sliding block puzzle played on a grid. The game uses numbered tiles that slide in four directions. When two tiles with the same number collide, they merge into one tile with the total value (e.g., 2+2=4). The objective is to combine tiles to create a tile with the number 2048. This game poses interesting challenges in state management and heuristic search algorithms for automated solvers.

### Acquire

A strategic board game involving the placement of tiles to form and expand corporations. Players buy stock in active chains and earn bonuses when chains merge. The game effectively models economic growth and mergers, offering a rich environment for implementing greedy algorithms or more complex strategies involving probability and asset valuation.
    
### Mastermind

A logic-based code-breaking game. The codemaker creates a secret pattern of colors, and the codebreaker tries to guess the pattern. Feedback is given for each guess indicating how many pegs are the correct color and position. This is a classic problem for investigating combinatorics, information theory, and constraint satisfaction algorithms.
    
### Queens

A classic component of the N-Queens puzzle, requiring the placement of $N$ queens on an $N \times N$ chessboard so that no two queens threaten each other. This means no two queens can share the same row, column, or diagonal. It serves as a quintessential example for exploring backtracking algorithms, constraint satisfaction problems, and recursive programming.
    
### Random Event Poisson

The goal of this app is to simulate the rolling of dice. We'd love a visual display to show the rolling of the dice, and for a first iteration its simple enough to just show the numbers. This app will not store data across sessions nor have any long persisting data memory.

Since we are replicating the pace that a human can roll the dice, we want to have a parameter that controls how quickly the dice can be rolled (default to 1 second and can go up to any number). Actually it's a time between rolls in seconds as a parameter because we likely only want to slow it down so more time transpires.  

We may want to generalize the app so the user can select number of dice and type of events they want to be able to receive alerts about (alert as defined in the web app, by a screen change event, more to be described).
    
### Sliding Block Puzzle - Rubiks

A category of permutation puzzles where the goal is to rearrange elements into a target configuration. This includes 2D sliding tiles and 3D rotational puzzles like the Rubik's Cube. These puzzles are formidable challenges for search algorithms due to their massive state spaces, making them ideal grounds for testing heuristics like Manhattan distance or pattern databases.
    
### Wordle

A word-guessing game relying on information theory. Players must identify a 5-letter secret word using feedback from guesses. The core challenge is to select words that maximize information gain (entropy) to narrow down the search space efficiently. It is a prime example of constraint satisfaction and optimal decision-making under uncertainty.
    
### Risk

A complex board game of global domination involving territory control, combat, and alliances. It combines graph theory (map connectivity), probability (dice roll outcomes), and game theory (multi-agent strategy). Programmatic solutions must handle stochastic elements and long-term planning against intelligent opponents.


