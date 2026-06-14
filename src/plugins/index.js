import progress from './progress'
import element from './element'
import auth from './auth'
import request from './request'
import websocket from './websocket'

export function setupPlugins(app) {
  app.use(progress)
  app.use(element)
  app.use(auth)
  app.use(request)
  app.use(websocket)
}
