# <img src="./frontend/public/planrr.png" title="Planrr" alt="Planrr logo" width="64" height="64"> Planrr

> - Weekly meal planner

---

<img src="https://img.shields.io/badge/node-~24-green?style=plastic" title="Node" alt="Node">
<img src="https://img.shields.io/python/required-version-toml?tomlFilePath=https://raw.githubusercontent.com/chump29/planrr/main/backend/pyproject.toml&style=plastic&color=green" title="Python" alt="Python"> <!-- markdownlint-disable-line MD013 -->
<img src="https://img.shields.io/github/license/chump29/planrr?style=plastic&color=green" title="License" alt="License">

---

### 📷 Screenshot <!-- markdownlint-disable-line MD001 -->

<img src="./images/screenshot.png" title="Screenshot" alt="Screenshot">

---

### 🔀 Docker Compose Flow:

```mermaid
flowchart LR
frontend@{shape: rounded, label: "planrr-frontend:80"}
frontendPort@{shape: rounded, label: "http://localhost:91"}
backend@{shape: rounded, label: "planrr-backend:5557"}
backendPort@{shape: rounded, label: "http://localhost:5557"}
frontend-->frontendPort
backend-->backendPort
```

#### Building Images:

```bash
./build.sh
```

---

### 📄 Documentation

- [Frontend](./frontend/README.md "Frontend")
- [Backend](./backend/README.md "Backend")
