import { z } from 'zod';
const ResourceCatalogBaseSchema = z.object({
    name: z.string().min(1, 'validation.required'),
    slug: z.string().min(1, 'validation.required'),
    description: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    resources: z.array(z.object({
        name: z.string().min(1, 'validation.required'),
        url: z.string().min(1, 'validation.required'),
        description: z.string().optional(),
        creator: z.string().optional(),
        company: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        logoUrl: z.string().optional(),
        enabled: z.boolean().optional(),
        metadata: z.record(z.string(), z.unknown()).optional().nullable()
    })).optional(),
    isPublic: z.boolean().optional(),
    publishedAt: z.coerce.date().nullable().optional(),
    coverImageUrl: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional().nullable()
});
const ResourceCatalogSchema = ResourceCatalogBaseSchema
    .extend({
    _id: z.coerce.string(),
});
export default ResourceCatalogSchema;
export { ResourceCatalogSchema, ResourceCatalogBaseSchema };
