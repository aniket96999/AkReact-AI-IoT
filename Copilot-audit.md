# NEEV Web App Audit

**Audit date:** 2026-08-24  
**Scope:** React/Vite frontend, MQTT integration, Gemini integration, state management, security, reliability, and scalability.

## Executive Summary

The application is a functional React/Vite prototype with feature-oriented components, but it is not production-ready. It is a modular frontend monolith rather than a microservices system. The most urgent risks are the client-side exposure of the Gemini API key, unauthenticated public MQTT control, excessive AI request frequency, and lack of persistence and automated tests.

**Overall prototype quality:** 4.5/10  
**Production readiness:** Not ready for real hardware or multi-user deployment.

## Architecture Assessment

### Current architecture

The application currently consists of:

- React UI components grouped by feature.
- One global `AppContext` for sensor data, history, alerts, automation, and plant configuration.
- Browser-side Gemini API calls in `src/services/geminiService.ts`.
- Browser-side MQTT control in `src/components/hooks/useMQTT.ts`.
- Local mock sensor generation in `src/services/mockHardwareService.ts`.
- In-memory history and alert state.
- No backend API, database, authentication, authorization, or independently deployable service.

The `services/` directory contains frontend modules, not microservices. A microservice must normally be independently deployable and communicate over a network boundary.

### Recommended target architecture

```text
React Web App
    |
    | HTTPS / WebSocket
    v
Authenticated Backend API
    |
    +-- Authentication and authorization
    +-- Sensor data service
    +-- Device command service
    +-- Alert service
    +-- AI analysis service
    |
    +-- PostgreSQL or time-series database
    +-- Message broker
    +-- Gemini API
```

A modular backend monolith is recommended before adopting multiple microservices. Split services later when independent deployment, scaling, team ownership, or failure isolation justifies the operational complexity.

## Loose Coupling Assessment

**Rating: Moderate-to-high coupling.**

### Positive aspects

- Components are organized by feature.
- Shared domain types are centralized in `src/types.ts`.
- MQTT logic is partly isolated in hooks.
- Gemini calls are grouped in one service module.

### Coupling concerns

1. `src/context/AppContext.tsx` owns simulation, history, automation, alerts, and configuration.
2. The dashboard combines UI state, MQTT commands, and automation state directly.
3. Dashboard sensor readings come from mock data while device controls use MQTT, producing two disconnected data paths.
4. `useMQTTSensor` exists but is not connected to the main application state.
5. MQTT hooks are located under `components/hooks`, although MQTT is infrastructure logic.
6. UI components call Gemini functions directly instead of using an application/domain layer.
7. Environment naming is inconsistent: `VITE_API_KEY` is used by the service while Vite config also references `GEMINI_API_KEY`.

### Recommended boundaries

```text
src/
  app/
  features/
    dashboard/
    analytics/
    disease/
    knowledge/
    profile/
    alerts/
  domain/
    sensor/
    automation/
    plants/
  infrastructure/
    mqtt/
    ai/
    storage/
  shared/
    types/
    validation/
```

The UI should depend on interfaces such as `sensorRepository`, `deviceCommandService`, and `plantAnalysisService`, rather than constructing MQTT or Gemini behavior directly.

## Scalability Report

**Current capacity:** Low to moderate for a single-user demonstration.

| Area | Assessment |
|---|---|
| UI rendering | Adequate for the current small data set |
| Sensor history | Only the latest 100 samples are retained in memory |
| Persistence | None; data is lost on refresh |
| Multi-user support | Not implemented |
| Device scaling | Poor; browser clients connect directly to a public broker |
| AI request scaling | Poor; no queue, cache, quota, or server control |
| Offline recovery | Not implemented |
| Observability | Mostly console logging |
| Static frontend scaling | Good, because it can be served from a CDN |
| Backend scalability | Not applicable because there is no backend |

### Main constraints

- `AppContext` appends a sensor record every three seconds and retains only 100 records.
- The global context can rerender many consumers on every sensor update.
- Sensor updates run regardless of which screen is active.
- AI calls happen from the browser.
- There is no database, queue, aggregation, pagination, or server-side filtering.
- MQTT connections are created by hooks and have no centralized connection management.
- Retry behavior does not include backoff, circuit breaking, or command acknowledgement.

## Trust and Reliability Record

### Verified positive controls

- `npm run build` passes.
- `npx tsc --noEmit` passes.
- `npm audit --omit=dev` reported zero known production vulnerabilities.
- Local environment files are ignored by Git through the `*.local` rule.
- MQTT effects include cleanup on component unmount.
- Feature components are separated reasonably well.

### Findings

| Severity | Finding | Evidence |
|---|---|---|
| Critical | Gemini API key is exposed through a `VITE_` client variable and was found in the production bundle. | `src/services/geminiService.ts` |
| Critical | MQTT uses a public broker without authentication, TLS, or topic authorization. | `src/components/hooks/useMQTT.ts` |
| High | Historical AI analysis can be requested about every three seconds after history has enough records. | `src/components/history/HistoryView.tsx` |
| High | No authentication or authorization exists for users, farms, devices, or commands. | Application-wide |
| High | Device commands have no durable audit record, acknowledgement, or failure state. | `src/components/dashboard/Dashboard.tsx` |
| High | Gemini responses are parsed as JSON without schema validation. | `src/services/geminiService.ts` |
| Medium | Uploaded images lack explicit file size, type, and dimension validation. | `src/components/disease/DiseaseDetector.tsx` |
| Medium | Object URLs created for image previews are not revoked. | `src/components/disease/DiseaseDetector.tsx` |
| Medium | The MQTT sensor hook is unused by the main data flow. | `src/components/hooks/useMQTTSensor.ts` |
| Medium | No test or lint scripts are defined. | `package.json` |

AI recommendations, especially chemical treatment suggestions, must remain advisory until validated by domain experts and presented with appropriate safety guidance.

## Priority Improvements

### Priority 0: Security

1. Revoke and rotate the exposed Gemini API key immediately.
2. Move Gemini requests to a server-only backend API.
3. Add authentication, authorization, rate limiting, and usage quotas.
4. Replace public MQTT access with TLS, credentials, private topics, ACLs, and unique device identities.
5. Route device commands through an authenticated backend or secured command gateway.
6. Validate uploaded files and avoid logging sensitive data or raw AI responses.

### Priority 1: Correctness and reliability

1. Stop AI requests on every history update; use manual refresh, debounce, or scheduled summaries.
2. Add schema validation for AI output using Zod or an equivalent library.
3. Add request timeouts, cancellation, bounded retries, and exponential backoff.
4. Separate automatic automation from manual overrides.
5. Persist sensor data, alerts, plant profiles, and device state.
6. Add MQTT command acknowledgements, timeout states, and visible failure feedback.
7. Use one authoritative sensor data source instead of mixing mock data and MQTT data.

### Priority 2: Maintainability and architecture

1. Move MQTT hooks into an infrastructure/services area.
2. Connect `useMQTTSensor` to application state or remove it.
3. Split `AppContext` into focused state domains or use a dedicated state store.
4. Add application service interfaces between UI components and external integrations.
5. Standardize environment variable names and deployment configuration.
6. Add route-level or feature-level code splitting as the application grows.

### Priority 3: Engineering quality

1. Add Vitest and React Testing Library.
2. Add ESLint and formatting checks.
3. Test automation rules, alert deduplication, MQTT command generation, and AI response validation.
4. Add CI checks for typecheck, build, lint, tests, and dependency auditing.
5. Add structured logs, metrics, tracing, and health checks.
6. Add error boundaries and explicit offline/loading/error states.

## Final Verdict

NEEV has a reasonable prototype foundation and a useful feature-oriented UI structure. It should currently be treated as a demo or development tool only. It must not control real agricultural hardware or use production AI credentials in its current form.

The most practical evolution path is:

1. Secure the credentials and MQTT control path.
2. Introduce an authenticated modular backend.
3. Persist sensor and command data.
4. Add validation, tests, observability, and request controls.
5. Consider separate microservices only after actual scaling and ownership needs emerge.
