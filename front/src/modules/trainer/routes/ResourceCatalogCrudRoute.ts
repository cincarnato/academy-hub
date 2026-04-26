
import ResourceCatalogCrudPage from "../pages/crud/ResourceCatalogCrudPage.vue";


const ResourceCatalogCrudRoute = [
  {
    name: 'ResourceCatalogCrudPage',
    path: '/crud/resourcecatalog',
    component: ResourceCatalogCrudPage,
    meta: {
      auth: true,
      permission: 'resourcecatalog:manage',
    }
  },
]

export default ResourceCatalogCrudRoute
export { ResourceCatalogCrudRoute }
