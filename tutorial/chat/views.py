from django.views.generic import TemplateView


class ChatView(TemplateView):
    template_name = "chat/chat.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Add somecontext here
        return context


class RoomView(TemplateView):
    template_name = "chat/room.html"

    room_name = None

    def get_object(self, queryset=None):
        return queryset.get(room_name=self.room_name)


