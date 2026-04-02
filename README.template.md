# <img src="./frontend/public/planrr.png" title="Planrr" alt="Planrr logo" width="64" height="64"> Planrr

> - Weekly meal planner

---

<img src="https://img.shields.io/badge/node-~24-green?style=plastic" title="Node" alt="Node">
&nbsp;
<img src="https://img.shields.io/python/required-version-toml?tomlFilePath=https://raw.githubusercontent.com/$_user/$_repo/main/backend/pyproject.toml&style=plastic&color=green" title="Python" alt="Python"> <!-- markdownlint-disable-line MD013 -->
&nbsp;
<img src="https://img.shields.io/github/license/$_user/$_repo?style=plastic&color=green" title="License" alt="License">

---

### 📷 Screenshot <!-- markdownlint-disable-line MD001 -->

<img src="./images/screenshot.png" title="Screenshot" alt="Screenshot">

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
