
<script setup lang="ts">
import ConceptCatalogCrud from '../../cruds/ConceptCatalogCrud'
import {Crud} from "@drax/crud-vue";
import type {IConceptCatalog} from "../../interfaces/IConceptCatalog";

function getConceptCatalogHref(item: unknown) {
  const catalog = item as IConceptCatalog
  return `/concept-catalog/${catalog.slug || catalog._id}`
}

</script>

<template>
  <crud :entity="ConceptCatalogCrud.instance">
    <template v-slot:item.actions="{item}">
      <v-btn variant="text" :href="getConceptCatalogHref(item)" target="_blank" icon="mdi-book-open-page-variant"></v-btn>
    </template>
  </crud>
</template>

<style scoped>

</style>
