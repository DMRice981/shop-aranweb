import progress from './progress'
import element from './element'
import auth from './auth'
import request from './request'

export function setupPlugins(app) {
  app.use(progress)
  app.use(element)
  app.use(auth)
  app.use(request)
}
