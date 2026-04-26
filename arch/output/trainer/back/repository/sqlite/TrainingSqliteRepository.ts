
import {AbstractSqliteRepository} from "@drax/crud-back";
import type {ITrainingRepository} from '../../interfaces/ITrainingRepository'
import type {ITraining, ITrainingBase} from "../../interfaces/ITraining";
import {SqliteTableField} from "@drax/common-back";

class TrainingSqliteRepository extends AbstractSqliteRepository<ITraining, ITrainingBase, ITrainingBase> implements ITrainingRepository {

    protected db: any;
    protected tableName: string = 'Training';
    protected dataBaseFile: string;
    protected searchFields: string[] = ['name', 'slug', 'description', 'status', 'category', 'tags', 'author'];
    protected booleanFields: string[] = ['isPublic'];
    protected jsonFields: string[] = ['tags', 'slides', 'metadata'];
    protected identifier: string = '_id';
    protected populateFields = [
        
    ]
    protected verbose: boolean = false;
    protected tableFields: SqliteTableField[] = [
        {name: "name", type: "TEXT", unique: undefined, primary: false},
{name: "slug", type: "TEXT", unique: true, primary: false},
{name: "description", type: "TEXT", unique: undefined, primary: false},
{name: "status", type: "TEXT", unique: undefined, primary: false},
{name: "category", type: "TEXT", unique: undefined, primary: false},
{name: "tags", type: "TEXT", unique: undefined, primary: false},
{name: "author", type: "TEXT", unique: undefined, primary: false},
{name: "slides", type: "TEXT", unique: undefined, primary: false},
{name: "primaryColor", type: "TEXT", unique: undefined, primary: false},
{name: "coverImageUrl", type: "TEXT", unique: undefined, primary: false},
{name: "isPublic", type: "TEXT", unique: undefined, primary: false},
{name: "publishedAt", type: "TEXT", unique: undefined, primary: false},
{name: "metadata", type: "TEXT", unique: undefined, primary: false}
    ]
  
}

export default TrainingSqliteRepository
export {TrainingSqliteRepository}

