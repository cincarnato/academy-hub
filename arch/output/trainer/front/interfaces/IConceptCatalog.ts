
interface IConceptCatalogBase {
    title: string
    descripcion?: string
    slug: string
    concepts?: Array<{
    name: string
    content?: string
    example?: string
    summary?: string
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
    content?: string
    example?: string
    summary?: string
    }>
    createdAt?: Date
    updatedAt?: Date
}

export type {
IConceptCatalogBase, 
IConceptCatalog
}
