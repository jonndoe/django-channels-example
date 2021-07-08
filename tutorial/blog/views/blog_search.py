from django.views.generic.base import TemplateView


class BlogSearchView(TemplateView):
    template_name = 'blog/blog_search.html'
    subtitle = None


