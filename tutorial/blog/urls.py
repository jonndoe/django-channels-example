from django.conf.urls import url
from django.urls import path

from blog.views.views import PostListView, PostDetailView, SearchResultView, SearchPageView
from blog.views.examplereflex import ExamplereflexView
from blog.views.examplereflex_with_js import ExamplereflexWithJsView
from blog.views.book_search import BookSearch
from blog.views.chat import ChatView
from blog.views.signup import SignupView
from blog.views.blog_search import BlogSearchView

from blog.models import Post


app_name = 'blog'


urlpatterns = [
    url(r'^$', PostListView.as_view(), name='post_list'),
    url(r'^(?P<year>\d{4})/(?P<month>\w{3})/(?P<day>\d{2})/(?P<slug>[-\w]+)/$',
        PostDetailView.as_view(), name='post_detail'),
    path('search/', SearchResultView.as_view(), name='search_result'),
    path('search-page/', SearchPageView.as_view(), name='search_page'),
    path('example-reflex/', ExamplereflexView.as_view(), name='example_reflex'),
    path('example-reflex-js/', ExamplereflexWithJsView.as_view(), name='example_reflex_js'),
    path('book-search-reflex/', BookSearch.as_view(), name='book_search_reflex'),
    path('chat-reflex/', ChatView.as_view(), name='chat_reflex'),
    path('signup-reflex/', SignupView.as_view(), name='signup_reflex'),
    path('blog-search-reflex/', BlogSearchView.as_view(), name='blog_search_reflex'),
]
