import { ArchGenerator } from '@drax/arch';
import FileAssetSchema from './schemas/trainer/FileAssetSchema.js';
import ResourceCatalogSchema from './schemas/trainer/ResourceCatalogSchema.js';
import TrainingSchema from './schemas/trainer/TrainingSchema.js';

//Import schemas

const schemas = [
    FileAssetSchema,
    ResourceCatalogSchema,
    TrainingSchema,
];

const generator = new ArchGenerator(schemas);
generator.build()
