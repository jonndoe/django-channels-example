from collections import defaultdict
from django.conf import settings
import os

BASE_PATH = settings.BASE_DIR


class BookSearchMixin():
    template_name = "blog/book_search_reflex.html"
    subtitle = None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["some_data"] = 'placeholder_string'
        return context
