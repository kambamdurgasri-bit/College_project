# LearnTrack AI

## Backend integration

The frontend reads the backend origin from `VITE_API_BASE_URL`. Copy `.env.example` to `.env.local` and set it to the backend URL before running the app.

The API client is in `src/api/client.js` and expects these endpoints:

- `GET /api/analytics`
- `GET /api/recommendations`

Both endpoints must return JSON and use `{ "message": "..." }` for error responses. Requests include cookies for session authentication and stop after 10 seconds. The backend must allow the frontend origin through CORS and allow credentials if cookie authentication is used.

The current dashboard still displays clearly labeled sample data until these endpoints are connected to the page state. This keeps local development usable while the backend contract is finalized.

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
