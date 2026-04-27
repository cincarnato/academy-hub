import { AbstractSqliteRepository } from "@drax/crud-back";
class FileAssetSqliteRepository extends AbstractSqliteRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'FileAsset';
        this.searchFields = ['label'];
        this.booleanFields = [];
        this.jsonFields = [];
        this.identifier = '_id';
        this.populateFields = [];
        this.verbose = false;
        this.tableFields = [
            { name: "label", type: "TEXT", unique: undefined, primary: false },
            { name: "file", type: "TEXT", unique: undefined, primary: false }
        ];
    }
}
export default FileAssetSqliteRepository;
export { FileAssetSqliteRepository };
