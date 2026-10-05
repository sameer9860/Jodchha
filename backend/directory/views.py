from django.db.models import F, Q
from django.shortcuts import get_object_or_404, redirect
from rest_framework import generics

from .models import Category, Click, Website
from .serializers import CategorySerializer, WebsiteSerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer


class WebsiteListView(generics.ListAPIView):
    serializer_class = WebsiteSerializer

    def get_queryset(self):
        queryset = Website.objects.filter(
            is_active=True
        ).select_related("category")

        category = self.request.query_params.get("category")
        featured = self.request.query_params.get("featured")
        search = self.request.query_params.get("search")

        if category:
            queryset = queryset.filter(category__slug=category)

        if featured == "true":
            queryset = queryset.filter(is_featured=True)

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(category__name__icontains=search)
            )

        return queryset


def website_redirect(request, slug):
    website = get_object_or_404(
        Website,
        slug=slug,
        is_active=True,
    )

    Website.objects.filter(pk=website.pk).update(
        click_count=F("click_count") + 1
    )

    Click.objects.create(
        website=website,
        referrer=request.headers.get("Referer", ""),
        user_agent=request.headers.get("User-Agent", ""),
    )

    return redirect(website.url)