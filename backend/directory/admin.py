from django.contrib import admin

from .models import Category, Click, ShortLink, Website


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Website)
class WebsiteAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "is_featured",
        "is_active",
        "click_count",
        "created_at",
    )
    list_filter = ("category", "is_featured", "is_active")
    search_fields = ("name", "description", "url")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(ShortLink)
class ShortLinkAdmin(admin.ModelAdmin):
    list_display = (
        "code",
        "destination_url",
        "click_count",
        "is_active",
        "created_at",
        "expires_at",
    )
    list_filter = ("is_active",)
    search_fields = ("code", "destination_url")


@admin.register(Click)
class ClickAdmin(admin.ModelAdmin):
    list_display = (
        "website",
        "short_link",
        "referrer",
        "created_at",
    )
    list_filter = ("created_at",)
    search_fields = ("referrer", "user_agent")