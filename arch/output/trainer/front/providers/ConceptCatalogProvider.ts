
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

}

export default ConceptCatalogProvider

