
import type {IFileAsset, IFileAssetBase} from './IFileAsset'
import {IDraxCrudRepository} from "@drax/crud-share";

interface IFileAssetRepository extends IDraxCrudRepository<IFileAsset, IFileAssetBase, IFileAssetBase>{

}

export {IFileAssetRepository}


