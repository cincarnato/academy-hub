import { AbstractMongoRepository } from "@drax/crud-back";
import { TrainingModel } from "../../models/TrainingModel.js";
class TrainingMongoRepository extends AbstractMongoRepository {
    constructor() {
        super();
        this._model = TrainingModel;
        this._searchFields = ['name', 'slug', 'description', 'status', 'category', 'tags', 'author'];
        this._populateFields = [];
        this._lean = true;
    }
}
export default TrainingMongoRepository;
export { TrainingMongoRepository };
