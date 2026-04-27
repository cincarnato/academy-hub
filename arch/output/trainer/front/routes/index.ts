
import ConceptCatalogCrudRoute from "./ConceptCatalogCrudRoute"
import FileAssetCrudRoute from "./FileAssetCrudRoute"
import ResourceCatalogCrudRoute from "./ResourceCatalogCrudRoute"
import TrainingCrudRoute from "./TrainingCrudRoute"

export const routes = [
    ...ConceptCatalogCrudRoute,
...FileAssetCrudRoute,
...ResourceCatalogCrudRoute,
...TrainingCrudRoute
]

export default routes
