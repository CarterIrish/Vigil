# Vigil

At its core, Vigil is a widget-based server monitoring dashboard that lets users define custom endpoints for tracking server health and statistics. Beyond monitoring, users have access to a collection of utility widgets that round out the dashboard and provide a more customized experience.

## Purpose

VIGIL is built for homelabbers and self-hosters who want a single, glanceable dashboard for the machines they care about. Users connect their own endpoints, and VIGIL handles the rest — polling, displaying, and organizing the data into a clean, customizable interface.

## Goals

- Provide a straightforward way to monitor server health through user-defined endpoints
- Offer a modular widget system that users can configure to fit their needs
- Deliver a polished, professional user experience that works as a real-world tool
- Support a freemium model where free-tier users can monitor up to 2 servers, while premium users unlock additional server slots and premium widgets

## Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Runtime    | Node.js                        |
| Server     | Express.js                     |
| Templating | Handlebars                     |
| Frontend   | React                          |
| Build      | Vite                           |
| Database   | MongoDB via Mongoose           |
| Sessions   | Redis                          |
| Linting    | ESLint (JS recommended config) |
| CI         | GitHub Actions                 |
| Deployment | Heroku                         |

## Requirements

- **User Accounts** — Signup, login, and password change with session management backed by Redis
- **Server Health Widgets** — Core widget type where users provide an endpoint and VIGIL displays the returned data (available on the free tier)
- **Premium Widgets** — Additional widget types (e.g., weather) available to premium-tier users
- **Widget Configuration Storage** — MongoDB-backed persistence for each user's enabled widgets and their settings
- **Profit Model** — Free/premium tier system with a toggle to demonstrate functionality (no real payment collection)
- **Dynamic React Components** — At least 5 dynamic components beyond auth views, powering the widget layer
- **Handlebars Templating** — Used for server-rendered pages where full-page dynamism isn't needed
- **Express Backend** — RESTful API with proper status codes, GET/POST support, and middleware
- **Polished CSS** — Professional styling that clearly communicates what the app does at a glance
- **Deployment** — Hosted on Heroku with GitHub Actions for CI
