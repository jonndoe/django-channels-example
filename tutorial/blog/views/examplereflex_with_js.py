from django.views.generic.base import TemplateView


class ExamplereflexWithJsView(TemplateView):
    template_name = 'blog/examplereflex_with_js.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['count'] = 0
        return context
