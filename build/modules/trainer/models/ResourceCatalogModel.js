import { mongoose } from '@drax/common-back';
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
const ResourceCatalogSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true, unique: true },
    slug: { type: String, required: true, index: true, unique: true },
    description: { type: String, required: false, index: false, unique: false },
    status: { type: String, enum: ['draft', 'published', 'archived'], required: true, index: true, unique: false },
    category: { type: String, required: false, index: true, unique: false },
    tags: [{ type: String, required: false, index: false, unique: false }],
    resources: [{
            name: { type: String, required: true, index: false, unique: false },
            url: { type: String, required: true, index: false, unique: false },
            description: { type: String, required: false, index: false, unique: false },
            creator: { type: String, required: false, index: false, unique: false },
            company: { type: String, required: false, index: false, unique: false },
            category: { type: String, required: false, index: false, unique: false },
            tags: [{ type: String, required: false, index: false, unique: false }],
            imageUrl: { type: String, required: false, index: false, unique: false },
            logoUrl: { type: String, required: false, index: false, unique: false },
            enabled: { type: Boolean, required: false, index: false, unique: false },
            metadata: {}
        }],
    isPublic: { type: Boolean, required: false, index: false, unique: false },
    publishedAt: { type: Date, required: false, index: false, unique: false },
    coverImageUrl: { type: String, required: false, index: false, unique: false },
    metadata: {}
}, { timestamps: true });
ResourceCatalogSchema.plugin(uniqueValidator, { message: 'validation.unique' });
ResourceCatalogSchema.plugin(mongoosePaginate);
ResourceCatalogSchema.virtual("id").get(function () {
    return this._id.toString();
});
ResourceCatalogSchema.set('toJSON', { getters: true, virtuals: true });
ResourceCatalogSchema.set('toObject', { getters: true, virtuals: true });
const MODEL_NAME = 'ResourceCatalog';
const COLLECTION_NAME = 'resourcecatalogs';
const ResourceCatalogModel = mongoose.model(MODEL_NAME, ResourceCatalogSchema, COLLECTION_NAME);
export { ResourceCatalogSchema, ResourceCatalogModel };
export default ResourceCatalogModel;
