# ![Planrr](./frontend/public/planrr.png) Planrr

> - Weekly meal planner

---

![Node](https://img.shields.io/badge/node-~24-green?style=plastic) &nbsp;
![Python](https://img.shields.io/python/required-version-toml?tomlFilePath=https://raw.githubusercontent.com/chump29/planrr/main/backend/pyproject.toml&style=plastic&color=green) &nbsp; <!-- markdownlint-disable-line MD013 -->
![License](https://img.shields.io/github/license/chump29/planrr?style=plastic&color=green)

---

### 📷 Screenshot <!-- markdownlint-disable-line MD001 -->

![Screenshot](./images/screenshot.png)

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
