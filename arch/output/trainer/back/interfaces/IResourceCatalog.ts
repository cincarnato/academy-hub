
interface IResourceCatalogBase {
    name: string
    slug: string
    description?: string
    status: string
    category?: string
    tags?: Array<string>
    resources?: Array<{
    name: string
    url: string
    description?: string
    creator?: string
    company?: string
    category?: string
    tags?: Array<string>
    imageUrl?: string
    logoUrl?: string
    enabled?: boolean
    metadata?: Record<string, any>
    }>
    isPublic?: boolean
    publishedAt?: Date
    coverImageUrl?: string
    metadata?: Record<string, any>
    createdAt?: Date
    updatedAt?: Date
}

interface IResourceCatalog {
    _id: string
    name: string
    slug: string
    description?: string
    status: string
    category?: string
    tags?: Array<string>
    resources?: Array<{
    name: string
    url: string
    description?: string
    creator?: string
    company?: string
    category?: string
    tags?: Array<string>
    imageUrl?: string
    logoUrl?: string
    enabled?: boolean
    metadata?: Record<string, any>
    }>
    isPublic?: boolean
    publishedAt?: Date
    coverImageUrl?: string
    metadata?: Record<string, any>
    createdAt?: Date
    updatedAt?: Date
}

export type {
IResourceCatalogBase, 
IResourceCatalog
}
