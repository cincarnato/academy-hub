import TrainingServiceFactory from "../factory/services/TrainingServiceFactory.js";
import { AbstractFastifyController } from "@drax/crud-back";
import TrainingPermissions from "../permissions/TrainingPermissions.js";
class TrainingController extends AbstractFastifyController {
    constructor() {
        super(TrainingServiceFactory.instance, TrainingPermissions);
        this.tenantField = "tenant";
        this.userField = "user";
        this.tenantFilter = false;
        this.tenantSetter = false;
        this.tenantAssert = false;
        this.userFilter = false;
        this.userSetter = false;
        this.userAssert = false;
    }
    assertReadPermission(request) {
        request.rbac.assertPermission(this.permission.View);
    }
}
export default TrainingController;
export { TrainingController };
