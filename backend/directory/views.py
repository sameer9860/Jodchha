from datetime import datetime, timedelta

from django.db.models import Count, F, Q
from django.shortcuts import get_object_or_404, redirect
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response

from .models import Category, Click, ShortLink, Website
from .serializers import (
    CategorySerializer,
    ShortLinkSerializer,
    WebsiteSerializer,
)
from .utils import generate_short_code

from rest_framework.permissions import IsAdminUser

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer


class WebsiteListView(generics.ListAPIView):
    serializer_class = WebsiteSerializer

    def get_queryset(self):
        queryset = Website.objects.filter(is_active=True).select_related("category")

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

    Website.objects.filter(pk=website.pk).update(click_count=F("click_count") + 1)

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

    ShortLink.objects.filter(pk=short_link.pk).update(click_count=F("click_count") + 1)

    Click.objects.create(
        short_link=short_link,
        referrer=request.headers.get("Referer", ""),
        user_agent=request.headers.get("User-Agent", ""),
    )

    return redirect(short_link.destination_url)


class AnalyticsDashboardView(generics.GenericAPIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, *args, **kwargs):
        now = timezone.now()
        today = now.date()

        today_start = timezone.make_aware(
            datetime.combine(
                today,
                datetime.min.time(),
            )
        )

        week_start = now - timedelta(days=7)
        month_start = now - timedelta(days=30)

        total_clicks = Click.objects.count()

        clicks_today = Click.objects.filter(
            created_at__gte=today_start,
        ).count()

        clicks_week = Click.objects.filter(
            created_at__gte=week_start,
        ).count()

        clicks_month = Click.objects.filter(
            created_at__gte=month_start,
        ).count()

        top_websites = (
            Website.objects.filter(is_active=True)
            .order_by("-click_count", "name")[:10]
            .values(
                "id",
                "name",
                "slug",
                "click_count",
            )
        )

        top_categories = (
            Click.objects.filter(website__isnull=False)
            .values(
                "website__category__name",
            )
            .annotate(
                clicks=Count("id"),
            )
            .order_by("-clicks")[:10]
        )

        recent_clicks = Click.objects.select_related(
            "website",
            "short_link",
        ).order_by("-created_at")[:20]

        recent_data = [
            {
                "id": click.id,
                "website": click.website.name if click.website else None,
                "short_link": click.short_link.code if click.short_link else None,
                "created_at": click.created_at,
            }
            for click in recent_clicks
        ]

        return Response(
            {
                "summary": {
                    "total_clicks": total_clicks,
                    "clicks_today": clicks_today,
                    "clicks_week": clicks_week,
                    "clicks_month": clicks_month,
                },
                "top_websites": list(top_websites),
                "top_categories": list(top_categories),
                "recent_clicks": recent_data,
            }
        )
