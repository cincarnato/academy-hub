
interface IConceptCatalogBase {
    title: string
    descripcion?: string
    slug: string
    concepts?: Array<{
    name: string
    explanation?: string
    example?: string
    utility?: string
    }>
    createdAt?: Date
    updatedAt?: Date
}

interface IConceptCatalog {
    _id: string
    title: string
    descripcion?: string
    slug: string
    concepts?: Array<{
    name: string
    explanation?: string
    example?: string
    utility?: string
    }>
    createdAt?: Date
    updatedAt?: Date
}

export type {
IConceptCatalogBase, 
IConceptCatalog
}
