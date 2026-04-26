import { IEntitySchema } from "@drax/arch";

const schema: IEntitySchema = {
    module: "trainer",
    name: "ResourceCatalog",
    apiBasePath: "resource-catalogs",
    collectionName: "resourcecatalogs",
    apiTag: "Trainer",
    tabs: ["General", "Resources", "Publication", "Advanced"],
    schema: {
        name: {
            type: "string",
            required: true,
            index: true,
            search: true,
            unique: true,
            header: true,
            groupTab: "General"
        },
        slug: {
            type: "string",
            required: true,
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
        resources: {
            type: "array.object",
            required: false,
            header: false,
            groupTab: "Resources",
            schema: {
                name: {
                    type: "string",
                    required: true,
                    search: true
                },
                url: {
                    type: "string",
                    required: true,
                    search: true
                },
                description: {
                    type: "longString",
                    required: false
                },
                creator: {
                    type: "string",
                    required: false,
                    search: true
                },
                company: {
                    type: "string",
                    required: false,
                    search: true
                },
                category: {
                    type: "string",
                    required: false,
                    search: true
                },
                tags: {
                    type: "array.string",
                    required: false
                },
                imageUrl: {
                    type: "string",
                    required: false
                },
                logoUrl: {
                    type: "string",
                    required: false
                },
                enabled: {
                    type: "boolean",
                    required: false,
                    default: true
                },
                metadata: {
                    type: "record",
                    required: false,
                    schema: {}
                }
            }
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
        coverImageUrl: {
            type: "string",
            required: false,
            header: false,
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
