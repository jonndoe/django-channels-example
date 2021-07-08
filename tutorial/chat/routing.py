from django.urls import re_path
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
import channels

from .consumers import ChatConsumer

print('chat.routing working now.')

channels_version = channels.__version__.split('.')[0]
if int(channels_version) >= 3:
    from sockpuppet.consumer import SockpuppetConsumerAsgi as SockpuppetConsumer
    socket_patterns = [
        re_path(r'ws/sockpuppet-sync', SockpuppetConsumer.as_asgi()),
        re_path(r'ws/chat/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
    ]
else:
    from sockpuppet.consumer import SockpuppetConsumer
    socket_patterns = [re_path(r'ws/sockpuppet-sync', SockpuppetConsumer)],
    re_path(r'ws/chat/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),

application = ProtocolTypeRouter({
    'websocket': AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(socket_patterns)
        ),
    )
})
