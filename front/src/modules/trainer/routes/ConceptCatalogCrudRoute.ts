
import ConceptCatalogCrudPage from "../pages/crud/ConceptCatalogCrudPage.vue";


const ConceptCatalogCrudRoute = [
  {
    name: 'ConceptCatalogCrudPage',
    path: '/crud/conceptcatalog',
    component: ConceptCatalogCrudPage,
    meta: {
      auth: true,
      permission: 'conceptcatalog:manage',
    }
  },
]

export default ConceptCatalogCrudRoute
export { ConceptCatalogCrudRoute }
