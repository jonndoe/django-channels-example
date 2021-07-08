from django.forms import ModelForm
from django.views.generic.edit import FormView

from blog.models import Subscription


class SubscriptionForm(ModelForm):
    class Meta:
        model = Subscription
        fields = ['name', 'email']


class SignupView(FormView):
    template_name = 'blog/signup.html'
    form_class = SubscriptionForm
    subtitle = 'Newsletter Signup'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['people'] = Subscription.objects.all()
        return context
