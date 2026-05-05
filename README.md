# task-flow-manager
Репозиторий для тестового задания: Система управления заявками

## Project structure

- `backend` — бэкенд (Express API + доменная логика заявок и переходов)
- `frontend` — фронтенд (SPA, интерфейс для входа, создания и обработки заявок)
- `backend/src/domain` — бизнес-правила (статусы, роли, валидации)
- `backend/src/application` — сценарии/сервисы приложения
- `backend/src/http` — контроллеры и роуты API
- `frontend/src/components` — UI-компоненты экранов
- `frontend/src/core` — ядро SPA (роутинг/состояние приложения)
- `package.json` (root) — общие скрипты для запуска backend + frontend

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
