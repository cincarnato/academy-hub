
import {EntityCrud, useCrudStore} from "@drax/crud-vue";
import type{
  IDraxCrudProvider,
  IEntityCrud,
  IEntityCrudField,
  IEntityCrudFilter,
  IEntityCrudHeader, 
  IEntityCrudPermissions,
  IEntityCrudRefs,
  IEntityCrudRules
} from "@drax/crud-share";
import FileAssetProvider from "../providers/FileAssetProvider";

//Import EntityCrud Refs


class FileAssetCrud extends EntityCrud implements IEntityCrud {

  static singleton: FileAssetCrud
  private store

  constructor() {
    super();
    this.name = 'FileAsset'
    this.store = useCrudStore(this.name)
  }
  
  static get instance(): FileAssetCrud {
    if(!FileAssetCrud.singleton){
      FileAssetCrud.singleton = new FileAssetCrud()
    }
    return FileAssetCrud.singleton
  }

  get permissions(): IEntityCrudPermissions{
    return {
      manage: 'fileasset:manage', 
      view: 'fileasset:view', 
      create: 'fileasset:create', 
      update: 'fileasset:update', 
      delete: 'fileasset:delete'
    }
  }

  get headers(): IEntityCrudHeader[] {
    return [
        {title: 'label',key:'label', align: 'start'},
{title: 'file',key:'file', align: 'start'}
    ]
  }
  
  get selectedHeaders(): string[] {
    return this.headers.map(header => header.key)
  }
  
  get actionHeaders():IEntityCrudHeader[]{
    return [
      {
        title: 'action.actions',
        key: 'actions',
        sortable: false,
        align: 'center',
        minWidth: '190px',
        fixed: 'end'
      },
    ]
  }

  get provider(): IDraxCrudProvider<any, any, any>{
    return FileAssetProvider.instance
  }
  
  get refs(): IEntityCrudRefs{
    return {
      
    }
  }

  get rules():IEntityCrudRules{
    return {
      label: [(v: any) => !!v || 'validation.required'],
file: [(v: any) => !!v || 'validation.required']
    }
  }

  get fields(): IEntityCrudField[]{
    return [
        {name:'label',type:'string',label:'label',default:''},
{name:'file',type:'fullFile',label:'file',default:{}}
    ]
  }
  
  get filters():IEntityCrudFilter[]{
    return [
      //{name: '_id', type: 'string', label: 'ID', default: '', operator: 'eq' },
    ]
  }
  
  get isViewable(){
    return true
  }

  get isEditable(){
    return true
  }

  get isCreatable(){
    return true
  }

  get isDeletable(){
    return true
  }

  get isExportable(){
    return true
  }

  get exportFormats(){
    return ['CSV', 'JSON']
  }

  get exportHeaders(){
    return ['_id']
  }

  get isImportable(){
    return false
  }
  
  get isColumnSelectable() {
    return true
  }

  get isGroupable() {
    return true
  }

  get importFormats(){
    return ['CSV', 'JSON']
  }

  get dialogFullscreen(){
    return false
  }
  
  get tabs() {
    return [
     
    ]
  }
  
  get menus() {
    return [
     
    ]
  }
  
  get searchEnable() {
    return true
  }

   get filtersEnable(){
    return true
  }

  get dynamicFiltersEnable(){
    return true
  }

  get isAiAssistable(){
    return false
  }

  get navigationOperations(){
    return ['view'] // edit, delete
  }
  
  get isSavedQueriesEnabled(){
    return true
  }

}

export default FileAssetCrud

