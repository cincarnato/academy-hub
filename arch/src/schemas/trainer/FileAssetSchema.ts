import { IEntitySchema } from "@drax/arch";

const schema: IEntitySchema = {
    module: "trainer",
    name: "FileAsset",
    apiBasePath: "file-assets",
    collectionName: "fileassets",
    apiTag: "Trainer",
    schema: {
        label: {
            type: "string",
            required: true,
            index: true,
            search: true,
            header: true
        },
        file: {
            type: "fullFile",
            required: true,
            header: true
        }
    }
};

export default schema;
export { schema };
