from django.urls import path

from .views import (
    AnalyticsDashboardView,
    CategoryListView,
    ShortLinkCreateView,
    WebsiteListView,
    short_link_redirect,
    website_redirect,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("websites/", WebsiteListView.as_view(), name="website-list"),
    path("go/<slug:slug>/", website_redirect, name="website-redirect"),
    
    path(
    "analytics/",
    AnalyticsDashboardView.as_view(),
    name="analytics-dashboard",
    
    
),
    path(
        "shortlinks/",
        ShortLinkCreateView.as_view(),
        name="shortlink-create",
    ),
    path(
        "s/<str:code>/",
        short_link_redirect,
        name="shortlink-redirect",
    ),
   path(
    "auth/token/",
    TokenObtainPairView.as_view(),
    name="token-obtain-pair",
),
path(
    "auth/token/refresh/",
    TokenRefreshView.as_view(),
    name="token-refresh",
),
]