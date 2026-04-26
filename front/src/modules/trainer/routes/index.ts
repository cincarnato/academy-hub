import ResourceCatalogCrudRoute from "./ResourceCatalogCrudRoute"
import TrainingCrudRoute from "./TrainingCrudRoute"
import TrainerRoutes from "./TrainerRoutes"

export const routes = [
  ...ResourceCatalogCrudRoute,
  ...TrainingCrudRoute,
  ...TrainerRoutes
]

export default routes
