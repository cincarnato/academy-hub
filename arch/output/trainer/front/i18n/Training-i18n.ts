
const messages = {
  en: {
  
    training: {
          entity: 'Training',
          menu: 'Training',
          crud: 'Manage Training',
          field:{
                       name:'name',
           slug:'slug',
           description:'description',
           status:'status',
           category:'category',
           tags:'tags',
           author:'author',
           slides:'slides',
           title: 'title',
           subtitle: 'subtitle',
           content: 'content',
           contentType: 'contentType',
           files: 'files',
           order: 'order',
           speakerNotes: 'speakerNotes',
           quiz: 'quiz',
           enabled: 'enabled',
           primaryColor:'primaryColor',
           coverImageUrl:'coverImageUrl',
           isPublic:'isPublic',
           publishedAt:'publishedAt',
           metadata:'metadata'
          }
      },
      permission: {
              'training:view': 'View Training',
              'training:create': 'Create Training',
              'training:update': 'Edit Training',
              'training:delete': 'Delete Training',
              'training:manage': 'Manage Training',
      }
  },
  es: {
     training: {
          entity: 'Training',
          menu: 'Training',
          crud: 'Gestionar Training',
          field:{
                       name:'name',
           slug:'slug',
           description:'description',
           status:'status',
           category:'category',
           tags:'tags',
           author:'author',
           slides:'slides',
           title: 'title',
           subtitle: 'subtitle',
           content: 'content',
           contentType: 'contentType',
           files: 'files',
           order: 'order',
           speakerNotes: 'speakerNotes',
           quiz: 'quiz',
           enabled: 'enabled',
           primaryColor:'primaryColor',
           coverImageUrl:'coverImageUrl',
           isPublic:'isPublic',
           publishedAt:'publishedAt',
           metadata:'metadata'
          }
      },
     permission: {
              'training:view': 'Ver Training',
              'training:create': 'Crear Training',
              'training:update': 'Editar Training',
              'training:delete': 'Eliminar Training',
              'training:manage': 'Gestionar Training',
     }
  }
}

export default messages;  
