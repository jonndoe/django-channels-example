from django.template.defaultfilters import slugify
from django.core.management.base import BaseCommand
from faker import Faker
from blog.models import Post

class Command(BaseCommand):
    help = 'In charge of create posts with faker, by default create 20.'

    def add_arguments(self, parser):
        parser.add_argument('--number', type=str)

    def handle(self, *args, **options):
        number = int(options.get('number'))

        for n in range(number):
            # Instances
            f = Faker()
            p = Post()

            # Getting fake values and save in db
            p.STATUS_CHOICES = 'Published'
            p.title = f'Post fake number {n} by {f.name()}'
            p.slug = slugify(p.title)
            num = 0
            text = ''
            while(num <= 10):
                text += f.text()
                num = num+1
            p.body = text
            p.save()

            # Output
            self.stdout.write(self.style.SUCCESS(f'Post {p.pk} created.'))
