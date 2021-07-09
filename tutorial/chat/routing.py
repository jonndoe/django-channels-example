from django.urls import re_path
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
import channels

# CableReadyConsumer should have been imported from blog app, but
# it gives error. So implement it in .consumers for now.
from .consumers import ChatConsumer, CableReadyConsumer

print('chat.routing working now.')

channels_version = channels.__version__.split('.')[0]
if int(channels_version) >= 3:
    from sockpuppet.consumer import SockpuppetConsumerAsgi as SockpuppetConsumer
    socket_patterns = [
        re_path(r'ws/sockpuppet-sync', SockpuppetConsumer.as_asgi()),
        re_path(r'ws/chat/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
        re_path(r'ws/cableready-sync', CableReadyConsumer.as_asgi()),
    ]
else:
    from sockpuppet.consumer import SockpuppetConsumer
    socket_patterns = [re_path(r'ws/sockpuppet-sync', SockpuppetConsumer)],
    re_path(r'ws/chat/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
    re_path(r'ws/cableready-sync', CableReadyConsumer.as_asgi()),

application = ProtocolTypeRouter({
    'websocket': AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(socket_patterns)
        ),
    )
})
