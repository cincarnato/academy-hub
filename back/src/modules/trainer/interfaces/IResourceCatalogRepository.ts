
import type {IResourceCatalog, IResourceCatalogBase} from './IResourceCatalog'
import {IDraxCrudRepository} from "@drax/crud-share";

interface IResourceCatalogRepository extends IDraxCrudRepository<IResourceCatalog, IResourceCatalogBase, IResourceCatalogBase>{

}

export {IResourceCatalogRepository}


