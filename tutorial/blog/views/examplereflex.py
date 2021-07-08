from django.views.generic.base import TemplateView


class ExamplereflexView(TemplateView):
    template_name = 'blog/examplereflex.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['count'] = 0
        return context
