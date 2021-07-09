from django.views.generic.base import TemplateView


class ProgressBarView(TemplateView):
    template_name = 'blog/progress_bar.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['status'] = 10
        return context
