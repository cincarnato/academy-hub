<script setup lang="ts">
import ConceptCatalogView from "../components/ConceptCatalogView.vue";

interface Props {
  catalogId: string
}

defineProps<Props>()
</script>

<template>
  <concept-catalog-view :catalog-id="catalogId" />
</template>
