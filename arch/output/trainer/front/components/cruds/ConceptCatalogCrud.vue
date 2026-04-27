
<script setup lang="ts">
import ConceptCatalogCrud from '../../cruds/ConceptCatalogCrud'
import {Crud} from "@drax/crud-vue";
import {formatDate} from "@drax/common-front"

</script>

<template>
  <crud :entity="ConceptCatalogCrud.instance">

  </crud>
</template>

<style scoped>

</style>

