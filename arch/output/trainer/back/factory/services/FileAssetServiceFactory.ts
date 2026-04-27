
import FileAssetMongoRepository from '../../repository/mongo/FileAssetMongoRepository.js'
import FileAssetSqliteRepository from '../../repository/sqlite/FileAssetSqliteRepository.js'
import type {IFileAssetRepository} from "../../interfaces/IFileAssetRepository";
import {FileAssetService} from '../../services/FileAssetService.js'
import {FileAssetBaseSchema, FileAssetSchema} from "../../schemas/FileAssetSchema.js";
import {COMMON, CommonConfig, DraxConfig} from "@drax/common-back";

class FileAssetServiceFactory {
    private static service: FileAssetService;

    public static get instance(): FileAssetService {
        if (!FileAssetServiceFactory.service) {
            
            let repository: IFileAssetRepository
            switch (DraxConfig.getOrLoad(CommonConfig.DbEngine)) {
                case COMMON.DB_ENGINES.MONGODB:
                    repository = new FileAssetMongoRepository()
                    break;
                case COMMON.DB_ENGINES.SQLITE:
                    const dbFile = DraxConfig.getOrLoad(CommonConfig.SqliteDbFile)
                    repository = new FileAssetSqliteRepository(dbFile, false)
                    repository.build()
                    break;
                default:
                    throw new Error("DraxConfig.DB_ENGINE must be one of " + Object.values(COMMON.DB_ENGINES).join(", "));
            }
            
            const baseSchema = FileAssetBaseSchema;
            const fullSchema = FileAssetSchema;
            FileAssetServiceFactory.service = new FileAssetService(repository, baseSchema, fullSchema);
        }
        return FileAssetServiceFactory.service;
    }
}

export default FileAssetServiceFactory
export {
    FileAssetServiceFactory
}

