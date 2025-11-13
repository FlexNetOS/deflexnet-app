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
