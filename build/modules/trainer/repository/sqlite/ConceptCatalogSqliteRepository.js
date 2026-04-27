import { AbstractSqliteRepository } from "@drax/crud-back";
class ConceptCatalogSqliteRepository extends AbstractSqliteRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'ConceptCatalog';
        this.searchFields = ['title', 'descripcion', 'slug'];
        this.booleanFields = [];
        this.jsonFields = ['concepts'];
        this.identifier = '_id';
        this.populateFields = [];
        this.verbose = false;
        this.tableFields = [
            { name: "title", type: "TEXT", unique: true, primary: false },
            { name: "descripcion", type: "TEXT", unique: undefined, primary: false },
            { name: "slug", type: "TEXT", unique: true, primary: false },
            { name: "concepts", type: "TEXT", unique: undefined, primary: false }
        ];
    }
}
export default ConceptCatalogSqliteRepository;
export { ConceptCatalogSqliteRepository };
