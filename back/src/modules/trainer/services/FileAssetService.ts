
import type{IFileAssetRepository} from "../interfaces/IFileAssetRepository";
import type {IFileAssetBase, IFileAsset} from "../interfaces/IFileAsset";
import {AbstractService} from "@drax/crud-back";
import type {ZodObject, ZodRawShape} from "zod";

class FileAssetService extends AbstractService<IFileAsset, IFileAssetBase, IFileAssetBase> {


    constructor(FileAssetRepository: IFileAssetRepository, baseSchema?: ZodObject<ZodRawShape>, fullSchema?: ZodObject<ZodRawShape>) {
        super(FileAssetRepository, baseSchema, fullSchema);
        
        this._validateOutput = true
        
    }

}

export default FileAssetService
export {FileAssetService}
