
import {AbstractMongoRepository} from "@drax/crud-back";
import {ResourceCatalogModel} from "../../models/ResourceCatalogModel.js";
import type {IResourceCatalogRepository} from '../../interfaces/IResourceCatalogRepository'
import type {IResourceCatalog, IResourceCatalogBase} from "../../interfaces/IResourceCatalog";


class ResourceCatalogMongoRepository extends AbstractMongoRepository<IResourceCatalog, IResourceCatalogBase, IResourceCatalogBase> implements IResourceCatalogRepository {

    constructor() {
        super();
        this._model = ResourceCatalogModel;
        this._searchFields = ['name', 'slug', 'description', 'status', 'category', 'tags'];
        this._populateFields = [];
        this._lean = true
    }

}

export default ResourceCatalogMongoRepository
export {ResourceCatalogMongoRepository}

