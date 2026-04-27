
import type{IConceptCatalogRepository} from "../interfaces/IConceptCatalogRepository";
import type {IConceptCatalogBase, IConceptCatalog} from "../interfaces/IConceptCatalog";
import {AbstractService} from "@drax/crud-back";
import type {ZodObject, ZodRawShape} from "zod";

class ConceptCatalogService extends AbstractService<IConceptCatalog, IConceptCatalogBase, IConceptCatalogBase> {


    constructor(ConceptCatalogRepository: IConceptCatalogRepository, baseSchema?: ZodObject<ZodRawShape>, fullSchema?: ZodObject<ZodRawShape>) {
        super(ConceptCatalogRepository, baseSchema, fullSchema);
        
        this._validateOutput = true
        
    }

}

export default ConceptCatalogService
export {ConceptCatalogService}
