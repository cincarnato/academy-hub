import FileAssetCrudRoute from "./FileAssetCrudRoute"
import ResourceCatalogCrudRoute from "./ResourceCatalogCrudRoute"
import TrainingCrudRoute from "./TrainingCrudRoute"
import TrainerRoutes from "./TrainerRoutes"

export const routes = [
  ...FileAssetCrudRoute,
  ...ResourceCatalogCrudRoute,
  ...TrainingCrudRoute,
  ...TrainerRoutes
]

export default routes
