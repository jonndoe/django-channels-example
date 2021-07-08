from django.views.generic.base import TemplateView
from .mixins import BookSearchMixin


class BookSearch(BookSearchMixin, TemplateView):
    subtitle = 'Search Book'

