from sockpuppet.reflex import Reflex

import logging

logger = logging.getLogger('dj-ch-ex-logger')


class ExamplereflexWithJsReflex(Reflex):
    logger.debug('Entered ExamplereflexWithJsReflex(Reflex)')
    def increment(self, step=1):
        logger.debug('Entered increment method.')
        self.count = int(self.element.dataset['count']) + step
        logger.debug('Increment method execution finished.')
