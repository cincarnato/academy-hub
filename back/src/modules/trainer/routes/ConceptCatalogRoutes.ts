
import ConceptCatalogController from "../controllers/ConceptCatalogController.js";
import {CrudSchemaBuilder} from "@drax/crud-back";
import {ConceptCatalogSchema, ConceptCatalogBaseSchema} from '../schemas/ConceptCatalogSchema.js'

async function ConceptCatalogFastifyRoutes(fastify, options) {

    const controller: ConceptCatalogController = new ConceptCatalogController()
    const schemas = new CrudSchemaBuilder(ConceptCatalogSchema, ConceptCatalogBaseSchema,ConceptCatalogBaseSchema, 'ConceptCatalog', 'openapi-3.0', ['Trainer']);

    fastify.get('/api/concept-catalogs', {schema: schemas.paginateSchema}, (req,rep) => controller.paginate(req,rep))
    
    fastify.get('/api/concept-catalogs/find', {schema: schemas.findSchema}, (req,rep) => controller.find(req,rep))
    
    fastify.get('/api/concept-catalogs/search', {schema: schemas.searchSchema}, (req,rep) => controller.search(req,rep))
    
    fastify.get('/api/concept-catalogs/:id', {schema: schemas.findByIdSchema}, (req,rep) => controller.findById(req,rep))
    
    fastify.get('/api/concept-catalogs/find-one', {schema: schemas.findOneSchema}, (req,rep) => controller.findOne(req,rep))
    
    fastify.get('/api/concept-catalogs/group-by', {schema: schemas.groupBySchema}, (req,rep) => controller.groupBy(req,rep))

    fastify.post('/api/concept-catalogs', {schema: schemas.createSchema}, (req,rep) =>controller.create(req,rep))

    fastify.put('/api/concept-catalogs/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.update(req,rep))
    
    fastify.patch('/api/concept-catalogs/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.updatePartial(req,rep))

    fastify.delete('/api/concept-catalogs/:id', {schema: schemas.deleteSchema}, (req,rep) =>controller.delete(req,rep))
    
    fastify.get('/api/concept-catalogs/export', (req,rep) =>controller.export(req,rep))
    
    fastify.post('/api/concept-catalogs/import', (req,rep) => controller.import(req,rep))
    
}

export default ConceptCatalogFastifyRoutes;
export {ConceptCatalogFastifyRoutes}
