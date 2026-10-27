from rest_framework.throttling import AnonRateThrottle


class ShortLinkCreateThrottle(AnonRateThrottle):
    scope = "shortlink_create"


class RedirectThrottle(AnonRateThrottle):
    scope = "redirect"
