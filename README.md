# deflexnet-app

Self-hosted agent playground featuring a CUDA-enabled vLLM model server, a FastAPI
agent gateway wired to a constitutional governance pack, and a React builder UI.

## Prerequisites

* Docker with the NVIDIA Container Toolkit (`nvidia-smi` should succeed)
* CUDA-capable GPU with driver version compatible with CUDA 12.x
* Optional developer tooling: Node.js 20, Python 3.11, pipx, poetry, uv (also
  provided inside the devcontainer)

Run the built-in environment validation before starting the stack:

```bash
./scripts/ark check
```

The command verifies Docker connectivity, GPU visibility, and that all runtime
ports are free.

## One-command bring-up

```bash
./scripts/ark up
```

`ark` ensures a `.env` file exists, builds the Docker images, and starts the
compose stack in the background. Bring everything down with:

```bash
./scripts/ark down
```

Tail runtime logs with:

```bash
./scripts/ark logs
```

You can perform the same actions with vanilla Docker Compose:

```bash
docker compose --env-file .env up --build
```

## Services & health checks

* Gateway (FastAPI) — <http://localhost:8000/healthz>
* vLLM OpenAI-compatible API — <http://localhost:8001/v1/models>
* Builder UI — <http://localhost:3000>
* MinIO console — <http://localhost:9001>

Once the stack is running, verify the key endpoints:

```bash
curl http://localhost:8000/healthz
curl http://localhost:8001/v1/models
```

## Court trifecta demo

The governance pack mounted into the gateway powers a stubbed `/court/trifecta`
endpoint. Submit a plan using the helper CLI:

```bash
./scripts/ark court examples/trifecta_example.json
```

The command pretty-prints the verdict and returns a success exit code when the
response is `PASS` or `PASS_WITH_CONDITIONS`.

## Builder walkthrough

Open the builder UI at [http://localhost:3000](http://localhost:3000). The demo
screen loads the FastAPI health endpoint to confirm connectivity, exposes the
constitutional pack sections, and lets you tweak the JSON plan before invoking
the court trifecta endpoint. Verdict, summary, and pack contents render directly
in the browser.

## Devcontainer

The `.devcontainer/` folder ships a CUDA-ready development environment powered by
`nvidia/cuda:12.1.1-runtime-ubuntu22.04`. It includes Python 3.11, Node.js 20,
pipx, poetry, uv, make, git, git-lfs, and build essentials. Open the repository
in VS Code (or use `devcontainer open`) to get a fully provisioned workspace
with GPU access via the NVIDIA Container Toolkit.

## Governance pack

`constitutional_pack/` is mounted read-only into the gateway container. Each
section (`Scripture`, `Geometry`, `Law`) can be updated locally and the builder
UI will surface the new contents on the next request.

## CLI extras

The `ark` CLI also includes a placeholder code generation helper:

```bash
./scripts/ark dev codegen "Refactor the gateway tools API"
```

The prompt is echoed into `.ark/changeset-<timestamp>.md`, simulating future
automation workflows.
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
   git clone https://github.com/FlexNetOS/deflexnet-app.git
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
- [DeflexNet whitepaper](https://example.com/deflexnet-whitepaper)
- [Issue tracker](https://github.com/FlexNetOS/deflexnet-app/issues)
- [Contribution guidelines](CONTRIBUTING.md)

