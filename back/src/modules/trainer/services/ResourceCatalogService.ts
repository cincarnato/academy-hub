
import type{IResourceCatalogRepository} from "../interfaces/IResourceCatalogRepository";
import type {IResourceCatalogBase, IResourceCatalog} from "../interfaces/IResourceCatalog";
import {AbstractService} from "@drax/crud-back";
import type {ZodObject, ZodRawShape} from "zod";

class ResourceCatalogService extends AbstractService<IResourceCatalog, IResourceCatalogBase, IResourceCatalogBase> {


    constructor(ResourceCatalogRepository: IResourceCatalogRepository, baseSchema?: ZodObject<ZodRawShape>, fullSchema?: ZodObject<ZodRawShape>) {
        super(ResourceCatalogRepository, baseSchema, fullSchema);
        
        this._validateOutput = true
        
    }

}

export default ResourceCatalogService
export {ResourceCatalogService}
