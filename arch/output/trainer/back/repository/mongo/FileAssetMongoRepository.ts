
import {AbstractMongoRepository} from "@drax/crud-back";
import {FileAssetModel} from "../../models/FileAssetModel.js";
import type {IFileAssetRepository} from '../../interfaces/IFileAssetRepository'
import type {IFileAsset, IFileAssetBase} from "../../interfaces/IFileAsset";


class FileAssetMongoRepository extends AbstractMongoRepository<IFileAsset, IFileAssetBase, IFileAssetBase> implements IFileAssetRepository {

    constructor() {
        super();
        this._model = FileAssetModel;
        this._searchFields = ['label'];
        this._populateFields = [];
        this._lean = true
    }

}

export default FileAssetMongoRepository
export {FileAssetMongoRepository}

