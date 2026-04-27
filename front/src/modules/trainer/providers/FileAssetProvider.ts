
import {AbstractCrudRestProvider} from "@drax/crud-front";
import type {IFileAsset, IFileAssetBase} from '../interfaces/IFileAsset'

class FileAssetProvider extends AbstractCrudRestProvider<IFileAsset, IFileAssetBase, IFileAssetBase> {
    
  static singleton: FileAssetProvider
    
  constructor() {
   super('/api/file-assets')
  }
  
  static get instance() {
    if(!FileAssetProvider.singleton){
      FileAssetProvider.singleton = new FileAssetProvider()
    }
    return FileAssetProvider.singleton
  }

}

export default FileAssetProvider

