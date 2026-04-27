import ConceptCatalogServiceFactory from "../factory/services/ConceptCatalogServiceFactory.js";
import { AbstractFastifyController } from "@drax/crud-back";
import ConceptCatalogPermissions from "../permissions/ConceptCatalogPermissions.js";
class ConceptCatalogController extends AbstractFastifyController {
    constructor() {
        super(ConceptCatalogServiceFactory.instance, ConceptCatalogPermissions);
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
        return true;
    }
}
export default ConceptCatalogController;
export { ConceptCatalogController };
