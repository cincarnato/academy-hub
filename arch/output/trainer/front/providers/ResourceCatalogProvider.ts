
import {AbstractCrudRestProvider} from "@drax/crud-front";
import type {IResourceCatalog, IResourceCatalogBase} from '../interfaces/IResourceCatalog'

class ResourceCatalogProvider extends AbstractCrudRestProvider<IResourceCatalog, IResourceCatalogBase, IResourceCatalogBase> {
    
  static singleton: ResourceCatalogProvider
    
  constructor() {
   super('/api/resource-catalogs')
  }
  
  static get instance() {
    if(!ResourceCatalogProvider.singleton){
      ResourceCatalogProvider.singleton = new ResourceCatalogProvider()
    }
    return ResourceCatalogProvider.singleton
  }

}

export default ResourceCatalogProvider

