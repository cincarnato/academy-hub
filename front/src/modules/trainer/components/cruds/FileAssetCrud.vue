
<script setup lang="ts">
import FileAssetCrud from '../../cruds/FileAssetCrud'
import {Crud} from "@drax/crud-vue";
import {formatDate} from "@drax/common-front"

</script>

<template>
  <crud :entity="FileAssetCrud.instance">
    <template v-slot:item.file="{value}"><v-img :src="value?.url" max-height="30px" class="my-1" /></template>
  </crud>
</template>

<style scoped>

</style>

