
interface ITrainingFile {
    filename: string
    filepath: string
    size: number
    mimetype?: string
    url: string
}

interface ITrainingFileReference {
    label?: string
    file: ITrainingFile
}

interface ITrainingQuizAnswer {
    answer: string
    points?: number
    isCorrect?: boolean
    feedback?: string
}

interface ITrainingQuizQuestion {
    question: string
    description?: string
    type: 'single_choice' | 'multiple_choice' | 'open_text' | string
    answers?: Array<ITrainingQuizAnswer>
    required?: boolean
    explanation?: string
}

interface ITrainingSlide {
    title: string
    subtitle?: string
    content: string
    contentType: string
    files?: Array<ITrainingFile>
    speakerNotes?: string
    quiz?: Array<ITrainingQuizQuestion>
    enabled?: boolean
}

interface ITrainingBase {
    name: string
    slug?: string
    description?: string
    status: string
    category?: string
    tags?: Array<string>
    author?: string
    globalSlideCss?: string
    files?: Array<ITrainingFileReference>
    slides?: Array<ITrainingSlide>
    primaryColor?: string
    coverImageUrl?: string
    isPublic?: boolean
    publishedAt?: Date
    metadata?: {}
    createdAt?: Date
    updatedAt?: Date
}

interface ITraining extends ITrainingBase {
    _id: string
}

export type {
    ITrainingBase,
    ITraining,
    ITrainingFile,
    ITrainingFileReference,
    ITrainingQuizAnswer,
    ITrainingQuizQuestion,
    ITrainingSlide,
}
