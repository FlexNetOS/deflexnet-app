# DeflexNet Application

## Project Description
DeflexNet is an experimentation environment for exploring dynamic load flexibility in modern energy systems. This repository contains the web application that visualizes simulated demand response scenarios, provides tools for analyzing flexibility potential, and demonstrates integration patterns for distributed energy resources. The goal is to offer researchers and engineers an accessible starting point for adapting DeflexNet concepts to their own grid innovation projects.

## Prerequisites
- Node.js 18 or later
- npm 9 or later
- Git for cloning the repository
- Optional: Docker (for containerized deployments) and a modern web browser for interacting with the UI

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/deflexnet-app.git
   cd deflexnet-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment defaults if needed and adjust values for your data sources:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the app in your browser at [http://localhost:3000](http://localhost:3000).

## Usage
- Explore the dashboard to review aggregated load flexibility indicators.
- Use scenario controls to toggle between forecast and real-time datasets.
- Inspect charts to understand ramping capabilities, curtailment windows, and cost impacts.
- Export datasets via the provided download actions to integrate DeflexNet outputs into downstream analytics tools.

## Contribution Guidelines
1. Create an issue describing planned changes before starting significant work.
2. Follow conventional commit messages and ensure linting/tests pass before opening a pull request.
3. Submit pull requests with contextual descriptions, screenshots for UI updates, and references to related research or datasets when applicable.
4. Reviewers focus on energy domain accuracy, accessibility of visualizations, and maintainability. Please incorporate review feedback promptly.

## Additional Resources
- [Issue tracker](https://github.com/your-org/deflexnet-app/issues)
- [Contribution guidelines](CONTRIBUTING.md)

