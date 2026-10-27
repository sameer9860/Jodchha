from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .admin_api import (
    AdminCategoryDetailView,
    AdminCategoryListCreateView,
    AdminClickDetailView,
    AdminClickListView,
    AdminShortLinkDetailView,
    AdminShortLinkListCreateView,
    AdminWebsiteDetailView,
    AdminWebsiteListCreateView,
)
from .auth import AdminTokenObtainPairView
from .views import (
    AnalyticsDashboardView,
    CategoryListView,
    ShortLinkCreateView,
    ShortLinkRedirectView,
    WebsiteDetailView,
    WebsiteListView,
    WebsiteRedirectView,
)


urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("websites/", WebsiteListView.as_view(), name="website-list"),
    path(
        "websites/<slug:slug>/",
        WebsiteDetailView.as_view(),
        name="website-detail",
    ),
    path(
        "go/<slug:slug>/",
        WebsiteRedirectView.as_view(),
        name="website-redirect",
    ),
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
        ShortLinkRedirectView.as_view(),
        name="shortlink-redirect",
    ),
    path(
        "auth/token/",
        AdminTokenObtainPairView.as_view(),
        name="token-obtain-pair",
    ),
    path(
        "auth/token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),
    # Staff admin management
    path(
        "admin/categories/",
        AdminCategoryListCreateView.as_view(),
        name="admin-category-list",
    ),
    path(
        "admin/categories/<int:pk>/",
        AdminCategoryDetailView.as_view(),
        name="admin-category-detail",
    ),
    path(
        "admin/websites/",
        AdminWebsiteListCreateView.as_view(),
        name="admin-website-list",
    ),
    path(
        "admin/websites/<int:pk>/",
        AdminWebsiteDetailView.as_view(),
        name="admin-website-detail",
    ),
    path(
        "admin/shortlinks/",
        AdminShortLinkListCreateView.as_view(),
        name="admin-shortlink-list",
    ),
    path(
        "admin/shortlinks/<int:pk>/",
        AdminShortLinkDetailView.as_view(),
        name="admin-shortlink-detail",
    ),
    path(
        "admin/clicks/",
        AdminClickListView.as_view(),
        name="admin-click-list",
    ),
    path(
        "admin/clicks/<int:pk>/",
        AdminClickDetailView.as_view(),
        name="admin-click-detail",
    ),
]