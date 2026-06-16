# Technical roadmap

## ASAP

- Add authorization features (JWT)
- Unified docker-compose starting workflow for better reproducibility across environment.
- Add rate-limiting and timeouts for all API endpoints.
- Improve the email verification logic in the backend.
- Limit CORS permissions to the exact origins that we know are going to use our API.

## This sprint (2 weeks)

- Add secrets manager for credentials.

We would need to decouple the logic of backend/index.ts (too many endpoints/logic)
- Add a controller layer for HTTP request handling.
- Add a service layer for business logic.
- Add an input layer for input validation.

- Different controllers for CRUD operations related to leads and another for orchestration (verify-emails, bulk ...)

- API documentation (Swagger UI, OpenAPI)

- CI/CD pipeline checks (formatting, tests, coverage, linter, credential_check)

## This iteration (1 month)

- CSV Country code validation.
- Better mapping logic for lead fields (they are currently hardcoded).

## Next iteration (2 months)

- Look for a way for our Temporal workflows to scale horizontally.
- Migrate to Postres in order for us to be able to scale better.
- Look for a way to asynchronously schedule jobs (verify-email) and check the status of them later.
