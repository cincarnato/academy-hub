import { AbstractService } from "@drax/crud-back";
class TrainingService extends AbstractService {
    constructor(TrainingRepository, baseSchema, fullSchema) {
        super(TrainingRepository, baseSchema, fullSchema);
        this._validateOutput = true;
    }
}
export default TrainingService;
export { TrainingService };
