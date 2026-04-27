
import {AbstractSqliteRepository} from "@drax/crud-back";
import type {IConceptCatalogRepository} from '../../interfaces/IConceptCatalogRepository'
import type {IConceptCatalog, IConceptCatalogBase} from "../../interfaces/IConceptCatalog";
import {SqliteTableField} from "@drax/common-back";

class ConceptCatalogSqliteRepository extends AbstractSqliteRepository<IConceptCatalog, IConceptCatalogBase, IConceptCatalogBase> implements IConceptCatalogRepository {

    protected db: any;
    protected tableName: string = 'ConceptCatalog';
    protected dataBaseFile: string;
    protected searchFields: string[] = ['title', 'descripcion', 'slug'];
    protected booleanFields: string[] = [];
    protected jsonFields: string[] = ['concepts'];
    protected identifier: string = '_id';
    protected populateFields = [
        
    ]
    protected verbose: boolean = false;
    protected tableFields: SqliteTableField[] = [
        {name: "title", type: "TEXT", unique: true, primary: false},
{name: "descripcion", type: "TEXT", unique: undefined, primary: false},
{name: "slug", type: "TEXT", unique: true, primary: false},
{name: "concepts", type: "TEXT", unique: undefined, primary: false}
    ]
  
}

export default ConceptCatalogSqliteRepository
export {ConceptCatalogSqliteRepository}

