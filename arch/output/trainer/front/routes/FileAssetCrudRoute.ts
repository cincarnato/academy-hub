
import FileAssetCrudPage from "../pages/crud/FileAssetCrudPage.vue";


const FileAssetCrudRoute = [
  {
    name: 'FileAssetCrudPage',
    path: '/crud/fileasset',
    component: FileAssetCrudPage,
    meta: {
      auth: true,
      permission: 'fileasset:manage',
    }
  },
]

export default FileAssetCrudRoute
export { FileAssetCrudRoute }
