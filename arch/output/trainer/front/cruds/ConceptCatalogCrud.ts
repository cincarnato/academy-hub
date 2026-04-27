
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
import ConceptCatalogProvider from "../providers/ConceptCatalogProvider";

//Import EntityCrud Refs


class ConceptCatalogCrud extends EntityCrud implements IEntityCrud {

  static singleton: ConceptCatalogCrud
  private store

  constructor() {
    super();
    this.name = 'ConceptCatalog'
    this.store = useCrudStore(this.name)
  }
  
  static get instance(): ConceptCatalogCrud {
    if(!ConceptCatalogCrud.singleton){
      ConceptCatalogCrud.singleton = new ConceptCatalogCrud()
    }
    return ConceptCatalogCrud.singleton
  }

  get permissions(): IEntityCrudPermissions{
    return {
      manage: 'conceptcatalog:manage', 
      view: 'conceptcatalog:view', 
      create: 'conceptcatalog:create', 
      update: 'conceptcatalog:update', 
      delete: 'conceptcatalog:delete'
    }
  }

  get headers(): IEntityCrudHeader[] {
    return [
        {title: 'title',key:'title', align: 'start'},
{title: 'slug',key:'slug', align: 'start'}
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
    return ConceptCatalogProvider.instance
  }
  
  get refs(): IEntityCrudRefs{
    return {
      
    }
  }

  get rules():IEntityCrudRules{
    return {
      title: [(v: any) => !!v || 'validation.required'],
slug: [(v: any) => !!v || 'validation.required'],
concepts: []
    }
  }

  get fields(): IEntityCrudField[]{
    return [
        {name:'title',type:'string',label:'title',default:'',groupTab: 'General'},
{name:'descripcion',type:'longString',label:'descripcion',default:'',groupTab: 'General'},
{name:'slug',type:'string',label:'slug',default:'',groupTab: 'General'},
{name:'concepts',type:'array.object',label:'concepts',default:[],groupTab: 'Concepts',objectFields: [{name:'name',type:'string',label:'name',default:''},
{name:'content',type:'longString',label:'content',default:''},
{name:'example',type:'longString',label:'example',default:''},
{name:'summary',type:'longString',label:'summary',default:''}]}
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
     'General', 'Concepts'
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

export default ConceptCatalogCrud

