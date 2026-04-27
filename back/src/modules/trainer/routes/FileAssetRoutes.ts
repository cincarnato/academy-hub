
import FileAssetController from "../controllers/FileAssetController.js";
import {CrudSchemaBuilder} from "@drax/crud-back";
import {FileAssetSchema, FileAssetBaseSchema} from '../schemas/FileAssetSchema.js'

async function FileAssetFastifyRoutes(fastify, options) {

    const controller: FileAssetController = new FileAssetController()
    const schemas = new CrudSchemaBuilder(FileAssetSchema, FileAssetBaseSchema,FileAssetBaseSchema, 'FileAsset', 'openapi-3.0', ['Trainer']);

    fastify.get('/api/file-assets', {schema: schemas.paginateSchema}, (req,rep) => controller.paginate(req,rep))
    
    fastify.get('/api/file-assets/find', {schema: schemas.findSchema}, (req,rep) => controller.find(req,rep))
    
    fastify.get('/api/file-assets/search', {schema: schemas.searchSchema}, (req,rep) => controller.search(req,rep))
    
    fastify.get('/api/file-assets/:id', {schema: schemas.findByIdSchema}, (req,rep) => controller.findById(req,rep))
    
    fastify.get('/api/file-assets/find-one', {schema: schemas.findOneSchema}, (req,rep) => controller.findOne(req,rep))
    
    fastify.get('/api/file-assets/group-by', {schema: schemas.groupBySchema}, (req,rep) => controller.groupBy(req,rep))

    fastify.post('/api/file-assets', {schema: schemas.createSchema}, (req,rep) =>controller.create(req,rep))

    fastify.put('/api/file-assets/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.update(req,rep))
    
    fastify.patch('/api/file-assets/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.updatePartial(req,rep))

    fastify.delete('/api/file-assets/:id', {schema: schemas.deleteSchema}, (req,rep) =>controller.delete(req,rep))
    
    fastify.get('/api/file-assets/export', (req,rep) =>controller.export(req,rep))
    
    fastify.post('/api/file-assets/import', (req,rep) => controller.import(req,rep))
    
}

export default FileAssetFastifyRoutes;
export {FileAssetFastifyRoutes}
