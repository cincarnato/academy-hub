
import {AbstractCrudRestProvider} from "@drax/crud-front";
import type {IConceptCatalog, IConceptCatalogBase} from '../interfaces/IConceptCatalog'

class ConceptCatalogProvider extends AbstractCrudRestProvider<IConceptCatalog, IConceptCatalogBase, IConceptCatalogBase> {
    
  static singleton: ConceptCatalogProvider
    
  constructor() {
   super('/api/concept-catalogs')
  }
  
  static get instance() {
    if(!ConceptCatalogProvider.singleton){
      ConceptCatalogProvider.singleton = new ConceptCatalogProvider()
    }
    return ConceptCatalogProvider.singleton
  }

  async findByIdOrSlug(value: string): Promise<IConceptCatalog> {
    try {
      return await this.findOne({
        filters: [{field: 'slug', operator: 'eq', value}]
      })
    } catch {
      return await this.findById(value)
    }
  }

}

export default ConceptCatalogProvider
