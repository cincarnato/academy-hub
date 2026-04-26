
import TrainingCrudPage from "../pages/crud/TrainingCrudPage.vue";


const TrainingCrudRoute = [
  {
    name: 'TrainingCrudPage',
    path: '/crud/training',
    component: TrainingCrudPage,
    meta: {
      auth: true,
      permission: 'training:manage',
    }
  },
]

export default TrainingCrudRoute
export { TrainingCrudRoute }
