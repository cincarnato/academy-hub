import { ArchGenerator } from '@drax/arch';
import ConceptCatalogSchema from './schemas/trainer/ConceptCatalogSchema.js';
import FileAssetSchema from './schemas/trainer/FileAssetSchema.js';
import ResourceCatalogSchema from './schemas/trainer/ResourceCatalogSchema.js';
import TrainingSchema from './schemas/trainer/TrainingSchema.js';

//Import schemas

const schemas = [
    ConceptCatalogSchema,
    FileAssetSchema,
    ResourceCatalogSchema,
    TrainingSchema,
];

const generator = new ArchGenerator(schemas);
generator.build()
