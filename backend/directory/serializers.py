from rest_framework import serializers

from .models import Category, ShortLink, Website


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "icon"]


class WebsiteSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Website
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "url",
            "logo",
            "category",
            "is_featured",
            "is_active",
            "click_count",
            "created_at",
            "updated_at",
        ]


class ShortLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortLink
        fields = [
            "id",
            "code",
            "destination_url",
            "click_count",
            "is_active",
            "created_at",
            "expires_at",
        ]
        read_only_fields = ["id", "code", "click_count", "created_at"]