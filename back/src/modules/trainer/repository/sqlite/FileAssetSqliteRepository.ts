
import {AbstractSqliteRepository} from "@drax/crud-back";
import type {IFileAssetRepository} from '../../interfaces/IFileAssetRepository'
import type {IFileAsset, IFileAssetBase} from "../../interfaces/IFileAsset";
import {SqliteTableField} from "@drax/common-back";

class FileAssetSqliteRepository extends AbstractSqliteRepository<IFileAsset, IFileAssetBase, IFileAssetBase> implements IFileAssetRepository {

    protected db: any;
    protected tableName: string = 'FileAsset';
    protected dataBaseFile: string;
    protected searchFields: string[] = ['label'];
    protected booleanFields: string[] = [];
    protected jsonFields: string[] = [];
    protected identifier: string = '_id';
    protected populateFields = [
        
    ]
    protected verbose: boolean = false;
    protected tableFields: SqliteTableField[] = [
        {name: "label", type: "TEXT", unique: undefined, primary: false},
{name: "file", type: "TEXT", unique: undefined, primary: false}
    ]
  
}

export default FileAssetSqliteRepository
export {FileAssetSqliteRepository}

