
import ConceptCatalogMongoRepository from '../../repository/mongo/ConceptCatalogMongoRepository.js'
import ConceptCatalogSqliteRepository from '../../repository/sqlite/ConceptCatalogSqliteRepository.js'
import type {IConceptCatalogRepository} from "../../interfaces/IConceptCatalogRepository";
import {ConceptCatalogService} from '../../services/ConceptCatalogService.js'
import {ConceptCatalogBaseSchema, ConceptCatalogSchema} from "../../schemas/ConceptCatalogSchema.js";
import {COMMON, CommonConfig, DraxConfig} from "@drax/common-back";

class ConceptCatalogServiceFactory {
    private static service: ConceptCatalogService;

    public static get instance(): ConceptCatalogService {
        if (!ConceptCatalogServiceFactory.service) {
            
            let repository: IConceptCatalogRepository
            switch (DraxConfig.getOrLoad(CommonConfig.DbEngine)) {
                case COMMON.DB_ENGINES.MONGODB:
                    repository = new ConceptCatalogMongoRepository()
                    break;
                case COMMON.DB_ENGINES.SQLITE:
                    const dbFile = DraxConfig.getOrLoad(CommonConfig.SqliteDbFile)
                    repository = new ConceptCatalogSqliteRepository(dbFile, false)
                    repository.build()
                    break;
                default:
                    throw new Error("DraxConfig.DB_ENGINE must be one of " + Object.values(COMMON.DB_ENGINES).join(", "));
            }
            
            const baseSchema = ConceptCatalogBaseSchema;
            const fullSchema = ConceptCatalogSchema;
            ConceptCatalogServiceFactory.service = new ConceptCatalogService(repository, baseSchema, fullSchema);
        }
        return ConceptCatalogServiceFactory.service;
    }
}

export default ConceptCatalogServiceFactory
export {
    ConceptCatalogServiceFactory
}

