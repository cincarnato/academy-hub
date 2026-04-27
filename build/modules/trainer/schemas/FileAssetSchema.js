import { z } from 'zod';
const FileAssetBaseSchema = z.object({
    label: z.string().min(1, 'validation.required'),
    file: z.object({
        filename: z.string().optional(),
        filepath: z.string().optional(),
        size: z.number().optional(),
        mimetype: z.string().optional(),
        url: z.string().optional()
    })
});
const FileAssetSchema = FileAssetBaseSchema
    .extend({
    _id: z.coerce.string(),
});
export default FileAssetSchema;
export { FileAssetSchema, FileAssetBaseSchema };
