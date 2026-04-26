
import {mongoose} from '@drax/common-back';
import {PaginateModel} from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2'
import type {ITraining} from '../interfaces/ITraining'

const TrainingSchema = new mongoose.Schema<ITraining>({
            name: {type: String,   required: true, index: true, unique: false },
            slug: {type: String,   required: false, index: true, unique: true },
            description: {type: String,   required: false, index: false, unique: false },
            status: {type: String,  enum: ['draft', 'published', 'archived'], required: true, index: true, unique: false },
            category: {type: String,   required: false, index: true, unique: false },
            tags: [{type: String,   required: false, index: false, unique: false }],
            author: {type: String,   required: false, index: true, unique: false },
            slides: [{ 
                        title: {type: String,   required: true, index: false, unique: false },
            subtitle: {type: String,   required: false, index: false, unique: false },
            content: {type: String,   required: true, index: false, unique: false },
            contentType: {type: String,  enum: ['html', 'markdown'], required: true, index: false, unique: false },
            files: [{ 
            {
        filename: {type: String ,  required: false, index: false, unique: false },
        filepath: {type: String ,  required: false, index: false, unique: false },
        size: {type: Number ,  required: false, index: false, unique: false },
        mimetype: {type: String ,  required: false, index: false, unique: false },
        url: {type: String ,  required: false, index: false, unique: false },
        } 
            }],
            order: {type: Number,   required: true, index: false, unique: false },
            speakerNotes: {type: String,   required: false, index: false, unique: false },
            quiz: [{ 
                        question: {type: String,   required: true, index: false, unique: false },
            description: {type: String,   required: false, index: false, unique: false },
            type: {type: String,  enum: ['single_choice', 'multiple_choice', 'open_text'], required: true, index: false, unique: false },
            answers: [{ 
                        answer: {type: String,   required: true, index: false, unique: false },
            points: {type: Number,   required: false, index: false, unique: false },
            isCorrect: {type: Boolean,   required: false, index: false, unique: false },
            feedback: {type: String,   required: false, index: false, unique: false } 
            }],
            required: {type: Boolean,   required: false, index: false, unique: false },
            explanation: {type: String,   required: false, index: false, unique: false } 
            }],
            enabled: {type: Boolean,   required: false, index: false, unique: false } 
            }],
            primaryColor: {type: String,   required: false, index: false, unique: false },
            coverImageUrl: {type: String,   required: false, index: false, unique: false },
            isPublic: {type: Boolean,   required: false, index: false, unique: false },
            publishedAt: {type: Date,   required: false, index: false, unique: false },
            metadata: {type: mongoose.Schema.Types.Mixed,   required: false, index: false, unique: false }
}, {timestamps: true});

TrainingSchema.plugin(uniqueValidator, {message: 'validation.unique'});
TrainingSchema.plugin(mongoosePaginate);

TrainingSchema.virtual("id").get(function () {
    return this._id.toString();
});


TrainingSchema.set('toJSON', {getters: true, virtuals: true});

TrainingSchema.set('toObject', {getters: true, virtuals: true});

const MODEL_NAME = 'Training';
const COLLECTION_NAME = 'trainings';
const TrainingModel = mongoose.model<ITraining, PaginateModel<ITraining>>(MODEL_NAME, TrainingSchema,COLLECTION_NAME);

export {
    TrainingSchema,
    TrainingModel
}

export default TrainingModel
