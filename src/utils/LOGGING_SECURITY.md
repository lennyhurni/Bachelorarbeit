# Secure Logging Guidelines

## Overview
This document provides guidelines for secure logging practices in the application to ensure sensitive data like API keys and credentials are never exposed in logs.

## Key Rules

1. **Never log entire error objects directly**
   - ❌ `logger.error("Error occurred", { error })`
   - ✅ `logger.error("Error occurred", { errorName: error.name, errorMessage: error.message })`
   - ✅ `safeLogger.errorSafe("Error occurred", error)` (preferred)

2. **Never log environment variables**
   - ❌ `logger.info("Using API key", { apiKey: process.env.API_KEY })`
   - ✅ `logger.info("API key configured", { configured: !!process.env.API_KEY })`

3. **Avoid logging request headers or raw payloads**
   - ❌ `logger.debug("Request headers", { headers: req.headers })`
   - ✅ `logger.debug("Request received", { contentType: req.headers['content-type'], contentLength: req.headers['content-length'] })`

4. **Use the safe logging utilities**
   - The `safeErrorExtract()` function should be used to extract safe properties from error objects
   - Use the `SafeBaseLogger` class which has `.errorSafe()`, `.warnSafe()`, and `.criticalSafe()` methods

## Example

```typescript
import { safeApiLogger } from "@/utils/logging";

try {
  // Some operation that might fail
} catch (error: any) {
  safeApiLogger.errorSafe("Operation failed", error, { 
    additionalContext: "Some safe context data"
  });
  
  // Instead of:
  // logger.error("Operation failed", { error });
}
```

## Implementation Details

This application includes several safety mechanisms for logging:

1. **Safe Error Extraction** - The `safeErrorExtract()` function safely extracts non-sensitive properties from error objects
2. **SafeBaseLogger** - Extended logger class with safe methods for error logging
3. **Type Safety** - Using `error: any` pattern with optional chaining for type safety

## Sensitive Data Checklist

Always check that these types of data never appear in logs:

- API keys and tokens
- Database credentials
- User passwords
- JWT tokens
- Client secrets
- Private keys
- Full session data
- Full request/response bodies

## Compliance

Proper logging practices are essential for:
- Security compliance
- Privacy regulations (GDPR, etc.)
- Preventing security breaches
- Maintaining user trust

## Questions?

If you're unsure about logging security, contact the security team before implementing new logging code. 