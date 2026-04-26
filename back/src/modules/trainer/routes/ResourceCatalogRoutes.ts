
import ResourceCatalogController from "../controllers/ResourceCatalogController.js";
import {CrudSchemaBuilder} from "@drax/crud-back";
import {ResourceCatalogSchema, ResourceCatalogBaseSchema} from '../schemas/ResourceCatalogSchema.js'

async function ResourceCatalogFastifyRoutes(fastify, options) {

    const controller: ResourceCatalogController = new ResourceCatalogController()
    const schemas = new CrudSchemaBuilder(ResourceCatalogSchema, ResourceCatalogBaseSchema,ResourceCatalogBaseSchema, 'ResourceCatalog', 'openapi-3.0', ['Trainer']);

    fastify.get('/api/resource-catalogs', {schema: schemas.paginateSchema}, (req,rep) => controller.paginate(req,rep))
    
    fastify.get('/api/resource-catalogs/find', {schema: schemas.findSchema}, (req,rep) => controller.find(req,rep))
    
    fastify.get('/api/resource-catalogs/search', {schema: schemas.searchSchema}, (req,rep) => controller.search(req,rep))
    
    fastify.get('/api/resource-catalogs/:id', {schema: schemas.findByIdSchema}, (req,rep) => controller.findById(req,rep))
    
    fastify.get('/api/resource-catalogs/find-one', {schema: schemas.findOneSchema}, (req,rep) => controller.findOne(req,rep))
    
    fastify.get('/api/resource-catalogs/group-by', {schema: schemas.groupBySchema}, (req,rep) => controller.groupBy(req,rep))

    fastify.post('/api/resource-catalogs', {schema: schemas.createSchema}, (req,rep) =>controller.create(req,rep))

    fastify.put('/api/resource-catalogs/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.update(req,rep))
    
    fastify.patch('/api/resource-catalogs/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.updatePartial(req,rep))

    fastify.delete('/api/resource-catalogs/:id', {schema: schemas.deleteSchema}, (req,rep) =>controller.delete(req,rep))
    
    fastify.get('/api/resource-catalogs/export', (req,rep) =>controller.export(req,rep))
    
    fastify.post('/api/resource-catalogs/import', (req,rep) => controller.import(req,rep))
    
}

export default ResourceCatalogFastifyRoutes;
export {ResourceCatalogFastifyRoutes}
