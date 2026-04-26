import ResourceCatalogMongoRepository from '../../repository/mongo/ResourceCatalogMongoRepository.js';
import ResourceCatalogSqliteRepository from '../../repository/sqlite/ResourceCatalogSqliteRepository.js';
import { ResourceCatalogService } from '../../services/ResourceCatalogService.js';
import { ResourceCatalogBaseSchema, ResourceCatalogSchema } from "../../schemas/ResourceCatalogSchema.js";
import { COMMON, CommonConfig, DraxConfig } from "@drax/common-back";
class ResourceCatalogServiceFactory {
    static get instance() {
        if (!ResourceCatalogServiceFactory.service) {
            let repository;
            switch (DraxConfig.getOrLoad(CommonConfig.DbEngine)) {
                case COMMON.DB_ENGINES.MONGODB:
                    repository = new ResourceCatalogMongoRepository();
                    break;
                case COMMON.DB_ENGINES.SQLITE:
                    const dbFile = DraxConfig.getOrLoad(CommonConfig.SqliteDbFile);
                    repository = new ResourceCatalogSqliteRepository(dbFile, false);
                    repository.build();
                    break;
                default:
                    throw new Error("DraxConfig.DB_ENGINE must be one of " + Object.values(COMMON.DB_ENGINES).join(", "));
            }
            const baseSchema = ResourceCatalogBaseSchema;
            const fullSchema = ResourceCatalogSchema;
            ResourceCatalogServiceFactory.service = new ResourceCatalogService(repository, baseSchema, fullSchema);
        }
        return ResourceCatalogServiceFactory.service;
    }
}
export default ResourceCatalogServiceFactory;
export { ResourceCatalogServiceFactory };
