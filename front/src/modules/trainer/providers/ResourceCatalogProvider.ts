
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

  async findByIdOrSlug(value: string): Promise<IResourceCatalog> {
    try {
      return await this.findOne({
        filters: [{field: 'slug', operator: 'eq', value}]
      })
    } catch {
      return await this.findById(value)
    }
  }

}

export default ResourceCatalogProvider
