import ConceptCatalogCrudRoute from "./ConceptCatalogCrudRoute"
import FileAssetCrudRoute from "./FileAssetCrudRoute"
import ResourceCatalogCrudRoute from "./ResourceCatalogCrudRoute"
import TrainingCrudRoute from "./TrainingCrudRoute"
import TrainerRoutes from "./TrainerRoutes"

export const routes = [
  ...ConceptCatalogCrudRoute,
  ...FileAssetCrudRoute,
  ...ResourceCatalogCrudRoute,
  ...TrainingCrudRoute,
  ...TrainerRoutes
]

export default routes
