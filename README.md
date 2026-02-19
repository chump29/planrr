# <img src="./frontend/public/planrr.png" title="NFLd" alt="NFLd logo" width="64" height="64"> Planrr

> - Weekly meal planner

---

### Docker Compose Flow: <!-- markdownlint-disable-line MD001 -->

```mermaid
flowchart LR
frontend@{shape: rounded, label: "nfld-frontend:80"}
frontendPort@{shape: rounded, label: "http://localhost:91"}
backend@{shape: rounded, label: "nfld-backend:5557"}
backendPort@{shape: rounded, label: "http://localhost:5557"}
frontend-->frontendPort
backend-->backendPort
```

---

### To build all images:

```bash
./build.sh
```

---

### Additional documentation available:

- [Frontend](./backend/README.md "Frontend")
- [Backend](./frontend/README.md "Backend")
