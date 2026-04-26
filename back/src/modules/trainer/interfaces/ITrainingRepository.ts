
import type {ITraining, ITrainingBase} from './ITraining'
import {IDraxCrudRepository} from "@drax/crud-share";

interface ITrainingRepository extends IDraxCrudRepository<ITraining, ITrainingBase, ITrainingBase>{

}

export {ITrainingRepository}


