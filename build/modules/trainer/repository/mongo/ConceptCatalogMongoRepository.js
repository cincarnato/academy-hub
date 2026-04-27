import { AbstractMongoRepository } from "@drax/crud-back";
import { ConceptCatalogModel } from "../../models/ConceptCatalogModel.js";
class ConceptCatalogMongoRepository extends AbstractMongoRepository {
    constructor() {
        super();
        this._model = ConceptCatalogModel;
        this._searchFields = ['title', 'descripcion', 'slug'];
        this._populateFields = [];
        this._lean = true;
    }
}
export default ConceptCatalogMongoRepository;
export { ConceptCatalogMongoRepository };
