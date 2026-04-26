<script setup lang="ts">
import ResourceCatalogView from "../components/ResourceCatalogView.vue";

interface Props {
  catalogId: string
}

defineProps<Props>()
</script>

<template>
  <resource-catalog-view :catalog-id="catalogId" />
</template>
