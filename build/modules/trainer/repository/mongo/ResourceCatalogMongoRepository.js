import { AbstractMongoRepository } from "@drax/crud-back";
import { ResourceCatalogModel } from "../../models/ResourceCatalogModel.js";
class ResourceCatalogMongoRepository extends AbstractMongoRepository {
    constructor() {
        super();
        this._model = ResourceCatalogModel;
        this._searchFields = ['name', 'slug', 'description', 'status', 'category', 'tags'];
        this._populateFields = [];
        this._lean = true;
    }
}
export default ResourceCatalogMongoRepository;
export { ResourceCatalogMongoRepository };
