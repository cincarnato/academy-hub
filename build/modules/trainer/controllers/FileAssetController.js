import FileAssetServiceFactory from "../factory/services/FileAssetServiceFactory.js";
import { AbstractFastifyController } from "@drax/crud-back";
import FileAssetPermissions from "../permissions/FileAssetPermissions.js";
class FileAssetController extends AbstractFastifyController {
    constructor() {
        super(FileAssetServiceFactory.instance, FileAssetPermissions);
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
export default FileAssetController;
export { FileAssetController };
