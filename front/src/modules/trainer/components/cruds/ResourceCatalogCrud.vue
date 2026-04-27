
<script setup lang="ts">
import ResourceCatalogCrud from '../../cruds/ResourceCatalogCrud'
import {Crud} from "@drax/crud-vue";
import {formatDate} from "@drax/common-front"
import type {IResourceCatalog} from "../../interfaces/IResourceCatalog";

function getResourceCatalogHref(item: unknown) {
  const catalog = item as IResourceCatalog
  return `/resource-catalog/${catalog.slug || catalog._id}`
}
</script>

<template>
  <crud :entity="ResourceCatalogCrud.instance">
    <template v-slot:item.tags="{value}"><v-chip v-for="v in value">{{v}}</v-chip></template>
    <template v-slot:item.publishedAt="{value}">{{formatDate(value)}}</template>

  <template v-slot:item.actions="{item}">
    <v-btn variant="text" :href="getResourceCatalogHref(item)" target="_blank" icon="mdi-view-gallery"></v-btn>
  </template>
  </crud>
</template>

<style scoped>

</style>
