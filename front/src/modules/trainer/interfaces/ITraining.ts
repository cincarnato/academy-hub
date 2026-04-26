
interface ITrainingBase {
    name: string
    slug?: string
    description?: string
    status: string
    category?: string
    tags?: Array<string>
    author?: string
    slides?: Array<{
    title: string
    subtitle?: string
    content: string
    contentType: string
    files?: Array<{
                filename: string,
                filepath: string,
                size: number,
                mimetype?: string,
                url: string
                }>
    order: number
    speakerNotes?: string
    quiz?: Array<{
    question: string
    description?: string
    type: string
    answers?: Array<{
    answer: string
    points?: number
    isCorrect?: boolean
    feedback?: string
    }>
    required?: boolean
    explanation?: string
    }>
    enabled?: boolean
    }>
    primaryColor?: string
    coverImageUrl?: string
    isPublic?: boolean
    publishedAt?: Date
    metadata?: {}
    createdAt?: Date
    updatedAt?: Date
}

interface ITraining {
    _id: string
    name: string
    slug?: string
    description?: string
    status: string
    category?: string
    tags?: Array<string>
    author?: string
    slides?: Array<{
    title: string
    subtitle?: string
    content: string
    contentType: string
    files?: Array<{
                filename: string,
                filepath: string,
                size: number,
                mimetype?: string,
                url: string
                }>
    order: number
    speakerNotes?: string
    quiz?: Array<{
    question: string
    description?: string
    type: string
    answers?: Array<{
    answer: string
    points?: number
    isCorrect?: boolean
    feedback?: string
    }>
    required?: boolean
    explanation?: string
    }>
    enabled?: boolean
    }>
    primaryColor?: string
    coverImageUrl?: string
    isPublic?: boolean
    publishedAt?: Date
    metadata?: {}
    createdAt?: Date
    updatedAt?: Date
}

export type {
ITrainingBase, 
ITraining
}
