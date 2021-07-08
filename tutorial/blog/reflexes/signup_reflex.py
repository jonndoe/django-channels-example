from sockpuppet.reflex import Reflex
from blog.models import Subscription

class SignupReflex(Reflex):

    def add_person(self):
        o = Subscription.objects.update_or_create(
            name=self.params['name'],
            email=self.params['email']
        )

    def remove_person(self):
        id = self.element.dataset['id']
        Subscription.objects.filter(id=id).delete()
