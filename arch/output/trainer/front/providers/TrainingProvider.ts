
import {AbstractCrudRestProvider} from "@drax/crud-front";
import type {ITraining, ITrainingBase} from '../interfaces/ITraining'

class TrainingProvider extends AbstractCrudRestProvider<ITraining, ITrainingBase, ITrainingBase> {
    
  static singleton: TrainingProvider
    
  constructor() {
   super('/api/trainings')
  }
  
  static get instance() {
    if(!TrainingProvider.singleton){
      TrainingProvider.singleton = new TrainingProvider()
    }
    return TrainingProvider.singleton
  }

}

export default TrainingProvider

