from datetime import date, time, datetime, timedelta

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

        start_date_param = request.query_params.get("start_date")
        end_date_param = request.query_params.get("end_date")

        # Default to the previous 30 days when no dates are provided.
        try:
            start_date = (
                date.fromisoformat(start_date_param)
                if start_date_param
                else today - timedelta(days=29)
            )
            end_date = (
                date.fromisoformat(end_date_param)
                if end_date_param
                else today
            )
        except ValueError:
            return Response(
                {
                    "detail": (
                        "Invalid date format. Please use YYYY-MM-DD "
                        "(e.g., 2026-10-09)."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if start_date > end_date:
            return Response(
        {
            "detail": (
                "Start date must be before or equal to the end date."
            )
        },
        status=status.HTTP_400_BAD_REQUEST,
    )

        start_datetime = timezone.make_aware(
            datetime.combine(start_date, time.min)
        )
        end_datetime = timezone.make_aware(
            datetime.combine(end_date + timedelta(days=1), time.min)
        )

        period_clicks = Click.objects.filter(
            created_at__gte=start_datetime,
            created_at__lt=end_datetime,
        )

        total_clicks = period_clicks.count()

        today_start = timezone.make_aware(
            datetime.combine(today, time.min)
        )
        tomorrow_start = today_start + timedelta(days=1)
        week_start = now - timedelta(days=7)
        month_start = now - timedelta(days=30)

        clicks_today = period_clicks.filter(
            created_at__gte=today_start,
            created_at__lt=tomorrow_start,
        ).count()

        clicks_week = period_clicks.filter(
            created_at__gte=week_start,
        ).count()

        clicks_month = period_clicks.filter(
            created_at__gte=month_start,
        ).count()

        daily_clicks = (
            period_clicks
            .extra(select={"day": "DATE(created_at)"})
            .values("day")
            .annotate(clicks=Count("id"))
            .order_by("day")
        )

        top_websites = (
            Website.objects.filter(is_active=True)
            .order_by("-click_count", "name")[:10]
            .values("id", "name", "slug", "click_count")
        )

        top_categories = (
            period_clicks.filter(website__isnull=False)
            .values("website__category__name")
            .annotate(clicks=Count("id"))
            .order_by("-clicks")[:10]
        )

        recent_clicks = (
            period_clicks.select_related("website", "short_link")
            .order_by("-created_at")[:20]
        )

        recent_data = [
            {
                "id": click.id,
                "website": click.website.name if click.website else None,
                "short_link": (
                    click.short_link.code if click.short_link else None
                ),
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
                "daily_clicks": [
                    {
                        "date": item["day"].isoformat(),
                        "clicks": item["clicks"],
                    }
                    for item in daily_clicks
                ],
                "top_websites": list(top_websites),
                "top_categories": list(top_categories),
                "recent_clicks": recent_data,
            }
        )