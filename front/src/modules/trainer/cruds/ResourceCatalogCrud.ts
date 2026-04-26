import {EntityCrud} from "@drax/crud-vue";
import type {
  IDraxCrudProvider,
  IEntityCrud,
  IEntityCrudField,
  IEntityCrudFilter,
  IEntityCrudHeader,
  IEntityCrudOperation,
  IEntityCrudPermissions,
  IEntityCrudRefs,
  IEntityCrudRules
} from "@drax/crud-share";
import ResourceCatalogProvider from "../providers/ResourceCatalogProvider";

//Import EntityCrud Refs


class ResourceCatalogCrud extends EntityCrud implements IEntityCrud {

  static singleton: ResourceCatalogCrud

  constructor() {
    super();
    this.name = 'ResourceCatalog'
  }

  static get instance(): ResourceCatalogCrud {
    if (!ResourceCatalogCrud.singleton) {
      ResourceCatalogCrud.singleton = new ResourceCatalogCrud()
    }
    return ResourceCatalogCrud.singleton
  }

  get permissions(): IEntityCrudPermissions {
    return {
      manage: 'resourcecatalog:manage',
      view: 'resourcecatalog:view',
      create: 'resourcecatalog:create',
      update: 'resourcecatalog:update',
      delete: 'resourcecatalog:delete'
    }
  }

  get headers(): IEntityCrudHeader[] {
    return [
      {title: 'name', key: 'name', align: 'start'},
      {title: 'slug', key: 'slug', align: 'start'},
      {title: 'status', key: 'status', align: 'start'},
      {title: 'category', key: 'category', align: 'start'},
      {title: 'isPublic', key: 'isPublic', align: 'start'},
      {title: 'publishedAt', key: 'publishedAt', align: 'start'}
    ]
  }

  get selectedHeaders(): string[] {
    return this.headers.map(header => header.key)
  }

  get actionHeaders(): IEntityCrudHeader[] {
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

  get provider(): IDraxCrudProvider<any, any, any> {
    return ResourceCatalogProvider.instance
  }

  get refs(): IEntityCrudRefs {
    return {}
  }

  get rules(): IEntityCrudRules {
    return {
      name: [(v: any) => !!v || 'validation.required'],
      slug: [(v: any) => !!v || 'validation.required'],
      status: [(v: any) => !!v || 'validation.required'],
      resources: [],
      metadata: []
    }
  }

  get fields(): IEntityCrudField[] {
    return [
      {name: 'name', type: 'string', label: 'name', default: '', groupTab: 'General'},
      {name: 'slug', type: 'string', label: 'slug', default: '', groupTab: 'General'},
      {name: 'description', type: 'longString', label: 'description', default: '', groupTab: 'General'},
      {
        name: 'status',
        type: 'enum',
        label: 'status',
        default: 'draft',
        groupTab: 'General',
        enum: ['draft', 'published', 'archived']
      },
      {name: 'category', type: 'string', label: 'category', default: '', groupTab: 'General'},
      {name: 'tags', type: 'array.string', label: 'tags', default: [], groupTab: 'General'},
      {
        name: 'resources',
        type: 'array.object',
        label: 'resources',
        default: [],
        groupTab: 'Resources',
        objectFields: [{name: 'name', type: 'string', label: 'name', default: ''},
          {name: 'url', type: 'string', label: 'url', default: ''},
          {name: 'description', type: 'longString', label: 'description', default: ''},
          {name: 'creator', type: 'string', label: 'creator', default: ''},
          {name: 'company', type: 'string', label: 'company', default: ''},
          {name: 'category', type: 'string', label: 'category', default: ''},
          {name: 'tags', type: 'array.string', label: 'tags', default: []},
          {name: 'imageUrl', type: 'string', label: 'imageUrl', default: ''},
          {name: 'logoUrl', type: 'string', label: 'logoUrl', default: ''},
          {name: 'enabled', type: 'boolean', label: 'enabled', default: true},
          {name: 'metadata', type: 'record', label: 'metadata', default: {}}]
      },
      {name: 'isPublic', type: 'boolean', label: 'isPublic', default: false, groupTab: 'Publication'},
      {name: 'publishedAt', type: 'date', label: 'publishedAt', default: null, groupTab: 'Publication'},
      {name: 'coverImageUrl', type: 'string', label: 'coverImageUrl', default: '', groupTab: 'Publication'},
      {name: 'metadata', type: 'record', label: 'metadata', default: {}, groupTab: 'Advanced'}
    ]
  }

  get filters(): IEntityCrudFilter[] {
    return [
      //{name: '_id', type: 'string', label: 'ID', default: '', operator: 'eq' },
    ]
  }

  get isViewable() {
    return true
  }

  get isEditable() {
    return true
  }

  get isCreatable() {
    return true
  }

  get isDeletable() {
    return true
  }

  get isExportable() {
    return true
  }

  get exportFormats() {
    return ['CSV', 'JSON']
  }

  get exportHeaders() {
    return ['_id']
  }

  get isImportable() {
    return false
  }

  get isColumnSelectable() {
    return true
  }

  get isGroupable() {
    return true
  }

  get importFormats() {
    return ['CSV', 'JSON']
  }

  get dialogFullscreen() {
    return true
  }

  get tabs() {
    return [
      'General', 'Resources', 'Publication', 'Advanced'
    ]
  }

  get menus() {
    return []
  }

  get searchEnable() {
    return true
  }

  get filtersEnable() {
    return true
  }

  get dynamicFiltersEnable() {
    return true
  }

  get isAiAssistable() {
    return true
  }

  get navigationOperations(): IEntityCrudOperation[] {
    return ['view'] // edit, delete
  }

  get isSavedQueriesEnabled() {
    return true
  }

}

export default ResourceCatalogCrud
