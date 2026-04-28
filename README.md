# task-flow-manager
Репозиторий для тестового задания: Система управления заявками

## Project structure

- `backend` - Express API and domain logic
- `frontend` - SPA on Web Components
- `package.json` (root) - convenience scripts for running both parts

## Requirements

- Node.js 20+
- npm 10+

## Install

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Run in development mode

```bash
npm run dev
```

Services:

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

Frontend uses `Vite` (`npm run dev --workspace frontend`).

## Minimal API checks

- `GET http://localhost:3000/health`
- `GET http://localhost:3000/api/requests`
