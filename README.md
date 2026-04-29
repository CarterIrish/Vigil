# Vigil

A customizable monitoring dashboard for developers and homelabbers. Vigil lets users build personal dashboards out of widgets that surface the things they care about — server health, the time, and (extensibly) anything else that fits the widget pattern.

> **Live demo:** https://vigil-44aa23df4fb9.herokuapp.com/

## What it does

Vigil sits between a browser homepage and a heavier monitoring stack like Grafana or UptimeRobot. After signing up, a user can:

- Create one or more dashboards
- Drag widget templates from a side panel onto a dashboard to add them
- Configure each widget (an endpoint to poll, a timezone to display, etc.)
- Watch widgets update live — Server Health widgets auto-poll their endpoint every minute, the Clock widget ticks every second
- Resize and rearrange dashboards via a CSS Grid masonry layout (data model in place; resize UI is the next planned feature)

## Features

- **Server Health widget** — polls a user-supplied endpoint, displays a green / amber / red status indicator, transitions to a "down" state after three consecutive non-healthy responses
- **Clock widget** — current time in a user-selected US timezone, in either 12-hour or 24-hour format
- **Drag-and-drop widget creation** via [`@dnd-kit/react`](https://github.com/clauderic/dnd-kit)
- **Masonry layout** built on CSS Grid with explicit per-item spans and `grid-auto-flow: dense`
- **Light / dark theme** powered by `light-dark()` color tokens — follows the OS-level `prefers-color-scheme`
- **Freemium tier system** — free accounts capped at 1 dashboard / 2 widgets, Pro accounts uncapped (toggle on the settings page; no payment is collected)
- **Authentication** — signup, login, password change, all backed by bcrypt and Redis-persisted sessions
- **404 page** for non-existent routes
- **Demo endpoints** — `/api/demo/{healthy,unhealthy,flaky}` for exercising the Server Health widget without needing a real broken service

## Tech Stack

| Layer       | Technology                                  |
| ----------- | ------------------------------------------- |
| Runtime     | Node.js                                     |
| Server      | Express 5 (TypeScript)                      |
| Templating  | express-handlebars                          |
| Frontend    | React 19                                    |
| Build       | Webpack + Babel + tsc                       |
| Drag/Drop   | @dnd-kit/react                              |
| Database    | MongoDB via Mongoose (discriminator schema) |
| Sessions    | Redis (connect-redis)                       |
| Auth        | bcrypt password hashing                     |
| Linting     | ESLint                                      |
| CI          | GitHub Actions                              |
| Deployment  | Heroku                                      |

## Architecture

```
client/
  App.jsx                  Dashboard root + WidgetArea grid
  ServerHealthWidget.jsx   Polling + status logic
  ClockWidget.jsx          Local time renderer
  AddWidgetModal.jsx       Type-dispatched create form
  EditWidgetModal.jsx      Type-dispatched edit form
  SidePanel.jsx            Dashboard list + draggable widget catalog
  DeleteDashboardModal.jsx Portal-rendered confirmation
  Login.jsx                Login + signup
  Settings.jsx             Password change + subscription toggle
  helper.js                Shared fetch helpers
  constants/
    timezones.js           Continental US IANA list

server/
  app.ts                   Express boot + middleware + Redis + Mongo
  router.ts                Route definitions
  controllers/
    Account.ts             Login, signup, logout
    Dashboard.ts           Dashboard CRUD
    Widget.ts              Widget CRUD + health proxy
    Settings.ts            Password + tier change
    Demo.ts                Public demo endpoints
  models/
    Account.ts             User accounts (bcrypt, tier)
    Dashboard.ts           Per-user dashboards
    Widget.ts              Discriminator base schema (type, name, w, h)
    ServerHealthWidget.ts  Discriminator: + endpoint
    ClockWidget.ts         Discriminator: + timezone, format
  middleware/              secureConnect, requiresLogin, requiresLogout, requireBody

views/                     Handlebars templates (login, dashboard, settings, notFound)
hosted/                    Static assets (tokens.css, mainStyle.css, loginStyle.css)
```

## Setup

### Prerequisites

- Node.js 20+
- A MongoDB connection string
- A Redis connection string

### Environment variables

Create a `.env` file in the project root:

```bash
PORT=3000
MOGODB_URI=mongodb+srv://...                # NB: legacy typo on the env var name, see below
REDIS_URL=rediss://...
SESSION_SECRET=some-long-random-string
NODE_ENV=development
```

> **Note:** the Mongo URI env var is currently spelled `MOGODB_URI` (missing the second `N`) for backward compatibility with the original DomoMaker config. Fix planned for the next release.

### Install and run

```bash
npm install
npm run dev          # runs webpack watch + nodemon under tsx
```

The app starts at `http://localhost:3000`.

### Production build

```bash
npm run build        # webpack only
npm start            # runs the compiled output (node dist/app.js)
```

The Heroku `heroku-postbuild` script runs `tsc && webpack` so the dyno only needs to start `node dist/app.js`.

## Scripts

| Script              | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Local dev with hot client reload + server auto-restart |
| `npm run build`     | Webpack bundle for client                              |
| `npm start`         | Run compiled production output                         |
| `npm test`          | Lint pass (`eslint --fix` over `server/`)              |

## Profit Model

Free tier: 1 dashboard, 2 widgets. Pro tier: unlimited. Caps are enforced server-side in the controllers, so the limits cannot be bypassed by a client that disables the form-level checks. The settings page exposes a toggle to switch tiers for demonstration; no payment information is collected at any point.

## API

A full endpoint reference (with methods, middleware, parameters, and return types) is in [`FINAL_SUBMISSION.md`](./FINAL_SUBMISSION.md#endpoint-documentation).

## Known behavior

- **Tier downgrade leaves existing data intact.** When a Pro user switches back to Free, their existing widgets / dashboards above the cap remain functional — only new creation is blocked. This matches how Notion, Stripe, and GitHub handle subscription downgrades. A future release may add a soft-lock UI for excess items.
- **Widget defaults don't backfill old documents.** Widgets created before the `w` / `h` schema fields were added will return `undefined` for those fields; the client falls back to `1×1` for any missing values.

## Borrowed Code

Adapted from the DomoMaker D/E pattern:

- `server/middleware/index.ts` — `requiresLogin`, `requiresLogout`, `secureConnect` (converted to TypeScript)
- `server/models/Account.ts` — bcrypt `generateHash` / `validatePassword` static and instance methods, `toAPI` static (converted to TypeScript with exported interfaces)
- `client/helper.js` — `sendPost`, `sendPut`, `handleError`, `hideError` (converted to ES module syntax)

Everything else — the React components, controllers, discriminator schemas, drag-and-drop integration, masonry layout, and styling system — was written from scratch.

## License

MIT
