#!/usr/bin/env bash
set -euo pipefail

failures=0
warnings=0
have_python=0

print_header() {
  echo "[check_env] $1"
}

require_command() {
  local name="$1"
  local cmd="$2"
  if command -v "$cmd" >/dev/null 2>&1; then
    echo "[check_env] ✔ $name"
    return 0
  else
    echo "[check_env] ✖ $name"
    failures=$((failures + 1))
    return 1
  fi
}

optional_command() {
  local name="$1"
  local cmd="$2"
  if command -v "$cmd" >/dev/null 2>&1; then
    echo "[check_env] ✔ $name"
    return 0
  else
    echo "[check_env] ⚠ $name (optional)"
    warnings=$((warnings + 1))
    return 1
  fi
}

check_docker_compose() {
  if docker compose version >/dev/null 2>&1; then
    echo "[check_env] ✔ docker compose"
  elif command -v docker-compose >/dev/null 2>&1; then
    echo "[check_env] ✔ docker-compose"
  else
    echo "[check_env] ✖ docker compose"
    failures=$((failures + 1))
  fi
}

check_docker_nvidia_runtime() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "[check_env] ✖ NVIDIA Container Toolkit runtime missing (docker unavailable)"
    failures=$((failures + 1))
    return
  fi
  if docker info --format '{{json .Runtimes}}' 2>/dev/null | grep -q '"nvidia"'; then
    echo "[check_env] ✔ NVIDIA Container Toolkit detected"
  else
    echo "[check_env] ✖ NVIDIA Container Toolkit runtime missing"
    failures=$((failures + 1))
  fi
}

check_port_available() {
  local port="$1"
  if (( have_python == 0 )); then
    echo "[check_env] ⚠ port ${port} not checked (python3 missing)"
    warnings=$((warnings + 1))
    return
  fi
  if python3 - "$port" <<'PY'
import socket
import sys
port = int(sys.argv[1])
s = socket.socket()
try:
    s.bind(("0.0.0.0", port))
except Exception:
    sys.exit(1)
finally:
    s.close()
PY
  then
    echo "[check_env] ✔ port ${port} available"
  else
    echo "[check_env] ✖ port ${port} busy"
    failures=$((failures + 1))
  fi
}

print_header "Checking critical executables"
if require_command "docker" "docker"; then
  docker --version
fi
check_docker_compose
if require_command "nvidia-smi" "nvidia-smi"; then
  nvidia-smi
fi
if optional_command "nvcc" "nvcc"; then
  nvcc --version
fi
if require_command "python3" "python3"; then
  python3 --version
  have_python=1
fi
if optional_command "node" "node"; then
  node --version
fi
if optional_command "pipx" "pipx"; then
  pipx --version
fi
if optional_command "poetry" "poetry"; then
  poetry --version
fi
if optional_command "uv" "uv"; then
  uv --version
fi
if optional_command "git-lfs" "git-lfs"; then
  git-lfs --version
fi

print_header "Validating Docker GPU runtime"
check_docker_nvidia_runtime

print_header "Checking required ports"
for port in 8000 8001 3000 5432 9000 6333; do
  check_port_available "$port"
done

if (( failures == 0 )); then
  echo "[check_env] ✅ environment ready for launch"
  if (( warnings > 0 )); then
    echo "[check_env] ⚠ ${warnings} optional component(s) missing"
  fi
  exit 0
else
  echo "[check_env] ❌ environment check failed"
  exit 1
fi
