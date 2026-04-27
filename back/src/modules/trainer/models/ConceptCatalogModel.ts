
import {mongoose} from '@drax/common-back';
import {PaginateModel} from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2'
import type {IConceptCatalog} from '../interfaces/IConceptCatalog'

const ConceptCatalogSchema = new mongoose.Schema<IConceptCatalog>({
            title: {type: String,   required: true, index: true, unique: true },
            descripcion: {type: String,   required: false, index: false, unique: false },
            slug: {type: String,   required: true, index: true, unique: true },
            concepts: [{ 
                        name: {type: String,   required: true, index: false, unique: false },
            explanation: {type: String,   required: false, index: false, unique: false },
            example: {type: String,   required: false, index: false, unique: false },
            utility: {type: String,   required: false, index: false, unique: false } 
            }]
}, {timestamps: true});

ConceptCatalogSchema.plugin(uniqueValidator, {message: 'validation.unique'});
ConceptCatalogSchema.plugin(mongoosePaginate);

ConceptCatalogSchema.virtual("id").get(function () {
    return this._id.toString();
});


ConceptCatalogSchema.set('toJSON', {getters: true, virtuals: true});

ConceptCatalogSchema.set('toObject', {getters: true, virtuals: true});

const MODEL_NAME = 'ConceptCatalog';
const COLLECTION_NAME = 'conceptcatalogs';
const ConceptCatalogModel = mongoose.model<IConceptCatalog, PaginateModel<IConceptCatalog>>(MODEL_NAME, ConceptCatalogSchema,COLLECTION_NAME);

export {
    ConceptCatalogSchema,
    ConceptCatalogModel
}

export default ConceptCatalogModel
