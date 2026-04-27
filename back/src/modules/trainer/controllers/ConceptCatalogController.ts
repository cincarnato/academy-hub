
import ConceptCatalogServiceFactory from "../factory/services/ConceptCatalogServiceFactory.js";
import {AbstractFastifyController} from "@drax/crud-back";
import ConceptCatalogPermissions from "../permissions/ConceptCatalogPermissions.js";
import type {IConceptCatalog, IConceptCatalogBase} from "../interfaces/IConceptCatalog";
import {CustomRequest} from "@drax/crud-back/src/controllers/AbstractFastifyController";

class ConceptCatalogController extends AbstractFastifyController<IConceptCatalog, IConceptCatalogBase, IConceptCatalogBase>   {

    constructor() {
        super(ConceptCatalogServiceFactory.instance, ConceptCatalogPermissions)
        this.tenantField = "tenant";
        this.userField = "user";

        this.tenantFilter = false;
        this.tenantSetter = false;
        this.tenantAssert = false;

        this.userFilter = false;
        this.userSetter = false;
        this.userAssert = false;
    }

    protected assertReadPermission(request: CustomRequest) {
        return true
    }

}

export default ConceptCatalogController;
export {
    ConceptCatalogController
}

