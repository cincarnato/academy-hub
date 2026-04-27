
import { z } from 'zod';


const ConceptCatalogBaseSchema = z.object({
      title: z.string().min(1,'validation.required'),
    descripcion: z.string().optional(),
    slug: z.string().min(1,'validation.required'),
    concepts: z.array(
z.object({    name: z.string().min(1,'validation.required'),
    explanation: z.string().optional(),
    example: z.string().optional(),
    utility: z.string().optional()})
    ).optional()
});

const ConceptCatalogSchema = ConceptCatalogBaseSchema
    .extend({
      _id: z.coerce.string(),
       
    })

export default ConceptCatalogSchema;
export {ConceptCatalogSchema, ConceptCatalogBaseSchema}
