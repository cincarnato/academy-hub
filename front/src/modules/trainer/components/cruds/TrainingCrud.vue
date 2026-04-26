
<script setup lang="ts">
import TrainingCrud from '../../cruds/TrainingCrud'
import {Crud} from "@drax/crud-vue";
import {formatDate} from "@drax/common-front"

</script>

<template>
  <crud :entity="TrainingCrud.instance">
    <template v-slot:item.tags="{value}"><v-chip v-for="v in value">{{v}}</v-chip></template>
    <template v-slot:item.publishedAt="{value}">{{formatDate(value)}}</template>

    <template v-slot:item.actions="{item}">
      <v-btn variant="text" :href="'/training/'+item._id" target="_blank" icon="mdi-view-gallery"></v-btn>
    </template>

  </crud>
</template>

<style scoped>

</style>

