from django.urls import path

from .views import (
    CategoryListView,
    ShortLinkCreateView,
    WebsiteListView,
    website_redirect,
    short_link_redirect,
)

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("websites/", WebsiteListView.as_view(), name="website-list"),
    path("go/<slug:slug>/", website_redirect, name="website-redirect"),
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
]