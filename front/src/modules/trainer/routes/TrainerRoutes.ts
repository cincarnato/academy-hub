import ConceptCatalogPage from "../pages/ConceptCatalogPage.vue";
import ResourceCatalogPage from "../pages/ResourceCatalogPage.vue";
import ResourceCatalogGalleryPage from "../pages/ResourceCatalogGalleryPage.vue";
import TrainingImprovePage from "../pages/TrainingImprovePage.vue";
import TrainingPage from "../pages/TrainingPage.vue";

const TrainerRoutes = [
  {
    name: 'ResourceCatalogGalleryPage',
    path: '/resource-catalogs-gallery',
    component: ResourceCatalogGalleryPage,
    meta: {
      auth: false,
    }
  },
  {
    name: 'ResourceCatalogPage',
    path: '/resource-catalog/:catalogId',
    component: ResourceCatalogPage,
    props: true,
    meta: {
      auth: false,
    }
  },
  {
    name: 'ConceptCatalogPage',
    path: '/concept-catalog/:catalogId',
    component: ConceptCatalogPage,
    props: true,
    meta: {
      auth: false,
    }
  },
  {
    name: 'TrainingPage',
    path: '/training/:trainingId',
    component: TrainingPage,
    props: true,
    meta: {
      auth: false,
    }
  },
  {
    name: 'TrainingImprovePage',
    path: '/training/:trainingId/improve',
    component: TrainingImprovePage,
    props: true,
    meta: {
      auth: false,
    }
  },
]

export default TrainerRoutes
export { TrainerRoutes }
