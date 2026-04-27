
import FileAssetCrudRoute from "./FileAssetCrudRoute"
import ResourceCatalogCrudRoute from "./ResourceCatalogCrudRoute"
import TrainingCrudRoute from "./TrainingCrudRoute"

export const routes = [
    ...FileAssetCrudRoute,
...ResourceCatalogCrudRoute,
...TrainingCrudRoute
]

export default routes
