import { IEntitySchema } from "@drax/arch";

const schema: IEntitySchema = {
    module: "trainer",
    name: "Training",
    apiBasePath: "trainings",
    collectionName: "trainings",
    apiTag: "Trainer",
    tabs: ["General", "Content", "Publication", "Advanced"],
    schema: {
        name: {
            type: "string",
            required: true,
            index: true,
            search: true,
            header: true,
            groupTab: "General"
        },
        slug: {
            type: "string",
            required: false,
            unique: true,
            index: true,
            search: true,
            header: true,
            groupTab: "General"
        },
        description: {
            type: "longString",
            required: false,
            search: true,
            header: false,
            groupTab: "General"
        },
        status: {
            type: "enum",
            enum: ["draft", "published", "archived"],
            required: true,
            default: "draft",
            index: true,
            search: true,
            header: true,
            groupTab: "General"
        },
        category: {
            type: "string",
            required: false,
            index: true,
            search: true,
            header: true,
            groupTab: "General"
        },
        tags: {
            type: "array.string",
            required: false,
            search: true,
            header: false,
            groupTab: "General"
        },
        author: {
            type: "string",
            required: false,
            index: true,
            search: true,
            header: true,
            groupTab: "General"
        },
        slides: {
            type: "array.object",
            required: false,
            header: false,
            groupTab: "Content",
            schema: {
                title: {
                    type: "string",
                    required: true,
                    search: true
                },
                subtitle: {
                    type: "string",
                    required: false
                },
                content: {
                    type: "longString",
                    required: true
                },
                contentType: {
                    type: "enum",
                    enum: ["html", "markdown"],
                    required: true,
                    default: "markdown"
                },
                files: {
                    type: "array.fullFile",
                    required: false
                },
                order: {
                    type: "number",
                    required: true
                },
                speakerNotes: {
                    type: "longString",
                    required: false
                },
                quiz: {
                    type: "array.object",
                    required: false,
                    schema: {
                        question: {
                            type: "string",
                            required: true
                        },
                        description: {
                            type: "longString",
                            required: false
                        },
                        type: {
                            type: "enum",
                            enum: ["single_choice", "multiple_choice", "open_text"],
                            required: true
                        },
                        answers: {
                            type: "array.object",
                            required: false,
                            schema: {
                                answer: {
                                    type: "string",
                                    required: true
                                },
                                points: {
                                    type: "number",
                                    required: false
                                },
                                isCorrect: {
                                    type: "boolean",
                                    required: false
                                },
                                feedback: {
                                    type: "longString",
                                    required: false
                                }
                            }
                        },
                        required: {
                            type: "boolean",
                            required: false,
                            default: false
                        },
                        explanation: {
                            type: "longString",
                            required: false
                        }
                    }
                },
                enabled: {
                    type: "boolean",
                    required: false,
                    default: true
                }
            }
        },
        primaryColor: {
            type: "string",
            required: false,
            header: false,
            groupTab: "Publication"
        },
        coverImageUrl: {
            type: "string",
            required: false,
            header: false,
            groupTab: "Publication"
        },
        isPublic: {
            type: "boolean",
            required: false,
            default: false,
            header: true,
            groupTab: "Publication"
        },
        publishedAt: {
            type: "date",
            required: false,
            header: true,
            groupTab: "Publication"
        },
        metadata: {
            type: "record",
            required: false,
            header: false,
            groupTab: "Advanced",
            schema: {}
        }
    }
};

export default schema;
export { schema };
