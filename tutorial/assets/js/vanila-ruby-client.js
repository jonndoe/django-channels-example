// Load all the controllers within this directory and all subdirectories.
// Controller files must be named *_controller.js.

import { Application } from 'stimulus'
import { definitionsFromContext } from 'stimulus/webpack-helpers'
import StimulusReflex from 'stimulus_reflex'
import consumer from './consumer'
import controller from './application_controller'
import CableReady from 'cable_ready'
import Examplereflex_With_JsController from "../../blog/javascript/controllers/examplereflex_with_js_controller";


const application = Application.start()

application.register("examplereflex_with_js", Examplereflex_With_JsController)


StimulusReflex.initialize(application, {
  controller,
  debug: true,
  isolate: true
})
CableReady.initialize({ consumer })