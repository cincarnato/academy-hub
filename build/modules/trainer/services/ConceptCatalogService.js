import { AbstractService } from "@drax/crud-back";
class ConceptCatalogService extends AbstractService {
    constructor(ConceptCatalogRepository, baseSchema, fullSchema) {
        super(ConceptCatalogRepository, baseSchema, fullSchema);
        this._validateOutput = true;
    }
}
export default ConceptCatalogService;
export { ConceptCatalogService };
