from django.db.models import Q
import random
import time

from django.views.generic import ListView, DetailView, TemplateView

# use this import instead of short 'from .models' to escape RuntimeErros
# https://medium.com/@michal.bock/fix-weird-exceptions-when-running-django-tests-f58def71b59a
from blog.models import Post


class PostListView(ListView):
    model = Post
    context_object_name = "post_list"
    template_name = "blog/post_list.html"
    paginate_by=5

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Added to see blue wait bar on top, as indication of working turbolinks
        time.sleep(random.randint(2, 3)) 
        return context


class PostDetailView(DetailView):
    model = Post
    context_object_name = 'post'
    template_name = 'blog/post_detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Added to see blue wait bar on top, as indication of working turbolinks
        # time.sleep(random.randint(2, 4)) 
        return context


class SearchPageView(TemplateView):
    model = Post
    template_name = "blog/search.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Added to see blue wait bar on top, as indication of working turbolinks
        # time.sleep(random.randint(2, 3)) 
        return context


class SearchResultView(ListView):
    model = Post
    context_object_name = 'post_list'
    template_name = 'blog/search_results.html'
    paginate_by=5

    def get_queryset(self):
        query = self.request.GET.get('q')
        return Post.objects.filter(
            Q(title__icontains=query) | Q(title__icontains=query)
        )
