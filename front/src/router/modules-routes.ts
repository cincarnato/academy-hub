import baseRoutes from '../modules/base/routes/index.js'
import googleRoutes from '../modules/google/routes/index.js'
import trainerRoutes from '../modules/trainer/routes/index.js'

const modulesRoutes = [
  ...baseRoutes,
  ...googleRoutes,
  ...trainerRoutes

]

export default modulesRoutes
export {modulesRoutes}
