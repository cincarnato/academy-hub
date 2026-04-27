import { AbstractMongoRepository } from "@drax/crud-back";
import { FileAssetModel } from "../../models/FileAssetModel.js";
class FileAssetMongoRepository extends AbstractMongoRepository {
    constructor() {
        super();
        this._model = FileAssetModel;
        this._searchFields = ['label'];
        this._populateFields = [];
        this._lean = true;
    }
}
export default FileAssetMongoRepository;
export { FileAssetMongoRepository };
