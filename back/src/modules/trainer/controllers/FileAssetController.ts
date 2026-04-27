
import FileAssetServiceFactory from "../factory/services/FileAssetServiceFactory.js";
import {AbstractFastifyController} from "@drax/crud-back";
import FileAssetPermissions from "../permissions/FileAssetPermissions.js";
import type {IFileAsset, IFileAssetBase} from "../interfaces/IFileAsset";

class FileAssetController extends AbstractFastifyController<IFileAsset, IFileAssetBase, IFileAssetBase>   {

    constructor() {
        super(FileAssetServiceFactory.instance, FileAssetPermissions)
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
export {
    FileAssetController
}

