import json
from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))


class CableReadyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # self.room_name = self.scope['url_route']['kwargs']['room_name']
        # self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        # await self.channel_layer.group_add(
        #    self.room_group_name,
        #    self.channel_name
        #)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))


class StimulusReflexConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group = 'connected'

        # Join room group
        await self.channel_layer.group_add(
            self.group,
            self.channel_name
        )

        await self.accept()

        await self.send(json.dumps("{\"type\":\"welcome\"}"))
        await self.send(json.dumps({"type": "welcome"}, separators=(',', ':')))
        #await self.send(json.dumps({"setAttribute": [{"selector": "#progress-bar", "name": "style", "value": f"width:50%"}]}))
        '''
        await self.send(json.dumps({"identifier": "{\"channel\":\"StimulusReflex::Channel\"}",
                                    "type": "message",
                                    "cableReady": "true",
                                    "operations": {"setAttribute": [{"selector": "#progress-bar",
                                                                     "name": "style",
                                                                     "value": "width: 110%"
                                                                     }
                                                                    ]
                                                   }
                                    }))
        '''



    async def disconnect(self, close_code):
        # Leave room group
        pass

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )
