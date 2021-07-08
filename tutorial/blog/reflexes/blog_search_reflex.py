from sockpuppet.reflex import Reflex
from django.db.models import Q 
from blog.models import Post


class BlogSearchReflex(Reflex):

    def perform(self, query=''):

        posts = Post.objects.filter(
            Q(title__icontains=query) | Q(title__icontains=query)
        )

        self.posts = posts
        self.count = len(posts)
