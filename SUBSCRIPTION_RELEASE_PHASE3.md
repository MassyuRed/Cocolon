# Subscription Release Phase 3

Phase 3 fixes the last missing layer before production launch:

- backend env names are now centralized and inspectable
- public env names are centralized in `lib/iap/iapConfig.js`
- a protected release-check endpoint is available
- sample env files are included for backend and Expo/public config

## Backend release-check endpoint

### GET

`GET /subscription/config/release-check`

Returns:
- missing backend env keys
- resolved Bundle ID / Package name / product IDs
- derived Apple / Google webhook target URLs
- production safety warnings such as `COCOLON_IAP_ALLOW_UNVERIFIED=true`
- a comparison block against any `EXPO_PUBLIC_*` values that exist on the server

### POST

`POST /subscription/config/release-check/compare-public`

Use this when you want to compare the deployed backend settings against the exact public env values you plan to ship in the app build.

Example body:

```json
{
  "api_base_url": "https://api.example.com",
  "ios_bundle_id": "com.example.cocolon",
  "android_package_name": "com.example.cocolon",
  "plus_sku_ios": "cocolon_plus_monthly",
  "plus_sku_android": "cocolon_plus_monthly",
  "premium_sku_ios": "cocolon_premium_monthly",
  "premium_sku_android": "cocolon_premium_monthly",
  "terms_url": "https://example.com/terms",
  "privacy_url": "https://example.com/privacy"
}
```

## Files added for env confirmation

- `services/ai_inference/.env.subscription.backend.example`
- `.env.subscription.public.example`

## Console values to match

### Apple
- Bundle ID must match `COCOLON_IAP_APPLE_BUNDLE_ID`
- Plus product IDs must match `COCOLON_IAP_IOS_PLUS_PRODUCT_IDS`
- Premium product IDs must match `COCOLON_IAP_IOS_PREMIUM_PRODUCT_IDS`
- App Store Server Notifications production and sandbox URLs should point to `/subscription/webhooks/apple`

### Google
- Package name must match `COCOLON_IAP_ANDROID_PACKAGE_NAME`
- Plus product IDs must match `COCOLON_IAP_ANDROID_PLUS_PRODUCT_IDS`
- Premium product IDs must match `COCOLON_IAP_ANDROID_PREMIUM_PRODUCT_IDS`
- RTDN / push destination should point to `/subscription/webhooks/google`
- If the webhook endpoint is public, configure `COCOLON_IAP_GOOGLE_WEBHOOK_BEARER`
