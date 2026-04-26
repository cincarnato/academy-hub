import {z} from 'zod';


const TrainingBaseSchema = z.object({
    name: z.string().min(1, 'validation.required'),
    slug: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    slides: z.array(
        z.object({
            title: z.string().min(1, 'validation.required'),
            subtitle: z.string().optional(),
            content: z.string().min(1, 'validation.required'),
            contentType: z.enum(['html', 'markdown']).default('markdown'),
            files: z.array(z.object({
                filename: z.string().optional(),
                filepath: z.string().optional(),
                size: z.number().optional(),
                mimetype: z.string().optional(),
                url: z.string().optional()
            })).optional(),
            order: z.number().min(0, 'validation.required'),
            speakerNotes: z.string().optional(),
            quiz: z.array(
                z.object({
                    question: z.string().min(1, 'validation.required'),
                    description: z.string().optional(),
                    type: z.enum(['single_choice', 'multiple_choice', 'open_text']),
                    answers: z.array(
                        z.object({
                            answer: z.string().min(1, 'validation.required'),
                            points: z.number().nullable().optional(),
                            isCorrect: z.boolean().optional(),
                            feedback: z.string().optional()
                        })
                    ).optional(),
                    required: z.boolean().optional(),
                    explanation: z.string().optional()
                })
            ).optional(),
            enabled: z.boolean().optional()
        })
    ).optional(),
    primaryColor: z.string().optional(),
    coverImageUrl: z.string().optional(),
    isPublic: z.boolean().optional(),
    publishedAt: z.coerce.date().nullable().optional(),
    metadata: z.record(z.string(),z.unknown()).optional().nullable()
});

const TrainingSchema = TrainingBaseSchema
    .extend({
        _id: z.coerce.string(),

    })

export default TrainingSchema;
export {TrainingSchema, TrainingBaseSchema}
