
import type {IConceptCatalog, IConceptCatalogBase} from './IConceptCatalog'
import {IDraxCrudRepository} from "@drax/crud-share";

interface IConceptCatalogRepository extends IDraxCrudRepository<IConceptCatalog, IConceptCatalogBase, IConceptCatalogBase>{

}

export {IConceptCatalogRepository}


