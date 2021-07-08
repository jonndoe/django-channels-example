from django.urls import path

from .views import ChatView, RoomView

app_name = 'chat'

urlpatterns = [
    path('', ChatView.as_view(), name='chat'),
    path('<str:room_name>/', RoomView.as_view(), name='room'),
]
