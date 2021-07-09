from sockpuppet.reflex import Reflex

from sockpuppet.channel import Channel
import time


class ProgressBarReflex(Reflex):

    def increment(self, step=10):
        if int(self.element.dataset['status']) == 100:
            self.status = 10
        else:
            self.status = int(self.element.dataset['status']) + step

        '''
        channel = Channel(self.get_channel_id(), identifier="{\"channel\":\"StimulusReflex::Channel\"}")
        status = self.status
        if status < 100:
            status += 10
            channel.set_attribute({
                'selector': "#progress-bar",
                'name': "style",
                'value': "width: {status}%".format(status=status)
            })
            channel.broadcast()
            '''