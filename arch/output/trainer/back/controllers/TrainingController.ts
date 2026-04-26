
import TrainingServiceFactory from "../factory/services/TrainingServiceFactory.js";
import {AbstractFastifyController} from "@drax/crud-back";
import TrainingPermissions from "../permissions/TrainingPermissions.js";
import type {ITraining, ITrainingBase} from "../interfaces/ITraining";

class TrainingController extends AbstractFastifyController<ITraining, ITrainingBase, ITrainingBase>   {

    constructor() {
        super(TrainingServiceFactory.instance, TrainingPermissions)
        this.tenantField = "tenant";
        this.userField = "user";
        
        this.tenantFilter = false;
        this.tenantSetter = false;
        this.tenantAssert = false;
        
        this.userFilter = false;
        this.userSetter = false;
        this.userAssert = false;
    }

}

export default TrainingController;
export {
    TrainingController
}

