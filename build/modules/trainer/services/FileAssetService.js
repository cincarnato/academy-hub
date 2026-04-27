import { AbstractService } from "@drax/crud-back";
class FileAssetService extends AbstractService {
    constructor(FileAssetRepository, baseSchema, fullSchema) {
        super(FileAssetRepository, baseSchema, fullSchema);
        this._validateOutput = true;
    }
}
export default FileAssetService;
export { FileAssetService };
