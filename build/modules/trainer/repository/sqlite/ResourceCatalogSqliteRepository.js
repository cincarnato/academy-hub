import { AbstractSqliteRepository } from "@drax/crud-back";
class ResourceCatalogSqliteRepository extends AbstractSqliteRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'ResourceCatalog';
        this.searchFields = ['name', 'slug', 'description', 'status', 'category', 'tags'];
        this.booleanFields = ['isPublic'];
        this.jsonFields = ['tags', 'resources', 'metadata'];
        this.identifier = '_id';
        this.populateFields = [];
        this.verbose = false;
        this.tableFields = [
            { name: "name", type: "TEXT", unique: true, primary: false },
            { name: "slug", type: "TEXT", unique: true, primary: false },
            { name: "description", type: "TEXT", unique: undefined, primary: false },
            { name: "status", type: "TEXT", unique: undefined, primary: false },
            { name: "category", type: "TEXT", unique: undefined, primary: false },
            { name: "tags", type: "TEXT", unique: undefined, primary: false },
            { name: "resources", type: "TEXT", unique: undefined, primary: false },
            { name: "isPublic", type: "TEXT", unique: undefined, primary: false },
            { name: "publishedAt", type: "TEXT", unique: undefined, primary: false },
            { name: "coverImageUrl", type: "TEXT", unique: undefined, primary: false },
            { name: "metadata", type: "TEXT", unique: undefined, primary: false }
        ];
    }
}
export default ResourceCatalogSqliteRepository;
export { ResourceCatalogSqliteRepository };
