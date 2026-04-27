
interface IFileAssetBase {
    label: string
    file: {
                filename: string,
                filepath: string,
                size: number,
                mimetype?: string,
                url: string
                }
    createdAt?: Date
    updatedAt?: Date
}

interface IFileAsset {
    _id: string
    label: string
    file: {
                filename: string,
                filepath: string,
                size: number,
                mimetype?: string,
                url: string
                }
    createdAt?: Date
    updatedAt?: Date
}

export type {
IFileAssetBase, 
IFileAsset
}
