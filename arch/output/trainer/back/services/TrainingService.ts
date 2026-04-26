
import type{ITrainingRepository} from "../interfaces/ITrainingRepository";
import type {ITrainingBase, ITraining} from "../interfaces/ITraining";
import {AbstractService} from "@drax/crud-back";
import type {ZodObject, ZodRawShape} from "zod";

class TrainingService extends AbstractService<ITraining, ITrainingBase, ITrainingBase> {


    constructor(TrainingRepository: ITrainingRepository, baseSchema?: ZodObject<ZodRawShape>, fullSchema?: ZodObject<ZodRawShape>) {
        super(TrainingRepository, baseSchema, fullSchema);
        
        this._validateOutput = true
        
    }

}

export default TrainingService
export {TrainingService}
