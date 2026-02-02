<p align="center">
  <img src="./enginy_brand_filled.svg" width="128" height="128" alt="Enginy logo">
</p>

## Overview

Welcome to the **TinyEnginy** take‑home! This exercise is a condensed version of our product and day‑to‑day work. Please treat the codebase as if it were the one you ship to production.


## What you’ll do (at a glance)


1. Investigate & fix a reported CSV import bug (details below).

2. Implement a new feature (details below).

3. Review an open PR that implements a new feature.

4. Analyze the codebase and propose improvements.


## Submission

Please record your screen (and, if possible, your voice) while you work on this task [(opensource tool)](https://cap.so/). We want to see how you collaborate with AI tools, how you reason through trade-offs, and how far you can get within the timebox.

The expected work time is around 1 hour. Do not worry if you cannot complete every part of the task. Work in the repository as you see fit, and when you are done, just ping us. We value the time you invest in this task, and we commit to spending a similar amount reviewing it thoroughly. Regardless of the outcome, we’ll provide constructive feedback so you can benefit from the evaluation.


## Getting Started

### Prerequisites

- **Node.js** (use the version in .nvmrc).

- **pnpm** package manager.

- **SQLite** (bundled; no separate install required).

- **Temporal** Workflow management system.

- **Claude Code** installed locally, with the provided `ANTHROPIC_API_KEY` configured. If you are more comfortable, you can use any other AI coding tool you have access to.

Install tools:

- Node via nvm: https://github.com/nvm-sh/nvm#installing-and-updating

- pnpm: https://pnpm.io/installation#using-other-package-managers

- Temporal: https://docs.temporal.io/develop/typescript/set-up-your-local-typescript

- Claude Code: https://docs.anthropic.com/en/docs/claude-code/overview

### Environment setup

Set the provided `ANTHROPIC_API_KEY` in your shell before running the project:

```zsh
export ANTHROPIC_API_KEY="your-provided-key"
```

**Backend (one‑time)**

```zsh
cd backend
nvm use                   # Ensure the Node version from .nvmrc
pnpm install              # Install dependencies
pnpm migrate:dev          # Sync local SQLite with Prisma schema
pnpm gen:prisma           # Generate Prisma client
temporal server start-dev # Starts Temporal server
```

**Backend (develop)**

```zsh
cd backend
pnpm run dev           # Starts the API server
```

When you change the Prisma schema:
```zsh
pnpm migrate:dev
```

**Frontend (one‑time)**

```zsh
cd frontend
nvm use                # Ensure the Node version from .nvmrc
pnpm install
```

**Frontend (develop)**

```zsh
cd frontend
pnpm run dev           # Starts the dev server
```

## Task Description

### Bug reported

When importing from CSV, the country column displays strange characters that do not match valid country codes. I have been using the example CSV file.

Some users have also complained that the email verification feature keeps running forever for some cases and does not give any kind of information.

### New Feature

Some users have mentioned they would like to track more data points for their leads.
We are adding the following fields: lead’s phone number, years at their current company, and LinkedIn profile.

We want users to be able to:

 1. See the new field in the table of leads
 2. Manually set those fields using the import from csv feature
 3. Implement an **enrich phone** process (details below)
 3. Use the new fields in the message composition

Since the list of fields will continue to grow, we need to improve the UX of the message composition (no design provided).

### Enrich phone

In order to implement the enrich phone number you should implement a **Temporal workflow** that finds a user’s phone number by querying three providers in sequence:

1. Call **Provider One** → if no phone found,  
2. Call **Provider Two** → if no phone found,  
3. Call **Provider Three** → if no phone found, mark as **No data found**.

#### Requirements
- Each provider call is an **activity** with:
  - Short timeout
  - Retry policy (e.g. 3 attempts, exponential backoff)
- Stop early when a phone is found.
- Idempotent workflow (only one per lead).
- Abstraction layer to handle different provider inputs.
- Show process feedback to the user
- Update frontend accordingly

#### Nice to have

Take into account provider rate limits, right now they have unlimited RPS/RPM, however they told us they will add rate limits to their endpoints.


#### Provider APIs

**Orion Connect**
> Provider with the best data in the market, but slow and fails sometimes
>
> Base URL: `https://api.enginy.ai/api/tmp/orionConnect`
>
> Request: `{ "fullName": "Ada Lovelace", "companyWebsite": "example.com" }`
>
> Authentication: `Request header 'x-auth-me' with key 'mySecretKey123'`
>
> Response: `POST { "phone": string | null }`

**Astra Dialer**
> Provider with the worst data in the market, but is the fastest one
>
> Base URL: `https://api.enginy.ai/api/tmp/astraDialer`
>
> Request: `POST { "email": "john.doe@example.com" }`
>
> Authentication: `Request header 'apiKey' with key '1234jhgf'`
>
> Response: `{ "phoneNmbr": string | null | undefined }`

**Nimbus Lookup**
> New provider in the market
>
> Base URL: `https://api.enginy.ai/api/tmp/numbusLookup`
>
> Request: `POST { "email": "john.doe@example.com", jobTitle: "CTO" }`
>
> Authentication: `Get parameter 'api' with key '000099998888'`
>
> Response: `{ "number": number, "countryCode": "string" }`

### PR review

Review the open PR as if it were from a teammate. Add any inline comments you find necessary and provide a final summary with either an approval or a change-request decision.

### Codebase Analysis & Roadmap

Create an `IMPROVEMENTS.md` file as if it was a document in our project management tool.

## Evaluation

You won’t be evaluated on producing a single predefined _correct solution_, but rather on your problem-solving skills, the product mindset you showcase, your ability to reason and explain your thought process, the trade-offs behind your decisions, and how you managed to use AI tools.