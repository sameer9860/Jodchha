from django.contrib import admin

from .models import Category, Click, ShortLink, Website


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ("is_active",)
    ordering = ("name",)


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
    list_editable = ("is_featured", "is_active")
    readonly_fields = ("click_count", "created_at", "updated_at")
    autocomplete_fields = ("category",)
    ordering = ("-is_featured", "-created_at")


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
    list_editable = ("is_active",)
    readonly_fields = ("click_count", "created_at")
    ordering = ("-created_at",)


@admin.register(Click)
class ClickAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "website",
        "short_link",
        "referrer",
        "created_at",
    )
    list_filter = ("created_at",)
    search_fields = ("referrer", "user_agent", "website__name", "short_link__code")
    readonly_fields = (
        "website",
        "short_link",
        "referrer",
        "user_agent",
        "created_at",
    )
    autocomplete_fields = ("website", "short_link")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
