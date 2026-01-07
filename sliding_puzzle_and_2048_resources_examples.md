# **Project: "Brain Gym" Web App (Sliding Puzzle \+ 2048\)**

### **1\. Executive Summary**

This project aims to build a single web application hosting two classic logic games: a **3x3 Sliding Tile Puzzle** and **2048**. The app will feature a polished frontend for human players (e.g., children) and a "Solver Mode" toggle that uses backend algorithms (A\*, Minimax, or PPO) to provide hints or auto-solve the game.

**Target Stack:**

* **Frontend:** React / Next.js (for responsive, animation-friendly UI).  
* **Backend/Logic:** Python (PyTorch/TensorFlow) for RL agents, or JavaScript for lighter algorithmic solvers.  
* **Development Platform:** Google Antigravity (IDE) \+ Gemini 3 Pro Agents.

### ---

**2\. Game 1: 3x3 Sliding Tile Puzzle**

#### **Source Material (Frontend)**

* **Repository:** alexyuisingwu/sliding-puzzle-solver  
  * **Why:** A clean React-based web app that already includes an "upload image" feature (matching your library puzzle use case) and a solver visualization.  
  * **Tech:** React, HTML5 Canvas.

#### **Source Material (Logic & AI)**

* **Repository:** forestagostinelli/DeepCubeA  
  * **Why:** The "Gold Standard" for sliding puzzles. This repo implements the **DeepCubeA** algorithm which uses Deep Reinforcement Learning \+ Weighted A\* Search.  
  * **Use Case:** Use this for the "Heavy AI" backend if you want to train a model to solve complex states.  
* **Alternative (Lighter):** gojkovicmatija99/Sliding-puzzle-solver  
  * **Why:** Implements A\*, BFS, and DFS purely in JavaScript. Better for a client-side "Hint" button without needing a heavy Python server.

#### **Key Academic Papers**

* *Solving the Rubik's Cube with Deep Reinforcement Learning and Search* (Agostinelli et al., 2019\) – [arXiv:1905.10279](https://www.google.com/search?q=https://arxiv.org/abs/1905.10279)  
* *Sliding Puzzles Gym: A Scalable Benchmark* (Oliveira & Luz, 2024\) – Describes the environment logic.

### ---

**3\. Game 2: 2048**

#### **Source Material (Frontend)**

* **Repository:** mateuszsokola/2048-in-react  
  * **Why:** A highly polished, mobile-friendly clone of 2048 built with Next.js. Includes smooth animations which are critical for child engagement.  
  * **Tech:** React, Next.js, SCSS.

#### **Source Material (Logic & AI)**

* **Repository:** edwinmanalastas/2048-solver  
  * **Why:** Implements the **Minimax** algorithm with Alpha-Beta pruning. This is perfect for a "Hint" button (e.g., "AI suggests moving UP").  
* **Repository (RL Implementation):** tsangwpx/ml2048  
  * **Why:** A robust PPO (Proximal Policy Optimization) implementation. Use this if you want to demonstrate "AI Learning" (showing the AI playing against itself).

### ---

**4\. Google Antigravity Agent Prompts**

*Copy and paste the following block into the **Agent Manager** (Mission Control) in Antigravity to kickstart the development.*

#### **Phase 1: Scaffolding the App**

Plaintext

@Gemini /plan  
I need to build a React-based game hub called "Brain Gym" that hosts two games: a 3x3 Sliding Puzzle and 2048\. 

Please perform the following steps:  
1\. Initialize a new Next.js project structure.  
2\. For the Sliding Puzzle, reference the logic in \`alexyuisingwu/sliding-puzzle-solver\` (GitHub). Create a component \`SlidingPuzzle.js\` that allows a user to click tiles to move them.  
3\. For 2048, reference \`mateuszsokola/2048-in-react\`. Create a component \`Game2048.js\` that handles the grid merging logic.  
4\. Create a main Landing Page that lets the user select which game to play.

Constraint: Ensure the UI is colorful and child-friendly. Use large buttons and clear fonts.

#### **Phase 2: Integrating the Solvers**

Plaintext

@Gemini /code  
Now we need to add "Solver" capabilities.

1\. Sliding Puzzle: Port the A\* solver logic (Manhattan distance heuristic) from the referenced repo into a TypeScript utility function \`solveSlidingPuzzle(grid)\`. Add a "Hint" button to the UI that highlights the next correct tile to move.  
2\. 2048: Port the Minimax algorithm from \`edwinmanalastas/2048-solver\`. Add a toggle switch "AI Autoplay" that automatically makes moves every 500ms when enabled.

#### **Phase 3: Reinforcement Learning (Optional Expansion)**

Plaintext

@Gemini /plan  
I want to train a custom PPO agent for the 2048 game using the logic from \`tsangwpx/ml2048\`.   
1\. Create a Python service (FastAPI) in a \`/backend\` folder.  
2\. Set up a PyTorch environment to train a small model on the 2048 grid state.  
3\. Expose an endpoint \`/predict\_move\` that the React frontend can call to get the move from the Neural Network.

### ---

**5\. GitHub Repository List (for Forking)**

| Game | Component | Repository URL | License |
| :---- | :---- | :---- | :---- |
| **Sliding Puzzle** | Frontend/Solver | github.com/alexyuisingwu/sliding-puzzle-solver | MIT |
| **Sliding Puzzle** | RL/Deep Learning | github.com/forestagostinelli/DeepCubeA | MIT |
| **2048** | Frontend (Next.js) | github.com/mateuszsokola/2048-in-react | MIT |
| **2048** | Minimax Solver | github.com/edwinmanalastas/2048-solver | MIT |
| **2048** | RL (PPO) | github.com/tsangwpx/ml2048 | MIT |

---

Video Reference: Google Antigravity \- AI Agent Store  
This video provides a visual overview of the Antigravity interface and how to use the "Agent Manager" to assign the tasks listed above.