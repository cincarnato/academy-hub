import { AbstractService } from "@drax/crud-back";
class ResourceCatalogService extends AbstractService {
    constructor(ResourceCatalogRepository, baseSchema, fullSchema) {
        super(ResourceCatalogRepository, baseSchema, fullSchema);
        this._validateOutput = true;
    }
}
export default ResourceCatalogService;
export { ResourceCatalogService };
