from django.urls import path

from .views import CategoryListView, WebsiteListView

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("websites/", WebsiteListView.as_view(), name="website-list"),
]