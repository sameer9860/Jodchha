from django.db.models import F, Q
from django.shortcuts import get_object_or_404, redirect
from rest_framework import generics

from .models import Category, Click, Website
from .serializers import CategorySerializer, WebsiteSerializer

from rest_framework import generics, status
from rest_framework.response import Response

from .models import Category, Click, ShortLink, Website
from .serializers import (
    CategorySerializer,
    ShortLinkSerializer,
    WebsiteSerializer,
)
from .utils import generate_short_code

from django.utils import timezone
from django.shortcuts import get_object_or_404, redirect
from django.db.models import F

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


class ShortLinkCreateView(generics.CreateAPIView):
    serializer_class = ShortLinkSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        short_link = ShortLink.objects.create(
            code=generate_short_code(),
            destination_url=serializer.validated_data["destination_url"],
            expires_at=serializer.validated_data.get("expires_at"),
        )

        output_serializer = self.get_serializer(short_link)

        return Response(
            output_serializer.data,
            status=status.HTTP_201_CREATED,
        )
        
def short_link_redirect(request, code):
    short_link = get_object_or_404(
        ShortLink,
        code=code,
        is_active=True,
    )

    if short_link.expires_at and short_link.expires_at <= timezone.now():
        return redirect("/")

    ShortLink.objects.filter(pk=short_link.pk).update(
        click_count=F("click_count") + 1
    )

    Click.objects.create(
        short_link=short_link,
        referrer=request.headers.get("Referer", ""),
        user_agent=request.headers.get("User-Agent", ""),
    )

    return redirect(short_link.destination_url)