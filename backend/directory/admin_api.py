from django.db.models import Q
from django.db.models.deletion import ProtectedError
from rest_framework import generics, serializers, status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from .models import Category, Click, ShortLink, Website
from .utils import generate_short_code


class AdminCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "icon",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {
            "slug": {"required": False, "allow_blank": True},
        }


class AdminWebsiteSerializer(serializers.ModelSerializer):
    category_detail = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Website
        fields = [
            "id",
            "category",
            "category_detail",
            "name",
            "slug",
            "description",
            "url",
            "logo",
            "is_featured",
            "is_active",
            "click_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "click_count", "created_at", "updated_at"]
        extra_kwargs = {
            "slug": {"required": False, "allow_blank": True},
            "logo": {"required": False, "allow_blank": True},
        }

    def get_category_detail(self, obj):
        return {
            "id": obj.category_id,
            "name": obj.category.name,
            "slug": obj.category.slug,
            "icon": obj.category.icon,
        }


class AdminShortLinkSerializer(serializers.ModelSerializer):
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
        read_only_fields = ["id", "click_count", "created_at"]
        extra_kwargs = {
            "code": {"required": False, "allow_blank": True},
            "expires_at": {"required": False, "allow_null": True},
        }

    def create(self, validated_data):
        code = (validated_data.get("code") or "").strip()
        if not code:
            validated_data["code"] = generate_short_code()
        return super().create(validated_data)


class AdminClickSerializer(serializers.ModelSerializer):
    website_name = serializers.CharField(
        source="website.name",
        read_only=True,
        allow_null=True,
    )
    short_link_code = serializers.CharField(
        source="short_link.code",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = Click
        fields = [
            "id",
            "website",
            "website_name",
            "short_link",
            "short_link_code",
            "referrer",
            "user_agent",
            "created_at",
        ]
        read_only_fields = fields


class AdminCategoryListCreateView(generics.ListCreateAPIView):
    permission_classes = (IsAdminUser,)
    serializer_class = AdminCategorySerializer
    queryset = Category.objects.all()

    def get_queryset(self):
        queryset = Category.objects.all()
        search = self.request.query_params.get("search")
        is_active = self.request.query_params.get("is_active")

        if search:
            queryset = queryset.filter(name__icontains=search)

        if is_active in {"true", "false"}:
            queryset = queryset.filter(is_active=is_active == "true")

        return queryset


class AdminCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAdminUser,)
    serializer_class = AdminCategorySerializer
    queryset = Category.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            self.perform_destroy(instance)
        except ProtectedError:
            return Response(
                {
                    "detail": (
                        "Cannot delete this category because websites are "
                        "still linked to it. Move or delete those websites first."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminWebsiteListCreateView(generics.ListCreateAPIView):
    permission_classes = (IsAdminUser,)
    serializer_class = AdminWebsiteSerializer

    def get_queryset(self):
        queryset = Website.objects.select_related("category").all()
        search = self.request.query_params.get("search")
        category = self.request.query_params.get("category")
        is_active = self.request.query_params.get("is_active")
        is_featured = self.request.query_params.get("is_featured")

        if search:
            queryset = queryset.filter(name__icontains=search)

        if category:
            queryset = queryset.filter(category_id=category)

        if is_active in {"true", "false"}:
            queryset = queryset.filter(is_active=is_active == "true")

        if is_featured in {"true", "false"}:
            queryset = queryset.filter(is_featured=is_featured == "true")

        return queryset


class AdminWebsiteDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAdminUser,)
    serializer_class = AdminWebsiteSerializer
    queryset = Website.objects.select_related("category").all()


class AdminShortLinkListCreateView(generics.ListCreateAPIView):
    permission_classes = (IsAdminUser,)
    serializer_class = AdminShortLinkSerializer

    def get_queryset(self):
        queryset = ShortLink.objects.all()
        search = self.request.query_params.get("search")
        is_active = self.request.query_params.get("is_active")

        if search:
            queryset = queryset.filter(
                Q(destination_url__icontains=search) | Q(code__icontains=search)
            )

        if is_active in {"true", "false"}:
            queryset = queryset.filter(is_active=is_active == "true")

        return queryset


class AdminShortLinkDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAdminUser,)
    serializer_class = AdminShortLinkSerializer
    queryset = ShortLink.objects.all()


class AdminClickListView(generics.ListAPIView):
    permission_classes = (IsAdminUser,)
    serializer_class = AdminClickSerializer

    def get_queryset(self):
        queryset = Click.objects.select_related("website", "short_link").all()
        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(
                Q(referrer__icontains=search)
                | Q(website__name__icontains=search)
                | Q(short_link__code__icontains=search)
            )

        return queryset[:200]


class AdminClickDetailView(generics.RetrieveAPIView):
    permission_classes = (IsAdminUser,)
    serializer_class = AdminClickSerializer
    queryset = Click.objects.select_related("website", "short_link").all()

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
