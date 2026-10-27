"""
Tests for the directory app.

Covers: public APIs (categories, websites, redirects, shortlinks),
admin CRUD, analytics, and throttle enforcement.
"""
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from .models import Category, Click, ShortLink, Website

User = get_user_model()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
class _BaseTestCase(TestCase):
    """Shared fixtures used by most test classes."""

    @classmethod
    def setUpTestData(cls):
        cls.admin_user = User.objects.create_superuser(
            username="admin",
            password="adminpass123",
        )
        cls.regular_user = User.objects.create_user(
            username="user",
            password="userpass123",
        )

        cls.category = Category.objects.create(
            name="News",
            slug="news",
            icon="📰",
            description="News websites",
        )
        cls.inactive_category = Category.objects.create(
            name="Archived",
            slug="archived",
            is_active=False,
        )

        cls.website = Website.objects.create(
            category=cls.category,
            name="Example News",
            slug="example-news",
            description="An example news site",
            url="https://example.com",
            logo="https://example.com/logo.png",
            is_featured=True,
        )
        cls.inactive_website = Website.objects.create(
            category=cls.category,
            name="Old Site",
            slug="old-site",
            description="No longer active",
            url="https://old.example.com",
            is_active=False,
        )

    def setUp(self):
        self.client = APIClient()


def _admin_client(test_case):
    """Return an APIClient authenticated as the admin user."""
    client = APIClient()
    response = client.post(
        reverse("token-obtain-pair"),
        {"username": "admin", "password": "adminpass123"},
        format="json",
    )
    token = response.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client


# ---------------------------------------------------------------------------
# Public – Categories
# ---------------------------------------------------------------------------
class CategoryListTests(_BaseTestCase):
    def test_list_active_categories(self):
        response = self.client.get(reverse("category-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        slugs = [c["slug"] for c in response.data]
        self.assertIn("news", slugs)
        self.assertNotIn("archived", slugs)


# ---------------------------------------------------------------------------
# Public – Websites
# ---------------------------------------------------------------------------
class WebsiteListTests(_BaseTestCase):
    def test_list_active_websites(self):
        response = self.client.get(reverse("website-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("results", response.data)
        slugs = [w["slug"] for w in results]
        self.assertIn("example-news", slugs)
        self.assertNotIn("old-site", slugs)

    def test_filter_by_category(self):
        response = self.client.get(
            reverse("website-list"),
            {"category": "news"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_featured(self):
        response = self.client.get(
            reverse("website-list"),
            {"featured": "true"},
        )
        results = response.data.get("results", response.data)
        self.assertTrue(all(w["is_featured"] for w in results))

    def test_search(self):
        response = self.client.get(
            reverse("website-list"),
            {"search": "Example"},
        )
        results = response.data.get("results", response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["slug"], "example-news")

    def test_pagination(self):
        response = self.client.get(
            reverse("website-list"),
            {"page_size": 1},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIn("count", data)
        self.assertIn("results", data)
        self.assertEqual(len(data["results"]), 1)


class WebsiteDetailTests(_BaseTestCase):
    def test_detail_by_slug(self):
        response = self.client.get(
            reverse("website-detail", kwargs={"slug": "example-news"})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Example News")
        self.assertEqual(response.data["logo"], "https://example.com/logo.png")

    def test_detail_inactive_404(self):
        response = self.client.get(
            reverse("website-detail", kwargs={"slug": "old-site"})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_detail_nonexistent_404(self):
        response = self.client.get(
            reverse("website-detail", kwargs={"slug": "does-not-exist"})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


# ---------------------------------------------------------------------------
# Public – Website redirect + click recording
# ---------------------------------------------------------------------------
class WebsiteRedirectTests(_BaseTestCase):
    def test_redirect_records_click(self):
        clicks_before = Click.objects.filter(website=self.website).count()
        count_before = Website.objects.get(pk=self.website.pk).click_count

        response = self.client.get(
            reverse("website-redirect", kwargs={"slug": "example-news"})
        )

        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.url, "https://example.com")

        self.assertEqual(
            Click.objects.filter(website=self.website).count(),
            clicks_before + 1,
        )
        self.assertEqual(
            Website.objects.get(pk=self.website.pk).click_count,
            count_before + 1,
        )

    def test_redirect_inactive_404(self):
        response = self.client.get(
            reverse("website-redirect", kwargs={"slug": "old-site"})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


# ---------------------------------------------------------------------------
# Public – Short links
# ---------------------------------------------------------------------------
class ShortLinkCreateTests(_BaseTestCase):
    def test_create_short_link(self):
        response = self.client.post(
            reverse("shortlink-create"),
            {"destination_url": "https://google.com"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("code", response.data)
        self.assertEqual(
            response.data["destination_url"], "https://google.com"
        )

    def test_create_short_link_invalid_url(self):
        response = self.client.post(
            reverse("shortlink-create"),
            {"destination_url": "not-a-url"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ShortLinkRedirectTests(_BaseTestCase):
    def setUp(self):
        super().setUp()
        self.short_link = ShortLink.objects.create(
            code="abc1234",
            destination_url="https://redirect-target.com",
        )

    def test_redirect_works(self):
        response = self.client.get(
            reverse("shortlink-redirect", kwargs={"code": "abc1234"})
        )
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.url, "https://redirect-target.com")

    def test_redirect_records_click(self):
        clicks_before = Click.objects.filter(
            short_link=self.short_link,
        ).count()

        self.client.get(
            reverse("shortlink-redirect", kwargs={"code": "abc1234"})
        )

        self.assertEqual(
            Click.objects.filter(short_link=self.short_link).count(),
            clicks_before + 1,
        )

    def test_expired_link_redirects_home(self):
        self.short_link.expires_at = timezone.now() - timedelta(hours=1)
        self.short_link.save()

        response = self.client.get(
            reverse("shortlink-redirect", kwargs={"code": "abc1234"})
        )
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.url, "/")

    def test_inactive_link_404(self):
        self.short_link.is_active = False
        self.short_link.save()

        response = self.client.get(
            reverse("shortlink-redirect", kwargs={"code": "abc1234"})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


# ---------------------------------------------------------------------------
# Auth – Admin login
# ---------------------------------------------------------------------------
class AdminLoginTests(_BaseTestCase):
    def test_admin_login_success(self):
        response = self.client.post(
            reverse("token-obtain-pair"),
            {"username": "admin", "password": "adminpass123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_non_staff_login_rejected(self):
        response = self.client.post(
            reverse("token-obtain-pair"),
            {"username": "user", "password": "userpass123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_wrong_password_rejected(self):
        response = self.client.post(
            reverse("token-obtain-pair"),
            {"username": "admin", "password": "wrong"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


# ---------------------------------------------------------------------------
# Admin CRUD – Categories
# ---------------------------------------------------------------------------
class AdminCategoryTests(_BaseTestCase):
    def test_list_requires_auth(self):
        response = self.client.get(reverse("admin-category-list"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_crud_lifecycle(self):
        client = _admin_client(self)

        # Create
        response = client.post(
            reverse("admin-category-list"),
            {"name": "Tech", "icon": "💻", "description": "Technology"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        cat_id = response.data["id"]
        self.assertEqual(response.data["slug"], "tech")

        # List
        response = client.get(reverse("admin-category-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Update
        response = client.patch(
            reverse("admin-category-detail", kwargs={"pk": cat_id}),
            {"description": "Updated description"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["description"], "Updated description")

        # Delete
        response = client.delete(
            reverse("admin-category-detail", kwargs={"pk": cat_id})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_protected_category(self):
        """Cannot delete a category that has websites linked to it."""
        client = _admin_client(self)
        response = client.delete(
            reverse(
                "admin-category-detail",
                kwargs={"pk": self.category.pk},
            )
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# ---------------------------------------------------------------------------
# Admin CRUD – Websites
# ---------------------------------------------------------------------------
class AdminWebsiteTests(_BaseTestCase):
    def test_crud_lifecycle(self):
        client = _admin_client(self)

        # Create
        response = client.post(
            reverse("admin-website-list"),
            {
                "category": self.category.pk,
                "name": "New Site",
                "description": "Brand new",
                "url": "https://new.example.com",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        site_id = response.data["id"]
        self.assertEqual(response.data["slug"], "new-site")

        # Update
        response = client.patch(
            reverse("admin-website-detail", kwargs={"pk": site_id}),
            {"is_featured": True},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["is_featured"])

        # Delete
        response = client.delete(
            reverse("admin-website-detail", kwargs={"pk": site_id})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_search_filter(self):
        client = _admin_client(self)
        response = client.get(
            reverse("admin-website-list"),
            {"search": "Example"},
        )
        results = response.data.get("results", response.data)
        self.assertTrue(len(results) >= 1)


# ---------------------------------------------------------------------------
# Admin CRUD – Short Links
# ---------------------------------------------------------------------------
class AdminShortLinkTests(_BaseTestCase):
    def test_crud_lifecycle(self):
        client = _admin_client(self)

        # Create (auto-generates code)
        response = client.post(
            reverse("admin-shortlink-list"),
            {"destination_url": "https://destination.com"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        link_id = response.data["id"]
        self.assertTrue(len(response.data["code"]) > 0)

        # Create with custom code
        response = client.post(
            reverse("admin-shortlink-list"),
            {"destination_url": "https://other.com", "code": "mycode"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["code"], "mycode")

        # Update
        response = client.patch(
            reverse("admin-shortlink-detail", kwargs={"pk": link_id}),
            {"is_active": False},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["is_active"])

        # Delete
        response = client.delete(
            reverse("admin-shortlink-detail", kwargs={"pk": link_id})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


# ---------------------------------------------------------------------------
# Admin – Analytics
# ---------------------------------------------------------------------------
class AnalyticsTests(_BaseTestCase):
    def test_requires_auth(self):
        response = self.client.get(reverse("analytics-dashboard"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_default_range(self):
        client = _admin_client(self)
        response = client.get(reverse("analytics-dashboard"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("summary", response.data)
        self.assertIn("daily_clicks", response.data)
        self.assertIn("top_websites", response.data)

    def test_custom_date_range(self):
        client = _admin_client(self)
        today = timezone.now().date()
        response = client.get(
            reverse("analytics-dashboard"),
            {
                "start_date": (today - timedelta(days=7)).isoformat(),
                "end_date": today.isoformat(),
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_date_format(self):
        client = _admin_client(self)
        response = client.get(
            reverse("analytics-dashboard"),
            {"start_date": "not-a-date"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_start_after_end(self):
        client = _admin_client(self)
        response = client.get(
            reverse("analytics-dashboard"),
            {"start_date": "2026-12-01", "end_date": "2026-01-01"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# ---------------------------------------------------------------------------
# Throttle enforcement
# ---------------------------------------------------------------------------
class ThrottleTests(_BaseTestCase):
    """Verify that rate limits actually block excess requests.

    DRF throttle classes cache parsed rates at the class level, so
    ``override_settings`` alone is not sufficient. We patch the class
    attributes directly and use a dedicated in-memory cache.
    """

    def setUp(self):
        super().setUp()
        from django.core.cache import caches

        # Use the default cache for throttling, clear it for isolation.
        self._cache = caches["default"]
        self._cache.clear()

        # Temporarily lower the rates on the throttle classes.
        from .throttles import RedirectThrottle, ShortLinkCreateThrottle

        self._orig_create_rate = getattr(ShortLinkCreateThrottle, "rate", None)
        self._orig_redirect_rate = getattr(RedirectThrottle, "rate", None)
        ShortLinkCreateThrottle.rate = "2/minute"
        RedirectThrottle.rate = "3/minute"

    def tearDown(self):
        from .throttles import RedirectThrottle, ShortLinkCreateThrottle

        if self._orig_create_rate is not None:
            ShortLinkCreateThrottle.rate = self._orig_create_rate
        elif hasattr(ShortLinkCreateThrottle, "rate"):
            delattr(ShortLinkCreateThrottle, "rate")

        if self._orig_redirect_rate is not None:
            RedirectThrottle.rate = self._orig_redirect_rate
        elif hasattr(RedirectThrottle, "rate"):
            delattr(RedirectThrottle, "rate")

        self._cache.clear()
        super().tearDown()

    def test_shortlink_create_throttled(self):
        url = reverse("shortlink-create")
        for i in range(2):
            response = self.client.post(
                url,
                {"destination_url": f"https://example{i}.com"},
                format="json",
            )
            self.assertEqual(
                response.status_code,
                status.HTTP_201_CREATED,
                f"Request {i + 1} should succeed",
            )

        # 3rd request should be throttled
        response = self.client.post(
            url,
            {"destination_url": "https://throttled.com"},
            format="json",
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_429_TOO_MANY_REQUESTS,
        )

    def test_redirect_throttled(self):
        link = ShortLink.objects.create(
            code="throttle1",
            destination_url="https://dest.com",
        )
        url = reverse("shortlink-redirect", kwargs={"code": link.code})

        for i in range(3):
            response = self.client.get(url)
            self.assertEqual(
                response.status_code,
                status.HTTP_302_FOUND,
                f"Request {i + 1} should succeed",
            )

        # 4th request should be throttled
        response = self.client.get(url)
        self.assertEqual(
            response.status_code,
            status.HTTP_429_TOO_MANY_REQUESTS,
        )
