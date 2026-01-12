# <img src="./frontend/public/planrr.png" alt="Planrr logo" title="Planrr" width="64" height="64"> Planrr

- Weekly meal planner

# Compose flowchart

```mermaid
flowchart LR
frontend@{shape: rounded, label: "frontend"}
frontendPort@{shape: rounded, label: "http://localhost:91"}
backend@{shape: rounded, label: "backend (direct)"}
backendPort@{shape: rounded, label: "http://localhost:5557"}
frontend-->frontendPort
backend-->backendPort
```

---

# Development stuff

### Backend:

```bash
cd backend
pip-compile --extra dev
pip-sync
python api.py &
```

### Frontend:

```bash
cd frontend
pnpm i
pnpm run build:dev
```

# Docker stuff

### To build images:

```bash
# All
./build.sh

# Backend
cd backend && ./build.sh

# Frontend
cd frontend && ./build.sh
```
