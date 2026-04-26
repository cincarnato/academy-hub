
import {AbstractMongoRepository} from "@drax/crud-back";
import {TrainingModel} from "../../models/TrainingModel.js";
import type {ITrainingRepository} from '../../interfaces/ITrainingRepository'
import type {ITraining, ITrainingBase} from "../../interfaces/ITraining";


class TrainingMongoRepository extends AbstractMongoRepository<ITraining, ITrainingBase, ITrainingBase> implements ITrainingRepository {

    constructor() {
        super();
        this._model = TrainingModel;
        this._searchFields = ['name', 'slug', 'description', 'status', 'category', 'tags', 'author'];
        this._populateFields = [];
        this._lean = true
    }

}

export default TrainingMongoRepository
export {TrainingMongoRepository}

