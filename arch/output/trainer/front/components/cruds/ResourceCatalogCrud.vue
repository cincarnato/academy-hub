
<script setup lang="ts">
import ResourceCatalogCrud from '../../cruds/ResourceCatalogCrud'
import {Crud} from "@drax/crud-vue";
import {formatDate} from "@drax/common-front"

</script>

<template>
  <crud :entity="ResourceCatalogCrud.instance">
    <template v-slot:item.tags="{value}"><v-chip v-for="v in value">{{v}}</v-chip></template>
    <template v-slot:item.publishedAt="{value}">{{formatDate(value)}}</template>
  </crud>
</template>

<style scoped>

</style>

