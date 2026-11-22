from slowapi import Limiter
from slowapi.util import get_remote_address

# Keyed by client IP. In production, run uvicorn with --proxy-headers so the
# real visitor IP (from X-Forwarded-For) is used instead of the proxy's.
limiter = Limiter(key_func=get_remote_address)
