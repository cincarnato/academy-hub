import { ArchGenerator } from '@drax/arch';
import ResourceCatalogSchema from './schemas/trainer/ResourceCatalogSchema.js';
import TrainingSchema from './schemas/trainer/TrainingSchema.js';

//Import schemas

const schemas = [
    ResourceCatalogSchema,
    TrainingSchema,
];

const generator = new ArchGenerator(schemas);
generator.build()
