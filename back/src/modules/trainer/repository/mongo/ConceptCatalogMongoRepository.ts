
import {AbstractMongoRepository} from "@drax/crud-back";
import {ConceptCatalogModel} from "../../models/ConceptCatalogModel.js";
import type {IConceptCatalogRepository} from '../../interfaces/IConceptCatalogRepository'
import type {IConceptCatalog, IConceptCatalogBase} from "../../interfaces/IConceptCatalog";


class ConceptCatalogMongoRepository extends AbstractMongoRepository<IConceptCatalog, IConceptCatalogBase, IConceptCatalogBase> implements IConceptCatalogRepository {

    constructor() {
        super();
        this._model = ConceptCatalogModel;
        this._searchFields = ['title', 'descripcion', 'slug'];
        this._populateFields = [];
        this._lean = true
    }

}

export default ConceptCatalogMongoRepository
export {ConceptCatalogMongoRepository}

