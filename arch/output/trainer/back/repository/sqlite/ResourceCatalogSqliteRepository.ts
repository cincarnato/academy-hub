
import {AbstractSqliteRepository} from "@drax/crud-back";
import type {IResourceCatalogRepository} from '../../interfaces/IResourceCatalogRepository'
import type {IResourceCatalog, IResourceCatalogBase} from "../../interfaces/IResourceCatalog";
import {SqliteTableField} from "@drax/common-back";

class ResourceCatalogSqliteRepository extends AbstractSqliteRepository<IResourceCatalog, IResourceCatalogBase, IResourceCatalogBase> implements IResourceCatalogRepository {

    protected db: any;
    protected tableName: string = 'ResourceCatalog';
    protected dataBaseFile: string;
    protected searchFields: string[] = ['name', 'slug', 'description', 'status', 'category', 'tags'];
    protected booleanFields: string[] = ['isPublic'];
    protected jsonFields: string[] = ['tags', 'resources', 'metadata'];
    protected identifier: string = '_id';
    protected populateFields = [
        
    ]
    protected verbose: boolean = false;
    protected tableFields: SqliteTableField[] = [
        {name: "name", type: "TEXT", unique: true, primary: false},
{name: "slug", type: "TEXT", unique: true, primary: false},
{name: "description", type: "TEXT", unique: undefined, primary: false},
{name: "status", type: "TEXT", unique: undefined, primary: false},
{name: "category", type: "TEXT", unique: undefined, primary: false},
{name: "tags", type: "TEXT", unique: undefined, primary: false},
{name: "resources", type: "TEXT", unique: undefined, primary: false},
{name: "isPublic", type: "TEXT", unique: undefined, primary: false},
{name: "publishedAt", type: "TEXT", unique: undefined, primary: false},
{name: "coverImageUrl", type: "TEXT", unique: undefined, primary: false},
{name: "metadata", type: "TEXT", unique: undefined, primary: false}
    ]
  
}

export default ResourceCatalogSqliteRepository
export {ResourceCatalogSqliteRepository}

