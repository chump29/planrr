# ![Planrr](./frontend/public/planrr.png) Planrr

> - Weekly meal planner

---

![API](https://img.shields.io/badge/API-v2.0.0-chocolate?style=plastic&logo=docker) &nbsp;
![UI](https://img.shields.io/badge/UI-v2.0.0-chocolate?style=plastic&logo=docker)

![MUI](https://img.shields.io/badge/MUI-~7-informational?style=plastic&logo=mui) &nbsp;
![Node](https://img.shields.io/badge/Node.js-~24-informational?style=plastic&logo=nodedotjs) &nbsp;
![PNPM](https://img.shields.io/badge/PNPM-~10-informational?style=plastic&logo=pnpm) &nbsp;
![React](https://img.shields.io/badge/React-~19-informational?style=plastic&logo=react) &nbsp;
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-~4-informational?style=plastic&logo=tailwindcss) &nbsp;
![Typescript](https://img.shields.io/badge/Typescript-~6-informational?style=plastic&logo=typescript) &nbsp;
![Vite](https://img.shields.io/badge/Vite-~8-informational?style=plastic&logo=vite) &nbsp;
![Zod](https://img.shields.io/badge/Zod-~4-informational?style=plastic&logo=zod)

![FastAPI](https://img.shields.io/badge/FastAPI->=0.135-informational?style=plastic&logo=fastapi) &nbsp;
![Pydantic](https://img.shields.io/badge/Pydantic->=2-informational?style=plastic&logo=pydantic) &nbsp;
![Python](https://img.shields.io/python/required-version-toml?tomlFilePath=https://raw.githubusercontent.com/$_user/$_repo/main/backend/pyproject.toml&style=plastic&color=informational&label=Python&logo=python) &nbsp; <!-- markdownlint-disable-line MD013 -->
![UV](https://img.shields.io/badge/UV->=0.11-informational?style=plastic&logo=uv)

![CodeQL](https://github.com/chump29/planrr/workflows/CodeQL/badge.svg) &nbsp;
![License](https://img.shields.io/github/license/$_user/$_repo?style=plastic&color=blueviolet&label=License&logo=gplv3)

---

### 📷 Screenshot <!-- markdownlint-disable-line MD001 -->

![Screenshot](./images/screenshot.png)

---

### 🐳 Docker

#### Compose Flow:

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

#### Building:

```bash
./docs.sh
```

#### Links:

- [Frontend](./frontend/README.md "Frontend")
- [Backend](./backend/README.md "Backend")
