import ResourceCatalogPage from "../pages/ResourceCatalogPage.vue";
import TrainingPage from "../pages/TrainingPage.vue";

const TrainerRoutes = [
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
    name: 'TrainingPage',
    path: '/training/:trainingId',
    component: TrainingPage,
    props: true,
    meta: {
      auth: false,
    }
  },
]

export default TrainerRoutes
export { TrainerRoutes }
