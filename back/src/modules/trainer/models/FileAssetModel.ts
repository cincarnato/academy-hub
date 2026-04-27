
import {mongoose} from '@drax/common-back';
import {PaginateModel} from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2'
import type {IFileAsset} from '../interfaces/IFileAsset'

const FileAssetSchema = new mongoose.Schema<IFileAsset>({
            label: {type: String,   required: true, index: true, unique: false },
            file: {
        filename: {type: String ,  required: true, index: false, unique: false },
        filepath: {type: String ,  required: true, index: false, unique: false },
        size: {type: Number ,  required: true, index: false, unique: false },
        mimetype: {type: String ,  required: true, index: false, unique: false },
        url: {type: String ,  required: true, index: false, unique: false },
        }
}, {timestamps: true});

FileAssetSchema.plugin(uniqueValidator, {message: 'validation.unique'});
FileAssetSchema.plugin(mongoosePaginate);

FileAssetSchema.virtual("id").get(function () {
    return this._id.toString();
});


FileAssetSchema.set('toJSON', {getters: true, virtuals: true});

FileAssetSchema.set('toObject', {getters: true, virtuals: true});

const MODEL_NAME = 'FileAsset';
const COLLECTION_NAME = 'fileassets';
const FileAssetModel = mongoose.model<IFileAsset, PaginateModel<IFileAsset>>(MODEL_NAME, FileAssetSchema,COLLECTION_NAME);

export {
    FileAssetSchema,
    FileAssetModel
}

export default FileAssetModel
