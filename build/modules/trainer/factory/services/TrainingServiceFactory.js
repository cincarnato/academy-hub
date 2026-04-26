import TrainingMongoRepository from '../../repository/mongo/TrainingMongoRepository.js';
import TrainingSqliteRepository from '../../repository/sqlite/TrainingSqliteRepository.js';
import { TrainingService } from '../../services/TrainingService.js';
import { TrainingBaseSchema, TrainingSchema } from "../../schemas/TrainingSchema.js";
import { COMMON, CommonConfig, DraxConfig } from "@drax/common-back";
class TrainingServiceFactory {
    static get instance() {
        if (!TrainingServiceFactory.service) {
            let repository;
            switch (DraxConfig.getOrLoad(CommonConfig.DbEngine)) {
                case COMMON.DB_ENGINES.MONGODB:
                    repository = new TrainingMongoRepository();
                    break;
                case COMMON.DB_ENGINES.SQLITE:
                    const dbFile = DraxConfig.getOrLoad(CommonConfig.SqliteDbFile);
                    repository = new TrainingSqliteRepository(dbFile, false);
                    repository.build();
                    break;
                default:
                    throw new Error("DraxConfig.DB_ENGINE must be one of " + Object.values(COMMON.DB_ENGINES).join(", "));
            }
            const baseSchema = TrainingBaseSchema;
            const fullSchema = TrainingSchema;
            TrainingServiceFactory.service = new TrainingService(repository, baseSchema, fullSchema);
        }
        return TrainingServiceFactory.service;
    }
}
export default TrainingServiceFactory;
export { TrainingServiceFactory };
