
<script setup lang="ts">
import TrainingCrud from '../../cruds/TrainingCrud'
import {Crud} from "@drax/crud-vue";
import {formatDate} from "@drax/common-front"
import type {ITraining} from "../../interfaces/ITraining";

function getTrainingHref(item: unknown) {
  const training = item as ITraining
  return `/training/${training.slug || training._id}`
}

function getTrainingImproveHref(item: unknown) {
  const training = item as ITraining
  return `/training/${training.slug || training._id}/improve`
}
</script>

<template>
  <crud :entity="TrainingCrud.instance">
    <template v-slot:item.tags="{value}"><v-chip v-for="v in value">{{v}}</v-chip></template>
    <template v-slot:item.publishedAt="{value}">{{formatDate(value)}}</template>

    <template v-slot:item.actions="{item}">
      <v-btn variant="text" :href="getTrainingHref(item)" target="_blank" icon="mdi-view-gallery"></v-btn>
      <v-btn variant="text" :href="getTrainingImproveHref(item)" target="_blank" icon="mdi-robot"></v-btn>
    </template>

  </crud>
</template>

<style scoped>

</style>
