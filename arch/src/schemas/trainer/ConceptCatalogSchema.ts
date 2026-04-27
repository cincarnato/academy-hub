import { IEntitySchema } from "@drax/arch";

const schema: IEntitySchema = {
    module: "trainer",
    name: "ConceptCatalog",
    apiBasePath: "concept-catalogs",
    collectionName: "conceptcatalogs",
    apiTag: "Trainer",
    tabs: ["General", "Concepts"],
    schema: {
        title: {
            type: "string",
            required: true,
            index: true,
            search: true,
            unique: true,
            header: true,
            groupTab: "General"
        },
        descripcion: {
            type: "longString",
            required: false,
            search: true,
            header: false,
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
        concepts: {
            type: "array.object",
            required: false,
            header: false,
            groupTab: "Concepts",
            schema: {
                name: {
                    type: "string",
                    required: true,
                    search: true
                },
                content: {
                    type: "longString",
                    required: false
                },
                example: {
                    type: "longString",
                    required: false
                },
                summary: {
                    type: "longString",
                    required: false
                }
            }
        }
    }
};

export default schema;
export { schema };
