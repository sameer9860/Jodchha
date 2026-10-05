import secrets
import string

from .models import ShortLink


def generate_short_code(length=7):
    characters = string.ascii_letters + string.digits

    while True:
        code = "".join(secrets.choice(characters) for _ in range(length))

        if not ShortLink.objects.filter(code=code).exists():
            return code