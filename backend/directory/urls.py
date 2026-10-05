from django.urls import path

from .views import (
    CategoryListView,
    WebsiteListView,
    website_redirect,
)

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("websites/", WebsiteListView.as_view(), name="website-list"),
    path("go/<slug:slug>/", website_redirect, name="website-redirect"),
]