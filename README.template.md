# ![Planrr](./frontend/public/planrr.png) Planrr

> - Weekly meal planner

---

![Node](https://img.shields.io/badge/node-~24-green?style=plastic) &nbsp;
![Python](https://img.shields.io/python/required-version-toml?tomlFilePath=https://raw.githubusercontent.com/$_user/$_repo/main/backend/pyproject.toml&style=plastic&color=green) &nbsp; <!-- markdownlint-disable-line MD013 -->
![License](https://img.shields.io/github/license/$_user/$_repo?style=plastic&color=green)

---

### 📷 Screenshot <!-- markdownlint-disable-line MD001 -->

![Screenshot](./images/screenshot.png)

---

### 🔀 Docker Compose Flow:

```mermaid
flowchart LR
frontend@{shape: rounded, label: "$_frontend"}
frontendPort@{shape: rounded, label: "$_frontendPort"}
backend@{shape: rounded, label: "$_backend"}
backendPort@{shape: rounded, label: "$_backendPort"}
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
