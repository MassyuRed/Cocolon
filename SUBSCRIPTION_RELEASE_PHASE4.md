# Subscription Release Phase 4

Phase 4 adds a protected **live console confirmation flow** on the backend.

## New endpoint

### GET `/subscription/config/release-check/live`

Admin-only endpoint.

It performs two live checks:

- **Apple / App Store Connect**
  - resolves the app by Bundle ID
  - walks subscription groups
  - collects subscriptions under those groups
  - checks whether expected Plus / Premium product IDs exist
  - checks whether expected Plus subscriptions have at least one introductory offer

- **Google / Play Console**
  - reads each expected subscription by product ID
  - checks whether expected Plus / Premium product IDs exist
  - checks whether expected Plus subscriptions have an ACTIVE base plan
  - checks whether expected Plus subscriptions have an ACTIVE free-trial offer
  - checks whether the expected Android offer tag is present on at least one ACTIVE Plus offer

## What this endpoint returns

- `blocking_issues`
- `warnings`
- per-provider snapshots under `providers.apple` / `providers.google`
- `manual_checks` for fields that still need human confirmation

## Manual-only items that remain

These are intentionally kept as manual checks because they are outside the catalog APIs or vary by infrastructure setup:

- App Store Server Notifications URL
- Google RTDN / Pub/Sub delivery path
- Terms URL / Privacy URL actually bundled into the app build

## Credentials

### Apple

Phase 4 can use either:

- dedicated App Store Connect envs
  - `COCOLON_IAP_ASC_ISSUER_ID`
  - `COCOLON_IAP_ASC_KEY_ID`
  - `COCOLON_IAP_ASC_PRIVATE_KEY` or `COCOLON_IAP_ASC_PRIVATE_KEY_FILE`

or, if omitted, it falls back to the existing Apple verification key.

### Google

Phase 4 reuses the existing Google Play service-account credentials already used by subscription verification.
