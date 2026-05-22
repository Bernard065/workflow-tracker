import logging
import time

from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse

logger = logging.getLogger("applications.api")


class ApiRequestLoggingMiddleware:
    """Log API request method, path, status code, duration, and client IP."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not request.path.startswith("/api/"):
            return self.get_response(request)

        start_time = time.perf_counter()

        response = self.get_response(request)

        duration_ms = (time.perf_counter() - start_time) * 1000

        logger.info(
            "API request method=%s path=%s status=%s duration_ms=%.2f ip=%s",
            request.method,
            request.path,
            response.status_code,
            duration_ms,
            get_client_ip(request),
        )

        return response


class ApiRateLimitMiddleware:
    """Basic IP-based API rate limiting using Django cache."""

    def __init__(self, get_response):
        self.get_response = get_response
        self.limit = settings.API_RATE_LIMIT_REQUESTS
        self.window_seconds = settings.API_RATE_LIMIT_WINDOW_SECONDS

    def __call__(self, request):
        if not request.path.startswith("/api/"):
            return self.get_response(request)

        if should_skip_rate_limit(request.path):
            return self.get_response(request)

        client_ip = get_client_ip(request)
        cache_key = f"api-rate-limit:{client_ip}"

        request_count = cache.get(cache_key, 0)

        if request_count >= self.limit:
            logger.warning(
                "API rate limit exceeded ip=%s path=%s limit=%s window_seconds=%s",
                client_ip,
                request.path,
                self.limit,
                self.window_seconds,
            )

            return JsonResponse(
                {
                    "detail": "Rate limit exceeded. Please try again later.",
                },
                status=429,
            )

        if request_count == 0:
            cache.set(cache_key, 1, timeout=self.window_seconds)
        else:
            cache.incr(cache_key)

        return self.get_response(request)


def get_client_ip(request) -> str:
    """Return client IP, supporting proxy headers when present."""

    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")

    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    return request.META.get("REMOTE_ADDR", "unknown")


def should_skip_rate_limit(path: str) -> bool:
    """Skip rate limiting for API documentation endpoints."""

    return path.startswith("/api/docs") or path.startswith("/api/openapi")
