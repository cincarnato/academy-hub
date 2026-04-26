import {z} from 'zod';


const TrainingBaseSchema = z.object({
    name: z.string().min(1, 'validation.required'),
    slug: z.string().optional().default(''),
    description: z.string().optional().default(''),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    category: z.string().optional().default(''),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    globalSlideCss: z.string().optional().default(''),
    files: z.array(
        z.object({
            label: z.string().optional().default(''),
            file: z.object({
                filename: z.string().optional(),
                filepath: z.string().optional(),
                size: z.number().optional(),
                mimetype: z.string().optional(),
                url: z.string().optional()
            }).nullish().default({filename: '', filepath: '', size: 0, mimetype: '', url: ''})
        })
    ).optional().default([]),
    slides: z.array(
        z.object({
            title: z.string().min(1, 'validation.required'),
            subtitle: z.string().optional().default(''),
            contentType: z.enum(['html', 'markdown']).default('markdown'),
            content: z.string().min(1, 'validation.required'),

            speakerNotes: z.string().optional().default(''),
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
            enabled: z.boolean().optional().default(true)
        })
    ).optional(),
    primaryColor: z.string().optional().nullish(),
    coverImageUrl: z.string().optional().nullish(),
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
