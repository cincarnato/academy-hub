
import merge from "deepmerge";
import FileAssetMessages from "./FileAsset-i18n"
import ResourceCatalogMessages from "./ResourceCatalog-i18n"
import TrainingMessages from "./Training-i18n"

const messages = merge.all([
    FileAssetMessages,
    ResourceCatalogMessages,
    TrainingMessages
])

export default messages
