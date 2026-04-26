
import merge from "deepmerge";
import ResourceCatalogMessages from "./ResourceCatalog-i18n"
import TrainingMessages from "./Training-i18n"

const messages = merge.all([
    ResourceCatalogMessages,
    TrainingMessages
])

export default messages
