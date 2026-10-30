# VCCT Custom Line List — DHIS2 Integration & main_dbs Bridge

This project provides a custom line listing solution connecting the **`main_dbs`** MySQL database with a **DHIS2 Custom Web App** built with React, Vite, Tailwind CSS, and shadcn/ui components.

---

## 📁 Architecture & Folder Structure

```
d:/dev/linelist/
├── db_structure/
│   └── main_db_structure.sql       # MySQL database structure for main_dbs
│
├── vcct/
│   ├── backend/                    # Node.js + Express MySQL Bridge API
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── db.js           # MySQL connection pool & graceful fallback
│   │   │   │   └── constants.js    # Dictionaries (Gender, HIV Results, RTRI, Risks, Reasons)
│   │   │   ├── controllers/
│   │   │   │   ├── hierarchyController.js  # Provinces, ODs, Facilities
│   │   │   │   ├── metaController.js       # Target Groups, Patient Types, Mappings
│   │   │   │   └── linelistController.js   # Paginated VCCT records & KPIs
│   │   │   ├── services/
│   │   │   │   ├── excelService.js         # Styled ExcelJS export engine
│   │   │   │   └── mockDataService.js      # High-fidelity fallback / demo data
│   │   │   ├── routes/
│   │   │   │   └── api.js                  # REST API routes
│   │   │   └── server.js                   # Express application entry
│   │   ├── .env                            # DB connection config
│   │   └── package.json
│   │
│   └── frontend/                   # React + Vite + Tailwind + shadcn/ui Custom App
│       ├── manifest.webapp         # DHIS2 Custom App Manifest descriptor
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/             # shadcn/ui components (Button, Card, Badge, Table, Sheet, Tabs, Input)
│       │   │   └── linelist/
│       │   │       ├── Header.jsx           # App branding, DHIS2 context, DB status
│       │   │       ├── KPISummary.jsx       # Real-time Positivity, Recency, Linkage KPIs
│       │   │       ├── FilterPanel.jsx      # Cascading Province -> OD -> Site + Date Presets
│       │   │       ├── DataTable.jsx        # TanStack Table with sort, pagination, column status
│       │   │       └── RecordDetailSheet.jsx # 4-Tab patient drilldown drawer (Profile, Tests, Risks, Reasons)
│       │   ├── lib/
│       │   │   ├── api.js          # Axios API bridge
│       │   │   └── utils.js        # shadcn `cn` class merge helper
│       │   ├── App.jsx             # Main Application
│       │   ├── index.css           # Tailwind design tokens & dark theme
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
```

---

## 🚀 Running Locally

### 1. Start Backend Bridge API (Port 5000)
```bash
cd vcct/backend
npm start
```

### 2. Start Frontend Custom App (Port 3000)
```bash
cd vcct/frontend
npm run dev
```

### 3. Deploying into DHIS2
Run `npm run build` inside `vcct/frontend/`. Zip the generated `dist/` directory along with `manifest.webapp` and upload it directly into the **DHIS2 App Management** app.
