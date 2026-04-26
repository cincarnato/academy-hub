
import TrainingController from "../controllers/TrainingController.js";
import {CrudSchemaBuilder} from "@drax/crud-back";
import {TrainingSchema, TrainingBaseSchema} from '../schemas/TrainingSchema.js'

async function TrainingFastifyRoutes(fastify, options) {

    const controller: TrainingController = new TrainingController()
    const schemas = new CrudSchemaBuilder(TrainingSchema, TrainingBaseSchema,TrainingBaseSchema, 'Training', 'openapi-3.0', ['Trainer']);

    fastify.get('/api/trainings', {schema: schemas.paginateSchema}, (req,rep) => controller.paginate(req,rep))
    
    fastify.get('/api/trainings/find', {schema: schemas.findSchema}, (req,rep) => controller.find(req,rep))
    
    fastify.get('/api/trainings/search', {schema: schemas.searchSchema}, (req,rep) => controller.search(req,rep))
    
    fastify.get('/api/trainings/:id', {schema: schemas.findByIdSchema}, (req,rep) => controller.findById(req,rep))
    
    fastify.get('/api/trainings/find-one', {schema: schemas.findOneSchema}, (req,rep) => controller.findOne(req,rep))
    
    fastify.get('/api/trainings/group-by', {schema: schemas.groupBySchema}, (req,rep) => controller.groupBy(req,rep))

    fastify.post('/api/trainings', {schema: schemas.createSchema}, (req,rep) =>controller.create(req,rep))

    fastify.put('/api/trainings/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.update(req,rep))
    
    fastify.patch('/api/trainings/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.updatePartial(req,rep))

    fastify.delete('/api/trainings/:id', {schema: schemas.deleteSchema}, (req,rep) =>controller.delete(req,rep))
    
    fastify.get('/api/trainings/export', (req,rep) =>controller.export(req,rep))
    
    fastify.post('/api/trainings/import', (req,rep) => controller.import(req,rep))
    
}

export default TrainingFastifyRoutes;
export {TrainingFastifyRoutes}
