export {
  ok,
  err,
  isOk,
  isErr,
  mapResult,
  unwrap,
  ServerPatternsError,
  type Result,
  type ServerPatternsErrorCode,
} from "./result.js";

export { createApiClient, type ApiClient, type ApiClientConfig, type RequestOptions, type HeadersResolver } from "./api-client.js";

export {
  parsePaginationParams,
  createPaginatedResult,
  paginateInMemory,
  type PaginationParams,
  type PaginatedResult,
  type ParsePaginationOptions,
} from "./pagination.js";

export {
  verifyHmacSignature,
  verifyTimestampedHmacSignature,
  type VerifyHmacSignatureOptions,
  type VerifyTimestampedHmacOptions,
  type VerificationResult,
} from "./webhook.js";

export {
  createRateLimiter,
  createInMemoryRateLimitStore,
  type RateLimiter,
  type RateLimiterOptions,
  type RateLimitResult,
  type RateLimitStore,
} from "./rate-limit.js";

export {
  withCache,
  createInMemoryCacheStore,
  type CacheStore,
  type WithCacheOptions,
} from "./cache.js";
