
import ResourceCatalogServiceFactory from "../factory/services/ResourceCatalogServiceFactory.js";
import {AbstractFastifyController} from "@drax/crud-back";
import ResourceCatalogPermissions from "../permissions/ResourceCatalogPermissions.js";
import type {IResourceCatalog, IResourceCatalogBase} from "../interfaces/IResourceCatalog";

class ResourceCatalogController extends AbstractFastifyController<IResourceCatalog, IResourceCatalogBase, IResourceCatalogBase>   {

    constructor() {
        super(ResourceCatalogServiceFactory.instance, ResourceCatalogPermissions)
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

export default ResourceCatalogController;
export {
    ResourceCatalogController
}

