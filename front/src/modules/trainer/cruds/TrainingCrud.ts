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
import TrainingProvider from "../providers/TrainingProvider";

//Import EntityCrud Refs


class TrainingCrud extends EntityCrud implements IEntityCrud {

  static singleton: TrainingCrud

  constructor() {
    super();
    this.name = 'Training'
  }

  static get instance(): TrainingCrud {
    if (!TrainingCrud.singleton) {
      TrainingCrud.singleton = new TrainingCrud()
    }
    return TrainingCrud.singleton
  }

  get permissions(): IEntityCrudPermissions {
    return {
      manage: 'training:manage',
      view: 'training:view',
      create: 'training:create',
      update: 'training:update',
      delete: 'training:delete'
    }
  }

  get headers(): IEntityCrudHeader[] {
    return [
      {title: 'name', key: 'name', align: 'start'},
      {title: 'slug', key: 'slug', align: 'start'},
      {title: 'status', key: 'status', align: 'start'},
      {title: 'category', key: 'category', align: 'start'},
      {title: 'author', key: 'author', align: 'start'},
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
    return TrainingProvider.instance
  }

  get refs(): IEntityCrudRefs {
    return {}
  }

  get rules(): IEntityCrudRules {
    return {
      name: [(v: any) => !!v || 'validation.required'],
      status: [(v: any) => !!v || 'validation.required'],
      slides: [],
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
      {name: 'author', type: 'string', label: 'author', default: '', groupTab: 'General'},
      {name: 'globalSlideCss', type: 'longString', label: 'globalSlideCss', default: '', groupTab: 'General'},
      {
        name: 'files',
        type: 'array.object',
        label: 'Files',
        default: [],
        groupTab: 'Archivos',
        arrayObjectUI: 'chips',
        arrayObjectShowField: 'label',
        objectFields: [
          {name: 'label', type: 'string', label: 'label', default: ''},
          {name: 'file', type: 'fullFile', label: 'file', default: {}, prependInnerIcon: 'mdi mdi-attachment'}
        ]
      },
      {
        name: 'slides',
        type: 'array.object',
        label: 'slides',
        default: [],
        arrayObjectUI: 'accordion',
        groupTab: 'Contenido',
        objectFields: [
          {name: 'title', type: 'string', label: 'title', default: ''},
          {name: 'subtitle', type: 'string', label: 'subtitle', default: ''},
          {name: 'contentType', type: 'enum', label: 'contentType', default: 'markdown', enum: ['html', 'markdown']},
          {name: 'content', type: 'longString', label: 'content', default: ''},
          {name: 'speakerNotes', type: 'longString', label: 'speakerNotes', default: ''},
          {
            name: 'quiz',
            type: 'array.object',
            label: 'quiz',
            default: [],
            objectFields: [{name: 'question', type: 'string', label: 'question', default: ''},
              {name: 'description', type: 'longString', label: 'description', default: ''},
              {
                name: 'type',
                type: 'enum',
                label: 'type',
                default: null,
                enum: ['single_choice', 'multiple_choice', 'open_text']
              },
              {
                name: 'answers',
                type: 'array.object',
                label: 'answers',
                default: [],
                objectFields: [{name: 'answer', type: 'string', label: 'answer', default: ''},
                  {name: 'points', type: 'number', label: 'points', default: null},
                  {name: 'isCorrect', type: 'boolean', label: 'isCorrect', default: false},
                  {name: 'feedback', type: 'longString', label: 'feedback', default: ''}]
              },
              {name: 'required', type: 'boolean', label: 'required', default: false},
              {name: 'explanation', type: 'longString', label: 'explanation', default: ''}]
          },
          {name: 'enabled', type: 'boolean', label: 'enabled', default: true}]
      },
      {name: 'primaryColor', type: 'string', label: 'primaryColor', default: '', groupTab: 'Publicación'},
      {name: 'coverImageUrl', type: 'string', label: 'coverImageUrl', default: '', groupTab: 'Publicación'},
      {name: 'isPublic', type: 'boolean', label: 'isPublic', default: false, groupTab: 'Publicación'},
      {name: 'publishedAt', type: 'date', label: 'publishedAt', default: null, groupTab: 'Publicación'},
      {name: 'metadata', type: 'record', label: 'metadata', default: {}, groupTab: 'Avanzado', objectFields: []}
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
      'General', 'Archivos', 'Contenido', 'Publicación', 'Avanzado'
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

export default TrainingCrud
